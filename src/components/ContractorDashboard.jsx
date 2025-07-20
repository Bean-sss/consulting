import React, { useState, useEffect } from 'react'
import DashboardLayout from './DashboardLayout'

const ContractorDashboard = () => {
  const [activeTab, setActiveTab] = useState('vendors')
  const [vendors, setVendors] = useState([])
  const [rfps, setRfps] = useState([])
  const [selectedRfpId, setSelectedRfpId] = useState('')
  const [vendorScores, setVendorScores] = useState([])
  const [loading, setLoading] = useState(false)
  const [publishMessage, setPublishMessage] = useState('')
  
  // Filter states
  const [filters, setFilters] = useState({
    capabilities: 'All Capabilities',
    clearance_level: 'All Levels',
    company_size: 'All Sizes'
  })

  // RFP form states
  const [rfpForm, setRfpForm] = useState({
    project_title: '',
    rfp_number: '',
    agency: 'Department of Defense',
    due_date: '',
    budget_min: '',
    budget_max: '',
    security_clearance: 'None',
    timeline: '',
    description: '',
    technical_requirements: '',
    required_capabilities: [],
    contact_name: '',
    contact_email: '',
    contact_phone: ''
  })

  const [uploadedFile, setUploadedFile] = useState(null)
  const [extracting, setExtracting] = useState(false)

  const tabs = [
    { id: 'vendors', label: 'Vendors' },
    { id: 'rfps', label: 'My RFPs' },
    { id: 'create', label: 'Create RFP' },
    { id: 'analytics', label: 'Analytics' }
  ]

  // Fetch data when component mounts
  useEffect(() => {
    fetchVendors()
    fetchRfps()
  }, [])

  // Update the vendor scores based on selected RFP
  useEffect(() => {
    if (selectedRfpId && activeTab === 'vendors') {
      fetchVendorScores(selectedRfpId)
    } else if (activeTab === 'vendors') {
      // When no RFP is selected, show vendors with N/A scores
      setVendorScores([])
    }
  }, [selectedRfpId, activeTab])

  // Auto-select first RFP when RFPs are loaded
  useEffect(() => {
    if (rfps.length > 0 && !selectedRfpId) {
      setSelectedRfpId(rfps[0].id.toString())
    }
  }, [rfps, selectedRfpId])

  const fetchVendors = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3000/api/vendors')
      const data = await response.json()
      
      if (response.ok) {
        setVendors(data.vendors || [])
      } else {
        // Handle error silently
      }
    } catch (error) {
      // Handle error silently
    } finally {
      setLoading(false)
    }
  }

  const fetchRfps = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/rfps')
      const data = await response.json()
      
      if (response.ok) {
        setRfps(data.rfps || [])
      } else {
        // Handle error silently
      }
    } catch (error) {
      // Handle error silently
    }
  }

  const fetchVendorScores = async (rfpId) => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:3000/api/rfp/${rfpId}/compatibility-scores`)
      const data = await response.json()
      
      if (response.ok) {
        // Sort vendors by compatibility score
        const sortedScores = (data.vendor_scores || []).sort((a, b) => 
          (b.compatibility_score || 0) - (a.compatibility_score || 0)
        )
        setVendorScores(sortedScores)
      } else {
        setVendorScores([])
      }
    } catch (error) {
      setVendorScores([])
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setUploadedFile(file)
    setExtracting(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('http://localhost:3000/api/extract-rfp-data', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (response.ok && data.extracted_data) {
        // Auto-fill form with extracted data
        const extracted = data.extracted_data
        
        const formatDate = (dateString) => {
          if (!dateString) return ''
          try {
            let date
            if (dateString.includes('March') || dateString.includes('Jan') || dateString.includes('Feb')) {
              date = new Date(dateString)
            } else if (dateString.includes('-')) {
              date = new Date(dateString)
            } else {
              date = new Date(dateString)
            }
            
            if (isNaN(date.getTime())) {
              return ''
            }
            
            return date.toISOString().split('T')[0]
          } catch (error) {
            return ''
          }
        }

        setRfpForm(prev => ({
          ...prev,
          project_title: extracted.project_title || prev.project_title,
          rfp_number: extracted.rfp_number || prev.rfp_number,
          agency: extracted.agency || prev.agency,
          due_date: formatDate(extracted.due_date) || prev.due_date,
          budget_min: extracted.budget?.min?.toString() || prev.budget_min,
          budget_max: extracted.budget?.max?.toString() || prev.budget_max,
          security_clearance: extracted.security_clearance_required || prev.security_clearance,
          timeline: extracted.timeline || prev.timeline,
          description: extracted.description || prev.description,
          required_capabilities: extracted.required_capabilities || prev.required_capabilities,
          contact_name: extracted.contact?.name?.replace(/,.*$/, '').trim() || prev.contact_name,
          contact_email: extracted.contact?.email || prev.contact_email,
          contact_phone: extracted.contact?.phone || prev.contact_phone
        }))

        setPublishMessage('Document processed successfully! All fields have been auto-filled. Review and publish your RFP.')
        setTimeout(() => setPublishMessage(''), 7000)

      } else {
        setPublishMessage('Failed to process document. Please check the file format and try again.')
        setTimeout(() => setPublishMessage(''), 5000)
      }
    } catch (error) {
      setPublishMessage('Upload failed. Please check your connection and try again.')
      setTimeout(() => setPublishMessage(''), 5000)
    } finally {
      setExtracting(false)
    }
  }

  const handlePublishRfp = async () => {
    if (!rfpForm.project_title || !rfpForm.agency || !rfpForm.due_date) {
      setPublishMessage('Please fill in required fields: Project Title, Agency, and Due Date')
      setTimeout(() => setPublishMessage(''), 5000)
      return
    }

    setLoading(true)
                    setPublishMessage('Publishing RFP...')

    try {
      const response = await fetch('http://localhost:3000/api/create-rfp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...rfpForm,
          status: 'active',
          required_capabilities: Array.isArray(rfpForm.required_capabilities) 
            ? rfpForm.required_capabilities 
            : rfpForm.required_capabilities.split(',').map(s => s.trim()),
          technical_requirements: Array.isArray(rfpForm.technical_requirements)
            ? rfpForm.technical_requirements
            : rfpForm.technical_requirements.split(',').map(s => s.trim())
        })
      })

      const data = await response.json()

      if (response.ok) {
        setPublishMessage('RFP published successfully! Vendors can now see this opportunity.')
        
        // Refresh RFPs list
        await fetchRfps()
        
        // Clear form
        setRfpForm({
          project_title: '',
          rfp_number: '',
          agency: 'Department of Defense',
          due_date: '',
          budget_min: '',
          budget_max: '',
          security_clearance: 'None',
          timeline: '',
          description: '',
          technical_requirements: '',
          required_capabilities: [],
          contact_name: '',
          contact_email: '',
          contact_phone: ''
        })
        
        setTimeout(() => setPublishMessage(''), 7000)
      } else {
        setPublishMessage(`Failed to publish RFP: ${data.error}`)
        setTimeout(() => setPublishMessage(''), 5000)
      }
    } catch (error) {
      setPublishMessage('Failed to publish RFP. Please try again.')
      setTimeout(() => setPublishMessage(''), 5000)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setRfpForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCapabilityChange = (capability, checked) => {
    setRfpForm(prev => ({
      ...prev,
      required_capabilities: checked 
        ? [...prev.required_capabilities, capability]
        : prev.required_capabilities.filter(cap => cap !== capability)
    }))
  }

  const renderVendorSearch = () => {
    const selectedRfp = rfps.find(rfp => rfp.id.toString() === selectedRfpId)
    
    // Use vendor scores if RFP is selected, otherwise show vendors with N/A scores
    const displayVendors = vendorScores.length > 0 ? vendorScores : vendors.map(vendor => ({
      ...vendor,
      compatibility_score: 'N/A',
      win_probability: null,
      risk_level: null,
      estimated_cost: null,
      reasons: null,
      rating: vendor.past_performance_score ? (vendor.past_performance_score / 20).toFixed(1) : '4.5',
      employees: vendor.employees_count || 'Not specified'
    }))
    
    return (
      <div className="vendor-search">
        <div className="section-header">
          <h2>Vendor Compatibility Analysis</h2>
          <p>AI-powered vendor matching for your RFPs</p>
        </div>

        {/* RFP Selection */}
        <div className="rfp-selection">
          <div className="rfp-selector-card">
            <h3>Select RFP for Compatibility Analysis</h3>
            {rfps.length === 0 ? (
              <div className="no-rfps-message">
                <p>No RFPs available. Create an RFP first to see vendor compatibility scores.</p>
              </div>
            ) : (
              <>
                <select 
                  className="rfp-select"
                  value={selectedRfpId}
                  onChange={(e) => setSelectedRfpId(e.target.value)}
                >
                  <option value="">Select an RFP...</option>
                  {rfps.map(rfp => (
                    <option key={rfp.id} value={rfp.id}>
                      {rfp.project_title} ({rfp.rfp_number})
                    </option>
                  ))}
                </select>
                {selectedRfp && (
                  <div className="rfp-info">
                    <span className="rfp-budget">
                      Budget: ${selectedRfp.budget_min?.toLocaleString()} - ${selectedRfp.budget_max?.toLocaleString()}
                    </span>
                    <span className="rfp-clearance">Clearance: {selectedRfp.security_clearance}</span>
                    <span className="rfp-agency">Agency: {selectedRfp.agency}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="search-filters">
          <div className="filter-group">
            <label>Capabilities</label>
            <select 
              className="filter-select"
              value={filters.capabilities}
              onChange={(e) => handleFilterChange('capabilities', e.target.value)}
            >
              <option>All Capabilities</option>
              <option>Cybersecurity</option>
              <option>AI/ML</option>
              <option>Software Development</option>
              <option>Systems Integration</option>
              <option>Quantum Computing</option>
              <option>Aerospace</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Clearance Level</label>
            <select 
              className="filter-select"
              value={filters.clearance_level}
              onChange={(e) => handleFilterChange('clearance_level', e.target.value)}
            >
              <option>All Levels</option>
              <option>Public Trust</option>
              <option>Secret</option>
              <option>Top Secret</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Company Size</label>
            <select 
              className="filter-select"
              value={filters.company_size}
              onChange={(e) => handleFilterChange('company_size', e.target.value)}
            >
              <option>All Sizes</option>
              <option>Small (1-100)</option>
              <option>Medium (101-500)</option>
              <option>Large (500+)</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-message">Loading vendor compatibility scores...</div>
        ) : (
          <div className="vendor-grid">
            {displayVendors.map((vendor, index) => {
              const isTopMatch = vendorScores.length > 0 && index === 0 && vendor.compatibility_score > 80
              const hasScores = vendorScores.length > 0
              
              return (
                <div key={vendor.id} className={`vendor-card ${isTopMatch ? 'top-match' : ''}`}>
                  {isTopMatch && (
                    <div className="top-match-badge">
                      BEST MATCH
                    </div>
                  )}
                  
                  <div className="vendor-header">
                    <div className="vendor-info">
                      <div className="vendor-avatar">
                        {vendor.name?.charAt(0) || 'V'}
                      </div>
                      <div className="vendor-details">
                        <h3>{vendor.name}</h3>
                        <p className="vendor-location">{vendor.location}</p>
                        <div className="vendor-meta">
                          <span className="rating">{vendor.rating} / 5.0</span>
                          <span className="employees">{vendor.employees} employees</span>
                        </div>
                      </div>
                    </div>
                    <div className="match-score">
                      <span className={`match-value ${vendor.compatibility_score === 'N/A' ? 'na-score' : ''}`}>
                        {vendor.compatibility_score === 'N/A' ? 'N/A' : `${vendor.compatibility_score}%`}
                      </span>
                      <span className="match-label">compatibility</span>
                    </div>
                  </div>
                  
                  <div className="vendor-stats">
                    <div className="stat-item">
                      <span className="stat-label">Performance</span>
                      <span className="stat-value">{vendor.past_performance_score || 95}%</span>
                    </div>
                    {hasScores && vendor.win_probability && (
                      <div className="stat-item">
                        <span className="stat-label">Win Probability</span>
                        <span className="stat-value">{vendor.win_probability}%</span>
                      </div>
                    )}
                    <div className="stat-item">
                      <span className="stat-label">Contracts</span>
                      <span className="stat-value">{vendor.active_contracts_count || 8}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Total Value</span>
                      <span className="stat-value">{vendor.total_contract_value}</span>
                    </div>
                  </div>
                  
                  <div className="vendor-capabilities">
                    <h4>Capabilities</h4>
                    <div className="capability-tags">
                      {(vendor.capabilities || []).slice(0, 3).map((cap, index) => (
                        <span key={index} className="capability-tag">{cap}</span>
                      ))}
                      {(vendor.capabilities || []).length > 3 && (
                        <span className="capability-more">+{vendor.capabilities.length - 3} more</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="vendor-certifications">
                    <h4>Certifications</h4>
                    <div className="cert-tags">
                      {(vendor.certifications || []).slice(0, 4).map((cert, index) => (
                        <span key={index} className="cert-tag">{cert}</span>
                      ))}
                    </div>
                  </div>

                  {hasScores && vendor.reasons && (
                    <div className="compatibility-reasons">
                      <h4>Match Analysis</h4>
                      <ul>
                        {vendor.reasons.slice(0, 3).map((reason, index) => (
                          <li key={index}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="vendor-footer">
                    <div className="risk-info">
                      {hasScores && vendor.risk_level ? (
                        <>
                          <span className={`risk-badge risk-${vendor.risk_level}`}>
                            {vendor.risk_level} risk
                          </span>
                          {vendor.estimated_cost && (
                            <span className="estimated-cost">{vendor.estimated_cost}</span>
                          )}
                        </>
                      ) : (
                        <>
                          <span className="risk-badge risk-unknown">Risk Analysis Pending</span>
                          <span className="estimated-cost">Select RFP for analysis</span>
                        </>
                      )}
                    </div>
                    <button className="contact-btn">Contact Vendor</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  const renderMyRFPs = () => {
    return (
      <div className="rfps-section">
        <div className="section-header">
          <h2>My RFPs</h2>
          <p>Manage your active and draft RFPs</p>
        </div>
        
        <div className="rfp-stats">
          <div className="stat-card">
            <span className="stat-number">{rfps.length}</span>
            <span className="stat-label">Total RFPs</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{rfps.filter(r => r.status === 'active').length}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{rfps.filter(r => r.status === 'draft').length}</span>
            <span className="stat-label">Draft</span>
          </div>
        </div>

        {loading ? (
          <div className="loading-message">Loading RFPs...</div>
        ) : rfps.length === 0 ? (
          <div className="no-rfps-section">
            <h3>No RFPs Created Yet</h3>
            <p>Get started by creating your first RFP in the "Create RFP" tab.</p>
          </div>
        ) : (
          <div className="rfp-table-container">
            <table className="rfp-table">
              <thead>
                <tr>
                  <th>RFP Details</th>
                  <th>Agency</th>
                  <th>Budget</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rfps.map((rfp) => (
                  <tr key={rfp.id} className="rfp-row">
                    <td className="rfp-title-cell">
                      <div className="rfp-title">{rfp.project_title}</div>
                      <div className="rfp-number">{rfp.rfp_number}</div>
                    </td>
                    <td>{rfp.agency}</td>
                    <td>
                      ${rfp.budget_min?.toLocaleString()} - ${rfp.budget_max?.toLocaleString()}
                    </td>
                    <td>
                      {new Date(rfp.due_date).toLocaleDateString()}
                    </td>
                    <td>
                      <span className={`status-badge status-${rfp.status}`}>
                        {rfp.status}
                      </span>
                    </td>
                    <td className="action-cell">
                      <button className="action-btn" onClick={() => setSelectedRfpId(rfp.id.toString())}>
                        View Vendors
                      </button>
                      <button className="action-btn">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <style jsx>{`
          .rfp-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
            margin-bottom: 32px;
          }

          .stat-card {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 24px;
            text-align: center;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          }

          .stat-number {
            display: block;
            font-size: 28px;
            font-weight: 700;
            color: #2563eb;
            margin-bottom: 8px;
          }

          .stat-label {
            color: #6b7280;
            font-size: 14px;
            font-weight: 500;
          }

          .rfp-table-container {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          }

          .rfp-table {
            width: 100%;
            border-collapse: collapse;
          }

          .rfp-table th {
            background: #f9fafb;
            padding: 16px;
            text-align: left;
            font-size: 14px;
            font-weight: 600;
            color: #374151;
            border-bottom: 1px solid #e5e7eb;
          }

          .rfp-table td {
            padding: 16px;
            font-size: 14px;
            color: #111827;
            border-bottom: 1px solid #e5e7eb;
          }

          .rfp-row:last-child td {
            border-bottom: none;
          }

          .rfp-title-cell {
            min-width: 250px;
          }

          .rfp-title {
            font-weight: 600;
            color: #111827;
            margin-bottom: 4px;
          }

          .rfp-number {
            font-size: 13px;
            color: #6b7280;
          }

          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 16px;
            font-size: 12px;
            font-weight: 500;
            text-transform: capitalize;
          }

          .status-active {
            background: #f0fdf4;
            color: #16a34a;
          }

          .status-draft {
            background: #f3f4f6;
            color: #6b7280;
          }

          .action-cell {
            white-space: nowrap;
          }

          .action-btn {
            background: #f3f4f6;
            color: #374151;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-right: 8px;
          }

          .action-btn:last-child {
            margin-right: 0;
          }

          .action-btn:hover {
            background: #e5e7eb;
          }

          @media (max-width: 768px) {
            .rfp-stats {
              grid-template-columns: 1fr;
              gap: 16px;
            }

            .rfp-table-container {
              overflow-x: auto;
            }

            .action-cell {
              display: flex;
              flex-direction: column;
              gap: 8px;
            }

            .action-btn {
              margin-right: 0;
            }
          }
        `}</style>
      </div>
    )
  }

  const renderCreateRFP = () => {
    return (
      <div className="create-rfp-section">
        <div className="section-header">
          <h2>Create New RFP</h2>
          <p>Upload a document or manually enter RFP details</p>
        </div>

        {/* File Upload Section */}
        <div className="upload-section">
          <div className="upload-card">
            <h3>Upload RFP Document</h3>
            <p>Upload a PDF, DOCX, or TXT file to automatically extract RFP details</p>
            
            <div className="file-upload-area">
              <input
                type="file"
                id="rfp-file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="rfp-file" className="upload-button">
                {extracting ? 'Processing...' : 'Choose File'}
              </label>
              {uploadedFile && (
                <div className="file-info">
                  <span>{uploadedFile.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Manual RFP Form */}
        <div className="rfp-form">
          <div className="form-section">
            <h3>Project Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Project Title *</label>
                <input
                  type="text"
                  className="form-input"
                  value={rfpForm.project_title}
                  onChange={(e) => setRfpForm(prev => ({ ...prev, project_title: e.target.value }))}
                  placeholder="Enter project title"
                />
              </div>
              <div className="form-group">
                <label>RFP Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={rfpForm.rfp_number}
                  onChange={(e) => setRfpForm(prev => ({ ...prev, rfp_number: e.target.value }))}
                  placeholder="Auto-generated if empty"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Agency *</label>
                <select
                  className="form-select"
                  value={rfpForm.agency}
                  onChange={(e) => setRfpForm(prev => ({ ...prev, agency: e.target.value }))}
                >
                  <option>Department of Defense</option>
                  <option>Department of Homeland Security</option>
                  <option>Department of Energy</option>
                  <option>NASA</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Due Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={rfpForm.due_date}
                  onChange={(e) => setRfpForm(prev => ({ ...prev, due_date: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Budget & Requirements</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Minimum Budget</label>
                <input
                  type="number"
                  className="form-input"
                  value={rfpForm.budget_min}
                  onChange={(e) => setRfpForm(prev => ({ ...prev, budget_min: e.target.value }))}
                  placeholder="0"
                />
              </div>
              <div className="form-group">
                <label>Maximum Budget</label>
                <input
                  type="number"
                  className="form-input"
                  value={rfpForm.budget_max}
                  onChange={(e) => setRfpForm(prev => ({ ...prev, budget_max: e.target.value }))}
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Security Clearance</label>
                <select
                  className="form-select"
                  value={rfpForm.security_clearance}
                  onChange={(e) => setRfpForm(prev => ({ ...prev, security_clearance: e.target.value }))}
                >
                  <option>None</option>
                  <option>Public Trust</option>
                  <option>Secret</option>
                  <option>Top Secret</option>
                  <option>Top Secret/SCI</option>
                </select>
              </div>
              <div className="form-group">
                <label>Project Timeline</label>
                <input
                  type="text"
                  className="form-input"
                  value={rfpForm.timeline}
                  onChange={(e) => setRfpForm(prev => ({ ...prev, timeline: e.target.value }))}
                  placeholder="e.g., 12 months, 2 years"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Project Description</h3>
            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-textarea"
                rows="4"
                value={rfpForm.description}
                onChange={(e) => setRfpForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Provide a detailed description of the project requirements..."
              />
            </div>
            
            <div className="form-group">
              <label>Required Capabilities</label>
              <textarea
                className="form-textarea"
                rows="3"
                value={Array.isArray(rfpForm.required_capabilities) 
                  ? rfpForm.required_capabilities.join(', ') 
                  : rfpForm.required_capabilities}
                onChange={(e) => setRfpForm(prev => ({ 
                  ...prev, 
                  required_capabilities: e.target.value.split(',').map(s => s.trim()) 
                }))}
                placeholder="e.g., AI/ML, Cybersecurity, Cloud Computing"
              />
            </div>
            
            <div className="form-group">
              <label>Technical Requirements</label>
              <textarea
                className="form-textarea"
                rows="3"
                value={Array.isArray(rfpForm.technical_requirements) 
                  ? rfpForm.technical_requirements.join(', ') 
                  : rfpForm.technical_requirements}
                onChange={(e) => setRfpForm(prev => ({ 
                  ...prev, 
                  technical_requirements: e.target.value.split(',').map(s => s.trim()) 
                }))}
                placeholder="e.g., DFARS Compliance, FedRAMP Authorization"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Contact Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Contact Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={rfpForm.contact_name}
                  onChange={(e) => setRfpForm(prev => ({ ...prev, contact_name: e.target.value }))}
                  placeholder="Primary contact name"
                />
              </div>
              <div className="form-group">
                <label>Contact Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={rfpForm.contact_email}
                  onChange={(e) => setRfpForm(prev => ({ ...prev, contact_email: e.target.value }))}
                  placeholder="contact@agency.gov"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Contact Phone</label>
              <input
                type="tel"
                className="form-input"
                value={rfpForm.contact_phone}
                onChange={(e) => setRfpForm(prev => ({ ...prev, contact_phone: e.target.value }))}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              className="primary-btn" 
              onClick={handlePublishRfp}
              disabled={loading}
            >
              {loading ? 'Publishing...' : 'Publish RFP'}
            </button>
          </div>

          {publishMessage && (
            <div className={`publish-message ${publishMessage.includes('Failed') ? 'error' : ''}`}>
              {publishMessage}
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderAnalytics = () => {
    return (
      <div className="analytics-section">
        <div className="section-header">
          <h2>Market Analytics</h2>
          <p>Insights into the vendor marketplace (Demo Version)</p>
        </div>
        
        <div className="demo-notice">
          <h3>Analytics Dashboard</h3>
          <p>This section would contain comprehensive market analytics, vendor performance metrics, and procurement insights. For the demo, this is a placeholder interface.</p>
          
          <div className="analytics-preview">
            <div className="metric-card">
              <h4>Active Vendors</h4>
              <span className="metric-value">{vendors.length}</span>
            </div>
            <div className="metric-card">
              <h4>Published RFPs</h4>
              <span className="metric-value">{rfps.length}</span>
            </div>
            <div className="metric-card">
              <h4>Avg. Match Score</h4>
              <span className="metric-value">
                {vendorScores.length > 0 
                  ? Math.round(vendorScores.reduce((sum, v) => sum + (v.compatibility_score || 0), 0) / vendorScores.length)
                  : 'N/A'}%
              </span>
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

        .rfp-selection {
          margin-bottom: 32px;
        }

        .rfp-selector-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .rfp-selector-card h3 {
          margin: 0 0 16px 0;
          font-size: 18px;
          font-weight: 600;
          color: #111827;
        }

        .no-rfps-message {
          padding: 24px;
          background: #f9fafb;
          border-radius: 6px;
          text-align: center;
        }

        .no-rfps-message p {
          margin: 0;
          color: #6b7280;
          font-size: 14px;
        }

        .rfp-select {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-size: 16px;
          background: white;
          margin-bottom: 16px;
          color: #111827;
        }

        .rfp-select:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .rfp-info {
          display: flex;
          gap: 24px;
          font-size: 14px;
          color: #6b7280;
          flex-wrap: wrap;
          padding: 16px;
          background: #f9fafb;
          border-radius: 6px;
        }

        .rfp-budget, .rfp-clearance, .rfp-agency {
          font-weight: 500;
        }

        .na-score {
          color: #9ca3af !important;
          font-size: 20px !important;
        }

        .risk-unknown {
          background: #f3f4f6;
          color: #6b7280;
        }

        .search-filters {
          display: flex;
          gap: 24px;
          margin-bottom: 32px;
          padding: 24px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .filter-group {
          flex: 1;
        }

        .filter-group label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .filter-select {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-size: 14px;
          color: #111827;
          background: white;
        }

        .filter-select:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .vendor-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 24px;
        }

        .vendor-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 24px;
          position: relative;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          transition: all 0.2s ease;
        }

        .vendor-card:hover {
          border-color: #2563eb;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
        }

        .vendor-card.top-match {
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
          background: #2563eb;
          color: white;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 600;
        }

        .vendor-details h3 {
          margin: 0 0 4px 0;
          font-size: 18px;
          font-weight: 600;
          color: #111827;
        }

        .vendor-location {
          margin: 0 0 8px 0;
          color: #6b7280;
          font-size: 14px;
        }

        .vendor-meta {
          display: flex;
          gap: 16px;
          font-size: 14px;
          color: #6b7280;
        }

        .match-score {
          text-align: right;
        }

        .match-value {
          display: block;
          font-size: 28px;
          font-weight: 700;
          color: #2563eb;
          line-height: 1;
        }

        .match-label {
          display: block;
          font-size: 12px;
          color: #6b7280;
          margin-top: 4px;
        }

        .vendor-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 16px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 6px;
          margin-bottom: 24px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-label {
          display: block;
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
        }

        .vendor-capabilities,
        .vendor-certifications {
          margin-bottom: 24px;
        }

        .vendor-capabilities h4,
        .vendor-certifications h4 {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .capability-tags,
        .cert-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .capability-tag {
          background: #eff6ff;
          color: #2563eb;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
        }

        .cert-tag {
          background: #f0fdf4;
          color: #16a34a;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
        }

        .capability-more {
          color: #6b7280;
          font-size: 12px;
          font-weight: 500;
        }

        .compatibility-reasons {
          margin: 16px 0;
          padding: 16px;
          background: #f9fafb;
          border-radius: 6px;
        }

        .compatibility-reasons h4 {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .compatibility-reasons ul {
          margin: 0;
          padding-left: 16px;
          list-style-type: disc;
        }

        .compatibility-reasons li {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .vendor-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
        }

        .risk-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
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

        .estimated-cost {
          font-size: 12px;
          color: #6b7280;
        }

        .contact-btn {
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

        .contact-btn:hover {
          background: #1d4ed8;
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

        .empty-state {
          text-align: center;
          padding: 48px 24px;
          color: #666;
          font-size: 16px;
        }

        .upload-section {
          margin-bottom: 32px;
          padding: 24px;
          background: white;
          border: 1px solid #e6e6e6;
          border-radius: 12px;
        }

        .upload-section h3 {
          color: #000;
          margin: 0 0 16px 0;
          font-size: 18px;
          font-weight: 600;
        }

        .file-upload-area {
          margin-bottom: 16px;
        }

        .upload-zone {
          display: block;
          padding: 48px 24px;
          border: 2px dashed #e6e6e6;
          border-radius: 12px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #fafafa;
        }

        .upload-zone:hover {
          border-color: #0070f3;
          background: #f0f8ff;
        }

        .upload-prompt .upload-icon {
          font-size: 32px;
          margin-bottom: 16px;
          opacity: 0.6;
        }

        .upload-prompt p {
          color: #000;
          font-size: 16px;
          font-weight: 500;
          margin: 0 0 8px 0;
        }

        .upload-prompt small {
          color: #666;
          font-size: 14px;
        }

        .upload-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #e6e6e6;
          border-top: 3px solid #0070f3;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .upload-loading p {
          color: #0070f3;
          font-size: 16px;
          font-weight: 500;
          margin: 0;
        }

        .upload-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .upload-success .upload-icon {
          width: 48px;
          height: 48px;
          background: #22c55e;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 600;
        }

        .upload-success p {
          color: #22c55e;
          font-size: 16px;
          font-weight: 500;
          margin: 0;
        }

        .upload-success small {
          color: #666;
          font-size: 14px;
        }

        .divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 32px 0;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e6e6e6;
        }

        .divider span {
          padding: 0 16px;
          color: #666;
          font-size: 14px;
          font-weight: 500;
          background: #fafafa;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }

        .checkbox-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          margin-top: 8px;
        }

        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 14px;
        }

        .checkbox-item input[type="checkbox"] {
          margin: 0;
        }

        .rfp-form {
          background: white;
          border: 1px solid #e6e6e6;
          border-radius: 12px;
          padding: 24px;
        }

        .form-section {
          margin-bottom: 32px;
        }

        .form-section:last-child {
          margin-bottom: 0;
        }

        .form-section h3 {
          color: #000;
          margin: 0 0 16px 0;
          font-size: 18px;
          font-weight: 600;
          padding-bottom: 8px;
          border-bottom: 1px solid #e6e6e6;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 6px;
          color: #000;
          font-size: 14px;
          font-weight: 500;
        }

        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          padding: 12px 16px;
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
          min-height: 80px;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #e6e6e6;
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

        .no-rfps-section {
          text-align: center;
          padding: 48px;
          background: white;
          border: 1px solid #e6e6e6;
          border-radius: 12px;
        }

        .no-rfps-section h3 {
          margin: 0 0 8px 0;
          color: #374151;
          font-size: 18px;
          font-weight: 600;
        }

        .no-rfps-section p {
          margin: 0;
          color: #6b7280;
          font-size: 14px;
        }

        .upload-section {
          margin-bottom: 32px;
        }

        .upload-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 24px;
          text-align: center;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .upload-card h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
          color: #111827;
        }

        .upload-card p {
          margin: 0 0 20px 0;
          color: #6b7280;
          font-size: 14px;
        }

        .file-upload-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .upload-button {
          background: #2563eb;
          color: white;
          padding: 12px 24px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          border: none;
          transition: background 0.2s ease;
          font-size: 14px;
        }

        .upload-button:hover {
          background: #1d4ed8;
        }

        .file-info {
          padding: 8px 16px;
          background: #f0fdf4;
          border: 1px solid #16a34a;
          border-radius: 6px;
          font-size: 14px;
          color: #16a34a;
          font-weight: 500;
        }

        .rfp-form {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .form-section {
          padding: 32px;
          border-bottom: 1px solid #e5e7eb;
        }

        .form-section:last-child {
          border-bottom: none;
        }

        .form-section h3 {
          margin: 0 0 24px 0;
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          padding-bottom: 12px;
          border-bottom: 2px solid #f3f4f6;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .form-input,
        .form-select,
        .form-textarea {
          padding: 12px 16px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-size: 14px;
          color: #111827;
          background: white;
          transition: border-color 0.2s ease;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .form-actions {
          padding: 24px 32px;
          background: #f9fafb;
          display: flex;
          justify-content: flex-end;
          border-top: 1px solid #e5e7eb;
        }

        .primary-btn {
          background: #2563eb;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .primary-btn:hover {
          background: #1d4ed8;
        }

        .primary-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .publish-message {
          margin-top: 16px;
          padding: 12px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
        }

        .publish-message.error {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .publish-message:not(.error) {
          background: #f0fdf4;
          color: #16a34a;
          border: 1px solid #bbf7d0;
        }

        .demo-notice {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 32px;
          text-align: center;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
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

        .analytics-preview {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          max-width: 600px;
          margin: 0 auto;
        }

        .metric-card {
          background: #f9fafb;
          border-radius: 6px;
          padding: 20px;
          text-align: center;
        }

        .metric-card h4 {
          margin: 0 0 8px 0;
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
        }

        .metric-card .metric-value {
          font-size: 24px;
          font-weight: 700;
          color: #2563eb;
        }

        .status-active {
          background: #f0fdf4;
          color: #22c55e;
        }

        .status-draft {
          background: #f3f4f6;
          color: #6b7280;
        }

        .vendor-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }

        .compatibility-reasons {
          margin: 16px 0;
          padding: 16px;
          background: #f8fafc;
          border-radius: 8px;
        }

        .compatibility-reasons h4 {
          margin: 0 0 8px 0;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .compatibility-reasons ul {
          margin: 0;
          padding-left: 16px;
          list-style-type: disc;
        }

        .compatibility-reasons li {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 4px;
        }
      `}</style>
    </DashboardLayout>
  )
}

export default ContractorDashboard 