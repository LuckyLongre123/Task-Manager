## 📋 Task Manager

<div align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Montserrat&weight=600&size=32&pause=1000&color=61DAFB&center=true&vCenter=true&width=900&height=70&lines=Task+Manager;Node.js+%7C+Express+%7C+EJS+%7C+Tailwind;Simple+and+Fast+Task+Notes" alt="Typing SVG" />
  
  <div>
    <img src="https://img.shields.io/badge/Status-Production_Ready-2ea44f?style=for-the-badge&logo=vercel&logoColor=white" alt="Status" />
    <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge&logo=semantic-release&logoColor=white" alt="Version" />
    <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge&logo=open-source-initiative&logoColor=white" alt="License" />
  </div>
  
  <div style="margin-top: 10px;">
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node" />
    <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/EJS-555555?style=for-the-badge&logo=ejs&logoColor=white" alt="EJS" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Filesystem_Storage-6B7280?style=for-the-badge&logo=files&logoColor=white" alt="FS" />
  </div>
</div>

<!-- Optional Live Demo button (uncomment and set URL if available)
<p align="center">
  <a href="https://your-live-demo.example.com/" target="_blank">
    <img src="https://img.shields.io/badge/🚀_Live_Demo-Open_App-brightgreen?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Live Demo" />
  </a>
  <br />
  <small>Hosted on your platform • Auto-scaled • Public demo</small>
  </p>
-->

---

### 🚀 Overview

**Task Manager** is a minimal, production-ready web app to create, view, edit, and delete text-based tasks stored as `.txt` files on disk. Built with Node.js, Express, EJS views, and TailwindCSS CDN. It’s fast, simple, and requires no database.

- 🔼 Create a task with title and details
- 👀 View a task in a clean reader
- ✏️ Edit task content and optionally rename the file
- 🗑️ Delete a task safely
- 🗂️ Browse all tasks on the home page

---

### 🛠️ Tech Stack

<div align="center">

