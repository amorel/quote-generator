#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

error_exit() {
    echo -e "${RED}Erreur: $1${NC}" >&2
    exit 1
}

export TAG=$(grep TAG .env | cut -d= -f2)
echo -e "${GREEN}Version de déploiement: $TAG${NC}"

echo -e "${GREEN}1. Construction des images avec docker-compose...${NC}"
docker-compose build || error_exit "Échec de la construction des images"

echo -e "${GREEN}2. Démarrage de Minikube (minikube v1.33.1)...${NC}"
minikube delete || true
minikube start \
  --kubernetes-version=v1.30.0 \
  --driver=docker \
  --cpus=2 \
  --memory=4096mb || error_exit "Échec du démarrage de Minikube"

echo -e "${GREEN}3. Activation de l'addon Ingress...${NC}"
minikube addons enable ingress || error_exit "Échec de l'activation de l'addon Ingress"

echo -e "${GREEN}4. Chargement des images dans Minikube...${NC}"
for service in shared api-gateway auth-service quote-service user-service frontend; do
    echo "Chargement de quote-generator-$service:$TAG"
    minikube image load quote-generator-$service:$TAG &
done

# Chargement des images MongoDB
echo "Chargement des images MongoDB..."
minikube image load quote-generator-auth-db:latest &
minikube image load quote-generator-quote-db:latest &

# Attend que tous les chargements d'images soient terminés
wait

# Vérifie si un des processus a échoué
if [ $? -ne 0 ]; then
    error_exit "Échec du chargement d'une ou plusieurs images"
fi

echo -e "${GREEN}5. Préparation des fichiers de monitoring...${NC}"
./scripts/prepare-k8s.sh || error_exit "Échec de la préparation des fichiers de monitoring"

echo -e "${GREEN}6. Déploiement des services...${NC}"
kubectl apply -k k8s/base || error_exit "Échec du déploiement Kubernetes"

echo "Attente du téléchargement des images (60s)..."
sleep 60

echo "Attente du démarrage de l'Ingress Controller..."
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=300s || error_exit "Timeout sur l'attente de l'Ingress Controller"

echo "Attente des déploiements..."
kubectl wait deployment --all --for=condition=Available=True --timeout=600s -n quote-generator

echo -e "${GREEN}7. État final des pods :${NC}"
kubectl get pods -n quote-generator
kubectl get pods -n ingress-nginx

echo -e "${GREEN}URLs des services :${NC}"
echo "Application: http://localhost"
echo "API Gateway: http://localhost/api"
echo "Grafana: http://localhost/grafana"

echo -e "${GREEN}Démarrage du tunnel Minikube...${NC}"
minikube tunnel