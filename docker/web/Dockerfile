FROM node:22-bookworm-slim AS build
WORKDIR /app
# react-snap pulls in Puppeteer, which would otherwise download Chromium.
ENV PUPPETEER_SKIP_DOWNLOAD=true PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
ARG SITE_URL=https://thepackhouse.vn
# Not "npm run build": its react-snap postbuild needs Chrome at a macOS path.
RUN npx vite build \
  && PRODUCTS_SNAPSHOT=public/products.json STRAPI_URL="$SITE_URL" SITE_URL="$SITE_URL" node generate-feed.js

FROM nginx:1.27-alpine
COPY docker/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/docs /usr/share/nginx/html
COPY docker/web/config.js /usr/share/nginx/html/config.js
