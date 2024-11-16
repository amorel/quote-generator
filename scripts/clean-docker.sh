#!/bin/bash

echo "🔄 Stopping and removing all containers..."
docker-compose down -v

echo "🧹 Cleaning up Docker system..."
docker system prune -af

echo "🏗️ Rebuilding all services..."
docker-compose build --no-cache

echo "🚀 Starting services..."
docker-compose up