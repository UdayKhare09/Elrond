// MFA Management Component

import React, { useState } from 'react';
import { authApi, ApiError } from '../../services/api.service';
import { Alert, type AlertType } from '../Alert/Alert';
import './MfaManagement.css';

export const MfaManagement: React.FC = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [setupCode, setSetupCode] = useState('');
  const [disableCode, setDisableCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: AlertType; message: string; details?: string } | null>(
    null,
  );

  const handleSetupMfa = async () => {
    setLoading(true);
    setAlert(null);

    try {
      const response = await authApi.setupMfa();
      setQrCode(response.qrCodeUrl);
      setSecret(response.secret);
      setAlert({
        type: 'success',
        message: '✓ MFA setup initiated successfully!',
        details: 'Scan the QR code with Google Authenticator or any TOTP app.',
      });
    } catch (error) {
      if (error instanceof ApiError) {
        setAlert({
          type: 'error',
          message: 'Setup failed',
          details: error.errorResponse.message,
        });
      } else {
        setAlert({
          type: 'error',
          message: 'Network error',
          details: 'Unable to connect to server',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEnableMfa = async () => {
    if (!setupCode || setupCode.length !== 6) {
      setAlert({
        type: 'warning',
        message: 'Please enter a valid 6-digit code',
      });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      await authApi.enableMfa(setupCode);
      setAlert({
        type: 'success',
        message: '✓ MFA enabled successfully!',
        details: 'You will need to provide your MFA code on the next login.',
      });
      setQrCode(null);
      setSecret(null);
      setSetupCode('');
    } catch (error) {
      if (error instanceof ApiError) {
        setAlert({
          type: 'error',
          message: 'Failed to enable MFA',
          details: error.errorResponse.message,
        });
      } else {
        setAlert({
          type: 'error',
          message: 'Network error',
          details: 'Unable to connect to server',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDisableMfa = async () => {
    if (!disableCode || disableCode.length !== 6) {
      setAlert({
        type: 'warning',
        message: 'Please enter a valid 6-digit code',
      });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      await authApi.disableMfa(disableCode);
      setAlert({
        type: 'success',
        message: '✓ MFA disabled successfully!',
        details: 'Two-factor authentication has been removed from your account.',
      });
      setDisableCode('');
    } catch (error) {
      if (error instanceof ApiError) {
        setAlert({
          type: 'error',
          message: 'Failed to disable MFA',
          details: error.errorResponse.message,
        });
      } else {
        setAlert({
          type: 'error',
          message: 'Network error',
          details: 'Unable to connect to server',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mfa-management-container">
      <h2>🔐 Multi-Factor Authentication</h2>
      <div className="info-box">
        Enable MFA for enhanced security. Use Google Authenticator or any compatible TOTP app.
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          details={alert.details}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="mfa-section">
        <h3>Setup MFA</h3>
        <button onClick={handleSetupMfa} disabled={loading} className="btn-primary">
          {loading ? 'Setting up...' : 'Setup MFA'}
        </button>

        {qrCode && (
          <div className="qr-code-container">
            <p>
              <strong>Scan this QR code with Google Authenticator:</strong>
            </p>
            <img src={qrCode} alt="MFA QR Code" className="qr-code-image" />
            <p>
              <strong>Secret:</strong> <code className="secret-code">{secret}</code>
            </p>

            <div className="form-group">
              <label htmlFor="setupCode">Enter 6-digit code to enable MFA:</label>
              <input
                type="text"
                id="setupCode"
                value={setupCode}
                onChange={(e) => setSetupCode(e.target.value)}
                maxLength={6}
                pattern="[0-9]{6}"
                placeholder="123456"
              />
            </div>
            <button onClick={handleEnableMfa} disabled={loading} className="btn-primary">
              {loading ? 'Enabling...' : 'Enable MFA'}
            </button>
          </div>
        )}
      </div>

      <div className="mfa-section">
        <h3>Disable MFA</h3>
        <div className="form-group">
          <label htmlFor="disableCode">Enter code to disable MFA:</label>
          <input
            type="text"
            id="disableCode"
            value={disableCode}
            onChange={(e) => setDisableCode(e.target.value)}
            maxLength={6}
            pattern="[0-9]{6}"
            placeholder="123456"
          />
        </div>
        <button onClick={handleDisableMfa} disabled={loading} className="btn-danger">
          {loading ? 'Disabling...' : 'Disable MFA'}
        </button>
      </div>
    </div>
  );
};

