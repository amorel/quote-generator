#!/bin/bash

# Couleurs pour la lisibilité
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Fonction de mise à jour d'un service
update_service() {
    local service=$1
    local image=$2
    
    echo -e "${GREEN}Mise à jour de $service...${NC}"
    
    # Mise à jour de l'image
    kubectl set image deployment/$service $service=$image -n quote-generator
    
    # Vérification du statut
    if kubectl rollout status deployment/$service -n quote-generator; then
        echo -e "${GREEN}✓ $service mis à jour avec succès${NC}"
    else
        echo -e "${RED}✗ Échec de la mise à jour de $service${NC}"
        # Rollback automatique en cas d'échec
        kubectl rollout undo deployment/$service -n quote-generator
        return 1
    fi
}

# Mise à jour des configurations
echo -e "${GREEN}Mise à jour des configurations...${NC}"
kubectl apply -k k8s/base

# Mise à jour des services individuels
update_service "api-gateway" "quote-generator-api-gateway:latest"
update_service "auth-service" "quote-generator-auth-service:latest"
update_service "quote-service" "quote-generator-quote-service:latest"
update_service "user-service" "quote-generator-user-service:latest"

# Vérification finale
echo -e "${GREEN}Vérification de l'état des pods...${NC}"
kubectl get pods -n quote-generator