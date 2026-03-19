# HMCTS Task Manager

Task management system for HMCTS caseworkers.

## Stack

Backend: Java 17, Spring Boot 3.5.0, Spring Data JPA, H2
Frontend: React 18, Axios
Testing: JUnit 5, Mockito

## Features

- Create, view, update, and delete tasks
- Filter tasks by status
- Sort by due date, title, or status
- Edit task details
- Input validation and error handling
- GOV.UK Design System styling

## Additional Features

Beyond the core CRUD requirements, filtering, sorting, and full edit functionality were added to support realistic caseworker workflows.

## Requirements

- Java 17+
- Node.js 16+
- npm

## Running the Application

### Backend
```bash
cd backend
./mvnw spring-boot:run
```

Runs on `http://localhost:8080`

### Frontend
```bash
cd frontend
npm install
npm start
```

Runs on `http://localhost:3000`

## Testing

### Backend Tests

```bash
cd backend
./mvnw test
```

The backend tests cover task CRUD operations, validation, and error handling.

### Manual Testing

1. Start backend and frontend.
2. Create a task with title `Test Task` and a due date in the future.
3. Verify it appears in the task list.
4. Update status to `IN_PROGRESS`.
5. Edit task details and save.
6. Delete the task and confirm it disappears.

## API Documentation

See [API.md](backend/API.md).

## Database

H2 database with file persistence.

- Data persists across restarts
- Stored in `./data/taskdb`
- No external database installation required

H2 Console: `http://localhost:8080/h2-console`

- JDBC URL: `jdbc:h2:file:./data/taskdb`
- Username: `sa`
- Password: (blank)

## Project Structure

```text
hmcts-task-manager/
├── backend/
│   ├── src/main/java/uk/gov/hmcts/taskmanager/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── model/
│   │   ├── dto/
│   │   └── exception/
│   └── src/test/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.js
└── README.md
```

## Design Choices

- H2 with file persistence: simple setup with persistent local data
- Client-side sorting: backend orders by due date; additional sorts are handled in React
- Component separation: `TaskForm` and `TaskTable` are reusable and easier to maintain

## Future Improvements

- Pagination for large datasets
- Server-side filtering and sorting
- Task priority levels
- Overdue task highlighting
- User authentication and task assignment
- PostgreSQL for production
- Audit logging
- Email notifications

