# One file, three images: docker build --target web|api|notifier .
# scripts/build-images.sh builds and tags all of them.

FROM node:22-bookworm-slim AS frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY vite.config.js index.html admin.html checkout.html return-policy.html privacy-policy.html terms-of-service.html styles.css admin.css colors_and_type.css ./
COPY src ./src
COPY public ./public
# products.json is published by the api at runtime. The rest is pre-compressed so nginx spends no CPU on it.
RUN npx vite build \
  && rm docs/products.json \
  && find docs -type f \( -name '*.html' -o -name '*.js' -o -name '*.css' -o -name '*.txt' \) -exec gzip -9 -k {} +


FROM nginx:1.27-alpine AS web
COPY docker/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --chmod=755 docker/web/tls.sh /docker-entrypoint.d/40-tls.sh
COPY --from=frontend /app/docs /srv/static
# Owned by the api's user, whichever container mounts these shared volumes first.
RUN mkdir -p /srv/site /srv/uploads && chown 1000:1000 /srv/site /srv/uploads


FROM node:22-alpine AS api-deps
# Compilers for better-sqlite3 in case no prebuilt binary matches. They stay out of the final image.
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY api/package.json api/package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund \
  && rm -rf node_modules/better-sqlite3/deps node_modules/better-sqlite3/src


FROM node:22-alpine AS api
WORKDIR /app
ENV NODE_ENV=production PORT=3000 DATA_DIR=/data SITE_DIR=/site UPLOADS_DIR=/uploads SEED_FILE=/app/seed/products.json TEMPLATE_FILE=/app/template/index.html
COPY --from=api-deps /app/node_modules ./node_modules
COPY api/package.json api/server.js api/db.js api/auth.js api/publish.js api/backup.js api/set-admin-password.js ./
COPY public/products.json ./seed/products.json
COPY --from=frontend /app/docs/index.html ./template/index.html
RUN mkdir -p /data /site /uploads && chown node:node /data /site /uploads
USER node
EXPOSE 3000
CMD ["node", "--max-old-space-size=128", "server.js"]


FROM node:22-alpine AS notifier
WORKDIR /app
ENV NODE_ENV=production PORT=4000
COPY notification-middleware/package.json notification-middleware/index.js ./
USER node
EXPOSE 4000
CMD ["node", "--max-old-space-size=32", "index.js"]
