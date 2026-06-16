# Traxly - Marketing Analytics & Link Management Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-traxly--puce.vercel.app-6E56CF?style=for-the-badge)](https://traxly-puce.vercel.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com)
[![Redis](https://img.shields.io/badge/Redis-Cache-DC382D?style=for-the-badge&logo=redis)](https://redis.io)

> A full-stack URL shortener and marketing analytics platform similar to Bitly + Short.io + Linktree, built from scratch with MERN stack.

## Live Demo

- Frontend: https://traxly-puce.vercel.app
- Backend API: https://traxly-api.onrender.com
- GitHub: https://github.com/Yachna-123/traxly

## Features

### Core
- Custom URL shortening with optional custom alias
- Link expiry dates with auto-deactivation
- Password protected links
- Toggle links active/inactive
- Search and filter links by campaign

### Analytics
- Real-time click tracking
- Clicks by date (last 7 days) with Area chart
- Clicks by device (Mobile/Desktop) with Pie chart
- Clicks by browser with Bar chart
- Geo-analytics with country tracking and progress bars
- UTM parameter tracking (utm_source, utm_medium, utm_campaign)
- Campaign grouping and filtering
- Referrer tracking
- CSV export of all link analytics

### Marketing
- A/B link testing: split traffic 50/50 between two URLs and track the winner
- Campaign tagging to group links under campaigns
- Bio page (Linktree-style) at /u/username
- QR code generation and download for every link

### Developer
- REST API with personal API keys (trx_ prefix)
- API key management: generate, regenerate, delete
- Programmatic link shortening via Bearer token

### Auth
- JWT authentication
- Forgot password and reset password flow
- Username validation with alphanumeric and underscore support

### Performance and Security
- Redis caching layer for fast redirects
- Rate limiting on shorten endpoint (10 req/min per IP)
- bcrypt password hashing
- Input validation with express-validator

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18, Tailwind CSS, Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Cache | Redis |
| Auth | JWT, bcrypt |
| Deployment | Vercel (frontend) + Render (backend) |
| Analytics | IP Geolocation API, UAParser.js |

## API Reference

### Auth
- POST /api/auth/register
- POST /api/auth/login
- GET  /api/auth/me
- POST /api/auth/forgot-password
- POST /api/auth/reset-password/:token

### Links
- POST   /api/links/shorten
- GET    /api/links
- PUT    /api/links/:id
- DELETE /api/links/:id
- PUT    /api/links/:id/toggle
- PUT    /api/links/:id/password
- GET    /api/links/:id/stats
- GET    /api/links/:id/qr

### A/B Testing
- POST   /api/abtests
- GET    /api/abtests
- DELETE /api/abtests/:id
- GET    /ab/:shortCode

### API Keys
- POST   /api/apikeys
- GET    /api/apikeys
- DELETE /api/apikeys

## Local Setup

Clone the repo and install dependencies:

    git clone https://github.com/Yachna-123/traxly.git
    cd traxly
    cd server && npm install && node index.js
    cd ../client && npm install && npm start

Environment variables needed in server/.env:

    MONGO_URI=your_mongodb_atlas_uri
    JWT_SECRET=your_jwt_secret
    JWT_EXPIRE=7d
    BASE_URL=http://localhost:5000
    FRONTEND_URL=http://localhost:3000
    REDIS_URL=your_redis_url
    PORT=5000

## Project Structure

    traxly/
    client/
      src/
        pages/       - Landing, Dashboard, Login, Register, ABTestPage, APIKeyPage
        components/  - StatsModal, QRModal, EditModal
        context/     - AuthContext
        api/         - axios instance
    server/
      controllers/   - authController, linkController, abTestController, apiKeyController
      models/        - User, Link, Click, ABTest, APIKey
      routes/        - authRoutes, linkRoutes, abTestRoutes, apiKeyRoutes
      middleware/    - authMiddleware, rateLimiter
      config/        - db.js, redis.js

## What I Learned

- Implementing Redis caching and cache invalidation strategies
- Building geo-analytics using IP geolocation APIs
- UTM parameter tracking and marketing attribution
- Extending JWT auth middleware to support API key authentication
- A/B testing implementation at the infrastructure level
- Debugging production issues on Render free tier
- Building a full SaaS-style product from scratch

## Author

Yachna Shivali
- GitHub: https://github.com/Yachna-123
- LinkedIn: https://linkedin.com/in/yachna-shivali
- LeetCode: https://leetcode.com/u/yachna-shivali

Built with MERN stack, deployed on Vercel + Render