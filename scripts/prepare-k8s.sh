#!/bin/bash

# Codes couleurs pour la lisibilité
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Suppression des anciens dossiers générés
echo -e "${GREEN}🗑️ Nettoyage des anciens dossiers...${NC}"
rm -rf k8s/base/generated

# Création des dossiers
echo -e "${GREEN}📁 Création des dossiers...${NC}"
mkdir -p k8s/base/generated/databases/mongo-init/auth-db
mkdir -p k8s/base/generated/databases/mongo-init/quote-db
mkdir -p k8s/base/generated/grafana/dashboards
mkdir -p k8s/base/generated/grafana/provisioning/dashboards
mkdir -p k8s/base/generated/grafana/provisioning/datasources
mkdir -p k8s/base/generated/databases/postgres

# Copie des fichiers MongoDB
echo -e "${GREEN}📋 Copie des scripts MongoDB...${NC}"
cp mongo-init/auth-db/* k8s/base/generated/databases/mongo-init/auth-db/
cp mongo-init/quote-db/* k8s/base/generated/databases/mongo-init/quote-db/

# Copie des autres fichiers
echo -e "${GREEN}📋 Copie des autres fichiers de configuration...${NC}"
cp monitoring/grafana/dashboards/*.json k8s/base/generated/grafana/dashboards/
cp monitoring/grafana/provisioning/dashboards/*.yaml k8s/base/generated/grafana/provisioning/dashboards/
cp monitoring/grafana/provisioning/datasources/*.yaml k8s/base/generated/grafana/provisioning/datasources/

# PostgreSQL
cp services/user-service/src/UserService.Infrastructure/Data/Scripts/init.sql k8s/base/generated/databases/postgres/

echo -e "${GREEN}✅ Préparation terminée !${NC}"