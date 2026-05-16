# 🔬 ClaimLens – Scientific Claim Verification Environment

ClaimLens is an **OpenEnv-compliant environment** designed for verifying scientific claims using AI agents. It provides a full-stack system with a **FastAPI backend** and a **React + Vite frontend** for interactive evaluation, experimentation, and benchmarking of LLM-based reasoning.

---

## 🚀 Features

- 🔍 Scientific claim verification environment  
- 🤖 LLM agent integration for automated reasoning  
- ⚙️ FastAPI backend for environment logic & APIs  
- 🎨 React + Vite frontend with Tailwind CSS  
- 🧪 Built-in scenarios and grading system  
- 🐳 Docker support for easy deployment  
- 📊 Structured evaluation for AI performance  

---

## ⚡ Quick Start (Docker)

### 1. Prerequisites
Install Docker Desktop: https://www.docker.com/products/docker-desktop/

### 2. Run
docker-compose up --build

### 3. Access
Frontend: http://localhost:5173  
Backend: http://localhost:8000  

---

## 🛠️ Manual Setup

### Backend (FastAPI)

cd server  
python -m venv venv  
.\venv\Scripts\Activate.ps1  

pip install -r requirements.txt  

python -m uvicorn server.app:app --host 0.0.0.0 --port 8000  

---

### Frontend (React + Vite)

cd frontend  
npm install  
npm run dev  

Open: http://localhost:5173  

---

## 🧪 Running the AI Agent

Set environment variables:

HF_TOKEN=your_huggingface_token  
API_BASE_URL=http://localhost:8000  

Run:

cd server  
python inference.py easy_1  

---

## 📂 Project Structure

server/ – FastAPI backend (env logic, grader, inference, data)  
frontend/ – React + Vite UI  
docker-compose.yml – Docker setup  

---

## 🧠 How It Works

- System provides scientific claims  
- AI agents attempt to verify them  
- Backend evaluates responses  
- Frontend displays results  

---

## 🛠️ Tech Stack

Backend: FastAPI, Python  
Frontend: React, Vite, Tailwind CSS  
AI: Hugging Face APIs  
DevOps: Docker  

---

## 💡 Use Cases

- LLM reasoning research  
- AI benchmarking  
- Scientific literacy tools  
- Evaluation environments  

---

## 🔮 Future Improvements

- Multi-agent support  
- Better evaluation metrics  
- Real-time collaboration  
- Larger datasets  

---

## 👤 Author

- Yash Kumar
- Contributor - Prakhar Pathak

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
