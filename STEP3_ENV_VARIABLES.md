# Step 3: Adding Environment Variables to Vercel - Detailed Guide

This guide walks you through adding all required environment variables to your Vercel project.

## Part 1: Navigate to Environment Variables

1. **Go to your Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in if needed
   - You should see your project listed

2. **Open Your Project**
   - Click on your project name (`authenticity-check-pro` or whatever you named it)

3. **Go to Settings**
   - Click on the **"Settings"** tab at the top of the page
   - It's next to "Deployments", "Analytics", etc.

4. **Find Environment Variables**
   - In the left sidebar, click **"Environment Variables"**
   - You'll see a page with a table/list of variables (probably empty right now)

---

## Part 2: Generate JWT Secret (Do This First)

Before adding variables, generate your JWT secret.

### On Windows (PowerShell):

1. **Open PowerShell** (press `Windows Key + X`, then select "Windows PowerShell" or "Terminal")

2. **Run this command:**
   ```powershell
   [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
   ```

3. **Copy the output** - it will look something like:
   ```
   aB3xK9mP2vL8nQ5rT1wY7zU4iO6jH0sD9fG2hJ5kL8mN1pQ4rS7tV0wX3yZ6
   ```
   - This is your `JWT_SECRET` - save it somewhere safe!

---

## Part 3: Add Each Environment Variable

For each variable below, follow these steps:

1. Click **"Add New"** or **"Add Environment Variable"** button
2. Enter the **Key** (variable name)
3. Enter the **Value**
4. Select **Environment** (choose "Production", "Preview", and "Development" - or just "Production" for now)
5. Click **"Save"**

### Variable 1: MONGODB_URI

**Key:** `MONGODB_URI`

**Value:** Your MongoDB Atlas connection string from Step 2

Example:
```
mongodb+srv://admin:YourPassword123@cluster0.xxxxx.mongodb.net/authenticity-check-pro?retryWrites=true&w=majority
```

**Important:** 
- Replace `YourPassword123` with your actual MongoDB password
- Replace `cluster0.xxxxx.mongodb.net` with your actual cluster URL
- Make sure the database name `authenticity-check-pro` is in the URL

**Environment:** Select all (Production, Preview, Development)

---

### Variable 2: JWT_SECRET

**Key:** `JWT_SECRET`

**Value:** The random string you generated in Part 2

Example:
```
aB3xK9mP2vL8nQ5rT1wY7zU4iO6jH0sD9fG2hJ5kL8mN1pQ4rS7tV0wX3yZ6
```

**Environment:** Select all (Production, Preview, Development)

---

### Variable 3: ADMIN_EMAIL

**Key:** `ADMIN_EMAIL`

**Value:** `admin@acp.com` (or your preferred admin email)

**Environment:** Select all (Production, Preview, Development)

---

### Variable 4: ADMIN_PASSWORD

**Key:** `ADMIN_PASSWORD`

**Value:** Your secure admin password (NOT the default `admin123` - use a strong password!)

Example: `MySecurePassword123!@#`

**Environment:** Select all (Production, Preview, Development)

**⚠️ Security Note:** Make this password strong and unique!

---

### Variable 5: NODE_ENV

**Key:** `NODE_ENV`

**Value:** `production`

**Environment:** Select only "Production"

---

## Part 4: Verify All Variables Are Added

After adding all variables, you should see a list like this:

```
MONGODB_URI          [Production, Preview, Development]
JWT_SECRET           [Production, Preview, Development]
ADMIN_EMAIL          [Production, Preview, Development]
ADMIN_PASSWORD       [Production, Preview, Development]
NODE_ENV             [Production]
```

---

## Part 5: Redeploy Your Application

**This is crucial!** Environment variables only take effect after redeployment.

### Method 1: Redeploy from Deployments Tab (Recommended)

1. **Go to "Deployments" tab** (at the top of your project page)

2. **Find your latest deployment**
   - You'll see a list of deployments
   - The most recent one is at the top

3. **Click the three dots (⋯)** on the right side of the deployment

4. **Click "Redeploy"**

5. **Confirm** - Click "Redeploy" again in the popup

6. **Wait for deployment** - This takes 2-3 minutes

### Method 2: Trigger New Deployment via Git

If you make any small change and push to GitHub, Vercel will automatically redeploy:

```bash
# Make a small change (like adding a comment)
# Then:
git add .
git commit -m "Trigger redeploy for environment variables"
git push origin main
```

---

## Part 6: Verify Variables Are Working

After redeployment completes:

1. **Check Build Logs:**
   - Go to "Deployments" tab
   - Click on the latest deployment
   - Check the build logs for any errors
   - If you see MongoDB connection errors, double-check your `MONGODB_URI`

2. **Test Your App:**
   - Visit your Vercel URL
   - Try logging into `/admin/login`
   - If login works, your environment variables are set correctly!

---

## Common Issues & Solutions

### Issue: "Variable not found" or "undefined"

**Solution:**
- Make sure you **redeployed** after adding variables
- Check that variable names match exactly (case-sensitive)
- Verify you selected the correct environment (Production)

### Issue: MongoDB connection fails

**Solution:**
- Double-check your `MONGODB_URI` format
- Make sure password is correct (no extra spaces)
- Verify database name is in the connection string
- Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`

### Issue: Can't find Environment Variables section

**Solution:**
- Make sure you're in the **Settings** tab
- Look in the left sidebar menu
- You need to be the project owner or have admin access

### Issue: Variables show but don't work

**Solution:**
- **Redeploy** - This is the most common issue!
- Check that values don't have extra spaces at the beginning or end
- Verify you're testing on the correct environment (Production vs Preview)

---

## Quick Checklist

- [ ] Generated JWT_SECRET using PowerShell command
- [ ] Added MONGODB_URI with correct connection string
- [ ] Added JWT_SECRET with generated value
- [ ] Added ADMIN_EMAIL
- [ ] Added ADMIN_PASSWORD (strong password, not default!)
- [ ] Added NODE_ENV = production
- [ ] Selected correct environments for each variable
- [ ] Redeployed application
- [ ] Verified deployment completed successfully
- [ ] Tested admin login to confirm variables work

---

## What's Next?

After completing Step 3:

✅ **Step 4:** Seed your database with brands and patterns  
✅ **Step 5:** Test your live application

See `POST_GITHUB_STEPS.md` for the complete guide.

---

**Need help?** If you're stuck on any step, check:
- Vercel documentation: https://vercel.com/docs/environment-variables
- Your deployment logs in Vercel dashboard
- MongoDB Atlas connection status
