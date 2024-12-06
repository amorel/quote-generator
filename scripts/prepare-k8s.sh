#!/bin/bash

# Codes couleurs pour la lisibilité
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Suppression des anciens dossiers générés
echo -e "${GREEN}🗑️ Nettoyage des anciens dossiers...${NC}"
rm -rf k8s/base/generated

# Créer les dossiers nécessaires
echo -e "${GREEN}📁 Création des dossiers...${NC}"
mkdir -p k8s/base/generated/grafana/dashboards
mkdir -p k8s/base/generated/grafana/provisioning/dashboards
mkdir -p k8s/base/generated/grafana/provisioning/datasources
mkdir -p k8s/base/generated/databases/postgres

# Copier les fichiers
echo -e "${GREEN}📋 Copie des fichiers de configuration...${NC}"
# Grafana
cp monitoring/grafana/dashboards/*.json k8s/base/generated/grafana/dashboards/
cp monitoring/grafana/provisioning/dashboards/*.yaml k8s/base/generated/grafana/provisioning/dashboards/
cp monitoring/grafana/provisioning/datasources/*.yaml k8s/base/generated/grafana/provisioning/datasources/
# PostgreSQL
cp services/user-service/src/UserService.Infrastructure/Data/Scripts/init.sql k8s/base/generated/databases/postgres/

echo -e "${GREEN}✅ Préparation terminée !${NC}"