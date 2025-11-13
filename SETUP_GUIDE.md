# Quick Setup Guide

## Prerequisites

- Java 25
- Maven 3.x
- PostgreSQL database
- Gmail account (for email verification) or SMTP server

## Step 1: Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE elrond;
```

The application will automatically create tables on startup (Hibernate DDL auto-update is enabled).

## Step 2: Configure Email

### Option A: Using Gmail

1. Enable 2-Step Verification: https://myaccount.google.com/security
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Set environment variables:

```bash
export MAIL_USERNAME="your-email@gmail.com"
export MAIL_PASSWORD="your-16-char-app-password"
```

### Option B: Using Another SMTP Server

Update `application.properties`:

```properties
spring.mail.host=smtp.yourprovider.com
spring.mail.port=587
spring.mail.username=your-email
spring.mail.password=your-password
```

## Step 3: Configure JWT Secret

**IMPORTANT**: Change the JWT secret for production!

```bash
export JWT_SECRET="your-secure-256-bit-secret-key-change-this-in-production"
```

Or generate a secure one:

```bash
# Generate a random 256-bit key
openssl rand -base64 32
```

## Step 4: Build and Run

```bash
# Build
mvn clean package -DskipTests

# Run
java -jar target/Elrond-0.0.1-SNAPSHOT.jar
```

Or use Maven:

```bash
mvn spring-boot:run
```

## Step 5: Test the API

### 1. Register a User

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

### 2. Check Your Email

You'll receive an email with a verification link. Click it or copy the token.

### 3. Verify Email

```bash
curl "http://localhost:8080/api/v1/auth/verify-email?token=YOUR_TOKEN"
```

### 4. Login

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "testuser",
    "password": "SecurePass123!"
  }'
```

Copy the JWT token from the response.

### 5. Setup MFA (Optional)

```bash
curl -X POST http://localhost:8080/api/v1/auth/mfa/setup \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

You'll receive:
- `secret`: Store this securely
- `qrCodeUrl`: Use this to generate a QR code

### 6. Generate QR Code

Use an online QR code generator or create one programmatically:

```bash
# Install qrencode
sudo apt-get install qrencode  # Ubuntu/Debian
# brew install qrencode  # macOS

# Generate QR code
echo "YOUR_QR_CODE_URL" | qrencode -t UTF8
```

### 7. Scan with Authenticator

Scan the QR code with:
- Google Authenticator
- Microsoft Authenticator
- Authy
- Any TOTP-compatible app

### 8. Enable MFA

```bash
curl -X POST "http://localhost:8080/api/v1/auth/mfa/enable?totpCode=123456" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Replace `123456` with the code from your authenticator app.

### 9. Login with MFA

Now when you login, you'll need the TOTP code:

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "testuser",
    "password": "SecurePass123!",
    "totpCode": "123456"
  }'
```

## Environment Variables Reference

```bash
# Database
export DATABASE_URL="jdbc:postgresql://localhost:5432/elrond?currentSchema=public"
export DATABASE_USERNAME="your_db_user"
export DATABASE_PASSWORD="your_db_password"

# JWT
export JWT_SECRET="your-secure-256-bit-secret-key"

# Application
export APP_URL="http://localhost:8080"

# Email
export MAIL_HOST="smtp.gmail.com"
export MAIL_PORT="587"
export MAIL_USERNAME="your-email@gmail.com"
export MAIL_PASSWORD="your-app-password"
export MAIL_FROM="noreply@example.com"
```

## Docker Compose (Optional)

Create `docker-compose.yml` for PostgreSQL:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: elrond
      POSTGRES_USER: uday
      POSTGRES_PASSWORD: Uday@88717
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Run:

```bash
docker-compose up -d
```

## Troubleshooting

### Email Not Sending

1. Check Gmail App Password is correct
2. Verify 2-Step Verification is enabled
3. Check firewall/network allows SMTP (port 587)
4. Check application logs for errors

### Database Connection Failed

1. Verify PostgreSQL is running
2. Check database credentials
3. Ensure database 'elrond' exists
4. Check PostgreSQL allows connections (pg_hba.conf)

### JWT Token Invalid

1. Ensure JWT_SECRET is set correctly
2. Check token hasn't expired (24 hours)
3. Verify Bearer token format in Authorization header

### MFA Code Invalid

1. Ensure phone/device time is synchronized
2. TOTP codes expire every 30 seconds
3. Verify secret was entered correctly in authenticator

## Production Checklist

- [ ] Change JWT_SECRET to a strong random value
- [ ] Use HTTPS (configure SSL certificate)
- [ ] Use production SMTP server
- [ ] Set `spring.jpa.hibernate.ddl-auto=validate` or `none`
- [ ] Enable database connection pooling
- [ ] Configure proper logging
- [ ] Set up monitoring and alerting
- [ ] Use environment-specific property files
- [ ] Enable CORS only for trusted domains
- [ ] Set up rate limiting
- [ ] Configure session timeout
- [ ] Enable database backups
- [ ] Use secrets management (AWS Secrets Manager, HashiCorp Vault, etc.)

## Next Steps

1. Implement role-based access control (RBAC)
2. Add password reset functionality
3. Implement refresh tokens
4. Add social login (OAuth2)
5. Implement account lockout after failed attempts
6. Add audit logging
7. Implement email templates with HTML
8. Add username/email uniqueness check endpoint
9. Implement user profile management
10. Add password strength requirements

## Support

For issues or questions, please create an issue in the repository.

