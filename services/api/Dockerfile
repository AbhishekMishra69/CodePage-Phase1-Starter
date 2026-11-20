FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
COPY services/api/package.json services/api/
COPY apps/user-web/package.json apps/user-web/
COPY apps/admin-web/package.json apps/admin-web/
RUN npm ci --omit=dev -w @codepage/api

COPY services/api/src services/api/src

WORKDIR /app/services/api
USER node
EXPOSE 5000

HEALTHCHECK --interval=15s --timeout=3s --start-period=20s --retries=3 \
CMD wget -qO- http://127.0.0.1:5000/health || exit 1

CMD ["node", "src/server.js"]