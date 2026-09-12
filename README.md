# Horizon

Канбан-доски для управления задачами и проектами — с drag-n-drop, форматированными описаниями задач, вложениями, приоритетами/дедлайнами и архивом.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)

## Возможности

- **Канбан-доски** — колонки и задачи, перетаскивание мышью (drag-n-drop)
- **Описания задач** — форматированный текст (заголовки, списки) через встроенный редактор
- **Вложения** — картинки и файлы прямо в задаче, хранятся в S3-совместимом хранилище
- **Приоритеты и дедлайны** — отслеживание сроков и важности задач
- **Архив** — закрытые задачи не теряются, историю можно посмотреть в любой момент
- **Авторизация** — email/пароль, вход через Яндекс, двухфакторная аутентификация (email), подтверждение почты, восстановление пароля
- **Тёмная/светлая тема**

## Технологии

**Backend** — NestJS 11, Prisma 7 + PostgreSQL, Redis (сессии), сессионная авторизация (не JWT), Argon2, AWS S3 SDK, Nodemailer + React Email

**Frontend** — Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, TanStack Query, @dnd-kit, Tiptap, react-hook-form + Zod

**Инфраструктура** — Docker, Docker Compose, деплой через [Dokploy](https://dokploy.com/)

## Безопасность

Помимо базовой авторизации, в проекте реализованы:

- CSRF-защита (double-submit cookie) на всех мутирующих запросах
- Rate limiting на чувствительных auth-эндпоинтах
- Security-заголовки (Helmet), `state`-параметр в OAuth-flow против login-CSRF
- Фильтрация чувствительных полей (пароли, OAuth-токены) из ответов API
- Валидация типа/размера загружаемых файлов на уровне Multer

## Структура проекта

```
Horizon/
├── backend/    # NestJS API
├── frontend/   # Next.js приложение
└── docker-compose.yml   # для деплоя (Dokploy)
```

У `backend/` и `frontend/` свои `docker-compose.yml`/`Dockerfile` для локальной разработки — команды для запуска каждого приведены ниже.

## Быстрый старт (локально)

**Требования:** Node.js 22+, Docker Desktop

```bash
git clone https://github.com/Sheka799/Horizon.git
cd Horizon
```

**1. Поднять Postgres и Redis:**
```bash
cd backend
docker compose up -d db redis
```

**2. Настроить переменные окружения:**
```bash
cp .env.example .env        # backend/.env — см. список переменных ниже
```
Файл `.env.example` в корне репозитория — справочный список всех переменных для backend, frontend и Dokploy. Реальные `.env` (в `backend/` и `frontend/`) в репозиторий не попадают ([.gitignore](backend/.gitignore)).

**3. Запустить backend:**
```bash
npm install
npx prisma migrate deploy   # применить миграции к базе
npm run start:dev           # http://localhost:3001
```

**4. Запустить frontend** (в отдельном терминале):
```bash
cd ../frontend
npm install
npm run dev                 # http://localhost:3000
```

## Тестирование

```bash
cd backend
npm test          # прогнать unit-тесты
npm run test:cov  # с отчётом покрытия
```

Backend покрывается unit-тестами на Jest (проект в процессе наращивания покрытия).

## Деплой

Проект контейнеризован (multi-stage `Dockerfile` для backend и frontend) и настроен под деплой через [Dokploy](https://dokploy.com/) — см. корневой `docker-compose.yml`.

## Планы (roadmap)

- Рабочие пространства (workspaces) с приглашением участников по email и ролями
- Совместный доступ к доскам
- Комментарии к задачам
- Обновления в реальном времени (WebSocket)
