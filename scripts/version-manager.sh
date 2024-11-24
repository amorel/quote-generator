#!/bin/bash

update_service() {
    SERVICE=$1
    OLD_VERSION=$2
    NEW_VERSION=$3
    
    # Build nouvelle version
    docker build -t quote-generator-${SERVICE}:${NEW_VERSION} \
      services/${SERVICE}
    
    # Chargement dans minikube
    minikube image load quote-generator-${SERVICE}:${NEW_VERSION}
    
    # Mise à jour progressive
    kubectl set image deployment/${SERVICE} \
      ${SERVICE}=quote-generator-${SERVICE}:${NEW_VERSION} \
      --record
    
    # Vérification du déploiement
    kubectl rollout status deployment/${SERVICE}
}