# 🌟 TodoSolution --- Modern Full‑Stack Todo Application

A beautifully structured, full‑stack **Todo List application**
featuring:

-   🖥 **ASP.NET Core 9 Web API** (C#, EF Core, SQLite)
-   ⚛️ **React + Vite** frontend
-   🗄 **SQLite** local database
-   🔄 Seamless CORS‑enabled interaction
-   🚀 Modern development workflow

This project is ideal for learning clean architecture, API design, React
front‑end development, and cross‑stack integration.

------------------------------------------------------------------------

## 📂 Project Structure

    TodoSolution/
    │
    ├── src/
    │   ├── Backend.TodoApi/       # ASP.NET Core API
    │   └── Frontend.todo-app/     # React + Vite frontend
    │
    ├── TodoSolution.sln            # Visual Studio solution
    └── README.md

------------------------------------------------------------------------

## ⚡ Getting Started

### 🔧 Requirements

-   .NET 9 SDK\
-   Node.js 18+\
-   npm or yarn

------------------------------------------------------------------------

# 🛠 Backend --- ASP.NET Core 9 API

### 📌 Location

    src/Backend.TodoApi

### ▶️ Run the API

``` bash
cd src/Backend.TodoApi
dotnet restore
dotnet build
dotnet run
```

By default, the API starts on: - **HTTP:** `http://localhost:5295` -
**HTTPS:** `https://localhost:7295`

### 📘 Swagger UI

Open in browser:

    https://localhost:7295/swagger

You get interactive API docs with full testing support.

------------------------------------------------------------------------

# 🖥 Frontend --- React + Vite

### 📌 Location

    src/Frontend.todo-app

### ▶️ Run the Frontend

``` bash
cd src/Frontend.todo-app
npm install
npm run dev
```

Default development URL:

    http://localhost:5173

------------------------------------------------------------------------

# 🔗 Connecting Frontend & Backend

The frontend communicates with the API via:

    https://localhost:7295/api/todo

CORS is already configured on the backend for local development.

------------------------------------------------------------------------

# 🗃 Database --- SQLite

Your database file is:

    src/Backend.TodoApi/todo.db

If you want a fresh DB: 1. Delete `todo.db` 2. Run backend again --- EF
Core recreates it automatically.

------------------------------------------------------------------------

# 📡 API Endpoints

  Method   Endpoint           Description
  -------- ------------------ -----------------
  GET      `/api/todo`        Get all todos
  GET      `/api/todo/{id}`   Get todo by ID
  POST     `/api/todo`        Create new todo
  PUT      `/api/todo/{id}`   Update todo
  DELETE   `/api/todo/{id}`   Delete todo

------------------------------------------------------------------------

# 🎨 Screenshots (Placeholders)

Add your own screenshots here!

    ![Frontend UI](docs/images/frontend.png)
    ![Swagger UI](docs/images/swagger.png)

------------------------------------------------------------------------

# 🚀 Production Build

### Backend:

``` bash
dotnet publish -c Release
```

### Frontend:

``` bash
npm run build
```

Output goes into the `dist/` directory.

------------------------------------------------------------------------

# 🧱 Architecture Overview

    React (Vite)
        ↓ fetch()
    ASP.NET Core API
        ↓ EF Core
    SQLite Database

Clean, minimal, and easy to extend.

------------------------------------------------------------------------

# 📦 Tech Stack Badges

![.NET](https://img.shields.io/badge/.NET-9.0-blueviolet)
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-Fast-orange)
![SQLite](https://img.shields.io/badge/SQLite-Embedded-lightgrey)
![License: MIT](https://img.shields.io/badge/License-MIT-green)

------------------------------------------------------------------------

# 🤝 Contributing

Pull requests are welcome!\
Feel free to open an issue for discussions or suggestions.

------------------------------------------------------------------------

# 📄 License

Distributed under the **MIT License**.\
Use, modify, and share freely.

------------------------------------------------------------------------

# 🌐 Contact

Have ideas or questions?\
Open an Issue --- happy to help!
