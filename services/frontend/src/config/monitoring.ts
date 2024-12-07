interface MonitoringCredentials {
  username: string;
  password: string;
}

interface MonitoringService {
  url: string;
  credentials: MonitoringCredentials;
  k8sPath?: string;
}

interface MonitoringConfig {
  rabbitmq: MonitoringService;
  grafana: MonitoringService;
  prometheus: MonitoringService;
}

declare global {
  interface Window {
    APP_CONFIG: {
      API_URL: string;
    };
  }
}

const getMonitoringConfig = (): MonitoringConfig => {
  const API_URL = window.APP_CONFIG?.API_URL || "http://localhost:3000";
  const isKubernetes = API_URL.includes("/api");

  const baseUrl = isKubernetes ? window.location.origin : "http://localhost";

  // Configuration commune
  const config = {
    rabbitmq: {
      url: `${baseUrl}${isKubernetes ? "/rabbitmq/" : ":15672"}`, // Notez le slash ajouté
      k8sPath: "/rabbitmq/",
      credentials: {
        username: import.meta.env.VITE_RABBITMQ_USERNAME || "admin",
        password: import.meta.env.VITE_RABBITMQ_PASSWORD || "password",
      },
    },
    grafana: {
      url: `${baseUrl}${isKubernetes ? "/grafana" : ":3100"}`,
      k8sPath: "/grafana",
      credentials: {
        username: import.meta.env.VITE_GRAFANA_USERNAME || "admin",
        password: import.meta.env.VITE_GRAFANA_PASSWORD || "admin",
      },
    },
    prometheus: {
      url: `${baseUrl}${isKubernetes ? "/prometheus/" : ":9090"}`, // Notez le slash ajouté
      k8sPath: "/prometheus/",
      credentials: {
        username: "-",
        password: "-",
      },
    },
  };

  return config;
};

export const monitoringConfig = getMonitoringConfig();
