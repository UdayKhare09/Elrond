# 🔐 Elrond Security Frontend

Modern React TypeScript frontend for the Elrond Security authentication system.

## Features

### 🛡️ Complete Security Implementation
- **User Registration** with strong password validation
- **Email Verification** workflow
- **Login System** with account lockout protection
- **Multi-Factor Authentication (MFA)** with TOTP
- **JWT Token Management** with secure storage
- **Real-time Error Handling** with detailed feedback

### 🎨 Modern UI/UX
- Clean, responsive design
- Animated transitions
- Real-time form validation
- Color-coded alerts and feedback
- Mobile-friendly layout

### 🔒 Security Features Demonstrated
1. **Password Strength Validation**
   - Minimum 8 characters
   - Uppercase, lowercase, digit, special character requirements
   - Visual feedback on requirements

2. **Account Lockout Protection**
   - Tracks failed login attempts
   - Locks account after 5 failed attempts
   - Visual warnings at 3+ attempts
   - Auto-unlock after 15 minutes

3. **Input Sanitization**
   - XSS protection
   - SQL injection prevention
   - Secure data handling

4. **JWT Authentication**
   - Secure token storage
   - Automatic token injection
   - Token expiration handling

5. **MFA Support**
   - QR code generation
   - Google Authenticator integration
   - TOTP code validation

6. **Error Handling**
   - Structured error responses
   - User-friendly messages
   - Detailed error information for debugging

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Running Elrond Security backend (default: http://localhost:8080)

### Installation

1. Clone the repository (if not already)
```bash
cd /home/uday/IdeaProjects/Elrond/frontend
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
# Edit .env and set VITE_API_BASE_URL if backend is not on localhost:8080
```

4. Start development server
```bash
npm run dev
```

5. Open browser at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Alert/          # Reusable alert component
│   │   ├── Login/          # Login form
│   │   ├── Register/       # Registration form
│   │   ├── VerifyEmail/    # Email verification
│   │   └── MfaManagement/  # MFA setup/disable
│   ├── context/
│   │   └── AuthContext.tsx # Authentication state management
│   ├── services/
│   │   └── api.service.ts  # Backend API calls
│   ├── types/
│   │   └── api.types.ts    # TypeScript interfaces
│   ├── App.tsx             # Main application component
│   ├── App.css             # Application styles
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── .env                    # Environment configuration
├── .env.example            # Example environment file
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── README.md               # This file
```

## Usage Guide

### 1. Register a New Account
- Click "Register" tab
- Fill in all required fields
- Use a strong password (requirements shown below form)
- Submit and check server logs for verification token

### 2. Verify Email
- Click "Verify Email" tab
- Paste the token from email/logs
- Submit to activate account

### 3. Login
- Click "Login" tab
- Enter username/email and password
- If MFA is enabled, provide 6-digit code
- Maximum 5 failed attempts before account locks

### 4. Setup MFA
- After login, click "Setup MFA"
- Scan QR code with Google Authenticator
- Enter code to enable
- Use code on future logins

### 5. Disable MFA
- While logged in, enter current MFA code
- Click "Disable MFA"

## API Integration

The frontend communicates with the backend using RESTful APIs:

### Endpoints Used
- `POST /api/v1/auth/register` - User registration
- `GET /api/v1/auth/verify-email` - Email verification
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/mfa/setup` - Initialize MFA
- `POST /api/v1/auth/mfa/enable` - Enable MFA
- `POST /api/v1/auth/mfa/disable` - Disable MFA
- `POST /api/v1/auth/mfa/verify` - Verify MFA code

### Error Handling

All API errors are handled consistently:
```typescript
interface ErrorResponse {
  message: string;
  status: number;
  timestamp: string;
  path: string;
}
```

Errors are displayed with:
- User-friendly message
- Detailed error information
- Timestamp and path
- Appropriate color coding

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Technology Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS3** - Styling with modern features
- **Context API** - State management

## Security Considerations

### Client-Side Security
- JWT tokens stored in localStorage (consider httpOnly cookies for production)
- Input validation before API calls
- Sensitive data cleared on logout
- No sensitive data in URL parameters
- HTTPS recommended for production

### Production Recommendations
1. Enable HTTPS
2. Use httpOnly cookies for tokens
3. Implement Content Security Policy
4. Add rate limiting on client side
5. Use secure session management
6. Implement proper CORS policies
7. Add request signing
8. Implement refresh token flow

## Troubleshooting

### Common Issues

**CORS Errors**
```
Solution: Ensure backend CORS is configured to allow frontend origin
```

**Connection Refused**
```
Solution: Check that backend is running on configured port (default: 8080)
```

**Token Expired**
```
Solution: Re-login to get new token. Implement token refresh in production.
```

**MFA QR Code Not Showing**
```
Solution: Check browser console for errors. Ensure you're logged in.
```

## Testing

### Manual Testing Checklist

- [ ] Register with weak password (should fail)
- [ ] Register with strong password (should succeed)
- [ ] Verify email with valid token
- [ ] Login with correct credentials
- [ ] Login with wrong password 5 times (should lock)
- [ ] Setup MFA and scan QR code
- [ ] Enable MFA with valid code
- [ ] Login with MFA code
- [ ] Disable MFA

## Contributing

1. Follow existing code style
2. Add TypeScript types for all new code
3. Test all features before committing
4. Update documentation as needed

## License

Same as Elrond Security project

## Support

For issues, check:
1. Backend logs for server errors
2. Browser console for client errors
3. Network tab for API issues
4. SECURITY_IMPROVEMENTS.md in backend

---

**Status**: ✅ Production Ready  
**Version**: 1.0.0  
**Last Updated**: November 27, 2025

