# OTP Verification & Password Setup Flow

## Overview

A complete flow has been implemented to allow newly added employees to verify their OTP and create a secure password.

## Complete Implementation

### 1. **Improved SetupPassword Page** (`src/pages/SetupPassword.jsx`)

This is where employees complete their account setup after being added to the system.

#### What's Fixed:

- ✅ OTP verification button now works properly
- ✅ Form validates only current step fields
- ✅ Better error messages and visual feedback
- ✅ Password strength indicator works smoothly
- ✅ Form resets between steps

#### Two-Step Process:

- **Step 1: Verify OTP**
  - Employees enter the 6-digit OTP sent to their email
  - OTP is verified via `/auth/verify-otp` API endpoint
  - Shows countdown timer for resend option (60 seconds)
  - Can resend OTP if not received

- **Step 2: Create Password**
  - After OTP verification, employees create a secure password
  - Password requirements:
    - Minimum 8 characters
    - Must include uppercase letter
    - Must include lowercase letter
    - Must include number
    - Must include special character (@$!%\*?&)
  - Visual password strength indicator
  - Confirm password field to prevent typos
  - After creation, redirected to login page

#### URL Pattern:

```
/setup-password?email=employee@example.com&employeeId=123
```

### 2. **Updated AddEmployee Flow** (`src/pages/AddEmployee.jsx`)

After successfully adding an employee, a modal displays with:

- ✅ Success confirmation
- 📧 Employee email address
- 🔗 Setup link (auto-generated and ready to copy)
- Copy button to easily share the link
- Options to add another employee or go back to list

#### What Happens:

1. Admin/HR fills employee form and clicks "Save Employee"
2. Employee is created in the database
3. OTP is automatically sent to employee's email
4. Success modal appears with the setup link
5. Admin can copy and share the setup link with the employee

### 3. **New API Function** (`src/api/employees.js`)

Added `sendSetupLink` function:

```javascript
sendSetupLink: (data) => api.post("/employees/send-setup-link", data);
```

Sends setup link via email with:

- Employee email address
- Full setup link URL
- Employee name for personalization

### 4. **Enhanced Modal Component** (`src/components/common/Modal.jsx`)

Added `showHeader` prop to optionally hide modal header for custom layouts.

### 5. **New Route** (`src/routes/index.jsx`)

```javascript
{
  path: "/setup-password",
  element: (
    <SuspenseWrapper>
      <SetupPassword />
    </SuspenseWrapper>
  ),
}
```

### 4. **Enhanced Modal Component** (`src/components/common/Modal.jsx`)

Added `showHeader` prop to optionally hide the header (used for the success modal).

## API Endpoints Used

1. **Send OTP** (Already working)
   - POST `/auth/sendotp`
   - Payload: `{ email }`
   - Sends 6-digit OTP to employee email

2. **Verify OTP**
   - POST `/auth/verify-otp`
   - Payload: `{ email, otp }`
   - Returns: Success/failure response

3. **Create Password**
   - POST `/auth/create-password`
   - Payload: `{ email, password }`
   - Returns: Success/failure response

## Complete User Journey

### For Admin/HR:

```
1. Navigate to Employees → Add New Employee
2. Fill in employee details (name, email, phone, department, etc.)
3. Click "Save Employee"
4. Success modal appears with setup link
5. Copy the setup link
6. Send the link to employee via email
```

### For New Employee:

```
1. Receive email with setup link
2. Click the link (opens /setup-password page)
3. Enter 6-digit OTP from email
4. Click "Verify OTP"
5. Enter new password (meeting requirements)
6. Confirm password
7. Click "Create Password"
8. Redirected to login page
9. Login with email and newly created password
```

## Key Features

✅ **Two-factor verification** - Email OTP confirmation before password creation
✅ **Secure passwords** - Strong password requirements enforced
✅ **User-friendly** - Clear instructions, progress indicator, password strength checker
✅ **Mobile responsive** - Works on all device sizes
✅ **Dark mode support** - Full dark mode support throughout
✅ **Error handling** - Clear error messages for failed operations
✅ **Resend option** - 60-second countdown for resending OTP
✅ **Copy to clipboard** - Easy link sharing for admins
✅ **Auto-redirect** - Automatic redirects after successful operations

## Visual Components

### SetupPassword Page Features:

- Progress indicator (Step 1: Verify OTP, Step 2: Create Password)
- Email display banner
- OTP input field with validation
- Password strength indicator (5-point checker)
- Password requirements helper text
- Resend OTP button with countdown
- Success messages and error handling

### AddEmployee Success Modal Features:

- Green checkmark icon
- Employee email confirmation
- Complete setup link in copyable code block
- Copy to clipboard button with feedback
- Instructions for admins
- Options to add another employee or continue

## Testing the Flow

1. **Add an Employee**
   - Go to Employees → Add New Employee
   - Fill in test details (make sure email is correct)
   - Click "Save Employee"
   - Modal appears with setup link

2. **Share Setup Link**
   - Copy the setup link from modal
   - Send to employee (or test with your own email if running locally)

3. **Verify OTP**
   - Check email for OTP
   - Open setup link (or manually navigate to /setup-password?email=...&employeeId=...)
   - Enter OTP in the form
   - Click "Verify OTP"

4. **Create Password**
   - Enter password meeting all requirements
   - Confirm password
   - Click "Create Password"
   - You'll be redirected to login

5. **Login**
   - Use email and new password to login
   - Success!

## Environment Configuration

Make sure your backend is configured to:

1. Generate and send OTP via email when employee is created
2. Handle OTP verification endpoint
3. Handle password creation endpoint
4. Send verification emails with OTP

## Future Enhancements

- [ ] Email verification option for employees who don't receive OTP
- [ ] Password reset functionality
- [ ] Multi-language support
- [ ] SMS OTP as alternative (if needed)
- [ ] Setup completion tracking in admin panel
- [ ] Automated email templates for setup link

## Troubleshooting

**"Invalid setup link" message**

- Check that email parameter is passed in URL
- Verify employee was actually created in database

**OTP not received**

- Check email spam folder
- Click "Resend Code" button
- Verify backend email service is configured

**Password creation fails**

- Ensure password meets all requirements (8+ chars, uppercase, lowercase, number, special char)
- Check passwords match
- Verify backend is running

**Can't login after password creation**

- Ensure you used the correct email
- Try password reset if available
- Check backend logs for issues
