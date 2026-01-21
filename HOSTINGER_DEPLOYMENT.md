# 🌐 Deploy to Hostinger - Complete Guide

## ✅ What You Need

1. **Hostinger Hosting Plan** (Business or higher for Node.js)
2. **Domain Access** (nexerawe.com)
3. **FTP/File Manager Access**
4. **Node.js Support** (check your plan)

---

## 🚨 IMPORTANT: Hostinger Plan Check

### Check if Your Plan Supports Node.js:

Most Hostinger plans need **Business or Cloud hosting** for Node.js apps.

**Shared Hosting Plans (Basic/Premium):**
- ❌ Cannot run Node.js backend
- ✅ Can host React frontend ONLY (after build)
- 💡 Solution: Host backend on Render (free) + frontend on Hostinger

**Business/Cloud Plans:**
- ✅ Can run Node.js backend
- ✅ Can host React frontend
- ✅ Can setup subdomain

---

## 📋 Deployment Options Based on Your Hostinger Plan

### **OPTION A: You Have Business/Cloud Plan**
→ Deploy EVERYTHING on Hostinger
→ Use this guide below

### **OPTION B: You Have Basic/Premium Plan**
→ Deploy **Frontend** on Hostinger (as static files)
→ Deploy **Backend** on Render.com (FREE)
→ Connect MongoDB Atlas (FREE)
→ Total cost: $0 extra! (Just use your existing Hostinger)

---

## 🚀 Full Hostinger Deployment (Business/Cloud Plan)

### **STEP 1: Prepare Your Code (On Your Computer)**

1. Download your code from Emergent
2. Install dependencies locally:

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
npm run build  # This creates production build
```

---

### **STEP 2: Setup MongoDB Database**

Hostinger doesn't include MongoDB, so use **MongoDB Atlas (FREE)**:

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create free cluster (512MB)
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/`
5. Save this for later

---

### **STEP 3: Upload Backend to Hostinger**

#### Via FTP (FileZilla):

1. **Connect to Hostinger via FTP:**
   - Host: ftp.yourdomain.com
   - Username: (from Hostinger)
   - Password: (from Hostinger)
   - Port: 21

2. **Upload Backend Files:**
   ```
   Upload to: /domains/nexerawe.com/public_html/api/
   
   Files to upload:
   - server_node.js
   - package.json
   - .env (update this!)
   - models/ folder
   - routes/ folder
   - middleware/ folder
   - utils/ folder
   ```

3. **Update .env file on server:**
   ```env
   MONGO_URL=mongodb+srv://your-atlas-url
   DB_NAME=nexerawe_journals
   CORS_ORIGINS=https://journals.nexerawe.com
   SMTP_HOST=smtp.hostinger.com
   SMTP_PORT=465
   SMTP_USER=team@nexerawe.com
   SMTP_PASS=8UkEiR;7=
   JWT_SECRET=nexerawe-journals-secret-key-2026
   FRONTEND_URL=https://journals.nexerawe.com
   PORT=3000
   ```

---

### **STEP 4: Setup Node.js App in Hostinger Control Panel**

1. **Login to Hostinger Control Panel**
2. **Go to "Advanced" → "Node.js"**
3. **Click "Create Node.js Application"**
4. **Configure:**
   ```
   Node.js Version: 18.x or higher
   Application Mode: Production
   Application Root: /domains/nexerawe.com/public_html/api
   Application URL: https://journals.nexerawe.com/api
   Application Startup File: server_node.js
   ```
5. **Click "Create"**

---

### **STEP 5: Upload Frontend to Hostinger**

1. **On your computer, build frontend:**
   ```bash
   cd frontend
   npm run build
   ```
   This creates a `build/` folder

2. **Upload via FTP:**
   ```
   Upload contents of build/ folder to:
   /domains/nexerawe.com/public_html/journals/
   
   (This should include: index.html, static/, etc.)
   ```

---

### **STEP 6: Setup Subdomain**

1. **In Hostinger Control Panel:**
   - Go to **"Domains" → "Subdomains"**
   - Click **"Create Subdomain"**
   - Subdomain: `journals`
   - Domain: `nexerawe.com`
   - Document Root: `/domains/nexerawe.com/public_html/journals`
   - Click **"Create"**

2. **SSL Certificate:**
   - Hostinger auto-installs SSL
   - Wait 5-10 minutes for HTTPS to work

---

### **STEP 7: Configure .htaccess (Important for React Router)**

Create `.htaccess` file in `/journals/` folder:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

---

### **STEP 8: Update Frontend API URL**

Your React app needs to know backend URL.

**Before building frontend, update .env:**
```env
REACT_APP_BACKEND_URL=https://journals.nexerawe.com/api
```

Then rebuild and re-upload:
```bash
npm run build
# Upload build/ folder again
```

---

### **STEP 9: Test Your Deployment**

1. **Test Backend API:**
   ```
   https://journals.nexerawe.com/api/health
   ```
   Should return: `{"status":"healthy","timestamp":"..."}`

2. **Test Frontend:**
   ```
   https://journals.nexerawe.com
   ```
   Should show your homepage

3. **Test Full Flow:**
   - Register a student
   - Upload journal
   - Login as admin
   - Approve journal
   - Check email notification

---

## 🔄 Alternative: Hybrid Approach (RECOMMENDED if Basic Plan)

If you have Hostinger Basic/Premium plan:

### **Setup:**
```
Frontend → Hostinger (static files)
Backend → Render.com (FREE)
Database → MongoDB Atlas (FREE)
Domain → journals.nexerawe.com (Hostinger)
```

### **Why This is Better:**
- ✅ Works with ANY Hostinger plan
- ✅ Backend on Render is FREE
- ✅ MongoDB Atlas is FREE
- ✅ More reliable than shared hosting for backend
- ✅ Easier to maintain

### **Cost:** $0 extra (just use existing Hostinger)

---

## 📊 Comparison: Full Hostinger vs Hybrid

| Aspect | Full Hostinger | Hybrid (Hostinger + Free) |
|--------|---------------|---------------------------|
| **Cost** | Hostinger plan only | Hostinger plan only |
| **Requirements** | Business/Cloud plan | Any plan |
| **Backend Performance** | Limited by shared hosting | Better (dedicated resources) |
| **Ease of Setup** | More complex | Easier |
| **Scalability** | Limited | Better |
| **Recommended** | If you have Business plan | For most users ✅ |

---

## 🎯 What I Recommend for YOU

**Tell me:**
1. **What Hostinger plan do you have?** (Basic, Premium, Business, or Cloud)
2. **Do you want to deploy everything on Hostinger?** Or use hybrid approach?

Based on your answer, I'll give you the EXACT steps you need to follow!

---

## 💡 Need Help With:

- Checking your Hostinger plan capabilities?
- Setting up FTP access?
- Creating MongoDB Atlas account?
- Configuring DNS settings?
- Uploading files via File Manager instead of FTP?

**Just ask me and I'll guide you step by step!** 😊
