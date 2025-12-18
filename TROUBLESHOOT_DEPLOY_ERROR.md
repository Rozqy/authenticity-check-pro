# Troubleshooting: "Invalid characters" Error When Deploying

## Is This About the Project Name or Environment Variable?

The error can appear in two places:

1. **Project Name** (when importing/creating project in Vercel)
2. **Environment Variable Name** (when adding variables)

Let's fix both scenarios:

---

## Scenario 1: Error When Creating/Importing Project in Vercel

If you're getting the error when clicking "Deploy" or "Import Project", it's about the **Project Name**.

### The Problem

Your folder/repository name is `Authenticity Check Pro` which has **spaces** - Vercel doesn't allow spaces in project names.

### ✅ Solution: Change Project Name in Vercel

When importing your GitHub repository to Vercel:

1. **Import your repository** from GitHub
2. **In the "Project Name" field**, change it to:
   - `authenticity-check-pro` (with hyphens)
   - OR `authenticity_check_pro` (with underscores)
   - OR `authenticitycheckpro` (no spaces)

**Valid project names:**
- ✅ `authenticity-check-pro`
- ✅ `authenticity_check_pro`
- ✅ `authenticitycheckpro`
- ✅ `AuthenticityCheckPro`

**Invalid project names:**
- ❌ `Authenticity Check Pro` (has spaces)
- ❌ `Authenticity-Check-Pro` (if it starts with capital - some restrictions)

### Step-by-Step Fix:

1. Go to Vercel dashboard
2. Click **"Add New Project"**
3. Import your GitHub repository
4. **Before clicking Deploy**, look for **"Project Name"** field
5. Change it from `Authenticity Check Pro` to `authenticity-check-pro`
6. Then click **"Deploy"**

---

## Scenario 2: Error When Adding Environment Variable

If you're getting the error when adding an environment variable, try these fixes:

### Fix 1: Check for Hidden Characters

1. **Delete the variable** completely
2. **Clear your browser cache** or try in incognito mode
3. **Type the name manually** character by character:
   - `M` `O` `N` `G` `O` `D` `B` `_` `U` `R` `I`
4. Don't copy-paste - type it fresh

### Fix 2: Try a Different Browser

Sometimes browser extensions or autofill can add hidden characters:
- Try Chrome, Firefox, or Edge
- Use incognito/private mode

### Fix 3: Check the Exact Field

Make sure you're typing in the **"Key"** field, not the **"Value"** field:
- **Key** = variable name (`MONGODB_URI`)
- **Value** = the actual value (your connection string)

### Fix 4: Try Adding Variables After Deployment

Sometimes it's easier to:
1. Deploy first (without environment variables)
2. Then add environment variables in Settings
3. Then redeploy

---

## Quick Test: Which Scenario Are You In?

**Answer these questions:**

1. **When does the error appear?**
   - [ ] When clicking "Deploy" or "Import Project" → **Scenario 1 (Project Name)**
   - [ ] When clicking "Save" on an environment variable → **Scenario 2 (Variable Name)**

2. **What page are you on?**
   - [ ] "Import Project" or "New Project" page → **Scenario 1**
   - [ ] "Settings" → "Environment Variables" page → **Scenario 2**

---

## Most Likely Solution

Based on you saying "clicked deploy", it's probably **Scenario 1 - Project Name**.

### Quick Fix:

1. In Vercel, when importing your repo
2. Look for **"Project Name"** or **"Configure Project"**
3. Change the name to: `authenticity-check-pro`
4. Click Deploy

---

## Still Not Working?

If it's still not working, try this:

1. **Screenshot the error** - where exactly does it appear?
2. **Check the exact field** - is it asking for:
   - Project name?
   - Environment variable name?
   - Something else?

3. **Try this workaround:**
   - Deploy with a simple name like `acp` or `auth-check`
   - You can rename the project later in Settings

---

## Alternative: Deploy via Vercel CLI

If the web interface keeps giving errors, try the CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (it will prompt for project name)
vercel

# For production
vercel --prod
```

The CLI will let you set the project name interactively.

---

**Which scenario matches your situation?** Let me know and I can provide more specific help!
