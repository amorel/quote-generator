#!/bin/bash

# Fonction pour afficher les versions actuelles
show_versions() {
    echo "Versions actuelles des services :"
    for service in api-gateway auth-service quote-service user-service; do
        echo -n "$service: "
        kubectl get deployment $service -n quote-generator \
            -o jsonpath="{.spec.template.spec.containers[0].image}" || echo "non trouvé"
        echo
    done
}

# Fonction pour mettre à jour un service
update_service() {
    local service=$1
    local version=$2
    
    echo "Mise à jour de $service vers la version $version"
    
    # Construction
    docker build -t $service:$version -f services/$service/Dockerfile .
    
    # Chargement dans minikube
    minikube image load $service:$version
    
    # Déploiement
    kubectl set image deployment/$service \
        $service=$service:$version \
        -n quote-generator
        
    # Attente du déploiement
    kubectl rollout status deployment/$service -n quote-generator
}

# Menu interactif
show_versions

echo -e "\nQue souhaitez-vous faire ?"
echo "1) Mettre à jour un service"
echo "2) Voir l'historique des versions"
echo "3) Revenir à une version précédente"
read -p "Choix : " choice

case $choice in
    1)
        read -p "Nom du service : " service
        read -p "Nouvelle version : " version
        update_service $service $version
        ;;
    2)
        read -p "Nom du service : " service
        kubectl rollout history deployment/$service -n quote-generator
        ;;
    3)
        read -p "Nom du service : " service
        read -p "Numéro de révision : " revision
        kubectl rollout undo deployment/$service \
            -n quote-generator \
            --to-revision=$revision
        ;;
esac

# Affichage final
show_versions