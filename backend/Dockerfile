FROM node:22.16.0-alpine3.22

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY server.js ./

RUN mkdir -p /app/data

ENV PORT=3000
ENV DATA_DIR=/app/data

EXPOSE 3000

CMD ["node", "server.js"]