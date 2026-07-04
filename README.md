# 💰 FinTrack AI

**AI-powered personal finance tracker for smarter money decisions.**

Track income and expenses, upload bank statements, visualize spending, and get AI-generated financial insights — all in one secure, full-stack web application.

[![Live Demo](https://img.shields.io/badge/demo-live-2ea44f?style=for-the-badge)](https://fintrack-ai-teal.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/repo-github-181717?style=for-the-badge&logo=github)](https://github.com/nithyasrimorla-png/FinTrack-AI)

![Next.js](https://img.shields.io/badge/Next.js-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-black?style=flat-square&logo=jsonwebtokens)
![Vercel](https://img.shields.io/badge/Vercel-black?style=flat-square&logo=vercel)
![Render](https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=white)

---

## 📖 Overview

FinTrack AI is a full-stack personal finance management platform built to demonstrate production-grade, end-to-end engineering — from secure authentication to data visualization and AI-assisted insights.

Users can register and log in securely, upload CSV bank statements for automatic transaction import, manage income/expenses, view interactive dashboards, and receive AI-generated summaries of their financial habits. The application is deployed with a decoupled architecture: a Next.js frontend on Vercel and an Express.js API on Render, backed by a PostgreSQL database (Neon).

**🔗 Live Demo:** [fintrack-ai-teal.vercel.app](https://fintrack-ai-teal.vercel.app)

**📦 Source Code:** [github.com/nithyasrimorla-png/FinTrack-AI](https://github.com/nithyasrimorla-png/FinTrack-AI)

---

##  Key Features

**Authentication & Security**
-  Secure user registration and JWT-based login
-  Password hashing with bcrypt
-  Forgot Password / Reset Password flow via secure, time-limited email links (Resend API)
-  JWT reset token expiration for link security

**Financial Management**
-  Add, edit, and delete transactions
-  CSV bank statement upload for bulk transaction import
-  Automatic transaction categorization
-  Dashboard analytics with income/expense summaries
-  Interactive charts and visualizations
-  AI-generated financial insights based on spending patterns

**Engineering**
-  RESTful API architecture
-  Fully responsive UI
-  Environment-based configuration
-  Production deployment (Vercel + Render)

---

##  Screenshots

> Add screenshots or a demo GIF here to give recruiters an immediate visual of the product.

| Login | Dashboard |
|---|---|
| _`screenshots/login.png`_ | _`screenshots/dashboard.png`_ |

| Transactions | Insights |
|---|---|
| _`screenshots/transactions.png`_ | _`screenshots/insights.png`_ |

---

##  Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js, React, TypeScript, Tailwind CSS, Axios |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | PostgreSQL (Neon), Prisma ORM |
| **Authentication** | JWT, bcrypt |
| **Email Service** | Resend API |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

##  System Architecture

FinTrack AI follows a decoupled client-server architecture:

```
┌─────────────────┐         HTTPS / REST          ┌──────────────────┐
│   Next.js App    │ ─────────────────────────────▶ │  Express.js API   │
│   (Vercel)        │ ◀───────────────────────────── │  (Render)          │
│                   │           JSON + JWT           │                    │
└─────────────────┘                                └────────┬─────────┘
                                                                │
                                                                │ Prisma ORM
                                                                ▼
                                                     ┌───────────────────┐
                                                     │  PostgreSQL (Neon) │
                                                     └───────────────────┘

                                          ┌───────────────────┐
                                          │   Resend API        │
                                          │ (Password Reset      │
                                          │  Emails)             │
                                          └───────────────────┘
```

- **Frontend (Next.js):** Handles UI rendering, client-side routing, and API communication via Axios.
- **Backend (Express.js):** Exposes REST endpoints, handles business logic, authentication, and CSV parsing.
- **Database (PostgreSQL + Prisma):** Stores users, transactions, and categories with type-safe queries.
- **Email Service (Resend):** Delivers password reset links securely.

---

##  Authentication Flow

1. **Registration:** User submits credentials → password is hashed with bcrypt → user record created in PostgreSQL.
2. **Login:** Credentials verified against the hashed password → JWT issued and returned to the client.
3. **Authenticated Requests:** JWT is attached to the `Authorization` header for protected routes; middleware verifies the token before granting access.
4. **Forgot Password:** User requests a reset → a short-lived JWT reset token is generated → a reset link is emailed via Resend.
5. **Reset Password:** User clicks the link → token is validated for authenticity and expiration → new password is hashed and saved.

This ensures passwords are never stored in plaintext and reset links cannot be reused or exploited after expiration.

---

##  Folder Structure

```
FinTrack-AI/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/            # App router pages
│   │   ├── components/     # Reusable UI components
│   │   ├── lib/             # Axios instance, helpers
│   │   └── styles/          # Tailwind/global styles
│   └── package.json
│
├── server/                 # Express.js backend
│   ├── src/
│   │   ├── controllers/    # Route logic
│   │   ├── routes/          # API route definitions
│   │   ├── middleware/      # Auth middleware, error handling
│   │   ├── prisma/           # Prisma schema & client
│   │   ├── services/         # Email, AI insights, CSV parsing
│   │   └── utils/            # Helper functions
│   └── package.json
│
└── README.md
```

> Structure reflects the general organization of the project; adjust to match your actual repo layout if it differs.

---

## Installation

### Prerequisites
- Node.js (v18+)
- PostgreSQL database (or a Neon account)
- Resend API key

### Clone the repository

```bash
git clone https://github.com/nithyasrimorla-png/FinTrack-AI.git
cd FinTrack-AI
```

### Install dependencies

```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

---

## Environment Variables

Create a `.env` file in the **server** directory:

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
JWT_RESET_SECRET=your_jwt_reset_secret
RESEND_API_KEY=your_resend_api_key
CLIENT_URL=http://localhost:3000
PORT=5000
```

Create a `.env.local` file in the **client** directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

> ⚠️ Never commit `.env` files. Use `.env.example` to document required variables.

---

## ▶️ Running Locally

```bash
# Run Prisma migrations
cd server
npx prisma migrate dev

# Start backend server
npm run dev

# In a separate terminal, start frontend
cd ../client
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate user and issue JWT |
| `POST` | `/api/auth/forgot-password` | Send password reset email |
| `POST` | `/api/auth/reset-password` | Reset password using token |
| `GET` | `/api/transactions` | Fetch all transactions for logged-in user |
| `POST` | `/api/transactions` | Create a new transaction |
| `PUT` | `/api/transactions/:id` | Update a transaction |
| `DELETE` | `/api/transactions/:id` | Delete a transaction |
| `POST` | `/api/transactions/upload` | Upload CSV bank statement |
| `GET` | `/api/insights` | Get AI-generated financial insights |

> All protected routes require a valid JWT in the `Authorization: Bearer <token>` header.

---

##  Deployment

| Component | Platform | Notes |
|---|---|---|
| Frontend | **Vercel** | Auto-deployed from `main` branch |
| Backend | **Render** | Node/Express web service |
| Database | **Neon (PostgreSQL)** | Managed serverless Postgres |
| Email | **Resend** | Transactional email for password resets |

Environment variables are configured separately in each platform's dashboard to keep secrets out of source control.

---

##  Challenges Faced During Development

- **Secure password reset flow:** Designing a reset mechanism that used short-lived JWTs to prevent replay attacks while keeping the user experience simple.
- **CSV parsing reliability:** Handling inconsistent CSV formats from different banks while mapping fields to a consistent transaction schema.
- **Cross-origin authentication:** Managing JWT-based auth across a decoupled frontend (Vercel) and backend (Render) deployment, including CORS and environment-specific configuration.
- **Database connection stability:** Tuning Prisma's connection handling for a serverless Postgres provider (Neon) to avoid connection exhaustion in production.

---

##  Future Enhancements

- 📊 Budget planning and goal-setting features
- 🔔 Spending alerts and notifications
- 🌍 Multi-currency support
- 📱 Native mobile app (React Native)
- 🧠 Expanded AI insights (forecasting, anomaly detection)
- 🔒 OAuth login (Google/GitHub)

---

## 🎯 Skills Demonstrated

- Full-stack application design and implementation
- RESTful API design with Express.js and TypeScript
- Secure authentication (JWT, bcrypt, token expiration)
- Relational database modeling with Prisma ORM
- Third-party API integration (Resend for transactional email)
- File processing (CSV parsing and transaction mapping)
- Data visualization and dashboard design
- Cloud deployment across separate frontend/backend platforms
- Environment-based configuration management

---

## 👀 What Recruiters Should Notice

- **End-to-end ownership:** Both frontend and backend are built and deployed independently, reflecting real-world production architecture.
- **Security-first mindset:** Password hashing, JWT expiration, and secure reset flows are implemented rather than just described.
- **Practical AI integration:** AI insights are built on real transaction data, not just a marketing label.
- **Production deployment experience:** The app is live and deployed across two separate cloud platforms (Vercel + Render) with a managed database (Neon).
- **Clean, typed codebase:** TypeScript is used across both frontend and backend for type safety and maintainability.

---

## 👤 Author

**Nithya Sri Morla**
GitHub: [@nithyasrimorla-png](https://github.com/nithyasrimorla-png)

---


