# Остановка и удаление существующих контейнеров
Write-Host "Остановка существующих контейнеров..." -ForegroundColor Green
docker-compose down

# Удаление старых образов
Write-Host "Удаление старых образов..." -ForegroundColor Green
docker system prune -f

# Сборка и запуск
Write-Host "Сборка и запуск контейнера..." -ForegroundColor Green
docker-compose up --build -d

# Проверка статуса
Write-Host "Проверка статуса контейнеров..." -ForegroundColor Green
docker-compose ps

Write-Host "Приложение доступно по адресу: http://localhost:3000" -ForegroundColor Yellow
Write-Host "Для просмотра логов используйте: docker-compose logs -f" -ForegroundColor Yellow 