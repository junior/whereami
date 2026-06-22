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
USER root
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
