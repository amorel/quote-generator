FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install && \
    npm run build && \
    echo "Build completed"

# Ajouter une commande qui termine immédiatement
CMD ["echo", "Shared package built successfully"]