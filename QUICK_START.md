# Quick Start Guide - Preview the Application

## Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all required packages (Next.js, React, MongoDB, etc.)

## Step 2: Set Up Environment Variables

Create a `.env` file in the root directory with the following content:

```env
# MongoDB Connection (use local MongoDB or MongoDB Atlas)
MONGODB_URI=mongodb://localhost:27017/authenticity-check-pro

# JWT Secret (use any random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Admin Credentials
ADMIN_EMAIL=admin@acp.com
ADMIN_PASSWORD=admin123

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Note:** If you don't have MongoDB installed locally, you can:
- Install MongoDB locally, OR
- Use MongoDB Atlas (free cloud database) and update the MONGODB_URI

## Step 3: Start MongoDB (if using local MongoDB)

If you have MongoDB installed locally, make sure it's running:

**Windows:**
```bash
# Usually runs automatically as a service, or start with:
net start MongoDB
```

**Mac/Linux:**
```bash
mongod
```

## Step 4: Run the Development Server

```bash
npm run dev
```

You should see output like:
```
✓ Ready in 2.5s
○ Local:        http://localhost:3000
```

## Step 5: Open in Browser

Open your browser and navigate to:
- **Homepage:** http://localhost:3000
- **Admin Login:** http://localhost:3000/admin/login

## Default Admin Credentials

- **Email:** admin@acp.com
- **Password:** admin123

## Pages to Preview

1. **Homepage** - http://localhost:3000
2. **Code Verification** - http://localhost:3000/verify-code
3. **Image Upload** - http://localhost:3000/verify-image
4. **Brands Directory** - http://localhost:3000/brands
5. **Admin Dashboard** - http://localhost:3000/admin/dashboard (login required)
6. **Admin Brands** - http://localhost:3000/admin/brands
7. **Admin Code Patterns** - http://localhost:3000/admin/code-patterns
8. **Admin Fake Patterns** - http://localhost:3000/admin/fake-patterns
9. **Admin Reference Images** - http://localhost:3000/admin/reference-images
10. **Admin Logs** - http://localhost:3000/admin/logs

## Troubleshooting

### MongoDB Connection Error
If you see MongoDB connection errors:
- Make sure MongoDB is running
- Check your MONGODB_URI in `.env`
- For MongoDB Atlas, ensure your IP is whitelisted

### Port Already in Use
If port 3000 is already in use:
```bash
# Use a different port
npm run dev -- -p 3001
```

### TypeScript Errors
If you see TypeScript errors, make sure all dependencies are installed:
```bash
npm install
```

## What Works Without MongoDB

Even without MongoDB, you can still preview:
- All UI pages and layouts
- Form interactions
- Navigation
- Styling and responsive design

API endpoints will show errors, but the frontend will still render.




