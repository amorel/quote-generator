FROM node:20-alpine
WORKDIR /app
COPY services/frontend/package*.json ./
RUN npm install
COPY services/frontend ./
EXPOSE 3006
ENV VITE_PORT=3006
CMD ["npm", "run", "dev"]