FROM node:alpine as npm_cache
WORKDIR /cache

COPY package*.json ./
RUN npm ci --production --no-optional --ddp --ignore-scripts --quiet


FROM node:alpine


ENV LANG C.UTF-8
ENV NODE_ENV $NODE_ENV
ENV NPM_CONFIG_LOGLEVEL error
ENV NPM_CONFIG_PRODUCTION true
ENV NODE_MODULES_CACHE true

RUN mkdir -p /app && chown node:node -R /app
WORKDIR /app
USER node

COPY --from=npm_cache /cache ./

COPY ../../../src src/

CMD ["node", "-r", "esm", "--max-old-space-size=1024", "--trace-warnings", "src/server/index.js"]
