# Deployment Guide

This guide explains how to deploy ColorGrid to various platforms.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- Git repository

## Environment Variables

### Backend (.env in server folder)
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/colorgrid
JWT_SECRET=your-super-secret-jwt-key-here
PORT=8000
NODE_ENV=production
```

### Frontend (.env in client folder)
```env
VITE_API_URL=https://your-backend-domain.com
```

## MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new account or sign in
3. Create a new cluster (free tier available)
4. Create a database user
5. Get your connection string
6. Replace the connection string in your backend .env file

## Deployment Options

### Option 1: Heroku (Backend) + Vercel (Frontend)

#### Backend on Heroku:
1. Install Heroku CLI
2. Login to Heroku: `heroku login`
3. Create app: `heroku create your-app-name-backend`
4. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI=your-connection-string
   heroku config:set JWT_SECRET=your-jwt-secret
   ```
5. Deploy: `git push heroku main`

#### Frontend on Vercel:
1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`
4. Set environment variables in Vercel dashboard

### Option 2: Render (Full Stack)

1. Create account on [Render](https://render.com)
2. Connect your GitHub repository
3. Create a new Web Service for backend
4. Create a new Static Site for frontend
5. Set environment variables in Render dashboard

### Option 3: DigitalOcean App Platform

1. Create account on [DigitalOcean](https://www.digitalocean.com)
2. Use App Platform to deploy from GitHub
3. Configure build and run commands
4. Set environment variables

## Build Commands

### Backend
```bash
cd server
npm install
npm start
```

### Frontend
```bash
cd client
npm install
npm run build
```

## Environment Configuration

Make sure to update the CORS settings in your backend to allow your frontend domain:

```javascript
// In server/server.js
const cors = require('cors');
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));
```

## SSL Certificate

Most deployment platforms provide SSL certificates automatically. Make sure to:
1. Use HTTPS URLs in production
2. Update Socket.io configuration for secure connections
3. Update CORS settings to allow HTTPS

## Monitoring

Consider adding monitoring tools:
- Error tracking (Sentry)
- Performance monitoring
- Uptime monitoring

## Backup Strategy

1. Set up automated MongoDB backups
2. Version control your code
3. Document your deployment process

## Troubleshooting

### Common Issues:
1. **CORS errors**: Check origin settings
2. **Database connection**: Verify MongoDB URI
3. **Environment variables**: Ensure all required vars are set
4. **Build failures**: Check Node.js version compatibility

### Debugging:
- Check application logs
- Verify environment variables
- Test API endpoints individually
- Check database connectivity
