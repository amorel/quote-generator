interface MonitoringCredentials {
    username: string;
    password: string;
  }
  
  interface MonitoringService {
    url: string;
    credentials: MonitoringCredentials;
  }
  
  interface MonitoringConfig {
    rabbitmq: MonitoringService;
    grafana: MonitoringService;
    prometheus: MonitoringService;
  }
  
  const getMonitoringConfig = (): MonitoringConfig => {
    const isDevelopment = import.meta.env.DEV;
    const baseUrl = isDevelopment ? 'http://localhost' : window.location.origin;
  
    return {
      rabbitmq: {
        url: `${baseUrl}:15672`,
        credentials: {
          username: import.meta.env.VITE_RABBITMQ_USERNAME || 'admin',
          password: import.meta.env.VITE_RABBITMQ_PASSWORD || 'password'
        }
      },
      grafana: {
        url: `${baseUrl}:3100`,
        credentials: {
          username: import.meta.env.VITE_GRAFANA_USERNAME || 'admin',
          password: import.meta.env.VITE_GRAFANA_PASSWORD || 'admin'
        }
      },
      prometheus: {
        url: `${baseUrl}:9090`,
        credentials: {
          username: '-',
          password: '-'
        }
      }
    };
  };
  
  export const monitoringConfig = getMonitoringConfig();