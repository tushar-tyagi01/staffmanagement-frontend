# Setup Link Email Sending Implementation

## 🔧 Backend Implementation Required

Your backend needs to implement the following endpoint to send the setup link via email:

### Endpoint: POST `/employees/send-setup-link`

**Request Body:**

```json
{
  "email": "employee@example.com",
  "setupLink": "http://your-domain.com/setup-password?email=employee@example.com&employeeId=123",
  "employeeName": "John Doe"
}
```

**Response (Success - 200):**

```json
{
  "message": "Setup link sent successfully",
  "success": true
}
```

**Response (Error - 400/500):**

```json
{
  "message": "Failed to send email",
  "success": false
}
```

### Backend Implementation Example (Node.js/Express)

```javascript
// In your employees router/controller

// POST /employees/send-setup-link
router.post("/send-setup-link", async (req, res) => {
  try {
    const { email, setupLink, employeeName } = req.body;

    // Validate inputs
    if (!email || !setupLink) {
      return res.status(400).json({
        message: "Email and setup link are required",
      });
    }

    // Send email using your email service (Nodemailer, SendGrid, etc.)
    const emailContent = `
      <h2>Welcome to Our Company, ${employeeName}!</h2>
      <p>You have been added to our staff management system.</p>
      
      <h3>Next Steps:</h3>
      <ol>
        <li>Click the setup link below</li>
        <li>Enter the 6-digit OTP sent to this email</li>
        <li>Create your secure password</li>
        <li>Login to the system</li>
      </ol>

      <p><strong>Your Setup Link:</strong></p>
      <p><a href="${setupLink}" style="background: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Complete Setup
      </a></p>

      <p>Or copy this link: <code>${setupLink}</code></p>

      <hr>
      <p style="color: #666; font-size: 12px;">
        This link will expire in 24 hours. If you didn't request this, please contact your administrator.
      </p>
    `;

    // Example with Nodemailer
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Welcome! Complete Your Account Setup",
      html: emailContent,
    });

    res.json({
      message: "Setup link sent successfully",
      success: true,
    });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({
      message: "Failed to send email",
      success: false,
    });
  }
});
```

## 🎯 Frontend Flow - Now Fully Implemented

### Step 1: Admin Adds Employee

```
1. Navigate to Employees → Add New Employee
2. Fill in employee details
3. Click "Save Employee"
```

### Step 2: Success Modal with Two Options

After successful creation, you see:

```
✅ Employee Added Successfully!
📧 Email: employee@example.com

┌─────────────────────────────────────┐
│ 📧 Send Setup Link via Email        │ ← PRIMARY ACTION
└─────────────────────────────────────┘

Or copy the link manually:
[Copy Link] button
```

### Step 3A: Auto Send via Email (Recommended)

```
- Click "Send Setup Link via Email" button
- System sends email automatically
- Redirects to Employees list
- Employee receives setup link in email
```

### Step 3B: Manual Copy & Send

```
- Click "Copy Link" button
- Copy the setup link to clipboard
- Send via your preferred method
```

## 📧 Email Template Recommendation

The backend should send an email with:

```
Subject: Welcome! Complete Your Account Setup

---

Dear [Employee Name],

Welcome to [Company Name]! You've been added to our staff management system.

To get started, follow these steps:

1. Click the link below or copy it into your browser
2. Enter the 6-digit code sent to this email
3. Create a strong password
4. Login to access the system

[COMPLETE SETUP] (button linking to setup page)

Direct Link: [setup-link]

Password Requirements:
- Minimum 8 characters
- Uppercase and lowercase letters
- At least one number
- At least one special character (@$!%*?&)

Questions? Contact the HR department.

---
```

## 🔐 Security Considerations

1. **Email Verification**: Only registered employees can set up accounts
2. **Link Expiration**: Consider adding expiration time to setup links (e.g., 24 hours)
3. **Rate Limiting**: Limit resend OTP attempts
4. **HTTPS Only**: Always use HTTPS for setup links
5. **OTP Validation**: Backend validates OTP before password creation

## 🧪 Testing the Complete Flow

### Test Scenario 1: Send via Email

```
1. Add employee with real/test email
2. Click "Send Setup Link via Email"
3. Check email for setup link
4. Click link in email
5. Enter OTP (check console/logs for OTP)
6. Create password
7. Login
```

### Test Scenario 2: Manual Copy & Send

```
1. Add employee
2. Click "Copy Link"
3. Manually paste in browser or email
4. Follow setup steps
```

## ✅ Troubleshooting

**Email not sending?**

- Check backend email service is configured
- Verify SMTP credentials
- Check email logs for errors

**Link not working?**

- Verify setup link URL is correct
- Check email parameter is URL encoded
- Test directly in browser: `/setup-password?email=test@example.com&employeeId=123`

**OTP not received?**

- Check spam folder
- Verify OTP generation is working
- Check email service logs

## 📊 API Endpoints Summary

| Method | Endpoint                     | Purpose                             |
| ------ | ---------------------------- | ----------------------------------- |
| POST   | `/employees`                 | Create employee (triggers OTP send) |
| POST   | `/employees/send-setup-link` | Send setup link via email           |
| POST   | `/auth/sendotp`              | Resend OTP                          |
| POST   | `/auth/verify-otp`           | Verify OTP                          |
| POST   | `/auth/create-password`      | Create password                     |

## 🚀 Next Steps

1. **Implement backend endpoint** `/employees/send-setup-link`
2. **Configure email service** (Nodemailer, SendGrid, etc.)
3. **Test email sending** with a test email address
4. **Set up email templates** for consistency
5. **Add error handling** for email failures
6. **Monitor email logs** for issues

## 📝 Example: Using SendGrid

```javascript
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: email,
  from: "noreply@company.com",
  subject: "Welcome! Complete Your Account Setup",
  html: emailContent,
};

await sgMail.send(msg);
```

## 📝 Example: Using Gmail with Nodemailer

```javascript
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD, // Use app password, not account password
  },
});

await transporter.sendMail({
  from: process.env.GMAIL_USER,
  to: email,
  subject: "Welcome! Complete Your Account Setup",
  html: emailContent,
});
```
