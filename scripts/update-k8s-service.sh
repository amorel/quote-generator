#!/bin/bash

# Couleurs pour la lisibilité
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
SERVICE_NAME="quote-service"
NAMESPACE="quote-generator"
VERSION="1.0.3"
DOCKERFILE_PATH="services/quote-service/Dockerfile"

# Afficher la version actuelle
echo -e "${GREEN}Version actuelle :${NC}"
kubectl describe deployment ${SERVICE_NAME} -n ${NAMESPACE} | grep Image:

# Construction de l'image
echo -e "\n${GREEN}Construction de l'image v${VERSION}...${NC}"
if docker build -t ${SERVICE_NAME}:${VERSION} -f ${DOCKERFILE_PATH} .; then
    echo -e "${GREEN}✓ Image construite${NC}"
else
    echo -e "${RED}✗ Échec de la construction${NC}"
    exit 1
fi

# Chargement dans minikube
echo -e "\n${GREEN}Chargement dans minikube...${NC}"
minikube image load ${SERVICE_NAME}:${VERSION}

# Mise à jour du déploiement
echo -e "\n${GREEN}Mise à jour du déploiement...${NC}"
kubectl set image deployment/${SERVICE_NAME} \
    ${SERVICE_NAME}=${SERVICE_NAME}:${VERSION} \
    -n ${NAMESPACE}

# Surveillance du déploiement
echo -e "\n${GREEN}Surveillance du déploiement...${NC}"
kubectl rollout status deployment/${SERVICE_NAME} -n ${NAMESPACE}

# Vérification finale
echo -e "\n${GREEN}État final :${NC}"
kubectl get pods -n ${NAMESPACE} -l app=${SERVICE_NAME}