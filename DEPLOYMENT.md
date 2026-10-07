# 🚀 AMRID PUBLIC SCHOOL - Production Deployment Guide

This comprehensive, step-by-step guide walks you through deploying the **AMRID PUBLIC SCHOOL** website and administration portal to production.

---

## 📋 Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Quick Checklist Before Deploying](#2-quick-checklist-before-deploying)
3. [MongoDB Atlas Database Setup](#3-mongodb-atlas-database-setup)
4. [Environment Variables Reference](#4-environment-variables-reference)
5. [Deployment Options](#5-deployment-options)
   - [Option A: Fullstack on Render / Railway (Recommended & Easiest)](#option-a-fullstack-on-render--railway-recommended)
   - [Option B: Separated Frontend (Vercel/Netlify) + Backend (Render)](#option-b-separated-frontend--backend)
   - [Option C: Self-Hosted VPS (Ubuntu + Nginx + PM2)](#option-c-self-hosted-vps-ubuntu--nginx--pm2)
6. [CORS & Cookie Configuration](#6-cors--cookie-configuration)
7. [Admin Portal Authentication Setup](#7-admin-portal-authentication-setup)
8. [Media & File Upload Storage](#8-media--file-upload-storage)
9. [Official WhatsApp & SMS Notifications](#9-official-whatsapp--sms-notifications)
10. [Custom Domain & SSL Configuration](#10-custom-domain--ssl-configuration)
11. [Post-Deployment Verification Checklist](#11-post-deployment-verification-checklist)

---

## 1. Architecture Overview

- **Frontend**: High-performance HTML5, Modern CSS, and Vanilla JavaScript bundled with **Vite**.
- **Backend**: **Node.js** with **Express 5**, implementing secure REST APIs, JWT session management, HTTP-only cookies, rate limiting, and Multer file upload handling.
- **Database**: **MongoDB Atlas** (cloud) with an automated, resilient fallback to local JSON database storage if MongoDB is temporarily unreachable or during offline development.
- **Notifications**: Automated background alerts dispatched via **Meta WhatsApp Cloud API**, **Twilio**, or **Fast2SMS** when parents submit admission enquiries or contact messages.

---

## 2. Quick Checklist Before Deploying

- [x] All hardcoded secrets and credentials have been removed from source code.
- [x] `node_modules/`, `.env`, and `dist/` are properly excluded from Git tracking.
- [x] Production build command works: `npm run build`.
- [x] Production start command works: `npm start`.
- [x] Protected admin APIs enforce authentication and HTTP-only cookies.
- [x] File upload extensions and MIME types are strictly validated.

---

## 3. MongoDB Atlas Database Setup

1. **Create an Account**:
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and register for a free account.
2. **Create a Cluster**:
   - Select the free **M0 (Shared)** tier.
   - Choose a region close to your primary users (e.g., `AWS / Mumbai (ap-south-1)` for India).
   - Name your cluster (e.g., `amrid-school-db`) and click **Create Deployment**.
3. **Set Up Database Access (User)**:
   - Go to **Security** → **Database Access** → click **Add New Database User**.
   - Select **Password Authentication**.
   - Username: e.g., `amrid_admin`.
   - Generate or enter a strong password (save this safely!).
   - Role: **Read and write to any database** (Atlas admin or `readWriteAnyDatabase`).
4. **Set Up Network Access (IP Whitelist)**:
   - Go to **Security** → **Network Access** → click **Add IP Address**.
   - Choose **Allow Access from Anywhere** (`0.0.0.0/0`).
   - Click **Confirm**. (Cloud hosts like Render, Railway, and Heroku have dynamic IP addresses, so `0.0.0.0/0` is required).
5. **Copy the Connection String**:
   - Go to **Deployment** → **Database** → click **Connect**.
   - Choose **Drivers** → Node.js.
   - Copy the connection URI. It looks like:
     ```text
     mongodb+srv://amrid_admin:<password>@cluster0.xxxxx.mongodb.net/amrid_school?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual database user password.
   - Put this full string into your `MONGODB_URI` environment variable.

> **Note**: When you connect for the first time, the application will **automatically seed** MongoDB with the existing school content, notices, events, and galleries so no data is ever lost.

---

## 4. Environment Variables Reference

Configure these in your production host dashboard (Render, Railway, Heroku, VPS `.env`):

| Variable Name | Required | Default / Example | Purpose |
| :--- | :---: | :--- | :--- |
| `NODE_ENV` | **Yes** | `production` | Enables secure cookies, removes debug traces |
| `PORT` | Optional | `8000` (Render/Railway sets automatically) | Port the backend server listens on |
| `ADMIN_USERNAME` | **Yes** | `admin` (or your choice) | Username to access `/admin` |
| `ADMIN_PASSWORD` | **Yes** | e.g. `StrongPass@2026!` | Plaintext password (auto-hashed by server) |
| `JWT_SECRET` | **Yes** | 32+ character random string | Signs session tokens for `/admin` |
| `FRONTEND_URL` | **Yes** | `https://amridpublicschool.com` | Allowed CORS origins (comma-separated if multiple) |
| `BACKEND_URL` | Optional | `https://amridpublicschool.com` | Public URL of the backend service |
| `MONGODB_URI` | Recommended | `mongodb+srv://...` | MongoDB Atlas database connection string |
| `DIRECTOR_PHONE` | Optional | `+918434149789` | Receives admission enquiry notifications |
| `PRINCIPAL_PHONE` | Optional | `+919693264161` | Receives admission enquiry notifications |
| `WHATSAPP_ACCESS_TOKEN` | Optional | Meta Graph API User Token | Enables automated WhatsApp notifications |
| `WHATSAPP_PHONE_NUMBER_ID` | Optional | Meta Phone Number ID | Meta WhatsApp sender phone ID |
| `TWILIO_ACCOUNT_SID` | Optional | `ACxxxxxxxx...` | Twilio SMS/WhatsApp Account SID |
| `TWILIO_AUTH_TOKEN` | Optional | `xxxxxxxx...` | Twilio Auth Token |
| `TWILIO_PHONE_NUMBER` | Optional | `+14155238886` | Twilio purchased phone number |

---

## 5. Deployment Options

### Option A: Fullstack on Render / Railway (Recommended)

In this setup, your single repository builds the Vite frontend and the Express backend serves the static files and API endpoints together on the same domain. **This avoids CORS issues and third-party cookie restrictions completely.**

#### Step-by-Step for Render ([render.com](https://render.com)):
1. Create a free account on Render and link your GitHub repository.
2. Click **New +** → **Web Service**.
3. Choose your repository: `AMRID-PUBLIC-SCHOOL`.
4. Configure the Web Service:
   - **Name**: `amrid-public-school`
   - **Region**: Singapore or Frankfurt (or closest to India)
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**:
     ```bash
     npm install && npm run build
     ```
   - **Start Command**:
     ```bash
     npm start
     ```
5. Click **Advanced** → **Add Environment Variable**:
   - `NODE_ENV` = `production`
   - `ADMIN_USERNAME` = `admin`
   - `ADMIN_PASSWORD` = `<your-chosen-admin-password>`
   - `JWT_SECRET` = `<generate-a-random-32-char-string>`
   - `FRONTEND_URL` = `https://amrid-public-school.onrender.com` (update to custom domain once set)
   - `MONGODB_URI` = `<your-mongodb-atlas-uri>`
   - `DIRECTOR_PHONE` = `+918434149789`
   - `PRINCIPAL_PHONE` = `+919693264161`
6. Click **Deploy Web Service**.
7. Once deployed, test your website at `https://amrid-public-school.onrender.com` and open `https://amrid-public-school.onrender.com/admin` to test login!

---

### Option B: Separated Frontend + Backend

Use this if you prefer hosting the frontend on **Vercel** / **Netlify** and the backend on **Render** / **Railway**:

#### 1. Backend (Render / Railway):
- Deploy as a Web Service.
- Set `FRONTEND_URL` to your Vercel/Netlify domain (e.g. `https://amrid-school.vercel.app`).

#### 2. Frontend (Vercel / Netlify):
- Link the repository.
- Framework Preset: **Vite**.
- Build Command: `npm run build`
- Output Directory: `dist`
- Add Environment Variable:
  - `VITE_API_URL` = `https://amrid-backend.onrender.com` (URL of your backend)
- Deploy!

---

### Option C: Self-Hosted VPS (Ubuntu + Nginx + PM2)

If deploying to a DigitalOcean, AWS EC2, or Hostinger VPS:

1. **Connect to your server**:
   ```bash
   ssh root@your_server_ip
   ```
2. **Install Node.js 20+ & PM2**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs nginx git
   sudo npm install -g pm2
   ```
3. **Clone your repository**:
   ```bash
   git clone https://github.com/azmiintezar07/AMRID-PUBLIC-SCHOOL.git /var/www/amrid-school
   cd /var/www/amrid-school
   ```
4. **Create the production `.env` file**:
   ```bash
   cp .env.example .env
   nano .env
   # Fill in MONGODB_URI, ADMIN_PASSWORD, JWT_SECRET, etc.
   ```
5. **Install dependencies and build**:
   ```bash
   npm install
   npm run build
   ```
6. **Start with PM2**:
   ```bash
   pm2 start server.js --name "amrid-school"
   pm2 save
   pm2 startup
   ```
7. **Configure Nginx Reverse Proxy** (`/etc/nginx/sites-available/amrid`):
   ```nginx
   server {
       server_name amridpublicschool.com www.amridpublicschool.com;
       client_max_body_size 30M;

       location / {
           proxy_pass http://127.0.0.1:8000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   Enable the site and install SSL via Let's Encrypt Certbot:
   ```bash
   sudo ln -s /etc/nginx/sites-available/amrid /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d amridpublicschool.com -d www.amridpublicschool.com
   ```

---

## 6. CORS & Cookie Configuration

- **Same-Domain Deployments** (Option A or C):
  - Frontend and Backend share the same domain name.
  - Cookies are sent natively as `SameSite=Lax`.
  - Zero cross-origin header issues.
- **Cross-Domain Deployments** (Option B):
  - In `api-routes.js`, when running across separate domains, the server sets `SameSite=None` and `Secure=true`.
  - In `admin.js`, every request includes `credentials: 'include'`.
  - Furthermore, `admin.js` automatically attaches the token via the `Authorization: Bearer <token>` header, ensuring reliable authentication even on browsers (like Safari) that restrict cross-site cookies.

---

## 7. Admin Portal Authentication Setup

1. The Admin Portal is accessed at:
   ```text
   https://yourdomain.com/admin
   ```
2. By default (in local development), credentials are configured in `.env`.
3. In production, configure:
   - `ADMIN_USERNAME`: e.g. `Azmi` or `principal`
   - `ADMIN_PASSWORD`: a strong password (minimum 10 characters)
4. The system automatically creates a bcrypt hash upon server launch and verifies logins securely.
5. All sensitive management actions (editing content, uploading media, viewing admissions, deleting messages) are protected by JWT authentication middleware and rate limiting.

---

## 8. Media & File Upload Storage

- Uploads are saved into `public/uploads/` and mirrored to `dist/uploads/`.
- All uploads are strictly validated:
  - Allowed extensions: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.mp4`, `.webm`, `.pdf`
  - Allowed MIME types: `image/*`, `video/mp4`, `video/webm`, `application/pdf`
  - Max upload size: `25 MB`
  - Sanitized filenames prevent directory traversal attacks.
- If deploying to hosting platforms with ephemeral storage (e.g. Render free tier restarts disk), attach a Render **Persistent Disk** mounted at `/public/uploads` or configure Cloudinary credentials in `.env`.

---

## 9. Official WhatsApp & SMS Notifications

When a parent submits an admission enquiry, the server automatically formats and delivers an alert to both the Director and Principal.

### A. Meta WhatsApp Cloud API (Recommended for WhatsApp):
1. Sign up at [developers.facebook.com](https://developers.facebook.com/).
2. Create an App → Choose **Business** → Add **WhatsApp**.
3. In the WhatsApp dashboard, copy your:
   - **System User Access Token** → set as `WHATSAPP_ACCESS_TOKEN`
   - **Phone Number ID** → set as `WHATSAPP_PHONE_NUMBER_ID`
4. Set recipient numbers in `DIRECTOR_PHONE` and `PRINCIPAL_PHONE`.

### B. Twilio (Alternative for SMS & WhatsApp):
1. Create an account at [twilio.com](https://www.twilio.com/).
2. Copy your **Account SID** and **Auth Token**.
3. Set `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_PHONE_NUMBER`.

> If credentials are not set, notifications are safely skipped with an informative log and will **never crash the server or disrupt enquiries**.

---

## 10. Custom Domain & SSL Configuration

1. In your domain registrar (GoDaddy, Namecheap, Cloudflare, Hostinger):
   - Add a **CNAME Record**:
     - Host: `www`
     - Value: your deployment address (e.g., `amrid-public-school.onrender.com`)
   - Add an **A Record** (for root apex domain):
     - Host: `@`
     - Value: your hosting provider's assigned IP address (e.g., Render or Cloudflare IP).
2. Enable automatic SSL in your hosting provider's dashboard (Render and Railway provide free automatic SSL certificates via Let's Encrypt).

---

## 11. Post-Deployment Verification Checklist

After deploying, verify the following:

1. **Homepage**:
   - Open `https://yourdomain.com` → verify images, fonts, and styling render properly.
2. **Health Check**:
   - Open `https://yourdomain.com/api/health` → verify status is `ok` and database is connected.
3. **Public Forms**:
   - Submit a test Admission Enquiry → verify success banner appears.
   - Submit a test Contact Message → verify success banner appears.
4. **Admin Portal**:
   - Open `https://yourdomain.com/admin` → verify login screen appears.
   - Log in with your production credentials → verify dashboard loads.
   - Go to **Admissions** → verify the test enquiry is visible.
   - Add a test note or update status to **Contacted**.
   - Go to **Media Library** → test uploading an image.
   - Go to **Notices / Events** → test creating a notice and saving changes.
   - Click **Logout** → verify secure sign-out.
