# syntax=docker/dockerfile:1
FROM node:24-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/shell/package.json ./apps/shell/package.json
COPY apps/example/package.json ./apps/example/package.json
COPY packages/ui/package.json ./packages/ui/package.json
COPY packages/contracts/package.json ./packages/contracts/package.json
RUN npm ci --include=dev

FROM dependencies AS source
COPY . .

FROM source AS shell-build
# The deployment URL is generated again at container startup.
RUN MICROFE_ENV=development MICROFE_EXAMPLE_URL=http://localhost:3001/remoteEntry.js npm run build --workspace @microfe/shell

FROM source AS example-build
RUN npm run build --workspace @microfe/example

FROM nginx:stable-alpine AS runtime
COPY container/nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
EXPOSE 8080
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/health || exit 1

FROM runtime AS shell
# Node is used once at startup to reuse the same URL validator as static builds.
RUN apk add --no-cache nodejs
COPY --from=shell-build /app/apps/shell/dist/ /usr/share/nginx/html/
COPY config/runtime-config.cjs /opt/microfe/runtime-config.cjs
COPY container/configure-runtime.cjs /opt/microfe/configure-runtime.cjs
COPY --chmod=755 container/40-runtime-config.sh /docker-entrypoint.d/40-runtime-config.sh
ENV MICROFE_ENV=production

FROM runtime AS example
COPY --from=example-build /app/apps/example/dist/ /usr/share/nginx/html/
