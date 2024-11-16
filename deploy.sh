#!/bin/bash

# Pull latest changes
git pull origin main

# Build and run with production configuration
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d

# Cleanup
docker system prune -af