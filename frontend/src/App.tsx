import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Register } from './components/Register/Register';
import { Login } from './components/Login/Login';
import { VerifyEmail } from './components/VerifyEmail/VerifyEmail';
import { MfaManagement } from './components/MfaManagement/MfaManagement';
import './App.css';

function AppContent() {
  const { isAuthenticated, username, logout, token } = useAuth();
  const [activeTab, setActiveTab] = useState<'register' | 'verify' | 'login'>('login');

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🔐 Elrond Security</h1>
        <p className="subtitle">Enterprise-Grade Authentication System</p>
      </header>

      <div className="auth-status">
        {isAuthenticated ? (
          <div className="status-authenticated">
            <div className="status-badge success">✓ Logged In</div>
            <div className="user-info">
              <p>
                <strong>User:</strong> {username}
              </p>
              <p className="token-display">
                <strong>JWT Token:</strong> {token?.substring(0, 30)}...
              </p>
            </div>
            <button onClick={logout} className="btn-secondary">
              Logout
            </button>
          </div>
        ) : (
          <div className="status-unauthenticated">
            <div className="status-badge danger">✗ Not Logged In</div>
          </div>
        )}
      </div>

      {!isAuthenticated ? (
        <div className="auth-section">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => setActiveTab('register')}
            >
              Register
            </button>
            <button
              className={`tab ${activeTab === 'verify' ? 'active' : ''}`}
              onClick={() => setActiveTab('verify')}
            >
              Verify Email
            </button>
            <button
              className={`tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'register' && <Register />}
            {activeTab === 'verify' && <VerifyEmail />}
            {activeTab === 'login' && <Login />}
          </div>
        </div>
      ) : (
        <div className="authenticated-section">
          <MfaManagement />
        </div>
      )}

      <footer className="app-footer">
        <div className="security-features">
          <h3>🛡️ Security Features</h3>
          <div className="features-grid">
            <div className="feature">
              <strong>✓ Password Strength Validation</strong>
              <p>Enforces strong passwords with multiple requirements</p>
            </div>
            <div className="feature">
              <strong>✓ Account Lockout</strong>
              <p>Prevents brute-force attacks (5 attempts, 15min lockout)</p>
            </div>
            <div className="feature">
              <strong>✓ Input Sanitization</strong>
              <p>Protects against XSS and injection attacks</p>
            </div>
            <div className="feature">
              <strong>✓ JWT Authentication</strong>
              <p>Secure token-based authentication</p>
            </div>
            <div className="feature">
              <strong>✓ Multi-Factor Authentication</strong>
              <p>TOTP-based 2FA with Google Authenticator</p>
            </div>
            <div className="feature">
              <strong>✓ Email Verification</strong>
              <p>Confirms user identity before activation</p>
            </div>
            <div className="feature">
              <strong>✓ Security Headers</strong>
              <p>CSP, HSTS, X-Frame-Options protection</p>
            </div>
            <div className="feature">
              <strong>✓ Security Event Logging</strong>
              <p>Comprehensive audit trail of all operations</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
