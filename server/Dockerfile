# syntax=docker/dockerfile:1
ARG NODE_VERSION=20.19.0

FROM node:${NODE_VERSION}-alpine AS build
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
COPY prisma ./prisma

# 1. Install all dependencies
RUN npm ci --include=dev --legacy-peer-deps

COPY tsconfig.json ./
COPY src ./src

# 2. Generate Prisma, Build, and Fix Extensions
RUN npx prisma generate \
    && npm run build \
    && npx resolve-tspaths \
    && npm prune --omit=dev --legacy-peer-deps

FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# 3. UPDATED FIX: Install OpenSSL 1.1 from the v3.16 repository
RUN apk add --no-cache openssl

# Security: Run as non-root user
RUN addgroup -S app && adduser -S app -G app

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

USER app
EXPOSE 8080

CMD ["node", "dist/index.js"]