#!/bin/bash

# Остановка и удаление существующих контейнеров
echo "Остановка существующих контейнеров..."
docker-compose down

# Удаление старых образов
echo "Удаление старых образов..."
docker system prune -f

# Сборка и запуск
echo "Сборка и запуск контейнера..."
docker-compose up --build -d

# Проверка статуса
echo "Проверка статуса контейнеров..."
docker-compose ps

echo "Приложение доступно по адресу: http://localhost:3000"
echo "Для просмотра логов используйте: docker-compose logs -f" 