| Frontend | Backend | Storage | Tools |
|----------|---------|---------|-------|
| ![EJS](https://img.shields.io/badge/EJS-555555?style=flat-square&logo=ejs&logoColor=white) | ![Node](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white) | ![FS](https://img.shields.io/badge/Filesystem-6B7280?style=flat-square) | ![Tailwind](https://img.shields.io/badge/Tailwind-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white) |
| ![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) | ![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white) |  | ![Nodemon](https://img.shields.io/badge/Nodemon-76D04B?style=flat-square&logo=nodemon&logoColor=white) |

</div>

---

### 📂 Project Structure

```
📦 Task_Manager_shadowx/
├── index.js               # Express app, routes, server bootstrap
├── files/                 # Auto-created folder for storing .txt tasks (runtime)
├── public/
│   └── javascripts/
│       └── script.js      # Client JS (optional; currently empty)
├── views/
│   ├── index.ejs          # Home: create form + list of tasks
│   ├── tasks.ejs          # View a single task (read-only)
│   └── edit.ejs           # Edit task title/content and rename file
├── package.json
└── README.md
```

---

### 🔗 Pages & Flow

- **Home (`GET /`)**: Lists all tasks and displays a form to create a new task.
- **Create (`POST /create`)**: Creates a `.txt` file named after the title (spaces → underscores) with the details as content. Redirects back to Home.
- **View (`GET /task/:file`)**: Opens a specific task in a read-only view.
- **Edit (`GET /edit/:file`)**: Opens edit UI to change content and optionally rename the file.
- **Save Edit (`POST /edit/filename`)**: Writes updates; if `newName` is provided, attempts to rename.
- **Delete (`GET /delete/:file`)**: Deletes the chosen task and returns to Home.

```mermaid
flowchart TD
  %% Primary navigation and actions
  Home["Home /\n(index.ejs)"] -->|Submit form| Create[(POST /create)]
  Create -->|302 Redirect| Home

  Home -->|Open task| View["GET /task/:file\n(tasks.ejs)"]
  View -->|Edit| Edit["GET /edit/:file\n(edit.ejs)"]
  Edit -->|Save content/rename| Save[(POST /edit/filename)]
  Save -->|302 Redirect| View
  Edit -->|Delete| Delete["GET /delete/:file"]
  Delete -->|302 Redirect| Home

  %% File system relationship
  subgraph Storage[Filesystem]
    Files["files/ directory\n*.txt task files"]
  end

  Create -->|writeFile| Files
  View -->|readFile| Files
  Save -->|writeFile/rename| Files
  Delete -->|unlink| Files
```

#### Navigation Map (Pages and Links)

```mermaid
flowchart LR
  H["/ (Home)"] -->|View| T["/task/:file"]
  H -->|Create| C[(POST /create)]
  T -->|Edit| E["/edit/:file"]
  E -->|Save| S[(POST /edit/filename)]
  E -->|Delete| D["/delete/:file"]
  C -->|302| H
  D -->|302| H
  S -->|302| T
```

---

### 🧠 How It Works

1. On startup, the app ensures a `files/` directory exists.
2. The Home page reads all filenames in `files/` and renders them.
3. Creating a task writes a new `.txt` file containing the provided details.
4. Viewing a task reads the file and renders its content.
5. Editing writes updated content and optionally renames the file.
6. Deleting removes the file from disk.

```mermaid
sequenceDiagram
  autonumber
  actor U as User
  participant V as View (Browser)
  participant S as Express Server (index.js)
  participant FS as Filesystem (files/)

  U->>V: Open / (Home)
  V->>S: GET /
  S->>FS: readdir(files/)
  FS-->>S: [task_a.txt, task_b.txt]
  S-->>V: 200 index.ejs (files)

  U->>V: Submit form (title, details)
  V->>S: POST /create { title, details }
  S->>FS: writeFile(title.txt, details)
  FS-->>S: OK
  S-->>V: 302 Redirect /

  U->>V: Click a task
  V->>S: GET /task/:file
  S->>FS: readFile(file)
  FS-->>S: content
  S-->>V: 200 tasks.ejs (content)

  U->>V: Edit task
  V->>S: GET /edit/:file
  S-->>V: 200 edit.ejs (form)
  V->>S: POST /edit/filename { filename, newName?, updatedData }
  S->>FS: writeFile + optional rename
  FS-->>S: OK
  S-->>V: 302 Redirect /task/:file
```

#### Module Relationship Diagram

```mermaid
classDiagram
  class ExpressApp {
    +GET / (list files)
    +POST /create (write file)
    +GET /task/:file (read file)
    +GET /edit/:file (read + render)
    +POST /edit/filename (write/rename)
    +GET /delete/:file (unlink)
  }
  class FileSystemService {
    +readdir()
    +readFile()
    +writeFile()
    +rename()
    +unlink()
  }
  class Views {
    index.ejs
    tasks.ejs
    edit.ejs
  }

  ExpressApp --> FileSystemService : fs module
  ExpressApp --> Views : EJS render
```

#### Task Entity (ER Perspective)

```mermaid
erDiagram
  TASK_FILE {
    string file_name PK
    text content
    date modified_at
  }
```

#### Task Lifecycle

```mermaid
stateDiagram-v2
  direction LR
  [*] --> Created
  note right of Created : File written to files/title.txt
  Created --> Viewed : GET task {file}
  Viewed --> Edited : GET edit {file}
  Edited --> Viewed : POST edit/filename
  Viewed --> Deleted : GET delete {file}
  Deleted --> [*]
```

---

### 🧩 API & Routes

| **Method** | **Path**             | **Purpose**                           | **Request Body**                                 | **Response**                      |
|------------|----------------------|---------------------------------------|--------------------------------------------------|-----------------------------------|
| GET        | `/`                  | Render home with create form + list   | -                                                | HTML                               |
| POST       | `/create`            | Create task as `.txt`                 | `{ title: string, details: string }`             | 302 Redirect to `/`                |
| GET        | `/task/:file`        | View a task                           | -                                                | HTML (`tasks.ejs`)                 |
| GET        | `/edit/:file`        | Render edit UI                        | -                                                | HTML (`edit.ejs`)                  |
| POST       | `/edit/filename`     | Save content and optional rename      | `{ filename, newName?, updatedData }`            | 302 Redirect to `/task/:file`      |
| GET        | `/delete/:file`      | Delete task file                      | -                                                | 302 Redirect to `/`                |

- **Validation & Errors**
  - Title is normalized to a safe filename: spaces → `_`, `.txt` appended.
  - On read/write failures, the server logs the error and redirects to Home.

---

### 🗄️ Storage Model

```txt
files/
  my_task.txt       # File content = task details (plain text)
  another_task.txt
```

- Each task is a plain text file in `files/`.
- File name convention: `<title>.txt` with spaces replaced by underscores.
- No database is required; storage is local filesystem.

---

### ⚙️ Installation & Setup

#### Prerequisites
```bash
Node.js 18+
```

#### Quick Start
```bash
# 1) Clone
git clone <repo-url>
cd Task_Manager_shadowx

# 2) Install deps
npm install

# 3) Run
node index.js
# or (recommended during development)
# npx nodemon index.js
# App on http://localhost:3000
```

---

### 🖥️ Usage Guide

1) Open the Home page `/`.
2) Enter a title and details, click Add Task.
3) Click a task in the list to view it.
4) Click Edit to update content or rename the file.
5) Use Delete from the edit screen to remove the task.

