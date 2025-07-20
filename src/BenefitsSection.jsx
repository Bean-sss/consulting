import React, { useState } from 'react'

export function BenefitsSection() {
  const [extractedData, setExtractedData] = useState(null)
  const [fieldStates, setFieldStates] = useState({
    project_title: false,
    budget_range: false,
    security_clearance: false,
    timeline: false
  })
  const [hasUploaded, setHasUploaded] = useState(false)

  const handleDataExtracted = (data) => {
    setExtractedData(data)
    setHasUploaded(true)
    // Reset checkmarks before animating
    setFieldStates({
      project_title: false,
      budget_range: false,
      security_clearance: false,
      timeline: false
    })
    // Animate field checkmarks with a slower delay
    setTimeout(() => setFieldStates(prev => ({ ...prev, project_title: true })), 400)
    setTimeout(() => setFieldStates(prev => ({ ...prev, budget_range: true })), 800)
    setTimeout(() => setFieldStates(prev => ({ ...prev, security_clearance: true })), 1200)
    setTimeout(() => setFieldStates(prev => ({ ...prev, timeline: true })), 1600)
  }

  const fieldConfig = [
    { key: 'project_title', label: 'Project Title' },
    { key: 'budget_range', label: 'Budget Range' },
    { key: 'security_clearance', label: 'Security Clearance' },
    { key: 'timeline', label: 'Timeline' }
  ]

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto">

        {/* Main Headline */}
        <div className="text-center mb-20">
          <h2 className="text-5xl lg:text-6xl font-bold text-primary tracking-tight leading-tight">
            AI-Powered RFP Automation
          </h2>
        </div>

        {/* Benefits Stack */}
        <div className="space-y-24">

          {/* Benefit 1: Upload & AI Analysis */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              {/* RFP Upload Interface - Dark Theme */}
              <div className="rfp-mockup-container">
                <div className="rfp-mockup-screen">
                  <div className="rfp-screen-header">
                    <div className="rfp-screen-controls">
                      <div className="rfp-control"></div>
                      <div className="rfp-control"></div>
                      <div className="rfp-control"></div>
                    </div>
                    <div className="rfp-screen-title">RFP Auto-Fill</div>
                  </div>
                  <div className="rfp-screen-content">
                    <div className="rfp-upload-area">
                      <div className="rfp-upload-icon">📄</div>
                      <div className="rfp-upload-text">Drop RFP here or click to upload</div>
                      <div className="rfp-upload-formats">PDF, DOCX, TXT</div>
                    </div>
                    
                    <div className="rfp-fields">
                      {fieldConfig.map((field, index) => (
                        <div key={field.key} className={`rfp-field ${fieldStates[field.key] ? 'filled' : ''}`}>
                          <div className="rfp-field-label">{field.label}</div>
                          <div className="rfp-field-status">
                            {fieldStates[field.key] ? '✓' : '...'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <style jsx>{`
                .rfp-mockup-container {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  position: relative;
                  max-width: 400px;
                  margin: 0 auto;
                }

                .rfp-mockup-screen {
                  background: #1e293b;
                  border-radius: 12px;
                  padding: 16px;
                  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                  width: 100%;
                  max-width: 400px;
                }

                .rfp-screen-header {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  margin-bottom: 16px;
                  padding-bottom: 12px;
                  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .rfp-screen-controls {
                  display: flex;
                  gap: 8px;
                }

                .rfp-control {
                  width: 12px;
                  height: 12px;
                  border-radius: 50%;
                  background: rgba(255, 255, 255, 0.3);
                }

                .rfp-control:first-child {
                  background: #ef4444;
                }

                .rfp-control:nth-child(2) {
                  background: #f59e0b;
                }

                .rfp-control:nth-child(3) {
                  background: #10b981;
                }

                .rfp-screen-title {
                  color: rgba(255, 255, 255, 0.9);
                  font-size: 14px;
                  font-weight: 600;
                }

                .rfp-screen-content {
                  display: flex;
                  flex-direction: column;
                  gap: 16px;
                }

                .rfp-upload-area {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  padding: 24px;
                  background: rgba(255, 255, 255, 0.05);
                  border-radius: 8px;
                  border: 2px dashed rgba(255, 255, 255, 0.2);
                  text-align: center;
                }

                .rfp-upload-icon {
                  font-size: 32px;
                  margin-bottom: 8px;
                }

                .rfp-upload-text {
                  color: white;
                  font-size: 14px;
                  font-weight: 500;
                  margin-bottom: 4px;
                }

                .rfp-upload-formats {
                  color: rgba(255, 255, 255, 0.6);
                  font-size: 12px;
                }

                .rfp-fields {
                  display: flex;
                  flex-direction: column;
                  gap: 8px;
                }

                .rfp-field {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  padding: 12px;
                  background: rgba(255, 255, 255, 0.05);
                  border-radius: 8px;
                  border-left: 4px solid rgba(255, 255, 255, 0.2);
                  transition: all 0.3s ease;
                }

                .rfp-field.filled {
                  border-left-color: #10b981;
                  background: rgba(16, 185, 129, 0.1);
                }

                .rfp-field-label {
                  color: white;
                  font-size: 14px;
                  font-weight: 500;
                }

                .rfp-field-status {
                  color: #10b981;
                  font-size: 14px;
                  font-weight: 600;
                  min-width: 20px;
                  text-align: center;
                }

                .rfp-field:not(.filled) .rfp-field-status {
                  color: rgba(255, 255, 255, 0.4);
                }
              `}</style>
            </div>

            <div className="order-1 lg:order-2 space-y-6">
              <h3 className="text-3xl lg:text-4xl font-bold text-primary">
                No manual entry, ever
              </h3>
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
                Upload an RFP and watch every field auto-populate—zero typing required.
              </p>
            </div>
          </div>

          {/* Benefit 2: Vendor Matching */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl lg:text-4xl font-bold text-primary">
                Intelligence-driven vendor discovery
              </h3>
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
                Our AI analyzes thousands of data points to surface the perfect partners. Real-time capability scores, security clearances, and performance metrics deliver instant qualification.
              </p>
            </div>

            <div>
              {/* Vendor Matching Mockup - Same as CTA */}
              <div className="mockup-container">
                <div className="mockup-screen">
                  <div className="screen-header">
                    <div className="screen-controls">
                      <div className="control"></div>
                      <div className="control"></div>
                      <div className="control"></div>
                    </div>
                    <div className="screen-title">Vendor Opportunities</div>
                  </div>
                  <div className="screen-content">
                    <div className="opportunity-item match">
                      <div className="opportunity-info">
                        <div className="opportunity-title">AI Defense Systems</div>
                        <div className="opportunity-match">96% Match</div>
                      </div>
                      <div className="opportunity-value">$9.2M</div>
                    </div>
                    <div className="opportunity-item match">
                      <div className="opportunity-info">
                        <div className="opportunity-title">Drone Technology</div>
                        <div className="opportunity-match">94% Match</div>
                      </div>
                      <div className="opportunity-value">$6.8M</div>
                    </div>
                    <div className="opportunity-item match">
                      <div className="opportunity-info">
                        <div className="opportunity-title">Secure Communications</div>
                        <div className="opportunity-match">91% Match</div>
                      </div>
                      <div className="opportunity-value">$4.5M</div>
                    </div>
                    <div className="opportunity-item potential">
                      <div className="opportunity-info">
                        <div className="opportunity-title">Naval Equipment</div>
                        <div className="opportunity-match">87% Match</div>
                      </div>
                      <div className="opportunity-value">$11.3M</div>
                    </div>
                  </div>
                </div>
              </div>

              <style jsx>{`
                .mockup-container {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  position: relative;
                  max-width: 400px;
                  margin: 0 auto;
                }

                .mockup-screen {
                  background: #1e293b;
                  border-radius: 12px;
                  padding: 16px;
                  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                  width: 100%;
                  max-width: 400px;
                }

                .screen-header {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  margin-bottom: 16px;
                  padding-bottom: 12px;
                  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .screen-controls {
                  display: flex;
                  gap: 8px;
                }

                .control {
                  width: 12px;
                  height: 12px;
                  border-radius: 50%;
                  background: rgba(255, 255, 255, 0.3);
                }

                .control:first-child {
                  background: #ef4444;
                }

                .control:nth-child(2) {
                  background: #f59e0b;
                }

                .control:nth-child(3) {
                  background: #10b981;
                }

                .screen-title {
                  color: rgba(255, 255, 255, 0.9);
                  font-size: 14px;
                  font-weight: 600;
                }

                .screen-content {
                  display: flex;
                  flex-direction: column;
                  gap: 12px;
                }

                .opportunity-item {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  padding: 12px;
                  background: rgba(255, 255, 255, 0.05);
                  border-radius: 8px;
                  border-left: 4px solid;
                }

                .opportunity-item.match {
                  border-left-color: #10b981;
                }

                .opportunity-item.potential {
                  border-left-color: #f59e0b;
                }

                .opportunity-info {
                  display: flex;
                  flex-direction: column;
                  gap: 4px;
                }

                .opportunity-title {
                  color: white;
                  font-size: 14px;
                  font-weight: 600;
                }

                .opportunity-value {
                  color: #10b981;
                  font-size: 16px;
                  font-weight: 700;
                }

                .opportunity-match {
                  color: #10b981;
                  font-size: 12px;
                  font-weight: 600;
                }

                .opportunity-item.potential .opportunity-value {
                  color: #f59e0b;
                }

                .opportunity-item.potential .opportunity-match {
                  color: #f59e0b;
                }
              `}</style>
            </div>
          </div>

          {/* Benefit 3: Faster Project Completion */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              {/* Pipeline Velocity Dashboard - Dark Theme */}
              <div className="velocity-mockup-container">
                <div className="velocity-mockup-screen">
                  <div className="velocity-screen-header">
                    <div className="velocity-screen-controls">
                      <div className="velocity-control"></div>
                      <div className="velocity-control"></div>
                      <div className="velocity-control"></div>
                    </div>
                    <div className="velocity-screen-title">Pipeline Velocity</div>
                  </div>
                  <div className="velocity-screen-content">
                    <div className="velocity-chart">
                      <svg viewBox="0 0 160 60" className="velocity-svg">
                        <polyline
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points="0,55 20,45 40,35 60,25 80,28 100,18 120,12 140,8 160,5"
                        />
                        <circle cx="160" cy="5" r="4" fill="#10b981" />
                      </svg>
                    </div>
                    
                    <div className="velocity-metrics">
                      <div className="velocity-metric">
                        <div className="velocity-metric-label">Traditional</div>
                        <div className="velocity-metric-value traditional">6-8 wks</div>
                      </div>
                      <div className="velocity-metric">
                        <div className="velocity-metric-label">With AI</div>
                        <div className="velocity-metric-value improved">3 days</div>
                      </div>
                    </div>
                    
                    <div className="velocity-improvement">
                      <div className="velocity-improvement-text">5× faster turnaround</div>
                    </div>
                  </div>
                </div>
              </div>

              <style jsx>{`
                .velocity-mockup-container {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  position: relative;
                  max-width: 400px;
                  margin: 0 auto;
                }

                .velocity-mockup-screen {
                  background: #1e293b;
                  border-radius: 12px;
                  padding: 16px;
                  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                  width: 100%;
                  max-width: 400px;
                }

                .velocity-screen-header {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  margin-bottom: 16px;
                  padding-bottom: 12px;
                  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .velocity-screen-controls {
                  display: flex;
                  gap: 8px;
                }

                .velocity-control {
                  width: 12px;
                  height: 12px;
                  border-radius: 50%;
                  background: rgba(255, 255, 255, 0.3);
                }

                .velocity-control:first-child {
                  background: #ef4444;
                }

                .velocity-control:nth-child(2) {
                  background: #f59e0b;
                }

                .velocity-control:nth-child(3) {
                  background: #10b981;
                }

                .velocity-screen-title {
                  color: rgba(255, 255, 255, 0.9);
                  font-size: 14px;
                  font-weight: 600;
                }

                .velocity-screen-content {
                  display: flex;
                  flex-direction: column;
                  gap: 16px;
                }

                .velocity-chart {
                  padding: 16px;
                  background: rgba(255, 255, 255, 0.05);
                  border-radius: 8px;
                  border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .velocity-svg {
                  width: 100%;
                  height: 60px;
                }

                .velocity-metrics {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 16px;
                }

                .velocity-metric {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  padding: 16px;
                  background: rgba(255, 255, 255, 0.05);
                  border-radius: 8px;
                  text-align: center;
                }

                .velocity-metric-label {
                  color: rgba(255, 255, 255, 0.7);
                  font-size: 12px;
                  font-weight: 500;
                  margin-bottom: 8px;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                }

                .velocity-metric-value {
                  font-size: 24px;
                  font-weight: 700;
                  line-height: 1;
                }

                .velocity-metric-value.traditional {
                  color: #ef4444;
                }

                .velocity-metric-value.improved {
                  color: #10b981;
                }

                .velocity-improvement {
                  text-align: center;
                  padding: 12px;
                  background: rgba(16, 185, 129, 0.1);
                  border-radius: 8px;
                  border: 1px solid rgba(16, 185, 129, 0.2);
                }

                .velocity-improvement-text {
                  color: #10b981;
                  font-size: 14px;
                  font-weight: 600;
                }
              `}</style>
            </div>

            <div className="order-1 lg:order-2 space-y-6">
              <h3 className="text-3xl lg:text-4xl font-bold text-primary">
                Close deals 5× faster
              </h3>
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
                Shrink 6-week cycles to 3-day turnarounds and watch progress in real time with live velocity charts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
