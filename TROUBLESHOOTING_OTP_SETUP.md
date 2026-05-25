# Troubleshooting Guide - OTP & Setup Flow

## 🐛 Issues & Solutions

### Issue 1: "Verify OTP" Button Not Working

**Symptoms:**

- Button doesn't respond when clicked
- Form validation errors appear
- Can't proceed to password step

**Solutions:**

#### ✅ Solution 1: Clear Browser Cache

1. Open Developer Tools (F12)
2. Go to Application/Storage tab
3. Clear Cache Storage
4. Clear Cookies
5. Reload page

#### ✅ Solution 2: Check Console for Errors

1. Open Developer Tools (F12)
2. Go to Console tab
3. Check for error messages
4. Look for API call failures
5. Share errors with backend team

#### ✅ Solution 3: Verify OTP Format

- OTP must be exactly 6 digits
- OTP must contain only numbers (0-9)
- Check that you copied OTP correctly from email

**Example Valid OTP:**

```
123456 ✅ Correct
12345  ❌ Too short
12345a ❌ Contains letter
```

#### ✅ Solution 4: Check Backend Connectivity

1. Open Developer Tools (F12)
2. Go to Network tab
3. Try to verify OTP
4. Look for API call to `/auth/verify-otp`
5. Check response status:
   - 200 = Success ✅
   - 400 = Bad request (check OTP format)
   - 401 = Unauthorized
   - 500 = Server error

### Issue 2: OTP Not Received in Email

**Symptoms:**

- No email received after adding employee
- Email goes to spam
- Can't find OTP code

**Solutions:**

#### ✅ Solution 1: Check Spam Folder

- Check email spam/junk folder
- Add sender email to contacts
- Mark email as "Not Spam"

#### ✅ Solution 2: Resend OTP

1. Click "Resend in Xseconds" button on setup page
2. Check email again after 60 seconds
3. Look for new email with fresh OTP

#### ✅ Solution 3: Verify Backend OTP Setup

1. Check that backend is configured to send OTP
2. Verify email service is running
3. Check backend logs for errors
4. Test email sending independently

#### ✅ Solution 4: Check Email Configuration

- Backend email service may not be configured
- Email credentials may be wrong
- Email service quota may be exceeded
- Contact backend team to verify setup

### Issue 3: Setup Link Not Working

**Symptoms:**

- Link doesn't open
- "Invalid setup link" message
- Page redirects to login

**Solutions:**

#### ✅ Solution 1: Verify Email Parameter

Setup link format must include email:

```
✅ Correct: /setup-password?email=test@example.com&employeeId=123
❌ Wrong:   /setup-password
❌ Wrong:   /setup-password?employeeId=123
```

#### ✅ Solution 2: Check Email URL Encoding

If email has special characters, they must be encoded:

```
✅ user+test@example.com → user%2Btest%40example.com
✅ test@company.com → test%40company.com
```

#### ✅ Solution 3: Manual Link Creation

If copy-paste has issues, manually construct:

```
Base: http://localhost:5173/setup-password
Email: employee@example.com
ID: 123

Final: http://localhost:5173/setup-password?email=employee%40example.com&employeeId=123
```

### Issue 4: Password Requirements Not Met

**Symptoms:**

- "Password must contain..." error
- Can't proceed to final step
- Password strength indicator shows red

**Solutions:**

#### ✅ Password Must Include:

- ✅ Minimum 8 characters
- ✅ At least ONE uppercase letter (A-Z)
- ✅ At least ONE lowercase letter (a-z)
- ✅ At least ONE number (0-9)
- ✅ At least ONE special character (@$!%\*?&)

**Valid Examples:**

```
✅ MyPass123!
✅ Secure@Pass99
✅ Test$1234abc
```

**Invalid Examples:**

```
❌ Password123     (no special character)
❌ pass123@       (no uppercase)
❌ PASS@123       (no lowercase)
❌ Pass@12        (only 7 characters)
❌ Abcdef@1       (insufficient variety - needs all 5)
```

### Issue 5: Email Sending Failed

**Symptoms:**

- "Failed to send email" message
- Setup link not sent automatically
- Modal shows error

**Solutions:**

#### ✅ Solution 1: Check Backend Service

1. Verify backend API is running
2. Check backend logs
3. Test endpoint directly with curl/Postman:

```bash
curl -X POST http://localhost:3000/employees/send-setup-link \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "setupLink": "http://localhost:5173/setup-password?email=test@example.com",
    "employeeName": "John Doe"
  }'
```

#### ✅ Solution 2: Verify Email Configuration

- Check backend email service is enabled
- Verify email credentials are correct
- Check email provider quotas
- Test email sending independently

#### ✅ Solution 3: Manual Fallback

If auto-send fails:

1. Click "Copy Link" button
2. Send link manually via email
3. Employee can still complete setup

## 🔄 Complete Flow - Step by Step

### Step 1: Create Employee

```
1. Go to Employees → Add New Employee
2. Fill in all required fields
3. Click "Save Employee"
4. Backend generates OTP
5. Backend sends OTP to email
```

### Step 2: Success Modal Appears

```
Shows employee email and two options:
- "Send Setup Link via Email" (Primary)
- "Copy Link" (Fallback)
```

### Step 3A: Send via Email (Recommended)

```
1. Click "Send Setup Link via Email"
2. Button shows "Sending..."
3. Email is sent to employee
4. Success message appears
5. Redirects to Employees list
```

### Step 3B: Manual Copy (Fallback)

```
1. Click "Copy Link"
2. Link is copied to clipboard
3. Paste in email or share manually
4. Employee receives link
```

### Step 4: Employee Opens Setup Link

```
1. Employee clicks link or pastes in browser
2. SetupPassword page loads
3. Email is pre-filled from URL
4. Ready to enter OTP
```

### Step 5: Employee Enters OTP

```
1. Employee copies OTP from email
2. Pastes/types 6-digit code
3. Clicks "Verify OTP"
4. Backend validates OTP
```

### Step 6: Employee Creates Password

```
1. Enters password meeting requirements
2. Confirms password
3. Password strength indicator shows green
4. Clicks "Create Password"
5. Backend creates account
```

### Step 7: Login

```
1. Redirected to login page
2. Employee enters email and password
3. Successfully logged in
```

## 📱 Testing Checklist

- [ ] Employee added successfully
- [ ] OTP received in email
- [ ] Setup link copy works
- [ ] Setup link opens correctly
- [ ] OTP verification works
- [ ] Password meets requirements
- [ ] Password creation succeeds
- [ ] Can login with new credentials
- [ ] Email sending works (optional)

## 🆘 When to Contact Backend Team

Provide them with:

1. **Error message** from toast notification
2. **Console error** (F12 → Console)
3. **Network error** (F12 → Network tab)
4. **Request payload** (what data was sent)
5. **Response data** (what came back)
6. **Backend logs** (server-side errors)

## 💡 Quick Tips

- ✅ Always check browser console first (F12)
- ✅ Check email spam folder
- ✅ Use "Resend" if OTP not received
- ✅ Clear cache if UI doesn't update
- ✅ Copy-paste OTP carefully (no extra spaces)
- ✅ Create strong passwords with all requirements
- ✅ Use manual copy as fallback if email fails
