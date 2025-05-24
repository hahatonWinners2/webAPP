# Инструкция по подключению к бэкенду

## Настройка CORS на бэкенде

Для корректной работы фронтенда с бэкендом необходимо настроить CORS на сервере. Вот пример настройки для разных бэкенд-фреймворков:

### Express.js
```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173', // URL вашего фронтенда
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Django
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]

CORS_ALLOW_METHODS = [
    "GET",
    "POST",
    "PUT",
    "DELETE",
]

CORS_ALLOW_HEADERS = [
    "content-type",
    "authorization",
]
```

### FastAPI
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## API Endpoints

Бэкенд должен предоставлять следующие эндпоинты:

### Получение списка клиентов
```
GET /api/clients
```
Ответ:
```json
[
  {
    "id": 1,
    "address": "ул. Ленина, 10",
    "info": "Жилой дом",
    "coefficient": 0.8,
    "highlighted": false,
    "legalEntity": "ООО \"Жилстрой\"",
    "status": "active",
    "comments": "Регулярные платежи",
    "photo": "https://example.com/photo.jpg"
  }
]
```

### Получение информации о клиенте
```
GET /api/clients/:id
```
Ответ:
```json
{
  "id": 1,
  "address": "ул. Ленина, 10",
  "info": "Жилой дом",
  "coefficient": 0.8,
  "highlighted": false,
  "legalEntity": "ООО \"Жилстрой\"",
  "status": "active",
  "comments": "Регулярные платежи",
  "photo": "https://example.com/photo.jpg"
}
```

### Получение данных о потреблении
```
GET /api/clients/:id/consumption
```
Ответ:
```json
{
  "consumption": [
    [1, 631],
    [2, 616],
    [3, 645],
    [4, 632],
    [5, 618],
    [6, 625]
  ]
}
```

### Обновление информации о клиенте
```
PUT /api/clients/:id
```
Тело запроса:
```json
{
  "address": "ул. Ленина, 10",
  "info": "Жилой дом",
  "coefficient": 0.8,
  "highlighted": false,
  "legalEntity": "ООО \"Жилстрой\"",
  "status": "active",
  "comments": "Регулярные платежи"
}
```

### Добавление нового клиента
```
POST /api/clients
```
Тело запроса:
```json
{
  "address": "ул. Ленина, 10",
  "info": "Жилой дом",
  "coefficient": 0.8,
  "legalEntity": "ООО \"Жилстрой\"",
  "status": "active",
  "comments": "Регулярные платежи"
}
```

### Генерация PDF-документа
```
POST /api/clients/:id/pdf
```
Ответ: PDF-файл

## Настройка фронтенда

1. Создайте файл `.env` в корневой директории проекта:
```
VITE_API_URL=http://localhost:3000
```

2. Убедитесь, что в `main.jsx` настроен базовый URL для axios:
```javascript
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
```

3. Замените моковые данные на реальные API-вызовы в компонентах:
   - В `ClientList.jsx` замените `mockClients` на вызов API
   - В `ClientDetails.jsx` замените `mockClients` и `mockConsumption` на вызовы API

## Обработка ошибок

Бэкенд должен возвращать соответствующие HTTP-статусы и сообщения об ошибках:

- 200: Успешный запрос
- 201: Успешное создание
- 400: Неверный запрос
- 401: Не авторизован
- 403: Доступ запрещен
- 404: Ресурс не найден
- 500: Внутренняя ошибка сервера

```json
{
  "error": "Клиент не найден",
  "message": "Клиент с ID 123 не существует"
}
```