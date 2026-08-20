# syntax=docker/dockerfile:1

# ---------- 1. deps: ставим зависимости один раз, кэшируем по package*.json ----------
FROM node:22.17.1-alpine AS deps
WORKDIR /app

# рекомендация Next.js для Alpine — некоторым нативным зависимостям нужен libc6-compat
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
RUN npm ci

# ---------- 2. builder: собираем production-бандл Next.js ----------
FROM deps AS builder
WORKDIR /app
COPY . .

# next.config.ts подставляет эти переменные прямо в клиентский бандл на этапе
# `next build` — то есть их нужно передавать именно как build-args, задавать
# их через `environment:` в docker-compose (как для backend) уже не сработает
ARG SERVER_URL
ARG NEXT_PUBLIC_YANDEX_SMART_CAPTCHA_CLIENT_KEY
ENV SERVER_URL=${SERVER_URL}
ENV NEXT_PUBLIC_YANDEX_SMART_CAPTCHA_CLIENT_KEY=${NEXT_PUBLIC_YANDEX_SMART_CAPTCHA_CLIENT_KEY}

# на случай, если папки public пока нет в репозитории — COPY ниже не должен упасть
RUN mkdir -p public
RUN npm run build

# ---------- 3. runner: минимальный образ на базе output: 'standalone' ----------
FROM node:22.17.1-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
# standalone-выход уже содержит только нужные для runtime node_modules —
# отдельно npm ci в этой стадии не требуется
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

ENV PORT=3000
ENV HOSTNAME=0.0.0.0
EXPOSE 3000

CMD ["node", "server.js"]
