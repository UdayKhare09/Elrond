# Elrond Authentication System

A complete authentication system with email verification, username/email login, password hashing (BCrypt), and TOTP-based MFA (Multi-Factor Authentication).

## Features

- ✅ User registration with email verification
- ✅ Login with username OR email
- ✅ BCrypt password hashing
- ✅ JWT-based authentication
- ✅ TOTP-based MFA (Google Authenticator compatible)
- ✅ Comprehensive error handling
- ✅ Industry-standard security practices

## Tech Stack

- **Spring Boot 3.5.7**
- **Spring Security** - Authentication & Authorization
- **JWT (JJWT 0.12.6)** - Token-based authentication
- **Google Authenticator (1.5.0)** - TOTP MFA
- **BCrypt** - Password hashing
- **PostgreSQL** - Database
- **Spring Mail** - Email verification

## API Endpoints

### Authentication Endpoints

#### 1. Register New User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "message": "Registration successful. Please check your email to verify your account."
}
```

#### 2. Verify Email
```http
GET /api/v1/auth/verify-email?token=<verification-token>
```

**Response:**
```json
{
  "message": "Email verified successfully. You can now login."
}
```

#### 3. Login (Username or Email)
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "usernameOrEmail": "johndoe",  // or "user@example.com"
  "password": "SecurePass123!"
}
```

**Response (No MFA):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "mfaRequired": false
}
```

**Response (MFA Enabled):**
```json
{
  "mfaToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "mfaRequired": true
}
```

#### 4. Login with MFA Code
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "usernameOrEmail": "johndoe",
  "password": "SecurePass123!",
  "totpCode": "123456"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "mfaRequired": false
}
```

### MFA Endpoints (Require Authentication)

#### 5. Setup MFA
```http
POST /api/v1/auth/mfa/setup
Authorization: Bearer <token>
```

**Response:**
```json
{
  "secret": "JBSWY3DPEHPK3PXP",
  "qrCodeUrl": "otpauth://totp/Elrond:johndoe?secret=JBSWY3DPEHPK3PXP&issuer=Elrond"
}
```

Use the QR code URL to generate a QR code and scan it with Google Authenticator.

#### 6. Enable MFA
```http
POST /api/v1/auth/mfa/enable?totpCode=123456
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "MFA enabled successfully"
}
```

#### 7. Verify MFA During Login
```http
POST /api/v1/auth/mfa/verify
Content-Type: application/json

{
  "totpCode": "123456",
  "mfaToken": "<mfa-token-from-login>"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "mfaRequired": false
}
```

#### 8. Disable MFA
```http
POST /api/v1/auth/mfa/disable?totpCode=123456
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "MFA disabled successfully"
}
```

## Configuration

### Application Properties

Update `src/main/resources/application.properties`:

```properties
# JWT Configuration
jwt.secret=${JWT_SECRET:your-secret-key-must-be-at-least-256-bits-long}
jwt.expiration=86400000  # 24 hours
jwt.mfa.expiration=300000  # 5 minutes

# Application URL
app.url=${APP_URL:http://localhost:8080}

# Email Configuration (Gmail example)
spring.mail.host=${MAIL_HOST:smtp.gmail.com}
spring.mail.port=${MAIL_PORT:587}
spring.mail.username=${MAIL_USERNAME:your-email@gmail.com}
spring.mail.password=${MAIL_PASSWORD:your-app-password}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
app.mail.from=${MAIL_FROM:noreply@elrond.com}
```

### Environment Variables

For production, use environment variables:

```bash
export JWT_SECRET="your-256-bit-secret-key-here"
export APP_URL="https://yourdomain.com"
export MAIL_HOST="smtp.gmail.com"
export MAIL_USERNAME="your-email@gmail.com"
export MAIL_PASSWORD="your-app-password"
export MAIL_FROM="noreply@yourdomain.com"
```

### Gmail App Password

To use Gmail for sending verification emails:

1. Enable 2-Step Verification in your Google Account
2. Go to: https://myaccount.google.com/apppasswords
3. Generate an App Password
4. Use this password in `MAIL_PASSWORD`

