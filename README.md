# ADIS - Advanced Desktop Intelligence System

<!-- ADIS is a sophisticated, voice-enabled assistant built with a modern tech stack, featuring a high-performance **FastAPI** backend and a stunning **Electron + React** desktop application.

---

## 🚀 Project Overview

ADIS combines the power of Python's automation and AI capabilities with a rich, interactive 3D frontend powered by Three.js and Vite.

### Key Features
- **Voice Intelligence**: Sophisticated voice command processing.
- **Cross-Platform**: Built with Electron for a seamless desktop experience.
- **Modern UI**: Tailored aesthetics using Tailwind CSS and React Three Fiber.
- **Fast API Backend**: High-performance asynchronous processing with Python.
- **Authentication**: Integrated Google and Microsoft OAuth systems.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18.x or later)
- **Python** (v3.10.x or later)
- **MongoDB** (Local or Cloud instance)
- **Git** -->

---

## 📂 Project Structure

```text
ADIS/
├── client/           # Electron + Vite + React Frontend
├── server/           # FastAPI Backend
└── README.md         # Project documentation
```

---

## 📦 Setting Up the Server (Backend)

The server handles logic, database interactions, and automation.

### 1. Create a Virtual Environment
Navigate to the server directory and create a virtual environment to keep dependencies isolated.

creating virtual environment named `.adis`
```powershell
cd server
python -m venv .adis
```

### 2. Activate Virtual Environment
- **Windows**:
  ```powershell
  .\.adis\Scripts\activate
  ```
- **Linux/macOS**:
  ```bash
  source .adis/bin/activate
  ```

### 3. Install Dependencies
Note: install dependencies after creating the virtual environment only, otherwise it will be installed to global environment.

Using the provided `req.txt`:

```powershell
pip install -r req.txt
```
<!-- #### make a requirement.txt file
```powershell
pip freeze > req.txt
``` -->

### 4. Setup the project structure (for easily import file and function)
Use the `pyproject.toml` file and install the package using following command
```powershell
pip install -e .
```

### 5. Environment Variables
Create a `.env` file in the `server/` directory and populate it with your credentials:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CLIENT_URL=http://localhost:5173
```
(see the `.env.example` file)

### 6. Run the Server
```powershell
uvicorn main:app --reload

OR

fastapi dev main.py
```

---

## 💻 Setting Up the Client (Frontend)

The client is the user interface and desktop shell for ADIS.

### 1. Install Dependencies
Navigate to the client directory and install the necessary NPM packages.

```powershell
cd client
npm install
```

### 2. Setup ENV variables

```env
VITE_USER_NAME = 'User' #will be modified later
VITE_ASSISTANT_NAME = 'ADIS' 
VITE_ASSISTANT_VERSION = '1.0.0' #will be modified later
VITE_MS_CLIENT_ID=your_microsoft_client_id
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_SERVER_URL=http://localhost:8000
```
(see the `.env.example` file)

### 3. Run in Development Mode
This will launch the Vite development server and the Electron application.

```powershell
npm run dev
```

### 4. Build for Production
To package the application for distribution:

```powershell
npm run build
```

---

## 🔑 Security & Configuration
- **API Keys**: Ensure all keys are stored in environment variables and never committed to version control.
- **OAuth**: Configure your Google and Microsoft developer consoles to allow `http://localhost:5173` as a redirect URI.

---

<!-- ## 📜 License
This project is private and intended for personal use or as specified by the repository owner.

---
*Created with ❤️ by the ADIS Team.* -->