---

### 🛡️ Notes & Considerations

- This app stores tasks as local files; ensure the host has write permissions.
- Filenames are derived from titles; avoid characters not valid for filenames.
- For multi-user or cloud deployment, consider moving to a database or object storage.

---

### 🧭 Roadmap / Enhancements

- Add search and filtering on the home page
- Add confirmation dialog before delete
- Add pagination for large numbers of files
- Add download/export task as `.txt`
- Optional: Switch to a database (e.g., MongoDB) for metadata and auditing

---

### 👨‍💻 Developer

<div align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Montserrat&weight=500&size=24&pause=1000&color=61DAFB&center=true&vCenter=true&width=500&height=50&lines=Lucky+Longre;Full-Stack+Developer;Problem+Solver" alt="Developer" />
  
  <p><em>Computer Science Student & Aspiring Software Developer</em></p>
  
  <div style="margin: 20px 0;">
    <a href="https://lucky-longre.onrender.com/" target="_blank">
      <img src="https://img.shields.io/badge/🌐_Portfolio-Visit_Website-0A66C2?style=for-the-badge&logo=vercel&logoColor=white" alt="Portfolio" />
    </a>
    <a href="mailto:officialluckylongre@gmail.com">
      <img src="https://img.shields.io/badge/📧_Email-Contact_Me-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" />
    </a>
    <a href="https://www.linkedin.com/in/lucky-longre/" target="_blank">
      <img src="https://img.shields.io/badge/💼_LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
    </a>
  </div>
  
  <p>
    <img src="https://img.shields.io/badge/Course-Computer_Science-brightgreen?style=flat-square" alt="Course" />
    <img src="https://img.shields.io/badge/Specialization-Full_Stack_Development-blue?style=flat-square" alt="Specialization" />
    <img src="https://img.shields.io/badge/Location-New_Delhi,_India-orange?style=flat-square" alt="Location" />
  </p>
</div>

#### 💼 Technical Expertise

<div align="center">

| **Frontend Technologies** | **Backend Technologies** | **Storage & Tools** |
|---------------------------|--------------------------|---------------------|
| HTML5, CSS3, JavaScript, Tailwind | Node.js, Express.js, REST | Filesystem (FS) |
| EJS, Responsive Design | Basic Auth/Validation | Git, GitHub |
| Basic jQuery/AJAX | File I/O (fs) | Postman, VS Code |

</div>

#### 🚀 Development Philosophy

- **Problem-Solving First**: Understand the user problem before writing code.
- **User-Centric Design**: Keep flows simple, fast, and accessible.
- **Security-Minded**: Validate inputs and protect data by default.
- **Performance Focused**: Favor efficient, maintainable implementations.
- **Continuous Learning**: Iterate with feedback and new best practices.

#### 📈 Goals

- **Short-term**: Build and ship practical, production-ready web apps.
- **Medium-term**: Deepen expertise in scalable backends and storage.
- **Long-term**: Lead full-stack projects and mentor budding developers.

---

<p align="center">
  <img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" />
  <br />
  <strong>Task Manager</strong> — Simple, fast, and focused on productivity.
  <br />
  <sub>Made with Node.js, Express, and EJS.</sub>
</p>


