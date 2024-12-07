#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

error_exit() {
    echo -e "${RED}Erreur: $1${NC}" >&2
    exit 1
}

debug_deployment() {
    echo -e "${YELLOW}Débogage du déploiement $1${NC}"
    kubectl describe deployment $1 -n quote-generator
    echo -e "${YELLOW}Logs des pods pour $1:${NC}"
    for pod in $(kubectl get pods -n quote-generator -l app=$1 -o name); do
        echo "=== Logs for $pod ==="
        kubectl logs $pod -n quote-generator --tail=50
    done
}

export TAG=$(grep TAG .env | cut -d= -f2)
echo -e "${GREEN}Version de redémarrage: $TAG${NC}"

echo -e "${GREEN}1. Préparation des fichiers de monitoring...${NC}"
./scripts/prepare-k8s.sh || error_exit "Échec de la préparation des fichiers de monitoring"

echo -e "${GREEN}2. Réinstallation des services...${NC}"
kubectl apply -k k8s/base || error_exit "Échec du déploiement Kubernetes"

echo -e "${GREEN}3. Attente du démarrage de l'Ingress Controller...${NC}"
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=300s || error_exit "Timeout sur l'attente de l'Ingress Controller"

echo -e "${GREEN}4. Vérification individuelle des déploiements...${NC}"
deployments=(api-gateway auth-service quote-service user-service frontend grafana prometheus rabbitmq)

for deployment in "${deployments[@]}"; do
    echo -e "${YELLOW}Attente du déploiement $deployment...${NC}"
    if ! kubectl wait deployment/$deployment --for=condition=Available=True --timeout=300s -n quote-generator; then
        echo -e "${RED}Timeout pour le déploiement $deployment${NC}"
        debug_deployment $deployment
    fi
done

echo -e "${GREEN}5. État final des pods :${NC}"
kubectl get pods -n quote-generator
kubectl get pods -n ingress-nginx

echo -e "${GREEN}6. Vérification des services :${NC}"
kubectl get svc -n quote-generator

echo -e "${GREEN}URLs des services :${NC}"
echo "Application: http://localhost"
echo "API Gateway: http://localhost/api"
echo "Grafana: http://localhost/grafana"
echo "Prometheus: http://localhost/prometheus"
echo "RabbitMQ: http://localhost/rabbitmq"

echo -e "${GREEN}Démarrage du tunnel Minikube...${NC}"
minikube tunnel