# syntax=docker/dockerfile:1

# --- build the static site ---
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- serve it with a non-root nginx (listens on 8080 as uid 101) ---
FROM nginxinc/nginx-unprivileged:alpine AS runtime
LABEL org.opencontainers.image.title="whereami" \
      org.opencontainers.image.description="MultiCloud demo — a React app that shows which cloud it is running in" \
      org.opencontainers.image.authors="Adao Oliveira Jr" \
      org.opencontainers.image.url="https://adao.dev" \
      org.opencontainers.image.source="https://github.com/junior/whereami" \
      org.opencontainers.image.licenses="MIT"
USER root
# curl handles corporate proxies (HTTPS_PROXY) and custom / MITM CAs (CURL_CA_BUNDLE) cleanly
RUN apk add --no-cache curl ca-certificates
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html
COPY --chmod=0755 entrypoint.sh /usr/local/bin/entrypoint.sh
# entrypoint (running as 101) refreshes ipinfo.json in here at startup
RUN chown -R 101:101 /usr/share/nginx/html
USER 101
EXPOSE 8080
ENTRYPOINT ["entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
