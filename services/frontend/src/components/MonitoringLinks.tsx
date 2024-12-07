import React, { useEffect, useRef } from "react";
import { monitoringConfig } from "../config/monitoring";

const MonitoringLinks: React.FC = () => {
    const hasLogged = useRef(false);

    useEffect(() => {
        if (hasLogged.current) return;
        hasLogged.current = true;

        const API_URL = window.APP_CONFIG?.API_URL || 'http://localhost:3000';
        const isKubernetes = API_URL.includes('/api');
        const environment = isKubernetes ? "Kubernetes" : "Development";

        const styles = {
            header: "color: #2196F3; font-weight: bold; font-size: 14px",
            serviceName: "color: #4CAF50; font-weight: bold",
            url: "color: #FF9800; text-decoration: underline; cursor: pointer",
            credentials: "color: #E91E63",
            separator: "color: #9E9E9E",
            environment: "color: #9C27B0; font-weight: bold",
            apiUrl: "color: #607D8B; font-style: italic",
        };

        console.log(`%c${environment} Monitoring Services:`, styles.header);
        console.log(`%cAPI URL: ${API_URL}`, styles.apiUrl);
        console.log("──────────────────────────────────────");

        Object.entries(monitoringConfig).forEach(([name, service]) => {
            const serviceTitle = name.charAt(0).toUpperCase() + name.slice(1);
            const k8sInfo = service.k8sPath && isKubernetes
                ? `\n%cK8s Path: %c${service.k8sPath}` 
                : '';

            console.log(
                `%c${serviceTitle}:
%cURL: %c${service.url}${k8sInfo}
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

        if (!isKubernetes) {
            console.log(
                "%c⚠️ Note: Ces credentials sont pour le développement local uniquement.",
                "color: #FFC107; font-weight: bold"
            );
        }
    }, []);

    return null;
};

export default MonitoringLinks;