# Quick GitHub & Vercel Deployment Guide

## Step 1: Configure Git (One-time setup)

```bash
# Set your Git identity (replace with your info)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `authenticity-check-pro` (or your choice)
3. Description: "Platform for verifying authenticity of drinks, cosmetics, and fragrances"
4. Choose **Public** or **Private**
5. **DO NOT** check "Initialize with README" (we already have files)
6. Click **"Create repository"**

## Step 3: Push to GitHub

```bash
# Add the new file we created
git add env.example

# Create initial commit
git commit -m "Initial commit: Authenticity Check Pro - Complete platform for verifying drinks, cosmetics, and fragrances"

# Add your GitHub repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/authenticity-check-pro.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

**Note:** Replace `YOUR_USERNAME` with your actual GitHub username in the URL above.

## Step 4: Deploy to Vercel

### Option A: Via Vercel Dashboard (Easiest)

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click **"Add New Project"**
4. Import your `authenticity-check-pro` repository
5. Vercel will auto-detect Next.js settings
6. **Add Environment Variables** (see below)
7. Click **"Deploy"**

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (follow prompts)
vercel

# For production
vercel --prod
```

## Step 5: Environment Variables in Vercel

In Vercel Dashboard → Your Project → Settings → Environment Variables, add:

### Required Variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/authenticity-check-pro
JWT_SECRET=generate-a-strong-random-string-here
ADMIN_EMAIL=admin@acp.com
ADMIN_PASSWORD=your-secure-password-here
NODE_ENV=production
```

### Generate JWT Secret:

**Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Mac/Linux:**
```bash
openssl rand -base64 32
```

## Step 6: Set Up MongoDB Atlas (Free)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a free cluster (M0 - Free tier)
4. Create database user (save username/password)
5. **Network Access**: Add IP `0.0.0.0/0` (allows Vercel to connect)
6. Get connection string: Click "Connect" → "Connect your application"
7. Copy the connection string
8. Replace `<password>` with your database password
9. Add to Vercel as `MONGODB_URI`

## Step 7: Seed Database After Deployment

After Vercel deployment is complete:

### Option 1: Run Seed Scripts Locally

```bash
# Update your local .env with production MONGODB_URI
# Then run:
npm run seed:all
```

### Option 2: Create Seed API Endpoint (Recommended)

Create a protected API endpoint to seed via web interface (see DEPLOYMENT.md for details).

## Step 8: Verify Deployment

1. Visit your Vercel URL (e.g., `https://authenticity-check-pro.vercel.app`)
2. Test admin login: `https://your-app.vercel.app/admin/login`
3. Test verification: `https://your-app.vercel.app/verify-code`
4. Check MongoDB connection works

## Important Security Notes

⚠️ **Before going live:**

1. **Change Admin Password** - Update `ADMIN_PASSWORD` in Vercel
2. **Use Strong JWT Secret** - Generate a secure random string
3. **Restrict MongoDB Access** - Use IP whitelist in MongoDB Atlas
4. **Enable HTTPS** - Automatic with Vercel ✅

## Troubleshooting

### Build Fails
- Check Vercel build logs
- Verify all dependencies in `package.json`
- Check TypeScript errors

### MongoDB Connection Issues
- Verify `MONGODB_URI` format is correct
- Check IP whitelist includes `0.0.0.0/0`
- Ensure database user has correct permissions

### Environment Variables Not Working
- Redeploy after adding variables
- Check variable names match exactly
- No extra spaces in values

## Next Steps After Deployment

1. ✅ Test all features
2. ✅ Seed database with brands
3. ✅ Change default admin credentials
4. ✅ Set up custom domain (optional)
5. ✅ Monitor Vercel analytics

## Continuous Deployment

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin main

# Vercel auto-deploys! 🚀
```

---

**Need help?** Check `DEPLOYMENT.md` for detailed instructions.

