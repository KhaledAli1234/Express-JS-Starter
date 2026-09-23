# Express JS Starter

Production-ready Express.js starter with JWT authentication (access/refresh tokens, token revocation), Google OAuth, MongoDB/Mongoose, email verification & OTP flows, Cloudinary/local file uploads, and role-based authorization.

## Features

- 🔐 **Authentication** — email/password signup & login, Google OAuth sign-in/sign-up
- 🎫 **JWT access/refresh tokens** — with per-role signatures (user vs. admin/system) and token revocation via a `jti` blacklist
- 📧 **Email verification & OTP** — email confirmation on signup, forgot-password flow, and a generic verification-code flow with attempt limiting and temporary bans
- 🛡️ **Role-based authorization** — `authentication` (verify identity) and `authorization` (verify role) middlewares, combinable via a single `auth()` helper
- 📁 **File uploads** — local disk storage and Cloudinary, with Joi validation on file type
- ✅ **Request validation** — Joi schemas for every route (body/params/files)
- 🧱 **Reusable DB service layer** — thin wrapper around Mongoose (`find`, `findOne`, `create`, `updateOne`, `findOneAndUpdate`, `deleteOne`, ...) shared by every module
- 🚦 **Security & hardening** — Helmet, CORS, rate limiting, bcrypt password hashing, AES field-level encryption (e.g. phone numbers)

## Tech Stack

Node.js (ESM) · Express 5 · MongoDB / Mongoose · JWT · Joi · Multer · Cloudinary · Nodemailer · bcryptjs · crypto-js

## Project Structure

```
src/
├── app.controller.js         # Express app setup, middleware, route mounting
├── index.js                  # Entry point
├── config/                   # .env files
├── DB/
│   ├── connection.db.js
│   ├── db.service.js         # Generic Mongoose query helpers
│   └── models/                # User, Token
├── middleware/
│   ├── authentication.middleware.js
│   └── validation.middleware.js
├── modules/
│   ├── auth/                 # signup, login, Google OAuth, OTP, forgot password
│   └── user/                 # profile, update, freeze/restore/delete, uploads
└── utils/
    ├── response.js           # asyncHandler, successResponse, globalErrorHandling
    ├── email/                # nodemailer + templates + event-driven sending
    ├── image/                # sharp-based resizing
    ├── multer/                # local & cloud upload configs
    └── security/              # hashing, encryption, JWT helpers
```

## Getting Started

### Prerequisites
- Node.js >= 22
- A running MongoDB instance

### Installation

```bash
git clone https://github.com/USERNAME/express-js-starter.git
cd express-js-starter
npm install
```

### Environment Variables

Copy the example file and fill in your own values:

```bash
cp src/config/.env.example src/config/.env.prod
```

| Variable | Description |
|---|---|
| `PORT` | Server port |
| `DB_URI` | MongoDB connection string |
| `ORIGINS` | Comma-separated allowed CORS origins |
| `SALT` | bcrypt salt rounds |
| `ENCRYPTION_SECRET` | AES secret for field-level encryption |
| `ACCESS_USER_TOKEN_SIGNATURE` / `ACCESS_SYSTEM_TOKEN_SIGNATURE` | JWT access token secrets (user vs. admin) |
| `REFRESH_USER_TOKEN_SIGNATURE` / `REFRESH_SYSTEM_TOKEN_SIGNATURE` | JWT refresh token secrets |
| `ACCESS_TOKEN_EXPIRES_IN` / `REFRESH_TOKEN_EXPIRES_IN` | Token lifetimes, in seconds |
| `EMAIL` / `EMAIL_PASSWORD` | Gmail account used to send emails |
| `WEB_CLIENT_ID` | Google OAuth client ID |
| `CLOUD_NAME` / `API_KEY` / `API_SECRET` | Cloudinary credentials |

### Run

```bash
npm run start:dev   # development, with --watch
npm start            # production
```

The server starts on `http://localhost:<PORT>`.

## API Endpoints

### Auth — `/auth`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/signup` | Register with email & password |
| PATCH | `/auth/confirm-Email` | Confirm email with OTP |
| POST | `/auth/signup/gmail` | Sign up via Google |
| POST | `/auth/login` | Login with email & password |
| POST | `/auth/login/gmail` | Login via Google |
| POST | `/auth/send-code` | Send a verification code |
| POST | `/auth/verify-code` | Verify the code |
| PATCH | `/auth/send-forgot-password` | Send a password-reset OTP |
| PATCH | `/auth/verify-forgot-password` | Verify the reset OTP |
| PATCH | `/auth/reset-forgot-password` | Set a new password |

### User — `/user`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/user` | required | Get own profile |
| GET | `/user/:userId` | — | View a public profile |
| GET | `/user/refresh-token` | refresh token | Issue a new token pair |
| PATCH | `/user` | required | Update basic info |
| PATCH | `/user/password` | required | Change password |
| PATCH | `/user/profile-image` | required | Upload profile image |
| PATCH | `/user/profile-cover-image` | required | Upload cover images |
| DELETE | `/user/:userId/freeze-account` | required | Freeze (soft-delete) account |
| PATCH | `/user/:userId/restore-account` | admin | Restore a frozen account |
| DELETE | `/user/:userId` | admin | Permanently delete account |
| POST | `/user/logout` | required | Logout / revoke token |

## License

ISC
