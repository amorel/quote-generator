FROM node:20-alpine
WORKDIR /app

# Shared module setup
COPY shared ./shared
RUN cd shared && npm install && npm run build

# Service dependencies
COPY services/auth-service ./services/auth-service
RUN cd services/auth-service && npm install && npm run build

WORKDIR /app/services/auth-service
CMD ["npm", "start"]