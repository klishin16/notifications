# Notifications Service (NestJS + Bull + PostgreSQL)


## 📌 Описание
Сервис для отправки email-сообщений с поддержкой очередей, логирования, шаблонов и файлов. Также включает веб-дашборд для мониторинга отправки и управления шаблонами.
## 🚀 Функционал
- 📩 **Отправка email** (обычных и шаблонных) через очереди Bull (Redis)
- 📊 **Логирование статусов отправки** (created, pending, sent, failed)
- 🔁 **Автоматические ретраи** при неудачной отправке с логированием количества попыток
- 📝 **Шаблоны email** (загрузка, редактирование, предпросмотр)
- 📊 **Графический дашборд** для мониторинга отправки email
- 📎 **Поддержка вложений в письмах** (attachments)
- 📜 **Просмотр логов через API**
- 🌐 **Поддержка SMTP, SendGrid, Mailgun** (в планах)
- 📊 **Мониторинг через Prometheus / Grafana** (в планах)

## 🏗️ Структура проекта
```
📂 notifications
 ├── dashboard/  # React-приложение для мониторинга
 ├── 📂 src/
 │    ├── 📂 common                     # Модуль с общими компонентами
 │    ├── 📂 email                      # Модуль для управлениями шаблонами
 │    │    ├── 📂 templates             # Шаблоны писем (Handlebars)
 │    │    │    ├── welcome.hbs         # Пример шаблона email
 │    │    ├── email.module.ts          # Модуль email-сервиса
 │    │    ├── email.controller.ts      # Контроллер API
 │    │    ├── email.service.ts         # Сервис отправки писем
 │    │    ├── email.processor.ts       # Обработчик очереди Bull
 │    │    ├── email-log.entity.ts      # Логирование email в PostgreSQL
 │    │    ├── email-log.service.ts     # Сервис логирования
 │    ├── 📂 statistics                 # Модуль для управлениями шаблонами
 │    ├── 📂 templates                  # Модуль для управлениями шаблонами
 ├── app.module.ts                      # Главный модуль
 ├── main.ts                            # Точка входа
```

## ⚙️ Установка и запуск
### 1️⃣ Установка зависимостей
```sh
yarn install
```

### 2️⃣ Настройка `.env` (пример)
```ini
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=notifications

REDIS_HOST=localhost
REDIS_PORT=6379

EMAIL_MAX_RETRIES=3

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
SMTP_FROM="No Reply" <noreply@example.com>
```

### 3️⃣ Запуск сервиса
```sh
# development
yarn run start

# watch mode
yarn run start:dev

# production mode
yarn run start:prod
```

### 4️⃣ Запуск Redis (для очередей Bull)
```sh
docker run -d --name redis -p 6379:6379 redis
```

## 📝 Тестирование

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## 🛠 API Endpoints

### 📩 Отправка email
```http
POST /email/send
```
**Body (JSON):**
```json
{
  "to": "user@example.com",
  "subject": "Добро пожаловать!",
  "text": "Ваш аккаунт создан.",
  "template": "welcome",
  "templateData": { "name": "Алексей", "code": "1234" },
  "attachments": [
    { "filename": "file.pdf", "path": "/uploads/file.pdf" }
  ]
}
```

### 📜 Просмотр логов
```http
GET /email/logs?status=failed&to=user@example.com&page=1&limit=10
```

### 📊 Дашборд (React)

Доступен по адресу http://localhost:5173 после запуска.
