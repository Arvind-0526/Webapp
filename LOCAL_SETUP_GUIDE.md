# Local Setup Complete ✅

All dependencies have been installed and configured! Here's how to run the application locally.

## 📋 Prerequisites Check

### 1. **MongoDB** (Required)
The application needs MongoDB running on `mongodb://localhost:27017`

**Option A: Install MongoDB Locally**
1. Download from: https://www.mongodb.com/try/download/community
2. Install MongoDB Community Edition
3. Start MongoDB service:
   - **Windows**: MongoDB should start automatically as a service, or run:
     ```powershell
     mongod
     ```

**Option B: Use MongoDB Atlas (Cloud)**
1. Create a free account at: https://www.mongodb.com/cloud/atlas
2. Create a cluster and get your connection string
3. Update `.env` file in `backend/` folder:
   ```
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net
   ```

**Option C: Use Docker**
```powershell
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

---

## 🚀 Running the Application

### **Option 1: Use VS Code Tasks (Recommended)**

1. Press `Ctrl + Shift + B` to open VS Code Task Runner
2. Select **"Run Both Servers"** to start both backend and frontend
3. Or run them individually:
   - **Backend Server**: Select `Backend Server (Node.js)`
   - **Frontend Server**: Select `Frontend Server (React)`

The servers will start on:
- **Backend**: http://localhost:8002
- **Frontend**: http://localhost:3000

### **Option 2: Manual Terminal Commands**

**Terminal 1 - Backend:**
```powershell
cd backend
npm start
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm start
```

### **Option 3: Development Mode (with hot reload)**

**Backend with Nodemon:**
```powershell
cd backend
npm run dev
```

**Frontend (already has hot reload):**
```powershell
cd frontend
npm start
```

---

## 🔐 Default Admin Account

```
Email: admin@nexerawe.com
Password: admin123456
```

⚠️ **CHANGE THE PASSWORD IMMEDIATELY AFTER FIRST LOGIN!**

---

## 📱 Access the Application

Once both servers are running:

1. **Frontend (Student/Admin Portal)**: http://localhost:3000
2. **Backend API Health Check**: http://localhost:8002/api/health
3. **Admin Login**: http://localhost:3000 → Click "Admin Login"

---

## 🌱 Seed Admin Account (Optional)

If the admin account doesn't exist or you need to reset it:

```powershell
cd backend
npm run seed-admin
```

Or use the VS Code Task: `Seed Admin Account`

---

## 📁 Project Structure

```
nexerawe-journals-code/
├── backend/              # Node.js + Express API
│   ├── routes/          # API endpoints
│   ├── models/          # MongoDB schemas
│   ├── middleware/      # Auth, validation
│   └── server_node.js   # Main server file
├── frontend/            # React application
│   ├── src/
│   │   ├── pages/      # Page components
│   │   ├── components/ # UI components
│   │   └── context/    # React context
│   └── package.json
└── .vscode/
    └── tasks.json      # VS Code tasks
```

---

## 🛠️ Environment Variables

### Backend (.env file)
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=nexerawe_journals
PORT=8002
JWT_SECRET=nexerawe-journals-secret-key-2026
CORS_ORIGINS=http://localhost:3000
```

---

## ✨ Features to Test

1. **Student Registration**: Register a new student account
2. **Journal Upload**: Upload a PDF (max 15MB)
3. **Admin Review**: Log in as admin to approve/reject journals
4. **Email Notifications**: Check email when journals are approved
5. **Public View**: Browse published journals on homepage

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
❌ MongoDB Connection Error: connect ECONNREFUSED
```
**Solution**: Make sure MongoDB is running. Start it with:
```powershell
mongod
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::8002
```
**Solution**: Change the port in backend `.env`:
```
PORT=8003
```
And update frontend API URL accordingly.

### Dependency Issues
If you get dependency errors, try:
```powershell
cd frontend
npm install --legacy-peer-deps
```

---

## 📚 API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/journals/upload` - Upload journal
- `GET /api/journals` - Get all published journals
- `GET /api/admin/journals` - Get journals for review
- `POST /api/admin/journals/:id/approve` - Approve journal

---

## ✅ Checklist Before Starting

- [ ] MongoDB installed and running
- [ ] Node.js 16+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Both `npm install` commands completed successfully
- [ ] `.env` file exists in `backend/` folder

---

**You're all set! Happy coding! 🎉**
