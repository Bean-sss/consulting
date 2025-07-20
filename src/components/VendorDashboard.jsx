import React, { useState, useEffect } from 'react'
import DashboardLayout from './DashboardLayout'
import { useAuth } from '../context/AuthContext'

const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState('matches')
  const [rfpMatches, setRfpMatches] = useState([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const tabs = [
    { id: 'matches', label: 'Matches' },
    { id: 'submit', label: 'Submit Proposal' },
    { id: 'tracking', label: 'Submissions' },
    { id: 'competitors', label: 'Competitors' }
  ]

  useEffect(() => {
    if (activeTab === 'matches') {
      fetchRfpMatches()
    }
  }, [activeTab])

  const fetchRfpMatches = async () => {
    try {
      setLoading(true)
      
      // For demo, we'll use vendor ID 1 (CyberDefense Solutions)
      // In a real app, this would come from the authenticated user
      const vendorId = 1
      
      const response = await fetch(`http://localhost:3000/api/vendor/${vendorId}/recommendations?limit=20`)
      const data = await response.json()
      
      if (response.ok) {
        setRfpMatches(data.recommendations || [])
      } else {
        setRfpMatches([])
      }
    } catch (error) {
      setRfpMatches([])
    } finally {
      setLoading(false)
    }
  }

  const renderMatches = () => {
    return (
      <div className="matches-section">
        <div className="section-header">
          <h2>RFP Matches</h2>
          <p>AI-powered RFP recommendations based on your capabilities</p>
        </div>
        
        {loading ? (
          <div className="loading-message">Loading RFP recommendations...</div>
        ) : rfpMatches.length === 0 ? (
          <div className="no-matches">
            <div className="no-matches-content">
              <h3>No RFP Matches Found</h3>
              <p>New RFPs that match your capabilities will appear here. Check back regularly for new opportunities.</p>
            </div>
          </div>
        ) : (
          <div className="rfp-grid">
            {rfpMatches.map((rfp, index) => {
              const isTopMatch = index === 0 && rfp.score > 80
              
              return (
                <div key={rfp.rfp_id} className={`rfp-card ${isTopMatch ? 'top-match' : ''}`}>
                  {isTopMatch && (
                    <div className="top-match-badge">
                      BEST OPPORTUNITY
                    </div>
                  )}
                  
                  <div className="rfp-header">
                    <div className="rfp-title-section">
                      <h3>{rfp.project_title}</h3>
                      <span className="rfp-number">{rfp.rfp_number}</span>
                      <span className="agency">{rfp.agency}</span>
                    </div>
                    <div className="match-score">
                      <span className="score-value">{rfp.score}%</span>
                      <span className="score-label">match</span>
                    </div>
                  </div>
                  
                  <div className="rfp-details">
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="label">Budget</span>
                        <span className="value">
                          ${rfp.budget_min?.toLocaleString()} - ${rfp.budget_max?.toLocaleString()}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Due Date</span>
                        <span className="value">
                          {new Date(rfp.due_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Win Probability</span>
                        <span className="value">{rfp.win_probability}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rfp-requirements">
                    <h4>Required Capabilities</h4>
                    <div className="requirement-tags">
                      {(rfp.required_capabilities || ['Cybersecurity', 'AI/ML', 'Software Development']).map((req, index) => (
                        <span key={index} className="requirement-tag">{req}</span>
                      ))}
                    </div>
                  </div>

                  <div className="rfp-clearance">
                    <h4>Security Requirements</h4>
                    <div className="clearance-info">
                      <span className="clearance-badge">
                        {rfp.security_clearance || 'None Required'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="rfp-footer">
                    <div className="competition-info">
                      <span className="win-probability">{rfp.win_probability}% Win Rate</span>
                      <span className={`risk-badge risk-${rfp.risk_level}`}>
                        {rfp.risk_level} risk
                      </span>
                    </div>
                    <button className="submit-btn">Submit Proposal</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  const renderSubmitProposal = () => {
    return (
      <div className="submit-section">
        <div className="section-header">
          <h2>Submit Proposal</h2>
          <p>Submit a proposal for an active RFP (Demo Interface)</p>
        </div>
        
        <div className="demo-notice">
          <h3>Proposal Submission</h3>
          <p>This section would allow vendors to submit detailed proposals for RFPs. For the demo, this is a placeholder interface showing the proposal submission flow.</p>
          
          <div className="demo-form">
            <div className="form-preview">
              <h4>Example Proposal Form Elements:</h4>
              <ul>
                <li>RFP Selection Dropdown</li>
                <li>Technical Approach Description</li>
                <li>Team Composition & Qualifications</li>
                <li>Proposed Budget & Timeline</li>
                <li>Supporting Documents Upload</li>
                <li>Company Certifications & Past Performance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderTracking = () => {
    return (
      <div className="tracking-section">
        <div className="section-header">
          <h2>Proposal Tracking</h2>
          <p>Track your RFP submissions and their status (Demo Interface)</p>
        </div>
        
        <div className="demo-notice">
          <h3>Submission Tracking</h3>
          <p>This section would show all submitted proposals with their current status, evaluation progress, and feedback from contracting officers.</p>
          
          <div className="tracking-preview">
            <div className="submission-example">
              <h4>Example Submission Statuses:</h4>
              <div className="status-examples">
                <span className="status-badge status-submitted">Submitted</span>
                <span className="status-badge status-under-review">Under Review</span>
                <span className="status-badge status-shortlisted">Shortlisted</span>
                <span className="status-badge status-awarded">Awarded</span>
                <span className="status-badge status-declined">Declined</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderCompetitorAnalysis = () => {
    return (
      <div className="competitors-section">
        <div className="section-header">
          <h2>Competitor Analysis</h2>
          <p>Market intelligence and competitive insights (Demo Interface)</p>
        </div>
        
        <div className="demo-notice">
          <h3>Competitive Intelligence</h3>
          <p>This section would provide insights into market competition, competitor capabilities, pricing trends, and win/loss analysis to help optimize your proposals.</p>
          
          <div className="competitor-preview">
            <div className="analysis-example">
              <h4>Example Analysis Features:</h4>
              <ul>
                <li>Competitor capability mapping</li>
                <li>Historical win rates by contract type</li>
                <li>Pricing benchmarks and trends</li>
                <li>Partnership opportunity identification</li>
                <li>Market share analysis</li>
              </ul>
            </div>
          </div>
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
          border-bottom: 2px solid #f3f4f6;
          padding-bottom: 16px;
        }
        
        .section-header h2 {
          color: #111827;
          margin: 0 0 8px 0;
          font-size: 24px;
          font-weight: 600;
          letter-spacing: -0.5px;
        }
        
        .section-header p {
          color: #6b7280;
          margin: 0;
          font-size: 16px;
        }

        .loading-message {
          text-align: center;
          padding: 48px;
          color: #6b7280;
          font-size: 16px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
        }

        .no-matches {
          text-align: center;
          padding: 48px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
        }

        .no-matches-content h3 {
          margin: 0 0 8px 0;
          color: #374151;
          font-size: 18px;
          font-weight: 600;
        }

        .no-matches-content p {
          margin: 0;
          color: #6b7280;
          font-size: 14px;
        }

        .rfp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 24px;
        }

        .rfp-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 24px;
          position: relative;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          transition: all 0.2s ease;
        }

        .rfp-card:hover {
          border-color: #2563eb;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
        }

        .rfp-card.top-match {
          border-color: #2563eb;
          background: linear-gradient(to bottom right, #ffffff, #eff6ff);
        }

        .top-match-badge {
          position: absolute;
          top: -12px;
          right: 16px;
          background: #2563eb;
          color: white;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .rfp-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }

        .rfp-title-section h3 {
          color: #111827;
          margin: 0 0 4px 0;
          font-size: 18px;
          font-weight: 600;
          letter-spacing: -0.3px;
        }

        .rfp-number {
          color: #6b7280;
          font-size: 14px;
          font-weight: 500;
          display: block;
          margin-bottom: 4px;
        }

        .agency {
          background: #eff6ff;
          color: #2563eb;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
          display: inline-block;
        }

        .match-score {
          text-align: right;
        }

        .score-value {
          display: block;
          font-size: 28px;
          font-weight: 700;
          color: #2563eb;
          line-height: 1;
        }

        .score-label {
          display: block;
          font-size: 12px;
          color: #6b7280;
          margin-top: 4px;
        }

        .rfp-details {
          margin-bottom: 24px;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 6px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .detail-item .label {
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;
        }

        .detail-item .value {
          font-size: 14px;
          color: #111827;
          font-weight: 500;
        }

        .rfp-requirements,
        .rfp-clearance {
          margin-bottom: 24px;
        }

        .rfp-requirements h4,
        .rfp-clearance h4 {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .requirement-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .requirement-tag {
          background: #eff6ff;
          color: #2563eb;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
        }

        .clearance-badge {
          background: #f0fdf4;
          color: #16a34a;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
          display: inline-block;
        }

        .rfp-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
        }

        .competition-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .win-probability {
          font-size: 14px;
          font-weight: 600;
          color: #16a34a;
        }

        .risk-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .risk-low {
          background: #f0fdf4;
          color: #16a34a;
        }

        .risk-medium {
          background: #fff7ed;
          color: #ea580c;
        }

        .risk-high {
          background: #fef2f2;
          color: #dc2626;
        }

        .submit-btn {
          background: #2563eb;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .submit-btn:hover {
          background: #1d4ed8;
        }

        .demo-notice {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 32px;
          text-align: center;
        }

        .demo-notice h3 {
          margin: 0 0 16px 0;
          font-size: 20px;
          font-weight: 600;
          color: #111827;
        }

        .demo-notice p {
          margin: 0 0 24px 0;
          color: #6b7280;
          font-size: 16px;
        }

        .demo-form,
        .tracking-preview,
        .competitor-preview {
          background: #f9fafb;
          border-radius: 6px;
          padding: 24px;
          text-align: left;
        }

        .form-preview h4,
        .analysis-example h4 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: #111827;
        }

        .form-preview ul,
        .analysis-example ul {
          margin: 0;
          padding-left: 20px;
          list-style-type: disc;
        }

        .form-preview li,
        .analysis-example li {
          margin-bottom: 8px;
          color: #4b5563;
        }

        .status-examples {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 12px;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-submitted {
          background: #e0f2fe;
          color: #0277bd;
        }

        .status-under-review {
          background: #fff7ed;
          color: #ea580c;
        }

        .status-shortlisted {
          background: #f0fdf4;
          color: #16a34a;
        }

        .status-awarded {
          background: #f0fdf4;
          color: #16a34a;
        }

        .status-declined {
          background: #fef2f2;
          color: #dc2626;
        }

        @media (max-width: 768px) {
          .rfp-grid {
            grid-template-columns: 1fr;
          }

          .detail-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .rfp-footer {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }

          .submit-btn {
            width: 100%;
          }
        }
      `}</style>
    </DashboardLayout>
  )
}

export default VendorDashboard 