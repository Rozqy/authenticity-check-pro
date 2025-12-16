# Deployment Guide

This guide will help you deploy Authenticity Check Pro to GitHub and Vercel.

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- MongoDB database (local or MongoDB Atlas)

## Step 1: Push to GitHub

### Initialize Git Repository

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Authenticity Check Pro"

# Add your GitHub repository (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/authenticity-check-pro.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it: `authenticity-check-pro` (or your preferred name)
3. **Don't** initialize with README, .gitignore, or license (we already have these)
4. Copy the repository URL
5. Use the commands above to push your code

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [Vercel](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings
5. Configure environment variables (see below)
6. Click **"Deploy"**

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

## Step 3: Configure Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables, add:

### Required Variables

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/authenticity-check-pro
JWT_SECRET=your-strong-random-secret-key-here
ADMIN_EMAIL=admin@acp.com
ADMIN_PASSWORD=your-secure-admin-password
NODE_ENV=production
```

### Optional Variables (for image storage)

```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Generate JWT Secret

```bash
# On Mac/Linux
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

## Step 4: Set Up MongoDB Atlas (Recommended for Production)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier available)
4. Create a database user
5. Whitelist IP addresses (add `0.0.0.0/0` for Vercel)
6. Get your connection string
7. Add it to Vercel environment variables as `MONGODB_URI`

## Step 5: Seed the Database

After deployment, you need to seed the database with brands and patterns.

### Option A: Run Seed Scripts Locally

```bash
# Connect to your production MongoDB
# Update .env with production MONGODB_URI
npm run seed:all
```

### Option B: Create a Seed API Endpoint (Recommended)

Create `app/api/seed/route.ts` to seed via API (protected with admin auth).

## Step 6: Verify Deployment

1. Visit your Vercel deployment URL
2. Test admin login: `/admin/login`
3. Test product verification: `/verify-code`
4. Check that MongoDB is connected

## Post-Deployment Checklist

- [ ] Environment variables configured in Vercel
- [ ] MongoDB Atlas cluster created and accessible
- [ ] Database seeded with brands and patterns
- [ ] Admin credentials changed from defaults
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Custom domain configured (optional)

## Troubleshooting

### Build Fails

- Check that all dependencies are in `package.json`
- Verify TypeScript compilation errors
- Check Vercel build logs

### MongoDB Connection Issues

- Verify `MONGODB_URI` is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

### Environment Variables Not Working

- Redeploy after adding environment variables
- Check variable names match exactly (case-sensitive)
- Verify no extra spaces in values

## Continuous Deployment

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin main

# Vercel will automatically deploy
```

## Production Best Practices

1. **Change Default Admin Credentials** - Update `ADMIN_EMAIL` and `ADMIN_PASSWORD`
2. **Use Strong JWT Secret** - Generate a secure random string
3. **Enable MongoDB Atlas IP Whitelist** - Restrict access
4. **Monitor Vercel Logs** - Check for errors
5. **Set Up Custom Domain** - Use your own domain name
6. **Enable Analytics** - Track usage in Vercel dashboard

## Support

For issues:
- Check Vercel deployment logs
- Review MongoDB Atlas connection status
- Verify environment variables are set correctly

