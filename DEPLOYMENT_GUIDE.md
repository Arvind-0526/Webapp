# 🚀 NexeraWe Journals - Production Deployment Guide

## Overview
This guide will help you deploy your Academic Journals platform to production with your custom domain: **journals.nexerawe.com**

---

## ✅ Pre-Deployment Checklist

### 1. Verify Application is Working
- [ ] Test registration: Create a student account
- [ ] Test login: Both student and admin login
- [ ] Test journal upload: Upload a PDF
- [ ] Test admin review: Approve/reject journals
- [ ] Verify email notifications are working

### 2. Important Credentials (Keep Safe!)

**Admin Account:**
```
Email: admin@nexerawe.com
Password: admin123456
⚠️ CHANGE THIS PASSWORD IMMEDIATELY AFTER DEPLOYMENT!
```

**SMTP Email (Already Configured):**
```
Host: smtp.hostinger.com
Port: 465
Email: team@nexerawe.com
Password: 8UkEiR;7=
```

---

## 📦 Step-by-Step Deployment Process

### **STEP 1: Test Your Application (5 minutes)**

1. Click the **"Preview"** button in Emergent interface
2. Test all key features:
   - Register a test student account
   - Upload a sample journal
   - Login as admin (admin@nexerawe.com / admin123456)
   - Approve the journal
   - Check if email was sent
3. If everything works, proceed to deployment!

---

### **STEP 2: Deploy to Production (10-15 minutes)**

1. **Click "Deploy" button** in Emergent interface
2. **Click "Deploy Now"** to start deployment
3. Wait for deployment to complete (10-15 minutes)
4. You'll receive a **public URL** like: `https://your-app-name.emergentagent.com`
5. **Test the public URL** - your app is now live!

**Cost:** 50 credits per month (includes 24/7 uptime, managed infrastructure)

---

### **STEP 3: Connect Your Custom Domain (15 minutes - 24 hours)**

#### A. In Emergent Platform:
1. After deployment, click **"Link domain"** button
2. Enter your domain: `journals.nexerawe.com`
3. Click **"Entri"** button
4. Follow the on-screen instructions

#### B. In Your Domain Provider (Hostinger/GoDaddy/Namecheap):

**CRITICAL STEP:** You need to update DNS settings

