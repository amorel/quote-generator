#!/bin/bash

TAG=$(grep TAG .env | cut -d= -f2)
echo "Checking images for version: $TAG"

services=("api-gateway" "auth-service" "quote-service" "user-service")

for service in "${services[@]}"; do
    echo -n "quote-generator-$service:$TAG - "
    if docker image inspect quote-generator-$service:$TAG >/dev/null 2>&1; then
        echo "✅ Exists"
    else
        echo "❌ Missing"
    fi
done