# syntax=docker/dockerfile:1.6

# Builder
FROM node:20-bullseye AS development

WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm install
RUN npm ci --only=production

COPY . /app

ENV CI=true
ENV PORT=3000

CMD ["npm", "start"]

# Build
FROM development AS build

RUN npm install --include=dev
RUN npm run build

# App
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY --from=build /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf ./*
COPY --from=build /app/build .
COPY --chmod=0755 entrypoint.sh /usr/local/bin/

ENTRYPOINT ["entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
