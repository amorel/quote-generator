#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Fonction d'erreur
error_exit() {
    echo -e "${RED}Erreur: $1${NC}" >&2
    exit 1
}

# Fonction pour arrêter tous les tunnels
stop_all_tunnels() {
    echo "Arrêt de tous les tunnels minikube..."
    taskkill /F /IM "minikube.exe" /FI "WINDOWTITLE eq minikube*" > nul 2>&1 || true
    sleep 5
}

# Fonction pour nettoyer les pods
clean_pods() {
    echo "Nettoyage des pods..."
    kubectl delete pods --all -n quote-generator
    sleep 10
}

# Récupération du TAG depuis .env
export TAG=$(grep TAG .env | cut -d= -f2)

echo -e "${GREEN}1. Nettoyage initial...${NC}"
stop_all_tunnels
clean_pods

echo -e "${GREEN}2. Application des nouvelles configurations Kubernetes...${NC}"
kubectl apply -k k8s/base --output=json | jq -r '.items[] | select(.metadata.name != null) | "\(.kind)/\(.metadata.name) updated"' || \
    error_exit "Échec de la mise à jour Kubernetes"

echo -e "${GREEN}3. Attente de 30 secondes pour stabilisation...${NC}"
sleep 30

echo -e "${GREEN}4. Redémarrage des deployments...${NC}"
# Redémarrage ordonné des services
for service in rabbitmq user-db auth-db quote-db grafana api-gateway auth-service quote-service user-service frontend; do
    echo "Redémarrage de $service..."
    kubectl rollout restart deployment $service -n quote-generator
    sleep 5
done

echo -e "${GREEN}5. Vérification du déploiement...${NC}"
for service in rabbitmq user-db auth-db quote-db grafana api-gateway auth-service quote-service user-service frontend; do
    echo "Attente de $service..."
    kubectl rollout status deployment $service -n quote-generator --timeout=300s || \
        error_exit "Timeout sur l'attente de $service"
done

echo -e "${GREEN}6. État final des pods :${NC}"
kubectl get pods -n quote-generator

echo -e "${GREEN}7. Configuration de l'accès...${NC}"
stop_all_tunnels

echo -e "${GREEN}URLs des services :${NC}"
echo "Application: http://localhost/"
echo "API Gateway: http://localhost/api"
echo "Grafana: http://localhost/grafana"

echo -e "${GREEN}Démarrage du tunnel Minikube...${NC}"
echo "IMPORTANT: Ne pas fermer ce terminal tant que vous avez besoin du tunnel"
echo "Pour arrêter, utilisez Ctrl+C"

# Démarrage du tunnel en avant-plan
minikube tunnel