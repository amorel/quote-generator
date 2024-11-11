FROM node:20-alpine
WORKDIR /app

# Shared module setup
COPY shared ./shared
RUN cd shared && npm install && npm run build

# Service dependencies
COPY services/quote-service ./services/quote-service
RUN cd services/quote-service && npm install && npm run build

WORKDIR /app/services/quote-service
CMD ["npm", "start"]

# Dockerfile pour services Node.js (c'est pour débugger avec VSCode, voir dans le fichier .vscode/launch.json)
# CMD ["node", "--inspect=0.0.0.0:9229", "dist/index.js"]