## Security Features

### Password Hashing
- **BCrypt** algorithm with default strength (10 rounds)
- Salted automatically
- Industry-standard secure

### JWT Tokens
- **HMAC-SHA256** algorithm
- 24-hour expiration for regular tokens
- 5-minute expiration for MFA tokens
- Stateless authentication

### TOTP MFA
- **Time-based One-Time Password** (RFC 6238)
- 30-second time window
- 6-digit codes
- Compatible with Google Authenticator, Authy, etc.

### Email Verification
- Tokens expire after 24 hours
- One-time use tokens
- Users must verify email before login

## Database Schema

### User Table
```sql
CREATE TABLE "user" (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255),
  enabled BOOLEAN NOT NULL DEFAULT FALSE,
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  mfa_secret VARCHAR(255)
);
```

### Verification Token Table
```sql
CREATE TABLE verification_token (
  id UUID PRIMARY KEY,
  token VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES "user"(id),
  expiry_date TIMESTAMP NOT NULL,
  used BOOLEAN NOT NULL DEFAULT FALSE
);
```

## Error Handling

All errors return a consistent JSON format:

```json
{
  "timestamp": "2025-11-13T02:00:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "User not found with username: johndoe"
}
```

### HTTP Status Codes

- `200 OK` - Success
- `201 Created` - User registered
- `400 Bad Request` - Invalid token or request
- `401 Unauthorized` - Invalid credentials or MFA code
- `404 Not Found` - User not found
- `409 Conflict` - Username or email already exists
- `500 Internal Server Error` - Server error

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "SecurePass123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "testuser",
    "password": "SecurePass123!"
  }'
```

### Setup MFA
```bash
curl -X POST http://localhost:8080/api/v1/auth/mfa/setup \
  -H "Authorization: Bearer <your-token>"
```

## Project Structure

```
src/main/java/dev/uday/elrond/security/
├── config/
│   └── SecurityConfig.java          # Spring Security configuration
├── controller/
│   ├── AuthController.java          # Authentication endpoints
│   └── UserController.java          # User endpoints
├── dto/
│   ├── LoginRequest.java            # Login DTO
│   ├── LoginResponse.java           # Login response DTO
│   ├── RegisterRequest.java         # Registration DTO
│   ├── MfaSetupResponse.java        # MFA setup response
│   ├── MfaVerificationRequest.java  # MFA verification DTO
│   └── UserDto.java                 # User DTO
├── exception/
│   ├── GlobalExceptionHandler.java  # Global error handler
│   ├── UserNotFoundException.java
│   ├── UserAlreadyExistsException.java
│   ├── InvalidTokenException.java
│   └── InvalidCredentialsException.java
├── filter/
│   └── JwtAuthenticationFilter.java # JWT filter
├── model/
│   ├── User.java                    # User entity
│   └── VerificationToken.java       # Email verification token
├── repository/
│   ├── UserRepository.java          # User repository
│   └── VerificationTokenRepository.java
└── service/
    ├── AuthService.java             # Authentication logic
    ├── UserService.java             # User operations
    ├── JwtService.java              # JWT token management
    ├── TotpService.java             # TOTP MFA logic
    ├── EmailService.java            # Email sending
    ├── CustomUserDetails.java       # UserDetails implementation
    └── CustomUserDetailsService.java # UserDetailsService implementation
```

## Running the Application

```bash
# Build
mvn clean package -DskipTests

# Run
java -jar target/Elrond-0.0.1-SNAPSHOT.jar

# Or with Maven
mvn spring-boot:run
```

## Best Practices Implemented

1. **Password Security**: BCrypt with salt
2. **Token Security**: Short-lived JWT tokens
3. **Email Verification**: Required before login
4. **MFA**: Optional but recommended TOTP
5. **Error Messages**: No information leakage
6. **Validation**: Input validation on all endpoints
7. **Stateless**: JWT-based stateless authentication
8. **HTTPS**: Use HTTPS in production (configure in server properties)

## License

MIT License

## Author

Developed for the Elrond project

