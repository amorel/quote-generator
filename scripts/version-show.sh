#!/bin/bash

# Vérifier les versions actuelles des images
echo "Versions des images :"
docker images | grep mongo
docker images | grep postgres
docker images | grep rabbitmq
docker images | grep prometheus
docker images | grep grafana

# Vérifier les tags latest
echo -e "\nImages utilisant latest :"
docker images | grep latest