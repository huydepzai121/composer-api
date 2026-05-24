# syntax=docker/dockerfile:1.7
# Composer API dev container. Workers code can't be hosted "in" Docker for
# production (it runs on Cloudflare's edge) so this image targets local
# development and preview via Vite + workerd.

FROM node:22-slim AS deps
WORKDIR /app
ENV NPM_CONFIG_FUND=false NPM_CONFIG_AUDIT=false
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-slim AS dev
WORKDIR /app
ENV NODE_ENV=development \
    HOST=0.0.0.0 \
    PORT=5173
RUN apt-get update \
 && apt-get install -y --no-install-recommends ca-certificates \
 && rm -rf /var/lib/apt/lists/*
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]

FROM node:22-slim AS build
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-slim AS preview
WORKDIR /app
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=4173
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json vite.config.ts wrangler.jsonc tsconfig.json ./
COPY worker ./worker
COPY migrations ./migrations
EXPOSE 4173
CMD ["npm", "run", "preview"]
