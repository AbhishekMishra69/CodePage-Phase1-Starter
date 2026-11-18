FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY services/api/package.json services/api/
COPY apps/user-web/package.json apps/user-web/
COPY apps/admin-web/package.json apps/admin-web/
RUN npm ci

COPY apps/admin-web apps/admin-web

ARG VITE_API_URL=http://localhost:5000/api/v1
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build -w @codepage/admin-web

FROM nginx:1.27-alpine
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/admin-web/dist /usr/share/nginx/html
EXPOSE 80

HEALTHCHECK --interval=15s --timeout=3s --retries=3 \
CMD wget -qO- http://127.0.0.1/ || exit 1