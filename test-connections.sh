#!/bin/bash

echo "Testing service health checks..."

# Test API Gateway
curl -f http://localhost:3000/health || exit 1
echo "✅ API Gateway is healthy"

# Test Auth Service
curl -f http://localhost:3001/health || exit 1
echo "✅ Auth Service is healthy"

# Test Quote Service
curl -f http://localhost:3002/health || exit 1
echo "✅ Quote Service is healthy"

# Test User Service
curl -f http://localhost:3003/health || exit 1
echo "✅ User Service is healthy"

echo "All services are healthy!"