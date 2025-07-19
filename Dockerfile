# Используем официальный Node.js образ
FROM node:20-alpine AS base

# Устанавливаем зависимости только при необходимости
FROM base AS deps
# Проверяем https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine для понимания, почему libc6-compat
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Копируем файлы зависимостей
COPY package.json package-lock.json* pnpm-lock.yaml* ./
# Устанавливаем зависимости
RUN npm ci --only=production

# Пересобираем исходный код только при необходимости
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Собираем приложение
RUN npm run build

# Продакшн образ, копируем все файлы и запускаем приложение
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Создаем пользователя для безопасности
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем собранное приложение
COPY --from=builder /app/public ./public

# Устанавливаем правильные разрешения для prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Автоматически используем вывод трассировки для получения наименьшего размера изображения
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# server.js создается автоматически из standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"] 