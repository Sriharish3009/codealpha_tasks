# Project Management Tool

A full-stack collaborative project management web application that helps teams organize projects, assign tasks, communicate through comments, and monitor progress.

## Features

- **Authentication:** JWT-based user authentication.
- **Project management:** Create, view, edit, and delete projects.
- **Team collaboration:** Add members to projects and manage project roles.
- **Task management:** Create, assign, edit, delete, and track tasks.
- **Kanban board:** Organize tasks by status and move them between columns.
- **Comments:** Communicate within individual tasks.
- **Notifications:** View notifications and mark them as read.
- **Real-time updates:** WebSocket support for notifications.
- **Dark mode:** Switch between light and dark themes.
- **Responsive interface:** Use the application across different screen sizes.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, JavaScript, CSS |
| API communication | Axios |
| Backend | Python, Django, Django REST Framework |
| Database | MySQL |
| Authentication | JSON Web Tokens (JWT) |
| Real-time communication | Django Channels, WebSockets |

## Project Structure

```text
project management tool/
├── backend/
│   ├── config/
│   ├── users/
│   ├── projects/
│   ├── tasks/
│   ├── comments/
│   └── manage.py
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── screenshots/
└── README.md
```

The exact files and folders may vary depending on the final implementation.

## Prerequisites

Install the following before running the application:

- Python
- Node.js and npm
- MySQL Server
- Git (optional)

## Running the Backend

Open a terminal in the project root and activate the virtual environment:

```powershell
.\venv\Scripts\Activate.ps1
cd backend
```

Run the Django system check:

```powershell
python manage.py check
```

Start the ASGI server using Daphne:

```powershell
daphne -b 127.0.0.1 -p 8000 config.asgi:application
```

Ensure MySQL is running and your database configuration is correct before starting the application.

## Running the Frontend

Open another terminal:

```powershell
cd "D:\Full stack\project management tool\frontend"
npm install
npm run dev
```

Open the local URL displayed by Vite in the terminal.

## Typical Workflow

1. Log in to the application.
2. Create a project.
3. Add team members.
4. Create tasks and assign them to members.
5. Track tasks on the Kanban board.
6. Add comments to tasks.
7. Check notifications and use dark mode.

## Screenshots

Application screenshots are available in the `screenshots/` directory.

Add Markdown image links here if you want the screenshots to appear directly in this README.

## Future Improvements

- Online deployment
- Automated backend and frontend tests
- Enhanced reporting and project analytics
- Additional collaboration features

## Author

Developed as a full-stack development project to practise frontend development, backend APIs, database integration, authentication, and collaborative application design.