1. **Login to your domain registrar** (where you bought nexerawe.com)
2. **Go to DNS Management** section
3. **Remove ALL existing 'A records'** for the subdomain `journals`
4. **Add the DNS records** provided by Emergent (you'll see these after clicking "Entri")

**Example DNS Configuration:**
```
Type: CNAME
Name: journals
Value: <provided-by-emergent>
TTL: Automatic or 3600
```

5. **Save changes**
6. **Wait for DNS propagation** (5-15 minutes, up to 24 hours max)

---

### **STEP 4: Post-Deployment Configuration**

#### Update Environment Variables (Important!)

After deployment, you need to update these settings:

**Backend Environment Variables:**
```env
MONGO_URL=<will-be-auto-configured>
DB_NAME=nexerawe_journals
CORS_ORIGINS=https://journals.nexerawe.com
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=team@nexerawe.com
SMTP_PASS=8UkEiR;7=
JWT_SECRET=nexerawe-journals-secret-key-2026
FRONTEND_URL=https://journals.nexerawe.com
```

**Frontend Environment Variables:**
```env
REACT_APP_BACKEND_URL=https://journals.nexerawe.com
```

These are typically auto-configured by Emergent during deployment.

---

## 🔒 Security Steps (DO IMMEDIATELY!)

### 1. Change Admin Password
```
1. Go to: https://journals.nexerawe.com/admin/login
2. Login with: admin@nexerawe.com / admin123456
3. Go to settings/profile
4. Change password to a strong one
5. SAVE THE NEW PASSWORD SECURELY!
```

### 2. Update JWT Secret (Optional but Recommended)
Generate a new JWT secret for production:
```bash
# Generate random secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Update `JWT_SECRET` in backend environment variables.

---

## 🧪 Testing Your Production Deployment

### Test These URLs:
1. **Homepage:** https://journals.nexerawe.com
2. **Registration:** https://journals.nexerawe.com/register
3. **Student Login:** https://journals.nexerawe.com/login
4. **Admin Login:** https://journals.nexerawe.com/admin/login

### Test This Flow:
1. ✅ Register a new student account
2. ✅ Login as student
3. ✅ Upload a journal (with PDF)
4. ✅ Logout and login as admin
5. ✅ Review and approve the journal
6. ✅ Check student email for approval notification
7. ✅ View published journal on homepage
8. ✅ Test student porthole view

---

## 📊 Monitoring Your Application

### Check Application Health:
- **API Health:** https://journals.nexerawe.com/api/health
- **Expected Response:** `{"status":"healthy","timestamp":"..."}`

### View Logs:
- Access logs through Emergent dashboard
- Monitor for errors or issues
- Check email delivery logs

---

## 🔧 Common Issues & Solutions

### Issue 1: Domain Not Working
**Symptoms:** Domain shows "site can't be reached"
**Solutions:**
1. Wait longer (DNS can take up to 24 hours)
2. Verify you removed ALL A records from DNS
3. Try re-linking domain (click "Entri" again)
4. Clear browser cache and try incognito mode

### Issue 2: Email Not Sending
**Symptoms:** Approval emails not received
**Solutions:**
1. Verify SMTP credentials in environment variables
2. Check Hostinger email account is active
3. Check spam/junk folder
4. Test with a different email address

### Issue 3: PDF Upload Failing
**Symptoms:** Upload shows error
**Solutions:**
1. Check file size < 15MB
2. Verify file is actual PDF format
3. Check backend logs for errors
4. Ensure uploads directory has write permissions

### Issue 4: MongoDB Connection Error
**Symptoms:** "Database connection failed"
**Solutions:**
1. MongoDB is auto-managed by Emergent
2. Check deployment logs
3. Verify DB_NAME is set correctly
4. Contact Emergent support if persists

---

## 🔄 Redeployment (Updating Your Live App)

When you make changes to your code:

1. **Test changes locally** using Preview
2. **Click "Deploy" again** to redeploy
3. **Wait for deployment** (10-15 minutes)
4. **Your live site will update automatically**
5. **No domain re-linking needed**

---

## 💰 Cost Breakdown

- **Deployment:** 50 credits per month per app
- **Included:** 
  - 24/7 uptime
  - Managed MongoDB database
  - Automatic SSL certificate for HTTPS
  - Infrastructure management
  - Scaling and load balancing

---

## 📞 Support & Help

### If You Need Help:
1. **Check Emergent documentation** for platform-specific issues
2. **Review application logs** in Emergent dashboard
3. **Test API endpoints** directly using curl or Postman
4. **Contact Emergent support** for platform issues

---

## ✨ Success Checklist

After deployment, verify:
- [ ] Domain journals.nexerawe.com is accessible
- [ ] HTTPS is working (secure padlock icon)
- [ ] Student registration works
- [ ] Student can upload journals
- [ ] Admin can login
- [ ] Admin can approve journals
- [ ] Email notifications are sent
- [ ] PDFs can be downloaded
- [ ] Student porthole pages work
- [ ] Admin password has been changed

---

## 🎯 Next Steps After Deployment

1. **Create your first admin account** (if needed)
2. **Add sample journals** to showcase the platform
3. **Share the platform** with your college/university
4. **Monitor usage** and user feedback
5. **Add enhancements** (certificates, batch approval, featured journals)

---

## 📝 Important Information to Share With Me

If you encounter issues during deployment, please share:

1. **Error messages** you're seeing
2. **Which step** you're stuck on
3. **Screenshots** if possible
4. **Domain registrar** you're using (Hostinger, GoDaddy, etc.)
5. **Current DNS settings** for journals.nexerawe.com

---

## 🎓 Learning Resources

Want to learn more about deployment?
- Emergent platform documentation
- Node.js deployment best practices
- MongoDB production configuration
- React production builds
- Domain and DNS management

---

**Ready to deploy? Let's do this! 🚀**

If you have any questions at any step, just ask me and I'll help you through it!
