#!/bin/bash
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}1. Réinstallation Ingress NGINX...${NC}"
kubectl apply -f k8s/base/ingress-nginx.yaml
kubectl apply -f k8s/base/deployments/ingress-nginx-controller-deployment.yaml
kubectl apply -f k8s/base/services/ingress-service.yaml

echo -e "${GREEN}2. Redéploiement des services...${NC}"
kubectl apply -k k8s/base

echo -e "${GREEN}3. Attente des déploiements...${NC}"
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/name=ingress-nginx \
  --timeout=300s

for deployment in api-gateway auth-service quote-service user-service frontend auth-db quote-db grafana
do
    kubectl wait deployment/$deployment --for=condition=Available=True --timeout=300s -n quote-generator
done

echo -e "${GREEN}4. État des pods :${NC}"
kubectl get pods -n quote-generator
kubectl get pods -n ingress-nginx

echo -e "${GREEN}URLs :${NC}"
echo "App: http://localhost:30090"
echo "API: http://localhost:30090/api"
echo "Grafana: http://localhost:30090/grafana"

minikube tunnel