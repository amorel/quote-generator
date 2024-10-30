FROM node:20-alpine
WORKDIR /app

# Shared module setup
COPY shared ./shared
RUN cd shared && npm install && npm run build

# Service dependencies
COPY services/api-gateway ./services/api-gateway
RUN cd services/api-gateway && npm install && npm run build

WORKDIR /app/services/api-gateway
CMD ["npm", "start"]