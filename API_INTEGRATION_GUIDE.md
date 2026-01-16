# API Integration Guide - Mini PLM Frontend

## Overview

This guide explains how the frontend integrates with the backend API and provides examples for testing.

---

## Architecture

### Request Flow

```
Component
   │
   │ useAuth hook
   │
   ▼
AuthContext
   │
   │ auth service methods
   │
   ▼
API Service (api.js)
   │
   │ Interceptors: Add JWT token
   │
   ▼
Axios Instance
   │
   │ HTTP Client
   │
   ▼
Backend API
```

---

## API Service

File: `src/services/api.js`

### Features

- **Base URL**: `http://localhost:8080/api`
- **Request Interceptor**: Adds JWT token to all requests
- **Response Interceptor**: Handles 401 errors (token expiration)
- **Error Handling**: Automatic error propagation

### Usage

```javascript
import { authService, healthService } from '../services/api';

// Login
const response = await authService.login('admin', 'admin123');
// Returns: { token: 'jwt-token', username: 'admin', role: 'ADMIN' }

// Register
const response = await authService.register('newuser', 'password123');

// Get current user
const user = await authService.getCurrentUser();

// Check health
const status = await healthService.checkStatus();
```

---

## Endpoints

### Authentication Endpoints

#### 1. Login

**Endpoint**: `POST /api/auth/login`

**Request**:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "username": "admin",
  "role": "ADMIN"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

#### 2. Register

**Endpoint**: `POST /api/auth/register`

**Request**:
```json
{
  "username": "newuser",
  "password": "password123"
}
```

**Response**:
```json
{
  "message": "User registered successfully",
  "username": "newuser"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"newuser","password":"password123"}'
```

#### 3. Get Current User

**Endpoint**: `GET /api/auth/me`

**Headers**:
```
Authorization: Bearer <TOKEN>
```

**Response**:
```json
{
  "username": "admin",
  "role": "ADMIN"
}
```

**cURL Example**:
```bash
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzUxMiJ9..."
```

### Health Endpoints

#### Check Status

**Endpoint**: `GET /api/health/status`

**Response**:
```json
{
  "status": "UP",
  "version": "1.0.0",
  "environment": "production"
}
```

#### Detailed Health

**Endpoint**: `GET /api/health/detailed`

**Response**:
```json
{
  "status": "UP",
  "components": {
    "database": "UP",
    "diskSpace": "UP"
  }
}
```

---

## Authentication Flow

### Step-by-Step

1. **User enters credentials** on login page
2. **Frontend calls** `authService.login(username, password)`
3. **API service** sends POST to `/api/auth/login`
4. **Backend validates** credentials
5. **Backend returns** JWT token + user data
6. **Frontend stores** token in localStorage
7. **Frontend redirects** to dashboard
8. **All future requests** include JWT in Authorization header

### Token Management

```javascript
// Token stored in localStorage
localStorage.getItem('token')
// Returns: 'eyJhbGciOiJIUzUxMiJ9...'

// User data stored in localStorage
localStorage.getItem('user')
// Returns: '{"username":"admin","role":"ADMIN"}'
```

### Token Expiration

- **Backend**: Token expires after configured duration (default: 24 hours)
- **Frontend**: 
  - Detects 401 responses
  - Clears localStorage
  - Redirects to login
  - User must re-login

---

## Request/Response Examples

### Successful Login

**Request**:
```bash
POST /api/auth/login HTTP/1.1
Host: localhost:8080
Content-Type: application/json
Content-Length: 39

{"username":"admin","password":"admin123"}
```

**Response**:
```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 150

{
  "token":"eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTczNjk4NjI2MCwiZXhwIjoxNzM3MDcyNjYwfQ.abc123...",
  "username":"admin",
  "role":"ADMIN"
}
```

### Failed Login

**Response**:
```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "message":"Invalid credentials",
  "error":"Unauthorized",
  "status":401
}
```

### Protected Route without Token

**Response**:
```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "message":"JWT token is missing",
  "error":"Unauthorized",
  "status":401
}
```

