import React, { useState } from 'react'
import DashboardLayout from './DashboardLayout'
import { mockVendors, mockRFPs, mockMatches } from '../data/mockData'

const ContractorDashboard = () => {
  const [activeTab, setActiveTab] = useState('vendors')

  const tabs = [
    { id: 'vendors', label: 'Vendors' },
    { id: 'rfps', label: 'My RFPs' },
    { id: 'create', label: 'Create RFP' },
    { id: 'analytics', label: 'Analytics' }
  ]

  const renderVendorSearch = () => {
    const recommendedVendors = mockMatches.contractor.recommendedVendors
    const enhancedVendors = recommendedVendors.map(rec => ({
      ...mockVendors.find(v => v.id === rec.vendorId),
      ...rec
    }))

    return (
      <div className="vendor-search-section">
        <div className="section-header">
          <h2>Recommended Vendors</h2>
          <p>AI-powered vendor matching based on your requirements</p>
        </div>
        
        <div className="search-filters">
          <div className="filter-group">
            <label>Capabilities</label>
            <select className="filter-select">
              <option>All Capabilities</option>
              <option>Cybersecurity</option>
              <option>AI/ML</option>
              <option>Software Development</option>
              <option>Systems Integration</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Clearance Level</label>
            <select className="filter-select">
              <option>All Levels</option>
              <option>Top Secret</option>
              <option>Secret</option>
              <option>Confidential</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Company Size</label>
            <select className="filter-select">
              <option>All Sizes</option>
              <option>Small (1-100)</option>
              <option>Medium (101-500)</option>
              <option>Large (500+)</option>
            </select>
          </div>
        </div>
        
        <div className="vendor-grid">
          {enhancedVendors.map((vendor) => (
            <div key={vendor.id} className="vendor-card">
              <div className="vendor-header">
                <div className="vendor-info">
                  <div className="vendor-avatar">
                    {vendor.name?.charAt(0) || 'V'}
                  </div>
                  <div className="vendor-details">
                    <h3>{vendor.name}</h3>
                    <p className="vendor-location">{vendor.location}</p>
                    <div className="vendor-meta">
                      <span className="rating">⭐ {vendor.rating}</span>
                      <span className="employees">{vendor.employees} employees</span>
                    </div>
                  </div>
                </div>
                <div className="match-score">
                  <span className="match-value">{vendor.matchScore}%</span>
                  <span className="match-label">match</span>
                </div>
              </div>
              
              <div className="vendor-stats">
                <div className="stat-item">
                  <span className="stat-label">Performance</span>
                  <span className="stat-value">{vendor.pastPerformance}%</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Contracts</span>
                  <span className="stat-value">{vendor.activeContracts}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total Value</span>
                  <span className="stat-value">{vendor.totalContractValue}</span>
                </div>
              </div>
              
              <div className="vendor-capabilities">
                <h4>Capabilities</h4>
                <div className="capability-tags">
                  {vendor.capabilities.slice(0, 3).map((cap, index) => (
                    <span key={index} className="capability-tag">{cap}</span>
                  ))}
                  {vendor.capabilities.length > 3 && (
                    <span className="capability-more">+{vendor.capabilities.length - 3} more</span>
                  )}
                </div>
              </div>
              
              <div className="vendor-certifications">
                <h4>Certifications</h4>
                <div className="cert-tags">
                  {vendor.certifications.map((cert, index) => (
                    <span key={index} className="cert-tag">{cert}</span>
                  ))}
                </div>
              </div>
              
              <div className="vendor-footer">
                <div className="risk-info">
                  <span className={`risk-badge risk-${vendor.riskLevel.toLowerCase()}`}>
                    {vendor.riskLevel} risk
                  </span>
                  <span className="estimated-cost">Est. {vendor.estimatedCost}</span>
                </div>
                <button className="contact-btn">Contact</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderMyRFPs = () => {
    const userRFPs = mockRFPs.filter(rfp => rfp.agency === 'Department of Defense')

    return (
      <div className="rfps-section">
        <div className="section-header">
          <h2>My RFPs</h2>
          <p>Manage your active and draft RFPs</p>
        </div>
        
        <div className="rfp-stats">
          <div className="stat-card">
            <span className="stat-number">{userRFPs.length}</span>
            <span className="stat-label">Total RFPs</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{userRFPs.filter(r => r.status === 'Active').length}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{userRFPs.filter(r => r.status === 'Draft').length}</span>
            <span className="stat-label">Draft</span>
          </div>
        </div>
        
        <div className="rfp-list">
          {userRFPs.map((rfp) => (
            <div key={rfp.id} className="rfp-card">
              <div className="rfp-header">
                <div className="rfp-info">
                  <h3>{rfp.title}</h3>
                  <span className="rfp-number">{rfp.rfpNumber}</span>
                </div>
                <div className="rfp-status">
                  <span className={`status-badge status-${rfp.status.toLowerCase()}`}>
                    {rfp.status}
                  </span>
                </div>
              </div>
              
              <div className="rfp-details">
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">Budget</span>
                    <span className="value">{rfp.budget}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Due Date</span>
                    <span className="value">{rfp.dueDate}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Responses</span>
                    <span className="value">{rfp.vendors.length} vendors</span>
                  </div>
                </div>
              </div>
              
              <div className="rfp-actions">
                <button className="action-btn">View Details</button>
                <button className="action-btn">Edit</button>
                <button className="action-btn primary">Manage</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderCreateRFP = () => {
    return (
      <div className="create-rfp-section">
        <div className="section-header">
          <h2>Create RFP</h2>
          <p>Create a new Request for Proposal</p>
        </div>
        
        <div className="rfp-form">
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>RFP Title</label>
                <input type="text" className="form-input" placeholder="Enter RFP title" />
              </div>
              <div className="form-group">
                <label>RFP Number</label>
                <input type="text" className="form-input" placeholder="e.g., DOD-2024-001" />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Agency</label>
                <select className="form-select">
                  <option>Department of Defense</option>
                  <option>U.S. Army</option>
                  <option>U.S. Navy</option>
                  <option>U.S. Air Force</option>
                  <option>Space Force</option>
                </select>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input type="date" className="form-input" />
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Requirements</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Budget Range</label>
                <select className="form-select">
                  <option>$100K - $500K</option>
                  <option>$500K - $1M</option>
                  <option>$1M - $5M</option>
                  <option>$5M - $10M</option>
                  <option>$10M+</option>
                </select>
              </div>
              <div className="form-group">
                <label>Clearance Required</label>
                <select className="form-select">
                  <option>None</option>
                  <option>Confidential</option>
                  <option>Secret</option>
                  <option>Top Secret</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label>Required Capabilities</label>
              <div className="checkbox-grid">
                <label className="checkbox-item">
                  <input type="checkbox" />
                  <span>Cybersecurity</span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" />
                  <span>AI/ML</span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" />
                  <span>Software Development</span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" />
                  <span>Systems Integration</span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" />
                  <span>Cloud Solutions</span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" />
                  <span>Data Analytics</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Description</h3>
            <div className="form-group">
              <label>Project Description</label>
              <textarea 
                className="form-textarea" 
                rows="4" 
                placeholder="Describe the project requirements..."
              />
            </div>
            
            <div className="form-group">
              <label>Technical Requirements</label>
              <textarea 
                className="form-textarea" 
                rows="4" 
                placeholder="List specific technical requirements..."
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button className="secondary-btn">Save Draft</button>
            <button className="primary-btn">Publish RFP</button>
          </div>
        </div>
      </div>
    )
  }

  const renderAnalytics = () => {
    const marketData = mockMatches.contractor.marketAnalysis

    return (
      <div className="analytics-section">
        <div className="section-header">
          <h2>Market Analytics</h2>
          <p>Insights into the vendor marketplace</p>
        </div>
        
        <div className="analytics-cards">
          <div className="analytics-card">
            <h3>Market Overview</h3>
            <div className="metrics-grid">
              <div className="metric">
                <span className="metric-value">{marketData.totalVendors}</span>
                <span className="metric-label">Total Vendors</span>
              </div>
              <div className="metric">
                <span className="metric-value">{marketData.qualifiedVendors}</span>
                <span className="metric-label">Qualified</span>
              </div>
              <div className="metric">
                <span className="metric-value">{marketData.averageBidPrice}</span>
                <span className="metric-label">Avg. Bid Price</span>
              </div>
              <div className="metric">
                <span className="metric-value">{marketData.competitionLevel}</span>
                <span className="metric-label">Competition</span>
              </div>
            </div>
          </div>
          
          <div className="analytics-card">
            <h3>Vendor Capabilities</h3>
            <div className="capability-chart">
              <div className="chart-item">
                <div className="chart-row">
                  <span className="chart-label">Cybersecurity</span>
                  <div className="chart-bar-container">
                    <div className="chart-bar" style={{ width: '85%' }}></div>
                    <span className="chart-value">85%</span>
                  </div>
                </div>
              </div>
              <div className="chart-item">
                <div className="chart-row">
                  <span className="chart-label">AI/ML</span>
                  <div className="chart-bar-container">
                    <div className="chart-bar" style={{ width: '62%' }}></div>
                    <span className="chart-value">62%</span>
                  </div>
                </div>
              </div>
              <div className="chart-item">
                <div className="chart-row">
                  <span className="chart-label">Software Dev</span>
                  <div className="chart-bar-container">
                    <div className="chart-bar" style={{ width: '78%' }}></div>
                    <span className="chart-value">78%</span>
                  </div>
                </div>
              </div>
              <div className="chart-item">
                <div className="chart-row">
                  <span className="chart-label">Systems Integration</span>
                  <div className="chart-bar-container">
                    <div className="chart-bar" style={{ width: '71%' }}></div>
                    <span className="chart-value">71%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="analytics-card">
            <h3>Market Trends</h3>
            <div className="trend-list">
              <div className="trend-item">
                <div className="trend-indicator positive">↗</div>
                <div className="trend-content">
                  <h4>Increasing Demand</h4>
                  <p>Cybersecurity vendors up 23% this quarter</p>
                </div>
              </div>
              <div className="trend-item">
                <div className="trend-indicator negative">↘</div>
                <div className="trend-content">
                  <h4>Competitive Pricing</h4>
                  <p>Average bid prices down 8% year-over-year</p>
                </div>
              </div>
              <div className="trend-item">
                <div className="trend-indicator positive">↗</div>
                <div className="trend-content">
                  <h4>Quality Improvement</h4>
                  <p>Vendor performance ratings up 15%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'vendors':
        return renderVendorSearch()
      case 'rfps':
        return renderMyRFPs()
      case 'create':
        return renderCreateRFP()
      case 'analytics':
        return renderAnalytics()
      default:
        return renderVendorSearch()
    }
  }

  return (
    <DashboardLayout 
      title="Contractor Dashboard" 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      tabs={tabs}
    >
      {renderTabContent()}
      
      <style jsx>{`
        .section-header {
          margin-bottom: 32px;
        }
        
        .section-header h2 {
          color: #000;
          margin: 0 0 8px 0;
          font-size: 24px;
          font-weight: 600;
          letter-spacing: -0.5px;
        }
        
        .section-header p {
          color: #666;
          margin: 0;
          font-size: 16px;
        }
        
        .search-filters {
          display: flex;
          gap: 16px;
          margin-bottom: 32px;
          padding: 24px;
          background: white;
          border: 1px solid #e6e6e6;
          border-radius: 12px;
        }
        
        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .filter-group label {
          font-weight: 500;
          color: #000;
          font-size: 14px;
        }
        
        .filter-select {
          padding: 8px 12px;
          border: 1px solid #e6e6e6;
          border-radius: 6px;
          font-size: 14px;
          background: white;
        }
        
        .vendor-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 24px;
        }
        
        .vendor-card {
          background: white;
          border: 1px solid #e6e6e6;
          border-radius: 12px;
          padding: 24px;
          transition: all 0.15s ease;
        }
        
        .vendor-card:hover {
          border-color: #0070f3;
          box-shadow: 0 4px 12px rgba(0, 112, 243, 0.1);
        }
        
        .vendor-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }
        
        .vendor-info {
          display: flex;
          gap: 16px;
        }
        
        .vendor-avatar {
          width: 48px;
          height: 48px;
          background: #0070f3;
          color: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 18px;
        }
        
        .vendor-details h3 {
          margin: 0 0 4px 0;
          color: #000;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: -0.2px;
        }
        
        .vendor-location {
          color: #666;
          font-size: 14px;
          margin: 0 0 8px 0;
        }
        
        .vendor-meta {
          display: flex;
          gap: 16px;
          font-size: 12px;
          color: #666;
        }
        
        .match-score {
          text-align: right;
        }
        
        .match-value {
          display: block;
          font-size: 20px;
          font-weight: 600;
          color: #22c55e;
          line-height: 1;
        }
        
        .match-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .vendor-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;
          padding: 16px;
          background: #fafafa;
          border-radius: 8px;
        }
        
        .stat-item {
          text-align: center;
        }
        
        .stat-label {
          display: block;
          font-size: 12px;
          color: #666;
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .stat-value {
          font-weight: 600;
          color: #000;
          font-size: 14px;
        }
        
        .vendor-capabilities,
        .vendor-certifications {
          margin-bottom: 24px;
        }
        
        .vendor-capabilities h4,
        .vendor-certifications h4 {
          margin: 0 0 12px 0;
          color: #000;
          font-size: 14px;
          font-weight: 600;
        }
        
        .capability-tags,
        .cert-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .capability-tag {
          background: #f0f7ff;
          color: #0070f3;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .cert-tag {
          background: #f0fdf4;
          color: #22c55e;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .capability-more {
          color: #666;
          font-size: 12px;
          padding: 4px 8px;
        }
        
        .vendor-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 24px;
          border-top: 1px solid #f0f0f0;
        }
        
        .risk-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .risk-badge {
          font-size: 12px;
          font-weight: 500;
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .risk-low {
          background: #f0fdf4;
          color: #22c55e;
        }
        
        .risk-medium {
          background: #fef3c7;
          color: #d97706;
        }
        
        .estimated-cost {
          font-size: 12px;
          color: #666;
        }
        
        .contact-btn {
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        
        .contact-btn:hover {
          background: #0060d9;
        }
        
        .rfp-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 32px;
        }
        
        .stat-card {
          background: white;
          border: 1px solid #e6e6e6;
          border-radius: 12px;
          padding: 24px;
          text-align: center;
        }
        
        .stat-number {
          display: block;
          font-size: 28px;
          font-weight: 600;
          color: #000;
          margin-bottom: 8px;
        }
        
        .stat-card .stat-label {
          font-size: 14px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .rfp-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .rfp-card {
          background: white;
          border: 1px solid #e6e6e6;
          border-radius: 12px;
          padding: 24px;
          transition: all 0.15s ease;
        }
        
        .rfp-card:hover {
          border-color: #0070f3;
          box-shadow: 0 4px 12px rgba(0, 112, 243, 0.1);
        }
        
        .rfp-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }
        
        .rfp-info h3 {
          margin: 0 0 4px 0;
          color: #000;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: -0.2px;
        }
        
        .rfp-number {
          color: #666;
          font-size: 12px;
          font-weight: 500;
        }
        
        .status-badge {
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .status-active {
          background: #f0fdf4;
          color: #22c55e;
        }
        
        .status-draft {
          background: #f3f4f6;
          color: #6b7280;
        }
        
        .rfp-details {
          margin-bottom: 16px;
        }
        
        .detail-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        
        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .detail-item .label {
          color: #666;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .detail-item .value {
          color: #000;
          font-size: 14px;
          font-weight: 500;
        }
        
        .rfp-actions {
          display: flex;
          gap: 8px;
        }
        
        .action-btn {
          background: #f5f5f5;
          color: #666;
          border: none;
          border-radius: 6px;
          padding: 8px 12px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        
        .action-btn:hover {
          background: #e6e6e6;
        }
        
        .action-btn.primary {
          background: #0070f3;
          color: white;
        }
        
        .action-btn.primary:hover {
          background: #0060d9;
        }
        
        .rfp-form {
          background: white;
          border: 1px solid #e6e6e6;
          border-radius: 12px;
          padding: 32px;
        }
        
        .form-section {
          margin-bottom: 32px;
        }
        
        .form-section:last-of-type {
          margin-bottom: 0;
        }
        
        .form-section h3 {
          color: #000;
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: -0.2px;
        }
        
        .form-group {
          margin-bottom: 16px;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #000;
          font-size: 14px;
        }
        
        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #e6e6e6;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.15s ease;
          background: white;
        }
        
        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #0070f3;
        }
        
        .form-textarea {
          resize: vertical;
        }
        
        .checkbox-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        
        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #000;
          cursor: pointer;
        }
        
        .checkbox-item input[type="checkbox"] {
          width: 16px;
          height: 16px;
          margin: 0;
        }
        
        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 32px;
        }
        
        .secondary-btn {
          background: #f5f5f5;
          color: #666;
          border: none;
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        
        .secondary-btn:hover {
          background: #e6e6e6;
        }
        
        .primary-btn {
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        
        .primary-btn:hover {
          background: #0060d9;
        }
        
        .analytics-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 24px;
        }
        
        .analytics-card {
          background: white;
          border: 1px solid #e6e6e6;
          border-radius: 12px;
          padding: 24px;
        }
        
        .analytics-card h3 {
          color: #000;
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: -0.2px;
        }
        
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        
        .metric {
          text-align: center;
          padding: 16px;
          background: #fafafa;
          border-radius: 8px;
        }
        
        .metric-value {
          display: block;
          font-size: 20px;
          font-weight: 600;
          color: #000;
          margin-bottom: 4px;
        }
        
        .metric-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .capability-chart {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .chart-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .chart-label {
          min-width: 120px;
          font-size: 14px;
          color: #000;
          font-weight: 500;
        }
        
        .chart-bar-container {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .chart-bar {
          height: 8px;
          background: #0070f3;
          border-radius: 4px;
          transition: width 0.3s ease;
        }
        
        .chart-value {
          font-size: 12px;
          color: #000;
          font-weight: 500;
          min-width: 40px;
        }
        
        .trend-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .trend-item {
          display: flex;
          gap: 16px;
          padding: 16px;
          background: #fafafa;
          border-radius: 8px;
        }
        
        .trend-indicator {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 600;
        }
        
        .trend-indicator.positive {
          background: #f0fdf4;
          color: #22c55e;
        }
        
        .trend-indicator.negative {
          background: #fef2f2;
          color: #dc2626;
        }
        
        .trend-content h4 {
          margin: 0 0 4px 0;
          color: #000;
          font-size: 14px;
          font-weight: 600;
        }
        
        .trend-content p {
          margin: 0;
          color: #666;
          font-size: 12px;
        }
        
        @media (max-width: 768px) {
          .vendor-grid {
            grid-template-columns: 1fr;
          }
          
          .search-filters {
            flex-direction: column;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .detail-grid {
            grid-template-columns: 1fr;
          }
          
          .checkbox-grid {
            grid-template-columns: 1fr;
          }
          
          .rfp-stats {
            grid-template-columns: 1fr;
          }
          
          .metrics-grid {
            grid-template-columns: 1fr;
          }
          
          .vendor-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </DashboardLayout>
  )
}

export default ContractorDashboard 