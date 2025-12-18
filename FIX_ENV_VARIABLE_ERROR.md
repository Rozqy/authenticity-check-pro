# Fix: "Invalid characters" Error in Vercel Environment Variables

## The Problem

You're getting this error:
> "The name contains invalid characters. Only letters, digits, and underscores are allowed. Furthermore, the name should not start with a digit."

This happens when the **Key** (variable name) has invalid characters.

## ✅ Correct Variable Names (Copy These Exactly)

When adding environment variables in Vercel, use these **exact** names:

1. `MONGODB_URI` (not `MONGODB URI` or `MONGODB-URI`)
2. `JWT_SECRET` (not `JWT SECRET` or `JWT-SECRET`)
3. `ADMIN_EMAIL` (not `ADMIN EMAIL` or `ADMIN-EMAIL`)
4. `ADMIN_PASSWORD` (not `ADMIN PASSWORD` or `ADMIN-PASSWORD`)
5. `NODE_ENV` (not `NODE ENV` or `NODE-ENV`)

## ❌ Common Mistakes

- ❌ `MONGODB URI` (has a space)
- ❌ `MONGODB-URI` (has a hyphen - use underscore instead)
- ❌ `MONGODB_URI ` (has trailing space)
- ❌ ` MongoDB_URI` (has leading space)
- ❌ `1MONGODB_URI` (starts with a number)

## ✅ How to Fix

1. **Delete the variable** that has the error (if you already created it)
2. **Click "Add New"** again
3. **Copy and paste** the exact variable name from the list above
4. **Make sure there are NO spaces** before or after the name
5. **Use underscores (_)** not hyphens (-)

## Step-by-Step Fix

### For MONGODB_URI:

1. In the **Key** field, type exactly: `MONGODB_URI`
   - All uppercase
   - Underscore between words
   - No spaces
   - No hyphens

2. In the **Value** field, paste your MongoDB connection string

3. Select environments (Production, Preview, Development)

4. Click **Save**

### Repeat for each variable:

- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `NODE_ENV`

## Quick Checklist

- [ ] Variable name is all uppercase
- [ ] Uses underscores (_) not hyphens (-)
- [ ] No spaces anywhere in the name
- [ ] No leading or trailing spaces
- [ ] Doesn't start with a number
- [ ] Matches exactly one of the 5 variable names above

## Still Having Issues?

If you're still getting the error:

1. **Clear the Key field completely**
2. **Type the name manually** (don't copy from somewhere that might have hidden characters)
3. **Double-check** there are no spaces
4. **Make sure** you're typing in the "Key" field, not the "Value" field

## Example Screenshot Description

When adding a variable, you should see:

```
┌─────────────────────────────────────┐
│ Add Environment Variable            │
├─────────────────────────────────────┤
│ Key: MONGODB_URI                    │ ← Type here (no spaces!)
│                                     │
│ Value: mongodb+srv://...            │ ← Your connection string
│                                     │
│ Environment:                        │
│ ☑ Production                        │
│ ☑ Preview                           │
│ ☑ Development                       │
│                                     │
│ [Cancel]  [Save]                    │
└─────────────────────────────────────┘
```

The **Key** field should have exactly: `MONGODB_URI` (no spaces, underscores only)

---

**After fixing, remember to redeploy your application!**
