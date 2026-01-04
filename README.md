# Flavour Finder by the Savour Squad

<img width="211" height="175" alt="image" src="https://github.com/user-attachments/assets/70b7c417-a1fb-48f0-a580-c158c4556a77" />

Roles and contributions:
 - Project Manager: Jerry
 - Designer: Kevin
 - Developers: Faysal, Aaron, Hang

Our mission: 
We aim to inspire people to explore new dining experiences and uncover the stories and cultures behind them, helping great local restaurants get discovered so their excellence can shine on its own.

[Our problem & solution](DesignSpecs.md)

[Requirements](requirements.md)

[Plan](Plan.md)

[Flavour Finder Website](https://c2tp.onrender.com/)

---

## Description
This project is a full-stack web application consisting of a Python backend and a JavaScript frontend. It is designed to demonstrate server-client interaction, database integration, and modern development workflows.

---

## System Requirement 

1. Git
2. Node.js
3. npm (it comes with Node.js package I believe)
4. Python 3.9+ recommended
5. pip (it comes with Python package I believe)

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <your-repository-name>
```

## Instructions / Installement

### 2. Create your own .venv 

- you would need to create a database+collection on MangoDB
- Then, create a .venv file by copy-pasting the following code: 

on Mac: 

```bash
cd backend-hang
python3 -m venv venv
source venv/bin/activate
```

on Windows: 

```bash
venv\Scripts\activate
```

### 3. Create and Activate Python Virtual Environment

```bash
python3 -m venv venv
cd backend-hang 
source venv/bin/activate
```

### 4.  Install Backend Dependencies and Run the Server

```bash 
cd backend-hang
pip install -r requirements.txt
python app.py
```

### 5. Run the frontend with the following: 

```bash
cd frontend 
npm install 
npm run dev
```

### 6. Access the website (a link would be provided when doing localhost)

- usually it's http://localhost:5173/

---

## Project Structure

```bash
project-root/
│
├── backend-hang/
│   ├── app.py
│   ├── requirements.txt
│   └── venv/
│
├── frontend/
│   ├── package.json
│   └── src/
│
└── README.md
```

**Notice:** This project was developed as part of the UBC-V CPEN 221 group project.