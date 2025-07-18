import React, { useState } from 'react'
import DashboardLayout from './DashboardLayout'
import { mockRFPs, mockMatches, mockVendors } from '../data/mockData'

const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState('matches')

  const tabs = [
    { id: 'matches', label: 'Matches' },
    { id: 'submit', label: 'Submit Proposal' },
    { id: 'tracking', label: 'Submissions' },
    { id: 'competitors', label: 'Competitors' }
  ]

  const renderMatches = () => {
    const matches = mockMatches.vendor.recommendedRFPs
    const matchedRFPs = matches.map(match => ({
      ...mockRFPs.find(rfp => rfp.id === match.rfpId),
      ...match
    }))

    return (
      <div className="matches-section">
        <div className="section-header">
          <h2>Recommended RFPs</h2>
          <p>AI-powered matching based on your capabilities</p>
        </div>
        
        <div className="rfp-grid">
          {matchedRFPs.map((rfp) => (
            <div key={rfp.id} className="rfp-card">
              <div className="rfp-header">
                <div className="rfp-title-section">
                  <h3>{rfp.title}</h3>
                  <span className="rfp-number">{rfp.rfpNumber}</span>
                </div>
                <div className="match-score">
                  <span className="score-value">{rfp.matchScore}%</span>
                  <span className="score-label">match</span>
                </div>
              </div>
              
              <div className="rfp-details">
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">Agency</span>
                    <span className="value">{rfp.agency}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Budget</span>
                    <span className="value">{rfp.budget}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Due Date</span>
                    <span className="value">{rfp.dueDate}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Clearance</span>
                    <span className="value">{rfp.clearanceRequired}</span>
                  </div>
                </div>
              </div>
              
              <div className="match-reasons">
                <h4>Why you're a good fit</h4>
                <ul>
                  {rfp.reasons.map((reason, index) => (
                    <li key={index}>{reason}</li>
                  ))}
                </ul>
              </div>
              
              <div className="rfp-footer">
                <div className="win-info">
                  <span className="win-probability">{rfp.winProbability}% win probability</span>
                  <span className="competition-level">{rfp.competitionLevel} competition</span>
                </div>
                <button className="submit-btn">Submit Proposal</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderSubmitProposal = () => {
    return (
      <div className="submit-section">
        <div className="section-header">
          <h2>Submit Proposal</h2>
          <p>Submit a proposal for an active RFP</p>
        </div>
        
        <div className="proposal-form">
          <div className="form-section">
            <h3>RFP Selection</h3>
            <div className="form-group">
              <label>Select RFP</label>
              <select className="form-select">
                <option value="">Choose an RFP...</option>
                {mockRFPs.filter(rfp => rfp.status === 'Active').map(rfp => (
                  <option key={rfp.id} value={rfp.id}>
                    {rfp.rfpNumber} - {rfp.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Proposal Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Proposed Budget</label>
                <input type="text" className="form-input" placeholder="$0.00" />
              </div>
              <div className="form-group">
                <label>Delivery Timeline</label>
                <input type="text" className="form-input" placeholder="e.g., 6 months" />
              </div>
            </div>
            
            <div className="form-group">
              <label>Technical Approach</label>
              <textarea 
                className="form-textarea" 
                rows="4" 
                placeholder="Describe your technical approach..."
              />
            </div>
            
            <div className="form-group">
              <label>Team Composition</label>
              <textarea 
                className="form-textarea" 
                rows="3" 
                placeholder="Describe your team structure..."
              />
            </div>
          </div>
          
          <div className="form-section">
            <h3>Supporting Documents</h3>
            <div className="form-group">
              <div className="file-upload">
                <input type="file" id="documents" multiple />
                <label htmlFor="documents" className="upload-label">
                  <span>Upload Files</span>
                  <small>PDF, DOC, etc.</small>
                </label>
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button className="secondary-btn">Save Draft</button>
            <button className="primary-btn">Submit Proposal</button>
          </div>
        </div>
      </div>
    )
  }

  const renderTracking = () => {
    const submissions = [
      { id: 1, rfpId: 1, status: 'Under Review', submittedDate: '2024-01-20', score: 92 },
      { id: 2, rfpId: 2, status: 'Submitted', submittedDate: '2024-01-18', score: 88 },
      { id: 3, rfpId: 3, status: 'Draft', submittedDate: '2024-01-15', score: 85 }
    ]

    return (
      <div className="tracking-section">
        <div className="section-header">
          <h2>Submissions</h2>
          <p>Track your RFP submissions and their status</p>
        </div>
        
        <div className="submissions-list">
          {submissions.map(submission => {
            const rfp = mockRFPs.find(r => r.id === submission.rfpId)
            return (
              <div key={submission.id} className="submission-card">
                <div className="submission-header">
                  <div className="submission-info">
                    <h3>{rfp.title}</h3>
                    <span className="submission-number">{rfp.rfpNumber}</span>
                  </div>
                  <div className="submission-status">
                    <span className={`status-badge status-${submission.status.toLowerCase().replace(' ', '-')}`}>
                      {submission.status}
                    </span>
                  </div>
                </div>
                
                <div className="submission-details">
                  <div className="detail-item">
                    <span className="label">Submitted</span>
                    <span className="value">{submission.submittedDate}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Match Score</span>
                    <span className="value">{submission.score}%</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Budget</span>
                    <span className="value">{rfp.budget}</span>
                  </div>
                </div>
                
                <div className="submission-actions">
                  <button className="action-btn">View Details</button>
                  <button className="action-btn">Edit</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderCompetitorAnalysis = () => {
    const competitors = mockMatches.vendor.competitorAnalysis

    return (
      <div className="competitor-section">
        <div className="section-header">
          <h2>Competitor Analysis</h2>
          <p>Understand your competition in the marketplace</p>
        </div>
        
        <div className="competitor-grid">
          {competitors.map((competitor, index) => (
            <div key={index} className="competitor-card">
              <div className="competitor-header">
                <h3>{competitor.name}</h3>
                <span className={`threat-badge threat-${competitor.threat.toLowerCase()}`}>
                  {competitor.threat} threat
                </span>
              </div>
              
              <div className="competitor-stats">
                <div className="stat-item">
                  <span className="stat-label">Shared RFPs</span>
                  <span className="stat-value">{competitor.sharedRFPs}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Est. Win Rate</span>
                  <span className="stat-value">
                    {competitor.threat === 'High' ? '78%' : '65%'}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Avg. Bid</span>
                  <span className="stat-value">
                    {competitor.threat === 'High' ? '$3.2M' : '$4.1M'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'matches':
        return renderMatches()
      case 'submit':
        return renderSubmitProposal()
      case 'tracking':
        return renderTracking()
      case 'competitors':
        return renderCompetitorAnalysis()
      default:
        return renderMatches()
    }
  }

  return (
    <DashboardLayout 
      title="Vendor Dashboard" 
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
        
        .rfp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 24px;
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
          margin-bottom: 24px;
        }
        
        .rfp-title-section h3 {
          color: #000;
          margin: 0 0 4px 0;
          font-size: 18px;
          font-weight: 600;
          letter-spacing: -0.3px;
        }
        
        .rfp-number {
          color: #666;
          font-size: 14px;
          font-weight: 500;
        }
        
        .match-score {
          text-align: right;
          flex-shrink: 0;
        }
        
        .score-value {
          display: block;
          font-size: 24px;
          font-weight: 600;
          color: #22c55e;
          line-height: 1;
        }
        
        .score-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .rfp-details {
          margin-bottom: 24px;
        }
        
        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
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
        
        .match-reasons {
          margin-bottom: 24px;
        }
        
        .match-reasons h4 {
          color: #000;
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: 600;
        }
        
        .match-reasons ul {
          margin: 0;
          padding: 0;
          list-style: none;
        }
        
        .match-reasons li {
          color: #666;
          font-size: 14px;
          margin-bottom: 8px;
          padding-left: 16px;
          position: relative;
        }
        
        .match-reasons li:before {
          content: "•";
          position: absolute;
          left: 0;
          color: #0070f3;
          font-weight: bold;
        }
        
        .rfp-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 24px;
          border-top: 1px solid #f0f0f0;
        }
        
        .win-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .win-probability {
          font-size: 14px;
          color: #22c55e;
          font-weight: 500;
        }
        
        .competition-level {
          font-size: 12px;
          color: #666;
          text-transform: capitalize;
        }
        
        .submit-btn {
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
        
        .submit-btn:hover {
          background: #0060d9;
        }
        
        .proposal-form {
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
        
        .file-upload {
          border: 2px dashed #e6e6e6;
          border-radius: 8px;
          padding: 24px;
          text-align: center;
          transition: border-color 0.15s ease;
        }
        
        .file-upload:hover {
          border-color: #0070f3;
        }
        
        .file-upload input[type="file"] {
          display: none;
        }
        
        .upload-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          color: #0070f3;
          font-weight: 500;
        }
        
        .upload-label small {
          color: #666;
          font-size: 12px;
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
        
        .submissions-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .submission-card {
          background: white;
          border: 1px solid #e6e6e6;
          border-radius: 12px;
          padding: 24px;
          transition: all 0.15s ease;
        }
        
        .submission-card:hover {
          border-color: #0070f3;
          box-shadow: 0 4px 12px rgba(0, 112, 243, 0.1);
        }
        
        .submission-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }
        
        .submission-info h3 {
          color: #000;
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: -0.2px;
        }
        
        .submission-number {
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
        
        .status-under-review {
          background: #fef3c7;
          color: #d97706;
        }
        
        .status-submitted {
          background: #dbeafe;
          color: #2563eb;
        }
        
        .status-draft {
          background: #f3f4f6;
          color: #6b7280;
        }
        
        .submission-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 16px;
          margin-bottom: 16px;
        }
        
        .submission-actions {
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
        
        .competitor-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }
        
        .competitor-card {
          background: white;
          border: 1px solid #e6e6e6;
          border-radius: 12px;
          padding: 24px;
          transition: all 0.15s ease;
        }
        
        .competitor-card:hover {
          border-color: #0070f3;
          box-shadow: 0 4px 12px rgba(0, 112, 243, 0.1);
        }
        
        .competitor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .competitor-header h3 {
          color: #000;
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: -0.2px;
        }
        
        .threat-badge {
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .threat-high {
          background: #fef2f2;
          color: #dc2626;
        }
        
        .threat-medium {
          background: #fef3c7;
          color: #d97706;
        }
        
        .competitor-stats {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .stat-label {
          color: #666;
          font-size: 14px;
        }
        
        .stat-value {
          font-weight: 500;
          color: #000;
          font-size: 14px;
        }
        
        @media (max-width: 768px) {
          .rfp-grid {
            grid-template-columns: 1fr;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .detail-grid {
            grid-template-columns: 1fr;
          }
          
          .competitor-grid {
            grid-template-columns: 1fr;
          }
          
          .submission-details {
            grid-template-columns: 1fr;
          }
          
          .rfp-footer {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }
        }
      `}</style>
    </DashboardLayout>
  )
}

export default VendorDashboard 