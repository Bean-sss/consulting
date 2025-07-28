import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const DashboardLayout = ({ children, title, activeTab, onTabChange, tabs = [] }) => {
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }

  const handleLogoClick = () => {
    navigate('/')
  }

  return (
    <div className="dashboard-layout">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo" onClick={handleLogoClick}>
              <span className="logo-text">DIB</span>
            </div>
            <div className="title-section">
              <h1>{title}</h1>
              <span className="user-badge">
                {user?.role === 'vendor' ? 'Vendor' : 'Contractor'}
              </span>
            </div>
          </div>
          
          <div className="header-right">
            <div className="user-menu-container">
              <button 
                className="user-menu-trigger"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="user-avatar">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="user-info">
                  <div className="user-name">{user?.name}</div>
                  <div className="user-company">{user?.company}</div>
                </div>
              </button>
              
              {showUserMenu && (
                <div className="user-menu">
                  <div className="user-details">
                    <div className="user-detail-item">
                      <span className="label">Clearance</span>
                      <span className="value">{user?.clearanceLevel}</span>
                    </div>
                    <div className="user-detail-item">
                      <span className="label">Email</span>
                      <span className="value">{user?.email}</span>
                    </div>
                    {user?.role === 'vendor' && (
                      <div className="user-detail-item">
                        <span className="label">Certifications</span>
                        <span className="value">{user?.certifications?.join(', ')}</span>
                      </div>
                    )}
                    {user?.role === 'contractor' && (
                      <div className="user-detail-item">
                        <span className="label">Position</span>
                        <span className="value">{user?.position}</span>
                      </div>
                    )}
                  </div>
                  <button className="logout-button" onClick={handleLogout}>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      {tabs.length > 0 && (
        <nav className="dashboard-nav">
          <div className="nav-container">
            <div className="nav-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => onTabChange(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="dashboard-content">
        {children}
      </main>

      <style jsx>{`
        .dashboard-layout {
          min-height: 100vh;
          background: #fafafa;
        }

        .dashboard-header {
          background: white;
          border-bottom: 1px solid #e6e6e6;
          padding: 0 24px;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 64px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .logo {
          display: flex;
          align-items: center;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }

        .logo:hover {
          opacity: 0.8;
        }

        .logo-text {
          font-size: 24px;
          font-weight: 600;
          color: #000;
          letter-spacing: -0.5px;
        }

        .title-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .title-section h1 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #000;
          letter-spacing: -0.3px;
        }

        .user-badge {
          background: #f5f5f5;
          color: #666;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .header-right {
          display: flex;
          align-items: center;
        }

        .user-menu-container {
          position: relative;
        }

        .user-menu-trigger {
          display: flex;
          align-items: center;
          gap: 12px;
          background: none;
          border: none;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .user-menu-trigger:hover {
          background: #f5f5f5;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          background: #0070f3;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
        }

        .user-info {
          text-align: left;
        }

        .user-name {
          font-weight: 500;
          color: #000;
          font-size: 14px;
          line-height: 1.2;
        }

        .user-company {
          color: #666;
          font-size: 12px;
          line-height: 1.2;
        }

        .user-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border: 1px solid #e6e6e6;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          min-width: 280px;
          z-index: 1000;
          margin-top: 8px;
        }

        .user-details {
          padding: 16px;
        }

        .user-detail-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
          gap: 16px;
        }

        .user-detail-item:last-child {
          margin-bottom: 0;
        }

        .user-detail-item .label {
          font-size: 12px;
          color: #666;
          font-weight: 500;
          min-width: 80px;
        }

        .user-detail-item .value {
          font-size: 12px;
          color: #000;
          text-align: right;
          flex: 1;
        }

        .logout-button {
          width: 100%;
          padding: 12px 16px;
          background: none;
          border: none;
          border-top: 1px solid #e6e6e6;
          color: #666;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .logout-button:hover {
          background: #f5f5f5;
          color: #000;
        }

        .dashboard-nav {
          background: white;
          border-bottom: 1px solid #e6e6e6;
          padding: 0 24px;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .nav-tabs {
          display: flex;
          gap: 8px;
        }

        .nav-tab {
          padding: 12px 16px;
          background: none;
          border: none;
          color: #666;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.15s ease;
        }

        .nav-tab:hover {
          color: #000;
        }

        .nav-tab.active {
          color: #0070f3;
          border-bottom-color: #0070f3;
        }

        .dashboard-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 24px;
        }

        @media (max-width: 768px) {
          .header-content {
            padding: 0 16px;
          }
          
          .header-left {
            gap: 16px;
          }
          
          .title-section h1 {
            font-size: 16px;
          }
          
          .user-info {
            display: none;
          }
          
          .dashboard-content {
            padding: 24px 16px;
          }
          
          .nav-tabs {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
        }
      `}</style>
    </div>
  )
}

export default DashboardLayout 