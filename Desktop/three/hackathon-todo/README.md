# Hackathon Todo App

This is a full-stack todo application with a Next.js frontend and FastAPI backend.

## Project Structure

- `backend/` - FastAPI backend with task management and authentication
- `frontend/` - Next.js frontend with task UI

## Running the Application

### Backend (API Server)

The backend should already be running on port 8000:

```bash
# If not running, start from the backend directory:
cd backend
source venv/bin/activate  # if using virtual environment
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend (Next.js App)

To run the frontend:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at http://localhost:3000

### Environment Variables

Make sure to copy `.env.example` to `.env` and adjust the values as needed.

## API Endpoints

The backend provides the following endpoints:

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/{id}` - Get a specific task
- `PUT /api/tasks/{id}` - Update a task
- `DELETE /api/tasks/{id}` - Delete a task
- `PATCH /api/tasks/{id}/complete` - Toggle task completion
- `POST /api/token` - Authenticate and get JWT token
- `GET /api/users/me/` - Get current user info

## Database

The application uses SQLModel with SQLite for local development and PostgreSQL for production.