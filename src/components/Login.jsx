import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const [selectedRole, setSelectedRole] = useState(null)
  const { login } = useAuth()

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
  }

  const handleLogin = () => {
    if (selectedRole) {
      login(selectedRole)
    }
  }

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-header">
          <div className="logo">
            <span className="logo-text">BID</span>
          </div>
          <h1>Welcome back</h1>
          <p>Choose your role to continue</p>
        </div>

        <div className="role-selection">
          <div 
            className={`role-card ${selectedRole === 'vendor' ? 'selected' : ''}`}
            onClick={() => handleRoleSelect('vendor')}
          >
            <div className="role-content">
              <div className="role-header">
                <h3>I'm a Vendor</h3>
                <p>Submit proposals and find opportunities</p>
              </div>
              <div className="role-features">
                <span>Submit RFP proposals</span>
                <span>View matching opportunities</span>
                <span>Track submission status</span>
              </div>
            </div>
            <div className="role-check">
              {selectedRole === 'vendor' && <div className="check-icon">✓</div>}
            </div>
          </div>

          <div 
            className={`role-card ${selectedRole === 'contractor' ? 'selected' : ''}`}
            onClick={() => handleRoleSelect('contractor')}
          >
            <div className="role-content">
              <div className="role-header">
                <h3>I'm a Contractor</h3>
                <p>Find vendors and manage RFPs</p>
              </div>
              <div className="role-features">
                <span>Discover qualified vendors</span>
                <span>Create and manage RFPs</span>
                <span>Review vendor proposals</span>
              </div>
            </div>
            <div className="role-check">
              {selectedRole === 'contractor' && <div className="check-icon">✓</div>}
            </div>
          </div>
        </div>

        <button 
          className={`continue-button ${selectedRole ? 'active' : ''}`}
          onClick={handleLogin}
          disabled={!selectedRole}
        >
          Continue
        </button>

        <div className="demo-note">
          <p>This is a demo environment with mock authentication</p>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fafafa;
          padding: 24px;
        }

        .login-content {
          width: 100%;
          max-width: 420px;
        }

        .login-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .logo {
          margin-bottom: 32px;
        }

        .logo-text {
          font-size: 28px;
          font-weight: 600;
          color: #000;
          letter-spacing: -0.5px;
        }

        .login-header h1 {
          font-size: 32px;
          font-weight: 600;
          color: #000;
          margin: 0 0 8px 0;
          letter-spacing: -0.8px;
        }

        .login-header p {
          color: #666;
          font-size: 16px;
          margin: 0;
          font-weight: 400;
        }

        .role-selection {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 32px;
        }

        .role-card {
          background: white;
          border: 1px solid #e6e6e6;
          border-radius: 12px;
          padding: 24px;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .role-card:hover {
          border-color: #0070f3;
          box-shadow: 0 4px 12px rgba(0, 112, 243, 0.1);
        }

        .role-card.selected {
          border-color: #0070f3;
          box-shadow: 0 4px 12px rgba(0, 112, 243, 0.15);
          background: #fafbff;
        }

        .role-content {
          flex: 1;
        }

        .role-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #000;
          margin: 0 0 4px 0;
          letter-spacing: -0.3px;
        }

        .role-header p {
          color: #666;
          font-size: 14px;
          margin: 0 0 16px 0;
          font-weight: 400;
        }

        .role-features {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .role-features span {
          font-size: 13px;
          color: #888;
          padding-left: 12px;
          position: relative;
        }

        .role-features span:before {
          content: "•";
          position: absolute;
          left: 0;
          color: #ccc;
        }

        .role-check {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 2px;
        }

        .check-icon {
          width: 20px;
          height: 20px;
          background: #0070f3;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
        }

        .continue-button {
          width: 100%;
          background: #e6e6e6;
          color: #999;
          border: none;
          border-radius: 8px;
          padding: 16px;
          font-size: 16px;
          font-weight: 500;
          cursor: not-allowed;
          transition: all 0.15s ease;
          margin-bottom: 24px;
        }

        .continue-button.active {
          background: #0070f3;
          color: white;
          cursor: pointer;
        }

        .continue-button.active:hover {
          background: #0060d9;
        }

        .demo-note {
          text-align: center;
          padding: 16px;
          background: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }

        .demo-note p {
          color: #666;
          font-size: 13px;
          margin: 0;
        }

        @media (max-width: 480px) {
          .login-container {
            padding: 16px;
          }
          
          .login-header h1 {
            font-size: 28px;
          }
          
          .role-card {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  )
}

export default Login 