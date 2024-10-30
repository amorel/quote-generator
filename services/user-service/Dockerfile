FROM node:20-alpine
WORKDIR /app

# Shared module setup
COPY shared ./shared
RUN cd shared && npm install && npm run build

# Service dependencies
COPY services/user-service ./services/user-service
RUN cd services/user-service && npm install && npm run build

WORKDIR /app/services/user-service
CMD ["npm", "start"]