---

## Error Handling

### Frontend Error Handling

```javascript
try {
  const user = await login(username, password);
  // Success - redirect to dashboard
  navigate('/dashboard');
} catch (error) {
  if (error.response?.status === 401) {
    // Invalid credentials
    setError('Invalid username or password');
  } else if (error.response?.status === 400) {
    // Bad request - validation error
    setError(error.response.data.message);
  } else if (error.code === 'ECONNREFUSED') {
    // Backend not running
    setError('Unable to connect to server');
  } else {
    // Other errors
    setError('An error occurred. Please try again.');
  }
}
```

### Common Errors

| Status | Meaning | Action |
|--------|---------|--------|
| 400 | Bad Request | Check request format |
| 401 | Unauthorized | Re-login or check token |
| 403 | Forbidden | Check user permissions |
| 404 | Not Found | Check endpoint URL |
| 500 | Server Error | Check backend logs |
| CORS | Cross-origin error | Check backend CORS config |
| ECONNREFUSED | Connection refused | Check backend is running |

---

## Testing with cURL

### Test Flow

```bash
# 1. Login and get token
RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}')

echo "Login Response: $RESPONSE"

# Extract token (requires jq)
TOKEN=$(echo $RESPONSE | jq -r '.token')
echo "Token: $TOKEN"

# 2. Use token to access protected endpoint
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# 3. Check health
curl -X GET http://localhost:8080/api/health/status
```

---

## Testing with Postman

### Setup

1. **Create collection**: "Mini PLM"
2. **Create environment**: "Local"
   - Variable: `api_url` = `http://localhost:8080/api`
   - Variable: `token` = (empty initially)

### Requests

#### Login Request

- **Method**: POST
- **URL**: `{{api_url}}/auth/login`
- **Body**:
  ```json
  {
    "username": "admin",
    "password": "admin123"
  }
  ```
- **Pre-request Script**:
  ```javascript
  // None needed
  ```
- **Tests**:
  ```javascript
  if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("token", jsonData.token);
  }
  ```

#### Get Current User Request

- **Method**: GET
- **URL**: `{{api_url}}/auth/me`
- **Headers**:
  ```
  Authorization: Bearer {{token}}
  ```

---

## Integration Testing Checklist

- [ ] Backend API is running on port 8080
- [ ] Frontend can reach backend (no CORS errors)
- [ ] Login with admin credentials works
- [ ] Token is stored in localStorage
- [ ] Dashboard loads after login
- [ ] System status endpoint returns data
- [ ] Logout clears token and redirects to login
- [ ] Protected routes redirect unauthenticated users to login
- [ ] API error responses are handled gracefully
- [ ] Network requests show Authorization header with token

---

## Performance Considerations

### API Caching

Current implementation: **No caching** (suitable for development)

For production, consider:
- Caching user data
- Implementing request debouncing
- Using SWR/React Query for data fetching

### Request Optimization

- Minimize API calls in components
- Use Context to avoid prop drilling
- Implement pagination for large datasets

---

## Security Considerations

✅ **Implemented**
- JWT token-based authentication
- Token in localStorage (OK for this app)
- HTTPS ready
- CORS protection

⚠️ **Production Recommendations**
- Use httpOnly cookies instead of localStorage
- Implement token refresh mechanism
- Add request signing for sensitive operations
- Implement rate limiting on backend

---

## Troubleshooting

### CORS Errors

```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution**: Backend CORS is configured. Ensure:
- Backend is running
- Frontend API URL matches backend host
- No firewall blocking requests

### 401 Errors

```
{"message":"JWT token is missing"}
```

**Solution**:
- Ensure token is in localStorage
- Check token hasn't expired
- Re-login to get new token

### Connection Refused

```
ERROR: connect ECONNREFUSED 127.0.0.1:8080
```

**Solution**:
- Ensure backend is running: `docker-compose up -d`
- Check backend on correct port
- Verify `.env.local` has correct API URL

---

**Last Updated**: January 16, 2026
**Version**: 1.0.0
