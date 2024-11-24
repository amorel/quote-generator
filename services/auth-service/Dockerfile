FROM node:20-alpine
WORKDIR /app

# Shared module setup
COPY shared ./shared
RUN cd shared && npm install && npm run build

# Service dependencies
COPY services/auth-service ./services/auth-service
WORKDIR /app/services/auth-service

# Build et debug
RUN npm install && \
    npm run build && \
    echo "=== Contenu de database.js ===" && \
    cat dist/src/config/database.js && \
    echo "=== Fin du fichier ==="

CMD ["npm", "start"]