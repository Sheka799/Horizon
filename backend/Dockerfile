# syntax=docker/dockerfile:1

# ---------- 1. deps: ставим зависимости один раз, кэшируем по package*.json ----------
FROM node:22.17.1-alpine AS deps
WORKDIR /app

# python3/make/g++ нужны на случай, если для argon2 не найдётся
# готовый prebuilt-бинарник под linux-musl и его придётся собирать из исходников
RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# ---------- 2. build: генерируем Prisma Client и собираем Nest-приложение ----------
FROM deps AS build
WORKDIR /app

# схему и конфиг Prisma копируем отдельным слоем — пока они не менялись,
# `prisma generate` будет браться из кэша Docker
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npx prisma generate

# остальной код и сборка
COPY . .
RUN npm run build

# ---------- 3. production: чистый образ только с runtime-зависимостями ----------
FROM node:22.17.1-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

# ставим ТОЛЬКО production-зависимости по lock-файлу (без eslint/jest/typescript и т.д.)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --legacy-peer-deps && npm cache clean --force

# собранное приложение (там же лежит и скомпилированный Prisma Client —
# генератор в schema.prisma настроен на вывод в prisma/generated, а не в node_modules/.prisma)
COPY --from=build /app/dist ./dist

# схема + миграции + конфиг — нужны для `prisma migrate deploy` в runtime
COPY --from=build /app/prisma/schema.prisma ./prisma/schema.prisma
COPY --from=build /app/prisma/migrations ./prisma/migrations
COPY --from=build /app/prisma.config.ts ./prisma.config.ts

EXPOSE 3001

# запускаем от непривилегированного пользователя (встроен в образ node:*-alpine)
USER node

# применяем миграции и запускаем скомпилированное приложение
# (entry-point после сборки лежит в dist/src/main.js, а не dist/main.js — см. dist/ структуру)
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]
