#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Récupération du TAG depuis .env
export TAG=$(grep TAG .env | cut -d= -f2)

# Fonction d'erreur
error_exit() {
    echo -e "${RED}Erreur: $1${NC}" >&2
    exit 1
}

echo -e "${GREEN}Version de déploiement: $TAG${NC}"

echo -e "${GREEN}1. Construction des images avec docker-compose...${NC}"
docker-compose build || error_exit "Échec de la construction des images"

echo -e "${GREEN}2. Démarrage de Minikube...${NC}"
minikube start --kubernetes-version=v1.31.0 --driver=docker --cpus=2 --memory=4096mb \
    --image-repository=registry.cn-hangzhou.aliyuncs.com/google_containers || error_exit "Échec du démarrage de Minikube"

echo -e "${GREEN}3. Chargement des images dans Minikube...${NC}"
for service in shared api-gateway auth-service quote-service user-service; do
    echo "Chargement de quote-generator-$service:$TAG"
    minikube image load quote-generator-$service:$TAG || error_exit "Échec du chargement de l'image $service"
done

echo -e "${GREEN}4. Préparation des fichiers de monitoring...${NC}"
echo "Génération des configurations Grafana..."
./scripts/prepare-k8s.sh || error_exit "Échec de la préparation des fichiers de monitoring"


echo -e "${GREEN}5. Déploiement des services...${NC}"
echo "Application des configurations Kubernetes avec la version $TAG..."
kubectl apply -k k8s/base || error_exit "Échec du déploiement Kubernetes"

echo "Attente démarrage RabbitMQ..."
kubectl wait --namespace quote-generator --for=condition=ready pod -l app=rabbitmq --timeout=90s || \
    error_exit "Timeout sur l'attente de RabbitMQ"

echo "Attente démarrage PostgreSQL..."
kubectl wait --namespace quote-generator --for=condition=ready pod -l app=user-db --timeout=90s || \
    error_exit "Timeout sur l'attente de PostgreSQL"

echo "Redémarrage services dépendants..."
kubectl rollout restart deployment -n quote-generator quote-service user-service

# Attente du démarrage des pods
echo -e "${GREEN}6. Attente du démarrage des pods (30s)...${NC}"
sleep 30

echo -e "${GREEN}7. État des pods :${NC}"
kubectl get pods -n quote-generator

# Vérification des versions déployées
echo -e "${GREEN}7.1. Vérification des versions déployées :${NC}"
for service in api-gateway auth-service quote-service user-service; do
    DEPLOYED_VERSION=$(kubectl get deployment $service -n quote-generator -o jsonpath="{.spec.template.spec.containers[0].image}" | cut -d: -f2)
    if [ "$DEPLOYED_VERSION" = "$TAG" ]; then
        echo -e "✅ $service: ${GREEN}version $TAG déployée${NC}"
    else
        echo -e "⚠️  $service: ${RED}version $DEPLOYED_VERSION (attendu: $TAG)${NC}"
    fi
done

echo -e "${GREEN}8. Configuration des tunnels...${NC}"
# Fermeture des tunnels existants
taskkill /F /IM "minikube.exe" /FI "WINDOWTITLE eq minikube service*" > nul 2>&1 || true

# Création des tunnels en arrière-plan
nohup minikube service api-gateway-service -n quote-generator > gateway-tunnel.log 2>&1 &
nohup minikube service grafana -n quote-generator > grafana-tunnel.log 2>&1 &

# Récupération des URLs
sleep 5
API_URL=$(cat gateway-tunnel.log | grep "http" | tail -n 1)
GRAFANA_URL=$(cat grafana-tunnel.log | grep "http" | tail -n 1)

echo -e "${GREEN}URLs des services :${NC}"
echo "API Gateway: $API_URL"
echo "Grafana: $GRAFANA_URL"
echo -e "${GREEN}Credentials Grafana :${NC}"
echo "Username: admin"
echo "Password: admin"

echo -e "\n${GREEN}Pour faire un rollback, utilisez :${NC}"
echo "kubectl rollback deployment <service-name> -n quote-generator"

echo -e "\n${GREEN}Pour vérifier les logs :${NC}"
echo "kubectl logs -f deployment/<service-name> -n quote-generator"