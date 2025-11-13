#!/bin/bash

# Elrond Authentication System Test Script
# This script tests all authentication endpoints

BASE_URL="http://localhost:8080"
API_BASE="${BASE_URL}/api/v1/auth"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Generate random username for testing
TIMESTAMP=$(date +%s)
USERNAME="testuser${TIMESTAMP}"
EMAIL="test${TIMESTAMP}@example.com"
PASSWORD="SecurePass123!"

echo -e "${YELLOW}=== Elrond Authentication System Test ===${NC}\n"

# Test 1: Register User
echo -e "${YELLOW}Test 1: Register User${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "${API_BASE}/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"${EMAIL}\",
    \"username\": \"${USERNAME}\",
    \"password\": \"${PASSWORD}\",
    \"firstName\": \"Test\",
    \"lastName\": \"User\"
  }")

echo "Response: ${REGISTER_RESPONSE}"

if echo "${REGISTER_RESPONSE}" | grep -q "Registration successful"; then
    echo -e "${GREEN}✓ Registration successful${NC}\n"
else
    echo -e "${RED}✗ Registration failed${NC}\n"
    exit 1
fi

# Test 2: Try login without email verification (should fail)
echo -e "${YELLOW}Test 2: Login without email verification (should fail)${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "${API_BASE}/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"usernameOrEmail\": \"${USERNAME}\",
    \"password\": \"${PASSWORD}\"
  }")

echo "Response: ${LOGIN_RESPONSE}"

if echo "${LOGIN_RESPONSE}" | grep -q "not verified"; then
    echo -e "${GREEN}✓ Correctly blocked unverified user${NC}\n"
else
    echo -e "${RED}✗ Should have blocked unverified user${NC}\n"
fi

# Test 3: Check username already exists
echo -e "${YELLOW}Test 3: Duplicate username (should fail)${NC}"
DUPLICATE_RESPONSE=$(curl -s -X POST "${API_BASE}/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"another${TIMESTAMP}@example.com\",
    \"username\": \"${USERNAME}\",
    \"password\": \"${PASSWORD}\",
    \"firstName\": \"Test\",
    \"lastName\": \"User\"
  }")

echo "Response: ${DUPLICATE_RESPONSE}"

if echo "${DUPLICATE_RESPONSE}" | grep -q "already exists"; then
    echo -e "${GREEN}✓ Correctly rejected duplicate username${NC}\n"
else
    echo -e "${RED}✗ Should have rejected duplicate username${NC}\n"
fi

# Test 4: Invalid credentials
echo -e "${YELLOW}Test 4: Login with wrong password (should fail)${NC}"
WRONG_PASSWORD_RESPONSE=$(curl -s -X POST "${API_BASE}/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"usernameOrEmail\": \"${USERNAME}\",
    \"password\": \"WrongPassword123!\"
  }")

echo "Response: ${WRONG_PASSWORD_RESPONSE}"

if echo "${WRONG_PASSWORD_RESPONSE}" | grep -q "Invalid credentials"; then
    echo -e "${GREEN}✓ Correctly rejected wrong password${NC}\n"
else
    echo -e "${RED}✗ Should have rejected wrong password${NC}\n"
fi

# Manual verification needed
echo -e "${YELLOW}=== Manual Steps Required ===${NC}"
echo -e "To complete testing, you need to:"
echo -e "1. Check email: ${EMAIL}"
echo -e "2. Click the verification link or copy the token"
echo -e "3. Run this command to verify:"
echo -e "   ${GREEN}curl \"${API_BASE}/verify-email?token=YOUR_TOKEN\"${NC}"
echo -e "\n4. Then login with:"
echo -e "   ${GREEN}curl -X POST \"${API_BASE}/login\" \\"
echo -e "     -H \"Content-Type: application/json\" \\"
echo -e "     -d '{"
echo -e "       \"usernameOrEmail\": \"${USERNAME}\","
echo -e "       \"password\": \"${PASSWORD}\""
echo -e "     }'${NC}"
echo -e "\n5. To test login with email:"
echo -e "   ${GREEN}curl -X POST \"${API_BASE}/login\" \\"
echo -e "     -H \"Content-Type: application/json\" \\"
echo -e "     -d '{"
echo -e "       \"usernameOrEmail\": \"${EMAIL}\","
echo -e "       \"password\": \"${PASSWORD}\""
echo -e "     }'${NC}"
echo -e "\n6. After getting JWT token, test MFA setup:"
echo -e "   ${GREEN}curl -X POST \"${API_BASE}/mfa/setup\" \\"
echo -e "     -H \"Authorization: Bearer YOUR_JWT_TOKEN\"${NC}"

echo -e "\n${YELLOW}=== Test Credentials ===${NC}"
echo -e "Email: ${GREEN}${EMAIL}${NC}"
echo -e "Username: ${GREEN}${USERNAME}${NC}"
echo -e "Password: ${GREEN}${PASSWORD}${NC}"

echo -e "\n${GREEN}Basic tests completed!${NC}"

