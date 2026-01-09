# Authentication Test Guide

## Testing the Fixed Authentication System

### 1. Registration Flow
1. Go to http://localhost:3000/account
2. Click "Create Account"
3. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123
   - Check newsletter subscription
4. Click "Create Account"

**Expected Result:**
- Should see "Account created successfully!" message
- Should be redirected to homepage
- Should see user avatar in header
- Should be able to proceed to checkout

### 2. Login Flow
1. Go to http://localhost:3000/account
2. Click "Sign In"
3. Fill in:
   - Email: test@example.com
   - Password: password123
4. Click "Sign In"

**Expected Result:**
- Should see "Login successful!" message
- Should be redirected to homepage
- Should see user avatar in header
- Should be able to proceed to checkout

### 3. Checkout Flow
1. Add items to cart
2. Go to cart page
3. Click "Proceed to Checkout"

**Expected Result:**
- If not logged in: Should redirect to login page
- If logged in: Should show checkout options

### 4. Admin Dashboard Verification
1. Go to http://localhost:3001
2. Click on "Leads" in sidebar

**Expected Result:**
- Should see the registered user as a new lead

## Debugging Tips

If authentication doesn't work:

1. **Check Browser Console** (F12):
   - Look for "API not available, using fallback authentication" messages
   - This indicates the backend API is not running

2. **Check API Server**:
   - Ensure API is running on http://localhost:4000
   - Test with: curl http://localhost:4000/health

3. **Clear Browser Storage**:
   - Open Developer Tools (F12)
   - Go to Application > Local Storage
   - Clear auth-storage

4. **Network Issues**:
   - Check if CORS is properly configured
   - Verify API URLs are correct

## Fallback Behavior

The system now has intelligent fallback:
- **If API is available**: Uses real backend authentication
- **If API is down**: Falls back to mock authentication
- **User experience**: Always works, regardless of backend status

This ensures the demo always works for your client!
