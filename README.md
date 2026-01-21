# NexeraWe Journals - Academic Publication Platform

A production-ready platform for college students to publish research papers and projects, with admin review and approval workflow.

## Features

✅ **Student Features:**
- User registration with legal agreement
- Journal/project upload (PDF, max 15MB)
- Enforced filename format: `journal-title_student-name_timestamp.pdf`
- Student Porthole (portfolio-style profile)
- Status tracking (Pending/Approved/Rejected/Private)
- Public/Private visibility control

✅ **Admin Features:**
- Review and approve/reject journals
- Add admin notes
- Automated email notifications on approval
- Dashboard with statistics

✅ **Public Features:**
- Browse published journals
- Filter by college, department, keywords
- View individual journal details
- Download tracking

## Tech Stack

- **Frontend:** React + Tailwind CSS + Shadcn UI
- **Backend:** Node.js + Express + MongoDB
- **Proxy:** FastAPI (for Kubernetes ingress compatibility)
- **Email:** NodeMailer with Hostinger SMTP
- **Auth:** JWT

## Default Admin Account

```
Email: admin@nexerawe.com
Password: admin123456
```

**⚠️ Change password after first login!**

## File Naming Convention

All uploaded journal PDFs are automatically renamed to:
```
<journal-title>_<student-name>_<timestamp>.pdf
```

Example: `ai-based-traffic-control_arvind-kumar_1704892123.pdf`

## Legal Agreement

Both registration and upload pages require acceptance of the publication agreement covering:
- Ownership & Authority
- Grant of License
- Academic Integrity
- Accuracy of Information
- Certification

## Publication ID Format

Each journal gets a unique ID: `NEX-JRNL-<YEAR>-<NUMBER>`

Example: `NEX-JRNL-2026-0001`

## Email Notification

When an admin approves a journal, the system automatically sends an email to the student with journal details and publication link.
