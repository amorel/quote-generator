FROM node:20-alpine
WORKDIR /app

# Copier le package shared et l'installer
COPY shared ./shared
WORKDIR /app/shared
RUN npm install && npm run build

# Setup du frontend
WORKDIR /app/services/frontend
COPY services/frontend/package*.json ./
RUN npm install && npm install ../../shared

# Copier le reste et build
COPY services/frontend ./
RUN npm run build

ENV VITE_PORT=3006
ENV HOST=0.0.0.0
EXPOSE 3006

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]