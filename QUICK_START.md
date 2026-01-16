# 🚀 Quick Start - Mini PLM Frontend

## 5-Minute Setup

### Step 1: Clone & Install

```bash
git clone https://github.com/Subhash0910/mini-plm-frontend.git
cd mini-plm-frontend
npm install
```

### Step 2: Configure Backend URL

```bash
# Create .env.local file
echo "REACT_APP_API_URL=http://localhost:8080/api" > .env.local
```

### Step 3: Start Frontend

```bash
npm start
```

✅ **Frontend running**: http://localhost:3000

---

## 🐣 Docker Quick Start (30 seconds)

### Using Docker Compose

```bash
# Both Frontend & Backend together
docker-compose up -d

# Frontend: http://localhost:3000
# Backend: http://localhost:8080
```

### Using Docker Image

```bash
# Build
docker build -t mini-plm-frontend .

# Run
docker run -p 3000:80 mini-plm-frontend
```

---

## 🔑 Login Immediately

Once frontend is running:

**URL**: http://localhost:3000

**Demo Credentials**:

```
Admin:
  Username: admin
  Password: admin123

Regular User:
  Username: user
  Password: user123
```

---

## 📋 What You Get

✅ Beautiful login page
✅ Secure authentication
✅ Dashboard with system status
✅ Protected routes
✅ Mobile-responsive design
✅ Production-ready code

---

## 🧱 Useful Commands

```bash
# Start development
npm start

# Build for production
npm run build

# Run tests
npm test

# Stop all services
docker-compose down

# View logs
docker-compose logs -f frontend
```

---

## 🔍 Verify Everything Works

### Frontend Checks
- [ ] Open http://localhost:3000
- [ ] See login page
- [ ] Try demo credentials
- [ ] See dashboard
- [ ] Check system status

### Backend Connectivity
- [ ] Open browser console (F12)
- [ ] No CORS errors
- [ ] No connection refused errors
- [ ] API calls succeeding (Network tab)

---

## ⚠️ Troubleshooting

### Port 3000 in use?

```bash
PORT=3001 npm start
```

### Dependencies not installing?

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Backend not responding?

- Ensure backend running on 8080
- Check `.env.local` has correct API URL
- Verify no firewall blocking

---

## 📦 Next Steps

1. **Explore Dashboard** - Check system status
2. **Read Full Guide** - See [FRONTEND_COMPLETE_GUIDE.md](FRONTEND_COMPLETE_GUIDE.md)
3. **Review Code** - Check `src/` directory structure
4. **Customize** - Add your own features
5. **Deploy** - Follow production deployment steps

---

**Status**: ✅ Production Ready | **Version**: 1.0.0 | **Updated**: Jan 16, 2026
