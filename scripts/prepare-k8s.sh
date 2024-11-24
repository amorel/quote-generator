#!/bin/bash

# *** ATTENTION ***
# Ce script est utilisé pour générer les fichiers de configuration de monitoring.
# La raison d'être de ce script:
# Kustomize ne permet pas d'accéder aux fichiers en dehors du répertoire de base pour des raisons de sécurité.

# Codes couleurs pour la lisibilité
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Suppression des anciens dossiers générés
echo -e "${GREEN}🗑️ Nettoyage des anciens dossiers...${NC}"
rm -rf k8s/base/monitoring/generated
rm -rf k8s/base/monitoring/grafana

# Créer les dossiers nécessaires
echo -e "${GREEN}📁 Création des dossiers...${NC}"
mkdir -p k8s/base/monitoring/generated/grafana/dashboards
mkdir -p k8s/base/monitoring/generated/grafana/provisioning/dashboards
mkdir -p k8s/base/monitoring/generated/grafana/provisioning/datasources

# Copier les fichiers
echo -e "${GREEN}📋 Copie des fichiers de configuration...${NC}"
cp monitoring/grafana/dashboards/*.json k8s/base/monitoring/generated/grafana/dashboards/
cp monitoring/grafana/provisioning/dashboards/*.yaml k8s/base/monitoring/generated/grafana/provisioning/dashboards/
cp monitoring/grafana/provisioning/datasources/*.yaml k8s/base/monitoring/generated/grafana/provisioning/datasources/

echo -e "${GREEN}✅ Préparation terminée !${NC}"