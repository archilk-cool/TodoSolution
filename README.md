
# ToDo Task Management (.NET 9 + SQLite, React/Vite) - Full Working Solution

## Overview
- Backend: ASP.NET Core 9.0 Web API (SQLite via EF Core)
- Frontend: React + Vite
- Designed to open as one Visual Studio 2022 solution (TodoSolution.sln).

## How to run

### Backend (Visual Studio)
1. Open `TodoSolution.sln` in Visual Studio 2022.
2. Right-click `Backend.TodoApi` -> Set as Startup Project.
3. Build (Ctrl+Shift+B) and Run (F5). The API will open with Swagger at `https://localhost:7295/swagger` and HTTP at `http://localhost:5295`.

> The SQLite file `todo.db` will be created in the backend project folder on first run.

### Frontend (terminal)
1. Open a terminal at `src/Frontend.todo-app`.
2. Run:
   ```
   npm install
   npm run dev
   ```
3. Vite dev server will start on `http://localhost:5173`. The frontend calls the API at `http://localhost:5295/api/todo`.

## Notes
- CORS is configured to allow `http://localhost:5173`.
- This is Option A: frontend runs separately (recommended).
- For production, replace SQLite with a server DB and add migrations.

