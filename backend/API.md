# Task Manager API

Base URL: `http://localhost:8080/api/tasks`

---

## Endpoints

### Create Task
`POST /api/tasks`

**Request:**
```json
{
    "title": "Review case files",
    "description": "Review all documents for case #12345",
    "status": "PENDING",
    "dueDate": "2026-03-25T14:00:00"
}
```

**Response:** `201 Created`
```json
{
    "id": 1,
    "title": "Review case files",
    "description": "Review all documents for case #12345",
    "status": "PENDING",
    "dueDate": "2026-03-25T14:00:00"
}
```

Required fields: `title`, `status`, `dueDate`

Valid status values: `PENDING`, `IN_PROGRESS`, `COMPLETED`

---

### Get All Tasks
`GET /api/tasks`

**Optional query parameter:** `?status=PENDING`

**Response:** `200 OK`
```json
[
    {
        "id": 1,
        "title": "Review case files",
        "status": "PENDING",
        "dueDate": "2026-03-25T14:00:00"
    }
]
```

Tasks are returned ordered by due date (earliest first).

---

### Get Task by ID
`GET /api/tasks/{id}`

**Response:** `200 OK` or `404 Not Found`

---

### Update Full Task
`PUT /api/tasks/{id}`

**Request:**
```json
{
    "title": "Updated title",
    "description": "Updated description",
    "status": "IN_PROGRESS",
    "dueDate": "2026-03-26T10:00:00"
}
```

**Response:** `200 OK`

---

### Update Task Status
`PATCH /api/tasks/{id}/status`

**Request:**
```json
{
    "status": "COMPLETED"
}
```

**Response:** `200 OK`

---

### Delete Task
`DELETE /api/tasks/{id}`

**Response:** `204 No Content`

---

## Error Responses

**Validation errors (400):**
```json
{
    "timestamp": "2026-03-17T10:30:00",
    "errors": {
        "title": "Title is required"
    }
}
```

**Not found (404):**
```json
{
    "timestamp": "2026-03-17T10:30:00",
    "message": "Task with ID 999 not found"
}
```

---

## Testing

**Create a task:**
```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Test", "status": "PENDING", "dueDate": "2026-03-25T14:00:00"}'
```

**Get all tasks:**
```bash
curl http://localhost:8080/api/tasks
```
