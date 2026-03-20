# API Auth Contract (Frontend)

This document describes the request/response payloads for the public auth endpoints.

Base URL:
- Use your API base URL (example: `process.env.NEXT_PUBLIC_API_URL`)
- All endpoints are under `{baseUrl}/api/...`

Pre-registration OTP flow (new):
1. `POST /api/auth/send-otp` with `{ phone }`
2. `POST /api/auth/verify-otp` with `{ phone, otp }` (returns `verified_token`)
3. `POST /api/register` and pass `verified_token` to set `user.phone_verified_at`

---

## Register (Sign up)

Endpoint:
- `POST /api/register`

Auth:
- None (public)

Request body (tenant registration example):
```json
{
  "account_type": "tenant",
  "email": "user@example.com",
  "username": "user123",
  "password": "Secret123!",
  "phone": "966501234567",
  "verified_token": "<verified_token>",
  "first_name": "John",
  "last_name": "Doe",
  "industry_type": "optional",
  "company_size": "optional",
  "referral_code": "optional",
  "roles": [],
  "permissions": [],
  "recaptcha_token": "<token>"
}
```

Notes:
- `recaptcha_token` is required only when `services.recaptcha.api_enabled` is enabled.
- `account_type` can be `tenant` or `employee`.
- If `verified_token` is provided (from `POST /api/auth/verify-otp`) and is not expired, the backend sets `user.phone_verified_at`.

Request body (employee creation example):
```json
{
  "account_type": "employee",
  "user_id": 123,
  "email": "employee@example.com",
  "username": "emp01",
  "password": "Secret123!",
  "phone": "966501111222",
  "verified_token": "<verified_token>",
  "first_name": "Employee",
  "last_name": "Name",
  "recaptcha_token": "<token>"
}
```

Success response (tenant):
```json
{
  "status": "success",
  "user": { "...": "user object" },
  "token": "<sanctum_token>",
  "membership": {
    "start_date": "YYYY-MM-DD",
    "expire_date": "YYYY-MM-DD"
  }
}
```

Success response (employee):
```json
{
  "status": "success",
  "message": "Employee created under tenant.",
  "employee": { "...": "employee object" }
}
```

Common error responses:
```json
// invalid/expired temp token
{ "status": "error", "error": "invalid_or_expired_temp_token" }
// temp token already registered
{ "status": "error", "error": "already_registered" }
// invalid referral_code
{ "status": "error", "message": "Invalid referral code." }
// employee user_id must be a tenant
{ "status": "error", "message": "Provided user_id must be a tenant account." }
```

---

## Login

Endpoint:
- `POST /api/login`

Auth:
- None (public)

Request body:
```json
{
  "email": "user@example.com",
  "password": "Secret123!",
  "recaptcha_token": "<token>"
}
```

Success response:
```json
{
  "user": { "...": "user object" },
  "token": "<sanctum_token>"
}
```

Error responses:
```json
// wrong credentials
{ "message": "Invalid credentials" }
// banned/inactive account
{ "message": "Account inactive or banned" }
// employee login when tenant inactive
{ "message": "Tenant is inactive; employee login disabled" }
```

---

## Send OTP (WhatsApp)

Endpoint:
- `POST /api/auth/send-otp`

Auth:
- None (public)

Request body:
```json
{
  "phone": "966501234567"
}
```

Success response:
```json
{ "success": true, "message": "OTP sent." }
```

Rate-limit / error response:
```json
{
  "success": false,
  "error": "rate_limit_exceeded",
  "message": "Too many OTP requests. Try again later."
}
```

---

## Verify OTP (phone verification)

Endpoint:
- `POST /api/auth/verify-otp`

Auth:
- None (public)

Request body:
```json
{
  "phone": "966501234567",
  "otp": "12345"
}
```

Success response:
```json
{
  "success": true,
  "message": "Phone verified.",
  "verified_token": "<verified_token>"
}
```

Error responses:
```json
{
  "success": false,
  "error": "otp_invalid",
  "message": "Invalid OTP."
}
```

Possible `error` values:
- `otp_invalid`
- `otp_expired`
- `too_many_attempts`
- `otp_not_found`

---

## Forgot password (send reset code)

Endpoint:
- `POST /api/auth/forgot-password`

Auth:
- None (public)

Request body (email method):
```json
{
  "method": "email",
  "identifier": "user@example.com",
  "recaptcha_token": "<token>"
}
```

Request body (phone method):
```json
{
  "method": "phone",
  "identifier": "501234567",
  "country_code": "+966",
  "recaptcha_token": "<token>"
}
```

Success response:
```json
{
  "message": "Reset code sent successfully (Attempt X/3)",
  "via": "email|phone",
  "attempts_used": 1,
  "attempts_remaining": 2
}
```

Error responses:
```json
{ "message": "User not found" }
```

Rate-limit error responses:
```json
{ "message": "Too many attempts. Try again later" }
{ "message": "You have reached the maximum 3 attempts" }
```

---

## Verify reset code (reset password)

Endpoint:
- `POST /api/auth/verify-reset-code`

Auth:
- None (public)

Request body:
```json
{
  "code": "12345",
  "new_password": "NewPass123!",
  "new_password_confirmation": "NewPass123!",
  "recaptcha_token": "<token>"
}
```

Success response:
```json
{
  "message": "Password reset successful"
}
```

Error responses:
```json
{ "message": "Invalid or expired code" }
{ "message": "User not found" }
```

