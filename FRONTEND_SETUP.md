# Mini PLM Frontend - Setup Guide

## Prerequisites

- Node.js 18+ (recommended Node 20)
- npm 9+
- Backend running on `http://localhost:8080` with API context path `/api`

## Local development (recommended)

### 1) Install

```bash
git clone https://github.com/Subhash0910/mini-plm-frontend.git
cd mini-plm-frontend
npm ci
```

### 2) Configure environment

Create a local env file:

```bash
cp .env.example .env.local
```

Default is:

- `REACT_APP_API_BASE_URL=/api`

This works with CRA proxy (from `package.json`):
- Browser calls: `http://localhost:3000/api/...`
- CRA proxy forwards to: `http://localhost:8080/api/...`

### 3) Start

```bash
npm start
```

Open:
- `http://localhost:3000`

## Running with a deployed backend

If the backend is deployed somewhere else (example: `https://yourdomain.com/api`), set:

```properties
REACT_APP_API_BASE_URL=https://yourdomain.com/api
```

Then rebuild:

```bash
npm run build
```

## Troubleshooting

### 401 / auto-logout

If the backend returns HTTP 401, the frontend clears stored auth automatically and the UI will act as logged out.

### CORS issues

If you run frontend and backend on different domains without proxying, ensure backend CORS allows the frontend origin.

---

Last updated: January 2026
