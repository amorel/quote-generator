FROM node:20-alpine
WORKDIR /app

# Build shared first
COPY shared ./shared
WORKDIR /app/shared
RUN npm install
RUN npm run build
RUN echo "=== CONTENU DU DOSSIER DIST ===" && \
    ls -la dist && \
    echo "=============================="

# Build quote-service
WORKDIR /app
COPY services/quote-service ./services/quote-service
WORKDIR /app/services/quote-service
RUN npm install
RUN npm run build

CMD ["npm", "start"]

# Dockerfile pour services Node.js (c'est pour débugger avec VSCode, voir dans le fichier .vscode/launch.json)
# CMD ["node", "--inspect=0.0.0.0:9229", "dist/index.js"]