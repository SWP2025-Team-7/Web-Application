# AI Automation for Employment Certificate Processing: Web Application

Веб-приложение для автоматизации обработки сертификатов занятости с интеграцией API бэкенда.

## 🚀 Возможности

- **Таблица пользователей** с полной интеграцией API
- **Редактирование в реальном времени** - двойной клик для редактирования ячеек
- **Добавление новых пользователей** через модальную форму
- **Удаление пользователей** с подтверждением
- **Экспорт данных** в CSV формат
- **Автоматическая синхронизация** с сервером
- **Адаптивный дизайн** с современным UI

## 📋 Структура данных пользователя

Каждый пользователь содержит следующие поля:
- **ID** - уникальный идентификатор
- **Псевдоним** - псевдоним пользователя
- **Имя, Фамилия, Отчество** - личные данные
- **Email** - электронная почта
- **Телефон** - номер телефона
- **Гражданство** - гражданство пользователя
- **Обязанность работать** - да/нет
- **Статус** - работает/безработный/студент
- **Сумма гранта** - размер гранта
- **Период обязанности** - период обязательств
- **Компания** - место работы
- **Должность** - занимаемая должность
- **Дата начала/окончания** - период работы
- **Зарплата** - размер заработной платы

## 🛠 Технологии

- **Next.js 15** - React фреймворк
- **TypeScript** - типизированный JavaScript
- **Tailwind CSS** - утилитарный CSS фреймворк
- **shadcn/ui** - компоненты UI
- **Lucide React** - иконки

## 🚀 Установка и запуск

### Локальная разработка

1. **Клонируйте репозиторий:**
   ```bash
   git clone https://github.com/SWP2025-Team-7/Web-Application.git
   cd Web-Application
   ```

2. **Установите зависимости:**
   ```bash
   npm install
   ```

3. **Запустите сервер разработки:**
   ```bash
   npm run dev
   ```

4. **Откройте браузер:**
   ```
   http://localhost:3000
   ```

### Docker (Рекомендуется)

1. **Клонируйте репозиторий:**
   ```bash
   git clone https://github.com/SWP2025-Team-7/Web-Application.git
   cd Web-Application
   ```

2. **Запустите с помощью Docker Compose:**

   **Linux/Mac:**
   ```bash
   chmod +x docker-run.sh
   ./docker-run.sh
   ```

   **Windows:**
   ```powershell
   .\docker-run.ps1
   ```

   **Или вручную:**
   ```bash
   docker-compose up --build -d
   ```

3. **Откройте браузер:**
   ```
   http://localhost:3000
   ```

4. **Полезные команды:**
   ```bash
   # Просмотр логов
   docker-compose logs -f

   # Остановка контейнеров
   docker-compose down

   # Пересборка
   docker-compose up --build -d
   ```

## 🔧 Конфигурация API

Приложение настроено для работы с бэкендом на `http://localhost:8000`. 

### API Endpoints:
- `GET /api/users/` - получить всех пользователей
- `GET /api/users/{id}` - получить пользователя по ID
- `POST /api/users/` - создать нового пользователя
- `PATCH /api/users/{id}` - обновить пользователя
- `DELETE /api/users/{id}` - удалить пользователя

## 📖 Использование

### Основные функции:

1. **Просмотр данных:**
   - Таблица автоматически загружает данные при открытии
   - Используйте кнопку "Обновить" для перезагрузки данных

2. **Редактирование:**
   - Кликните на ячейку для выделения
   - Двойной клик для редактирования
   - Enter - сохранить, Escape - отменить

3. **Добавление пользователей:**
   - Нажмите кнопку "Добавить пользователя"
   - Заполните форму
   - Нажмите "Создать пользователя"

4. **Удаление пользователей:**
   - Нажмите на иконку корзины в строке пользователя
   - Подтвердите удаление

5. **Экспорт данных:**
   - Нажмите "Экспорт CSV" для скачивания данных

## 🔒 Безопасность

- Все запросы к API проходят через прокси Next.js
- Настроены CORS заголовки для безопасной работы
- Валидация данных на клиенте и сервере

## 📝 Лицензия

Этот проект является частью SWP2025 Team 7.

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Внесите изменения
4. Создайте Pull Request

## 📞 Поддержка

По вопросам обращайтесь к команде SWP2025 Team 7.
