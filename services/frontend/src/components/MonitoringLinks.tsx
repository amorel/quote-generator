import React, { useEffect, useRef } from "react";
import { monitoringConfig } from "../config/monitoring";

const MonitoringLinks: React.FC = () => {
  const hasLogged = useRef(false);

  useEffect(() => {
    // Vérifier si on a déjà affiché les logs
    if (hasLogged.current) return;
    hasLogged.current = true;

    const isDev = import.meta.env.DEV;
    const environment = isDev ? "Development" : "Production";

    // Style definitions
    const styles = {
      header: "color: #2196F3; font-weight: bold; font-size: 14px",
      serviceName: "color: #4CAF50; font-weight: bold",
      url: "color: #FF9800; text-decoration: underline; cursor: pointer",
      credentials: "color: #E91E63",
      separator: "color: #9E9E9E",
    };

    console.log(`%c${environment} Monitoring Services:`, styles.header);
    console.log("──────────────────────────────────────");

    Object.entries(monitoringConfig).forEach(([name, service]) => {
      const serviceTitle = name.charAt(0).toUpperCase() + name.slice(1);

      console.log(
        `%c${serviceTitle}:
%cURL: %c${service.url}
%cCredentials: %cusername: ${service.credentials.username} %c| %cpassword: ${service.credentials.password}
──────────────────────────────────────`,
        styles.serviceName,
        styles.serviceName,
        styles.url,
        styles.serviceName,
        styles.credentials,
        styles.separator,
        styles.credentials
      );
    });

    console.log(
      "%c⚠️ Note: Ces credentials sont pour le développement local uniquement.",
      "color: #FFC107; font-weight: bold"
    );
  }, []);

  return null;
};

export default MonitoringLinks;
