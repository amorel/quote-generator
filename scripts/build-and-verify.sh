#!/bin/bash

# 1. Récupérer la version
TAG=$(grep TAG .env | cut -d= -f2)
echo "Building version: $TAG"

# 2. Build
docker compose build

# 3. Vérifier les images
docker images | grep quote-generator | grep $TAG

# 4. Si tout est ok, démarrer
if [ $? -eq 0 ]; then
    echo "All images built successfully with tag $TAG"
    docker compose up -d
else
    echo "Error: Some images are missing the correct tag"
    exit 1
fi