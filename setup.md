# Project Setup & Deployment Guide

This guide provides step-by-step instructions for running the Scientific Claim Verification Environment locally, as well as deployment configurations for Vercel, GitHub Pages, and Firebase.

## 1. Localhost Setup Process

You can run the application locally using Docker (recommended) or native Python/Node.js setup.

### Option A: Using Docker Compose (Recommended)
1. Ensure Docker Desktop is installed and running.
2. Clone the repository and navigate to the root directory `SCV-ENV`.
3. Build and launch the full stack:
   ```bash
   docker-compose up --build
   ```
4. Access the frontend interface at `http://localhost:5173`.
5. Access the backend API at `http://localhost:8000`.

### Option B: Native Setup
**Backend:**
1. Navigate to the server folder: `cd server`
2. Create python virtual environment: `python -m venv venv`
3. Activate the venv:
   - Windows: `.\venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Run uvicorn: `uvicorn server.app:app --host 0.0.0.0 --port 8000`

**Frontend:**
1. Open a new terminal and navigate to the frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Ensure the `VITE_API_URL` environment variable is mapped to your backend in `.env` or run directly.
4. Run dev server: `npm run dev`

---

## 2. Hosting Process on Vercel (Frontend)

Vercel is the easiest method to deploy Vite-based React frontends.

1. **Push to GitHub**: Make sure your repository is pushed to a remote GitHub account.
2. **Log into Vercel**: Go to [vercel.com](https://vercel.com/) and sign in with GitHub.
3. **Import Project**: Click "Add New Project" and import your `SCV-ENV` repository.
4. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend` (Since your React project lies inside the `frontend` directory).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Environment Variables**: Add `VITE_API_URL` pointing to your hosted backend URI if it's not hosted locally.
6. **Deploy**: Click **Deploy**. Vercel will automatically configure CI/CD for future pushes.

---

## 3. Hosting Process on GitHub Pages (Frontend)

GitHub Pages allows you to host static sites directly from a GitHub repository.

1. **Install `gh-pages`**: In your `frontend` terminal, install the package:
   ```bash
   cd frontend
   npm install gh-pages --save-dev
   ```
2. **Update `package.json`**:
   Add a `homepage` attribute at the top level of `frontend/package.json`:
   ```json
   "homepage": "https://<your-username>.github.io/<your-repo-name>",
   ```
   Add the following scripts to the `"scripts"` section:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```
3. **Update `vite.config.js`**:
   Add the base path matching your repo name:
   ```javascript
   export default defineConfig({
     base: '/<your-repo-name>/',
     plugins: [react()],
   })
   ```
4. **Deploy**: Run `npm run deploy` from the `frontend` folder. The `gh-pages` branch will be created and pushed. Include GitHub Actions manually if you wish to automate it.

---

## 4. Hosting Process on Firebase (Frontend)

Firebase Hosting provides fast, secure hosting for web applications.

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```
2. **Login to Firebase**:
   ```bash
   firebase login
   ```
3. **Initialize Firebase Project**:
   Run the following inside your `frontend` directory:
   ```bash
   firebase init hosting
   ```
   - Select your Firebase Project (or create a new one).
   - What do you want to use as your public directory? **`dist`**
   - Configure as a single-page app (rewrite all urls to /index.html)? **Yes**
   - Set up automatic builds and deploys with GitHub? **Yes** (if you want CI/CD, else No).
4. **Build and Deploy**:
   ```bash
   npm run build
   firebase deploy
   ```

*Note: The Backend (`server/`) and Environment (`openenv.yaml`) are decoupled and can be deployed separately to Hugging Face Spaces (via Docker) or Render/Railway while the frontend is hosted using any of the above mechanisms.*
