#!/bin/bash
# Arrêt des tunnels existants
taskkill /F /IM "minikube.exe" /FI "WINDOWTITLE eq minikube service*" > nul 2>&1 || true

# Démarrage des nouveaux tunnels
nohup minikube service api-gateway-service -n quote-generator > gateway-tunnel.log 2>&1 &
nohup minikube service grafana -n quote-generator > grafana-tunnel.log 2>&1 &

# Attente et affichage des URLs
sleep 5
echo "URLs des services :"
echo "API Gateway: $(cat gateway-tunnel.log | grep "http" | tail -n 1)"
echo "Grafana: $(cat grafana-tunnel.log | grep "http" | tail -n 1)"
echo "Credentials Grafana :"
echo "Username: admin"
echo "Password: admin"