# PhishScale Pro - Enterprise Phishing Awareness Platform

PhishScale Pro is a professional-grade cybersecurity training tool designed to simulate phishing attacks, track employee responses, and provide educational feedback. It helps organizations transition from "theoretical" security training to "experiential" awareness.

---

## 🚀 Key Features

- **Enterprise Analytics**: Real-time tracking of Email Opens, Link Clicks, and Data Submissions.
- **Phish-Prone Department Analysis**: Identify which teams (Sales, Engineering, Finance, etc.) are most vulnerable.
- **Premium Template Engine**: Pre-built, professional Microsoft 365, HR, and IT Security pretexts.
- **Universal CSV Importer**: Intelligent discovery of target lists, supporting varied headers and formats.
- **Microsoft 365 Trap Perfection**: A high-fidelity login simulation designed for maximum educational conviction.
- **Factory Reset**: Instant environment cleanup for new simulation cycles.

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, PapaParse (CSV Processing), Chart.js (Analytics).
- **Backend**: Node.js, Express, PostgreSQL (for production), JSON File Store (demo fallback).
- **Communication**: SendGrid API / SMTP integration for reliable delivery.

---

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL (Optional, system falls back to JSON store if DB is missing)
- SendGrid API Key (for live campaigns)

### 2. Backend Setup
1. Navigate to the `backend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on the environment variables:
   ```env
   PORT=5000
   DATABASE_URL=your_postgresql_url
   SENDGRID_API_KEY=your_key
   SENDGRID_FROM_EMAIL=your_verified_sender
   FRONTEND_URL=your_frontend_url
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🧪 Simulation Workflow

1. **Import Targets**: Upload a CSV of employees or add them manually in the Dashboard.
2. **Compose Campaign**: Select a Professional Template, customize the subject, and create a Campaign.
3. **Launch Simulation**: 
   - **Test Mode**: Send a lure only to your admin email to verify its look.
   - **Live Mode**: Dispatch the lure to all imported targets.
4. **Monitor Analytics**: Watch the **Simulation Live Feed** for real-time engagement data.
5. **Education**: Clicked users are redirected to a safe landing page explaining the "red flags" they missed.

---

## 🛡️ Security & Ethics
This tool is for **educational purposes only**. Always ensure you have organizational authorization before launching simulations against actual employees.

**PhishScale Pro - Building a Human Firewall.**
