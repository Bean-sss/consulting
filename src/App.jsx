/**
 * Main application component for the Defense RFP Platform
 * Provides landing page and dashboard routing for vendors and contractors
 */

import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './components/Login'
import VendorDashboard from './components/VendorDashboard'
import ContractorDashboard from './components/ContractorDashboard'
import { BenefitsSection } from './BenefitsSection'
import { LogoCarousel } from './components/LogoCarousel'

// Landing page component
const LandingPage = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  
  const videos = [
    '/assets/13668624_3840_2160_25fps.mp4',
    '/assets/3309765-uhd_3840_2160_30fps.mp4',
    '/assets/6201055-uhd_3840_2160_25fps.mp4',
    '/assets/6333333-hd_1920_1080_24fps.mp4'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentVideoIndex((prev) => (prev + 1) % videos.length)
        setTimeout(() => {
          setIsTransitioning(false)
        }, 300)
      }, 300)
    }, 8000)

    return () => clearInterval(interval)
  }, [videos.length])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      setIsScrolled(scrollTop > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleFaqClick = (e) => {
      const faqQuestion = e.target.closest('.faq-question')
      if (faqQuestion) {
        const faqItem = faqQuestion.parentElement
        faqItem.classList.toggle('active')
      }
    }

    document.addEventListener('click', handleFaqClick)
    return () => document.removeEventListener('click', handleFaqClick)
  }, [])

  useEffect(() => {
    const handleToggleClick = (e) => {
      const toggleButton = e.target.closest('.toggle-button')
      if (toggleButton) {
        const target = toggleButton.dataset.target
        
        // Update active button
        document.querySelectorAll('.toggle-button').forEach(btn => {
          btn.classList.remove('active')
        })
        toggleButton.classList.add('active')
        
        // Update content visibility
        document.querySelectorAll('.cta-content').forEach(content => {
          content.classList.add('hidden')
        })
        document.getElementById(`${target}-content`).classList.remove('hidden')
      }
    }

    document.addEventListener('click', handleToggleClick)
    return () => document.removeEventListener('click', handleToggleClick)
  }, [])

  useEffect(() => {
    const handleTabClick = (e) => {
      const tabButton = e.target.closest('.tab-button')
      if (tabButton) {
        const target = tabButton.dataset.tab
        
        // Update active tab button
        document.querySelectorAll('.tab-button').forEach(btn => {
          btn.classList.remove('active')
        })
        tabButton.classList.add('active')
        
        // Update tab content visibility
        document.querySelectorAll('.tab-content').forEach(content => {
          content.classList.remove('active')
        })
        document.getElementById(`${target}-tab`).classList.add('active')
      }
    }

    document.addEventListener('click', handleTabClick)
    return () => document.removeEventListener('click', handleTabClick)
  }, [])

  const handleIndicatorClick = (index) => {
    if (index === currentVideoIndex) return
    
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentVideoIndex(index)
      setTimeout(() => {
        setIsTransitioning(false)
      }, 300)
    }, 300)
  }

  return (
    <div className="App">
      {/* Header */}
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <div className="logo-icon"></div>
              <span className="logo-text">BID</span>
            </div>
            <nav>
              <ul className="nav">
                <li><a href="#home">Home</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </nav>
            <a href="/login" className="cta-button">Get Started</a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-video-container">
          {videos.map((video, index) => (
            <video
              key={video}
              className={`hero-video ${index === currentVideoIndex ? 'active' : ''} ${isTransitioning ? 'transitioning' : ''}`}
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ))}
          <div className="hero-overlay"></div>
        </div>
        
        <div className="hero-content">
          <div className="container">
            <div className="hero-text">
              <div className="hero-badge">
                <span>Trusted by 500+ defense contractors & 2,000+ vendors</span>
              </div>
              <h1>Defense procurement.<br />Reimagined.</h1>
              <p>
                The AI-powered platform that connects qualified vendors with the right contracts 
                and helps contractors find perfect matches. Stop wasting time on manual processes.
              </p>
              <div className="hero-buttons">
                <a href="/login" className="cta-button primary">Get Started Free</a>
                <a href="#how-it-works" className="secondary-button">See How It Works</a>
              </div>
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">$4.1B</span>
                  <span className="stat-label">Contract value matched</span>
                </div>
                <div className="stat">
                  <span className="stat-number">94%</span>
                  <span className="stat-label">Match accuracy</span>
                </div>
                <div className="stat">
                  <span className="stat-number">&lt; 5 min</span>
                  <span className="stat-label">Average analysis time</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="video-indicators">
          {videos.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentVideoIndex ? 'active' : ''}`}
              onClick={() => handleIndicatorClick(index)}
            />
          ))}
        </div>
      </section>

      {/* Logo Carousel */}
      <LogoCarousel />

      {/* Benefits Section */}
      <BenefitsSection />

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-toggle">
            <button className="toggle-button active" data-target="contractors">For Contractors</button>
            <button className="toggle-button" data-target="vendors">For Vendors</button>
          </div>
          
          <div className="cta-content" id="contractors-content">
            <div className="cta-text">
              <div className="cta-badge">
                <span>Join 500+ defense contractors</span>
              </div>
              <h2>Start winning more contracts</h2>
              <p>
                Transform weeks of manual work into minutes of automated intelligence. 
                Get started with BID today.
              </p>
              <div className="cta-buttons">
                <a href="/login" className="cta-button primary">Get Started Free</a>
                <a href="#how-it-works" className="cta-button secondary">See How It Works</a>
              </div>
              <div className="cta-stats">
                <div className="stat">
                  <span className="stat-number">94%</span>
                  <span className="stat-label">Match accuracy</span>
                </div>
                <div className="stat">
                  <span className="stat-number">5×</span>
                  <span className="stat-label">Faster awards</span>
                </div>
                <div className="stat">
                  <span className="stat-number">$2.3B</span>
                  <span className="stat-label">Contracts won</span>
                </div>
              </div>
            </div>
            <div className="cta-visual">
              <div className="mockup-screen">
                <div className="screen-header">
                  <div className="screen-controls">
                    <div className="control"></div>
                    <div className="control"></div>
                    <div className="control"></div>
                  </div>
                  <div className="screen-title">Contract Dashboard</div>
                </div>
                <div className="screen-content">
                  <div className="contract-item won">
                    <div className="contract-info">
                      <div className="contract-title">F-35 Avionics Integration</div>
                      <div className="contract-value">$12.5M</div>
                    </div>
                    <div className="contract-status">WON</div>
                  </div>
                  <div className="contract-item won">
                    <div className="contract-info">
                      <div className="contract-title">Naval Radar Systems</div>
                      <div className="contract-value">$8.2M</div>
                    </div>
                    <div className="contract-status">WON</div>
                  </div>
                  <div className="contract-item won">
                    <div className="contract-info">
                      <div className="contract-title">Cybersecurity Framework</div>
                      <div className="contract-value">$5.8M</div>
                    </div>
                    <div className="contract-status">WON</div>
                  </div>
                  <div className="contract-item pending">
                    <div className="contract-info">
                      <div className="contract-title">Satellite Communications</div>
                      <div className="contract-value">$15.3M</div>
                    </div>
                    <div className="contract-status">PENDING</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="cta-content hidden" id="vendors-content">
            <div className="cta-text">
              <div className="cta-badge">
                <span>Join 2,000+ qualified vendors</span>
              </div>
              <h2>Get discovered by top contractors</h2>
              <p>
                Stop chasing RFPs blindly. Get matched with contracts that fit your capabilities 
                and maximize your win rate.
              </p>
              <div className="cta-buttons">
                <a href="/login" className="cta-button primary">Join as Vendor</a>
                <a href="#how-it-works" className="cta-button secondary">Learn More</a>
              </div>
              <div className="cta-stats">
                <div className="stat">
                  <span className="stat-number">73%</span>
                  <span className="stat-label">Higher win rate</span>
                </div>
                <div className="stat">
                  <span className="stat-number">2,000+</span>
                  <span className="stat-label">Active vendors</span>
                </div>
                <div className="stat">
                  <span className="stat-number">$1.8B</span>
                  <span className="stat-label">Vendor revenue</span>
                </div>
              </div>
            </div>
            <div className="cta-visual">
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
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Transform your procurement process in three powerful steps</p>
          </div>
          <div className="process-card">
            <div className="process-tabs">
              <button className="tab-button active" data-tab="upload">
                <span className="tab-number">01</span>
                <span className="tab-label">Upload RFP</span>
              </button>
              <button className="tab-button" data-tab="analyze">
                <span className="tab-number">02</span>
                <span className="tab-label">AI Analysis</span>
              </button>
              <button className="tab-button" data-tab="award">
                <span className="tab-number">03</span>
                <span className="tab-label">Select & Award</span>
              </button>
            </div>
            
            <div className="tab-content active" id="upload-tab">
              <div className="tab-panel">
                <div className="step-visual">
                  <div className="step-mockup">
                    <div className="mockup-header">
                      <div className="mockup-dot"></div>
                      <div className="mockup-dot"></div>
                      <div className="mockup-dot"></div>
                      <span className="mockup-title">Document Upload</span>
                    </div>
                    <div className="mockup-content">
                      <div className="upload-zone">
                        <div className="upload-dropzone">
                          <div className="upload-icon">📄</div>
                          <div className="upload-main-text">Drag & drop your RFP document</div>
                          <div className="upload-sub-text">or click to browse files</div>
                          <div className="upload-button">Browse Files</div>
                        </div>
                        <div className="upload-file-info">
                          <div className="file-details">
                            <div className="file-name">RFP_Defense_Contract_2024.pdf</div>
                            <div className="file-size">2.4 MB • Uploading...</div>
                          </div>
                          <div className="upload-progress">
                            <div className="progress-bar"></div>
                            <div className="progress-text">75% • 3s remaining</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="step-info">
                  <div className="step-badge">
                    <span className="step-number">01</span>
                    <span className="step-label">UPLOAD</span>
                  </div>
                  <h3>Upload RFP</h3>
                  <p>Drop your RFP document and watch our AI extract all key requirements automatically</p>
                  <div className="step-metric">
                    <span className="metric-value">&lt; 2 min</span>
                    <span className="metric-label">Processing time</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="tab-content" id="analyze-tab">
              <div className="tab-panel">
                <div className="step-visual">
                  <div className="step-mockup">
                    <div className="mockup-header">
                      <div className="mockup-dot"></div>
                      <div className="mockup-dot"></div>
                      <div className="mockup-dot"></div>
                      <span className="mockup-title">AI Analysis Engine</span>
                    </div>
                    <div className="mockup-content">
                      <div className="analysis-results">
                        <div className="analysis-header">
                          <div className="analysis-status">Analyzing 247 vendors...</div>
                          <div className="analysis-progress">87%</div>
                        </div>
                        <div className="match-results">
                          <div className="match-item high-match">
                            <div className="match-info">
                              <div className="vendor-name">Lockheed Martin</div>
                              <div className="capabilities">Defense Systems, Security Clearance</div>
                            </div>
                            <div className="match-score">96%</div>
                          </div>
                          <div className="match-item medium-match">
                            <div className="match-info">
                              <div className="vendor-name">Raytheon Technologies</div>
                              <div className="capabilities">Aerospace, Cybersecurity</div>
                            </div>
                            <div className="match-score">91%</div>
                          </div>
                          <div className="match-item low-match">
                            <div className="match-info">
                              <div className="vendor-name">BAE Systems</div>
                              <div className="capabilities">Naval Systems, Electronics</div>
                            </div>
                            <div className="match-score">73%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="step-info">
                  <div className="step-badge">
                    <span className="step-number">02</span>
                    <span className="step-label">ANALYZE</span>
                  </div>
                  <h3>AI Analysis</h3>
                  <p>Our system matches requirements with qualified vendors based on capabilities and clearances</p>
                  <div className="step-metric">
                    <span className="metric-value">94%</span>
                    <span className="metric-label">Match accuracy</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="tab-content" id="award-tab">
              <div className="tab-panel">
                <div className="step-visual">
                  <div className="step-mockup">
                    <div className="mockup-header">
                      <div className="mockup-dot"></div>
                      <div className="mockup-dot"></div>
                      <div className="mockup-dot"></div>
                      <span className="mockup-title">Award Dashboard</span>
                    </div>
                    <div className="mockup-content">
                      <div className="award-interface">
                        <div className="award-header">
                          <div className="award-title">F-35 Avionics Integration</div>
                          <div className="award-value">$12.5M</div>
                        </div>
                        <div className="selected-vendor">
                          <div className="vendor-card">
                            <div className="vendor-info">
                              <div className="vendor-name">Lockheed Martin</div>
                              <div className="vendor-details">Prime Contractor • Security Clearance: Secret</div>
                            </div>
                            <div className="award-badge">SELECTED</div>
                          </div>
                        </div>
                        <div className="award-actions">
                          <div className="action-item">
                            <div className="action-text">Contract generated</div>
                            <div className="action-status completed">✓</div>
                          </div>
                          <div className="action-item">
                            <div className="action-text">Vendor notification sent</div>
                            <div className="action-status completed">✓</div>
                          </div>
                          <div className="action-item">
                            <div className="action-text">Legal review pending</div>
                            <div className="action-status pending">⏳</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="step-info">
                  <div className="step-badge">
                    <span className="step-number">03</span>
                    <span className="step-label">AWARD</span>
                  </div>
                  <h3>Select & Award</h3>
                  <p>Review ranked matches and connect with the best vendors for your project</p>
                  <div className="step-metric">
                    <span className="metric-value">5×</span>
                    <span className="metric-label">Faster awards</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="results" id="features">
        <div className="container">
          <div className="results-header">
            <h2>Real Results From Real Customers</h2>
            <p>See how defense contractors and vendors are transforming their procurement</p>
          </div>
          <div className="results-dashboard">
            <div className="results-row">
              <div className="result-card large">
                <div className="result-header">
                  <h3>Total Customer Savings</h3>
                  <span className="result-period">Last 12 months</span>
                </div>
                <div className="result-value">$2.3M</div>
                <div className="result-metric">
                  <div className="metric-bar">
                    <div className="metric-progress" style={{ width: '87%' }}></div>
                  </div>
                  <span className="metric-label">87% above industry average</span>
                </div>
              </div>
              <div className="result-card">
                <div className="result-header">
                  <h3>Time Reduction</h3>
                  <span className="result-period">Avg per RFP</span>
                </div>
                <div className="result-value">67%</div>
                <div className="result-comparison">
                  <div className="comparison-item">
                    <span className="comparison-label">Before</span>
                    <span className="comparison-value">6 weeks</span>
                  </div>
                  <div className="comparison-arrow">→</div>
                  <div className="comparison-item">
                    <span className="comparison-label">After</span>
                    <span className="comparison-value">2 weeks</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="results-row">
              <div className="result-card">
                <div className="result-header">
                  <h3>Win Rate Improvement</h3>
                  <span className="result-period">For contractors</span>
                </div>
                <div className="result-value">+34%</div>
                <div className="result-chart">
                  <div className="chart-bars">
                    <div className="chart-bar before">
                      <div className="bar-fill" style={{ height: '42%' }}></div>
                      <span className="bar-label">Before</span>
                    </div>
                    <div className="chart-bar after">
                      <div className="bar-fill" style={{ height: '76%' }}></div>
                      <span className="bar-label">After</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="result-card">
                <div className="result-header">
                  <h3>Vendor Qualification</h3>
                  <span className="result-period">Speed increase</span>
                </div>
                <div className="result-value">12×</div>
                <div className="result-detail">
                  <div className="detail-item">
                    <span className="detail-label">Traditional</span>
                    <span className="detail-value">2-3 days</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">With BID</span>
                    <span className="detail-value">4 hours</span>
                  </div>
                </div>
              </div>
              <div className="result-card testimonial">
                <div className="testimonial-content">
                  <p>"BID reduced our procurement cycle from 8 weeks to 2 weeks. The ROI was immediate."</p>
                  <div className="testimonial-author">
                    <div className="author-info">
                      <span className="author-name">Sarah Chen</span>
                      <span className="author-title">Procurement Director, Lockheed Martin</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq" id="faq">
        <div className="container">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about our platform</p>
          </div>
          <div className="faq-container">
            <div className="faq-item">
              <div className="faq-question">
                <span>Is the platform secure for defense contracts?</span>
                <div className="faq-icon">+</div>
              </div>
              <div className="faq-answer">
                <p>Yes, our platform meets all federal security requirements including SOC 2 Type II compliance, FedRAMP authorization, and DFARS compliance. All data is encrypted in transit and at rest.</p>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-question">
                <span>How accurate is the AI matching?</span>
                <div className="faq-icon">+</div>
              </div>
              <div className="faq-answer">
                <p>Our AI achieves 94% accuracy in vendor matching by analyzing over 200 data points including past performance, security clearances, technical capabilities, and geographic location.</p>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-question">
                <span>What file formats are supported?</span>
                <div className="faq-icon">+</div>
              </div>
              <div className="faq-answer">
                <p>We support PDF, DOCX, and TXT files up to 50MB. Our AI can extract data from complex government RFP formats including SF-33, DD-1423, and custom solicitation documents.</p>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-question">
                <span>How long does the matching process take?</span>
                <div className="faq-icon">+</div>
              </div>
              <div className="faq-answer">
                <p>Initial AI analysis completes in under 2 minutes for most RFPs. Full vendor matching and scoring typically takes 5-10 minutes depending on the complexity of requirements.</p>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-question">
                <span>Do you integrate with existing procurement systems?</span>
                <div className="faq-icon">+</div>
              </div>
              <div className="faq-answer">
                <p>Yes, we offer API integrations with major ERP systems, SAM.gov, and custom government procurement platforms. Our team provides white-glove integration support.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="brand-logo">
                <div className="logo-icon"></div>
              <span className="logo-text">BID</span>
              </div>
              <p>Streamlining defense procurement with secure, efficient RFP matching.</p>
            </div>
            <div className="footer-links">
              <div className="footer-section">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#how-it-works">How It Works</a>
                <a href="#pricing">Pricing</a>
                <a href="#security">Security</a>
              </div>
              <div className="footer-section">
                <h4>Company</h4>
                <a href="#about">About</a>
                <a href="#careers">Careers</a>
                <a href="#contact">Contact</a>
                <a href="#blog">Blog</a>
              </div>
              <div className="footer-section">
                <h4>Support</h4>
                <a href="#help">Help Center</a>
                <a href="#docs">Documentation</a>
                <a href="#privacy">Privacy</a>
                <a href="#terms">Terms</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-bottom-content">
            <p>&copy; 2024 BID. All rights reserved.</p>
              <div className="footer-badges">
                <div className="badge">SOC 2 Certified</div>
                <div className="badge">FedRAMP Authorized</div>
                <div className="badge">DFARS Compliant</div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .App {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: transparent;
          backdrop-filter: none;
          border-bottom: none;
          transition: all 0.3s ease;
        }

        .header.scrolled {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 70px;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 18px;
        }

        .logo-text {
          font-size: 28px;
          font-weight: 700;
          color: white;
          letter-spacing: -0.5px;
          transition: color 0.3s ease;
        }

        .header.scrolled .logo-text {
          color: #1e293b;
        }

        .nav {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 32px;
        }

        .nav a {
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
          font-weight: 500;
          font-size: 15px;
          transition: color 0.3s ease;
        }

        .nav a:hover {
          color: white;
        }

        .header.scrolled .nav a {
          color: #64748b;
        }

        .header.scrolled .nav a:hover {
          color: #1e293b;
        }

        .cta-button {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          color: white;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s ease;
          border: none;
          cursor: pointer;
          display: inline-block;
          box-shadow: 0 4px 14px 0 rgba(220, 38, 38, 0.3);
        }

        .cta-button:hover {
          background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px 0 rgba(220, 38, 38, 0.4);
        }

        .hero {
          position: relative;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .hero-video-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .hero-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 0.6s ease;
        }

        .hero-video.active {
          opacity: 1;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%);
          z-index: 2;
        }

        .hero-content {
          position: relative;
          z-index: 3;
          text-align: left;
          color: white;
        }

        .hero-badge {
          display: inline-block;
          background: rgba(220, 38, 38, 0.1);
          border: 1px solid rgba(220, 38, 38, 0.3);
          border-radius: 50px;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 24px;
          backdrop-filter: blur(10px);
        }

        .hero-badge span {
          color: #dc2626;
          opacity: 0.9;
        }

        .hero-text h1 {
          font-size: 64px;
          font-weight: 700;
          margin: 0 0 24px 0;
          line-height: 1.1;
          letter-spacing: -1px;
          text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        .hero-text p {
          font-size: 20px;
          margin: 0 0 40px 0;
          opacity: 0.9;
          max-width: 600px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .hero-buttons {
          display: flex;
          gap: 16px;
          justify-content: flex-start;
          align-items: center;
          margin-bottom: 48px;
        }

        .hero-stats {
          display: flex;
          gap: 40px;
          align-items: center;
        }

        .hero-stats .stat {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .hero-stats .stat-number {
          font-size: 24px;
          font-weight: 700;
          color: #dc2626;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .hero-stats .stat-label {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .secondary-button {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 500;
          font-size: 14px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
        }

        .secondary-button:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-1px);
        }

        .video-indicators {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 12px;
          z-index: 3;
        }

        .indicator {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .indicator.active {
          background: #dc2626;
          transform: scale(1.2);
          box-shadow: 0 0 10px rgba(220, 38, 38, 0.5);
        }

        .results {
          padding: 120px 0;
          background: #fafafa;
        }

        .results-header {
          text-align: center;
          margin-bottom: 80px;
        }

        .results-header h2 {
          font-size: 48px;
          font-weight: 600;
          color: #000;
          margin: 0 0 16px 0;
          letter-spacing: -1px;
        }

        .results-header p {
          font-size: 20px;
          color: #666;
          margin: 0;
        }

        .results-dashboard {
          display: flex;
          flex-direction: column;
          gap: 40px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .results-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }

        .result-card {
          background: white;
          padding: 32px;
          border-radius: 16px;
          border: 1px solid #e6e6e6;
          transition: all 0.3s ease;
          position: relative;
        }

        .result-card:hover {
          border-color: #dc2626;
          box-shadow: 0 8px 24px rgba(220, 38, 38, 0.1);
          transform: translateY(-4px);
        }

        .result-card.large {
          grid-column: span 2;
        }

        .result-card.testimonial {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          color: white;
        }

        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .result-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #000;
          margin: 0;
          letter-spacing: -0.3px;
        }

        .result-period {
          font-size: 12px;
          color: #666;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .result-value {
          font-size: 48px;
          font-weight: 700;
          color: #dc2626;
          margin-bottom: 20px;
          letter-spacing: -2px;
        }

        .result-metric {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .metric-bar {
          width: 100%;
          height: 8px;
          background: #f0f0f0;
          border-radius: 4px;
          overflow: hidden;
        }

        .metric-progress {
          height: 100%;
          background: linear-gradient(90deg, #dc2626, #b91c1c);
          border-radius: 4px;
          transition: width 2s ease;
        }

        .metric-label {
          font-size: 14px;
          color: #666;
          font-weight: 500;
        }

        .result-comparison {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .comparison-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .comparison-label {
          font-size: 12px;
          color: #666;
          font-weight: 500;
          text-transform: uppercase;
        }

        .comparison-value {
          font-size: 16px;
          font-weight: 600;
          color: #000;
        }

        .comparison-arrow {
          font-size: 20px;
          color: #dc2626;
          font-weight: 600;
        }

        .result-chart {
          margin-top: 8px;
        }

        .chart-bars {
          display: flex;
          gap: 16px;
          align-items: flex-end;
          height: 80px;
        }

        .chart-bar {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          flex: 1;
        }

        .bar-fill {
          width: 100%;
          background: linear-gradient(180deg, #dc2626, #b91c1c);
          border-radius: 4px 4px 0 0;
          transition: height 1.5s ease;
        }

        .bar-label {
          font-size: 12px;
          color: #666;
          font-weight: 500;
        }

        .result-detail {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .detail-label {
          font-size: 14px;
          color: #666;
          font-weight: 500;
        }

        .detail-value {
          font-size: 14px;
          font-weight: 600;
          color: #000;
        }

        .testimonial-content {
          color: white;
        }

        .testimonial-content p {
          font-size: 18px;
          font-weight: 500;
          line-height: 1.5;
          margin: 0 0 24px 0;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .author-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .author-name {
          font-size: 16px;
          font-weight: 600;
          color: white;
        }

        .author-title {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
        }

        .cta-section {
          padding: 120px 0;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: white;
        }

        .cta-toggle {
          display: flex;
          justify-content: center;
          margin-bottom: 60px;
          gap: 0;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 4px;
          width: fit-content;
          margin-left: auto;
          margin-right: auto;
        }

        .toggle-button {
          padding: 12px 24px;
          border: none;
          background: transparent;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .toggle-button.active {
          background: #dc2626;
          color: white;
          box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
        }

        .toggle-button:hover:not(.active) {
          color: white;
          background: rgba(255, 255, 255, 0.1);
        }

        .cta-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          transition: opacity 0.3s ease;
        }

        .cta-content.hidden {
          display: none;
        }

        .cta-text {
          text-align: left;
        }

        .cta-visual {
          display: flex;
          justify-content: center;
          align-items: center;
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

        .contract-item, .opportunity-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          border-left: 4px solid;
        }

        .contract-item.won, .opportunity-item.match {
          border-left-color: #10b981;
        }

        .contract-item.pending, .opportunity-item.potential {
          border-left-color: #f59e0b;
        }

        .contract-info, .opportunity-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          align-items: flex-start;
        }

        .contract-title, .opportunity-title {
          color: white;
          font-size: 14px;
          font-weight: 600;
        }

        .contract-value, .opportunity-value {
          color: #10b981;
          font-size: 16px;
          font-weight: 700;
        }

        .contract-status {
          color: #10b981;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 8px;
          background: rgba(16, 185, 129, 0.1);
          border-radius: 4px;
        }

        .contract-status:contains("PENDING") {
          color: #f59e0b;
          background: rgba(245, 158, 11, 0.1);
        }

        .opportunity-match {
          color: #10b981;
          font-size: 12px;
          font-weight: 600;
        }

        .cta-badge {
          display: inline-block;
          background: rgba(220, 38, 38, 0.1);
          border: 1px solid rgba(220, 38, 38, 0.3);
          padding: 8px 16px;
          border-radius: 20px;
          margin-bottom: 24px;
        }

        .cta-badge span {
          font-size: 14px;
          font-weight: 500;
          color: #dc2626;
        }

        .cta-content h2 {
          font-size: 56px;
          font-weight: 700;
          margin: 0 0 24px 0;
          letter-spacing: -1.5px;
          line-height: 1.1;
        }

        .cta-content p {
          font-size: 22px;
          margin: 0 0 48px 0;
          opacity: 0.9;
          line-height: 1.5;
          font-weight: 400;
        }

        .cta-buttons {
          display: flex;
          gap: 16px;
          justify-content: flex-start;
          align-items: center;
          margin-bottom: 80px;
        }

        .cta-button.primary {
          background: #dc2626;
          color: white;
          text-decoration: none;
          padding: 16px 32px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.2s ease;
          border: none;
          cursor: pointer;
          display: inline-block;
          box-shadow: 0 4px 14px 0 rgba(220, 38, 38, 0.4);
        }

        .cta-button.primary:hover {
          background: #b91c1c;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px 0 rgba(220, 38, 38, 0.5);
        }

        .cta-button.secondary {
          background: transparent;
          color: white;
          text-decoration: none;
          padding: 16px 32px;
          border-radius: 12px;
          font-weight: 500;
          font-size: 16px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          transition: all 0.2s ease;
          cursor: pointer;
          display: inline-block;
        }

        .cta-button.secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .cta-stats {
          display: flex;
          justify-content: flex-start;
          gap: 48px;
          opacity: 0.9;
        }

        .cta-stats .stat {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }

        .cta-stats .stat-number {
          font-size: 32px;
          font-weight: 700;
          color: #dc2626;
          letter-spacing: -0.5px;
        }

        .cta-stats .stat-label {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
        }

        .footer {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          padding: 80px 0 0 0;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(220, 38, 38, 0.3), transparent);
        }

        .footer-content {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 80px;
          margin-bottom: 60px;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .brand-logo .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 18px;
          box-shadow: 0 4px 14px rgba(220, 38, 38, 0.3);
        }

        .brand-logo .logo-text {
          font-size: 28px;
          font-weight: 700;
          color: white;
          letter-spacing: -0.5px;
        }

        .footer-brand p {
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
          font-size: 16px;
          line-height: 1.6;
          max-width: 300px;
          text-align: left;
        }



        .footer-links {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
        }

        .footer-section h4 {
          font-size: 14px;
          font-weight: 600;
          color: white;
          margin: 0 0 20px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .footer-section a {
          display: block;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          margin-bottom: 12px;
          font-size: 14px;
          transition: all 0.2s ease;
          padding: 4px 0;
        }

        .footer-section a:hover {
          color: white;
          transform: translateX(4px);
        }

        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: 32px 0;
          background: rgba(0, 0, 0, 0.2);
          margin: 0 -24px;
          padding-left: 24px;
          padding-right: 24px;
        }

        .footer-bottom-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }

        .footer-bottom p {
          color: rgba(255, 255, 255, 0.6);
          margin: 0;
          font-size: 14px;
        }

        .footer-badges {
          display: flex;
          gap: 16px;
        }

        .badge {
          background: rgba(220, 38, 38, 0.1);
          border: 1px solid rgba(220, 38, 38, 0.3);
          color: #dc2626;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
        }

        .section-header {
          text-align: center;
          margin-bottom: 80px;
        }

        .section-header h2 {
          font-size: 48px;
          font-weight: 600;
          color: #000;
          margin: 0 0 16px 0;
          letter-spacing: -1px;
        }

        .section-header p {
          font-size: 20px;
          color: #666;
          margin: 0;
        }

        .how-it-works {
          padding: 120px 0;
          background: white;
          color: #000;
        }

        .how-it-works .section-header h2 {
          font-size: 48px;
          font-weight: 600;
          color: #000;
          margin: 0 0 16px 0;
          letter-spacing: -1px;
        }

        .how-it-works .section-header p {
          font-size: 20px;
          color: #666;
          margin: 0;
        }

        .process-card {
          max-width: 1200px;
          margin: 0 auto;
          background: #1e2937;
          border-radius: 20px;
          padding: 0;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          overflow: hidden;
        }

        .process-tabs {
          display: flex;
          background: rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .tab-button {
          flex: 1;
          padding: 24px;
          border: none;
          background: transparent;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          transition: all 0.3s ease;
          border-bottom: 3px solid transparent;
          position: relative;
        }

        .tab-button:hover {
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.8);
        }

        .tab-button.active {
          color: white;
          background: rgba(220, 38, 38, 0.1);
          border-bottom-color: #dc2626;
        }

        .tab-number {
          display: block;
          font-size: 16px;
          font-weight: 700;
          color: #dc2626;
          margin-bottom: 8px;
        }

        .tab-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .tab-content {
          display: none;
          padding: 40px;
        }

        .tab-content.active {
          display: block;
        }

        .tab-panel {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .step-visual {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .step-mockup {
          background: #1e2937;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          width: 100%;
          max-width: 400px;
          transition: all 0.3s ease;
        }

        .step-mockup:hover {
          transform: translateY(-5px);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
        }

        .mockup-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .mockup-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
        }

        .mockup-dot:first-child {
          background: #ef4444;
        }

        .mockup-dot:nth-child(2) {
          background: #f59e0b;
        }

        .mockup-dot:nth-child(3) {
          background: #10b981;
        }

        .mockup-title {
          color: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          font-weight: 600;
          margin-left: auto;
        }

        .mockup-content {
          min-height: 160px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;
        }

        .upload-zone {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
          padding: 16px;
        }

        .upload-dropzone {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 24px;
          border: 2px dashed rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.02);
          transition: all 0.3s ease;
        }

        .upload-dropzone:hover {
          border-color: rgba(255, 255, 255, 0.5);
          background: rgba(255, 255, 255, 0.05);
        }

        .upload-icon {
          font-size: 36px;
          margin-bottom: 4px;
        }

        .upload-main-text {
          color: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          font-weight: 500;
          text-align: center;
        }

        .upload-sub-text {
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
          text-align: center;
        }

        .upload-button {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.3);
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          margin-top: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .upload-button:hover {
          background: rgba(16, 185, 129, 0.2);
          border-color: rgba(16, 185, 129, 0.5);
        }

        .upload-file-info {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .file-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .file-name {
          color: rgba(255, 255, 255, 0.9);
          font-size: 13px;
          font-weight: 500;
        }

        .file-size {
          color: rgba(255, 255, 255, 0.6);
          font-size: 11px;
        }

        .upload-progress {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
        }

        .progress-bar {
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
          position: relative;
        }

        .progress-bar::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 75%;
          height: 100%;
          background: linear-gradient(90deg, #10b981, #059669);
          border-radius: 2px;
          animation: pulse 2s infinite;
        }

        .progress-text {
          color: rgba(255, 255, 255, 0.7);
          font-size: 11px;
          text-align: center;
          font-weight: 500;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .analysis-results {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
        }

        .analysis-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          border-left: 3px solid #f59e0b;
        }

        .analysis-status {
          color: rgba(255, 255, 255, 0.9);
          font-size: 13px;
          font-weight: 500;
        }

        .analysis-progress {
          color: #f59e0b;
          font-size: 14px;
          font-weight: 700;
        }

        .match-results {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .match-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          border-left: 3px solid;
        }

        .match-item.high-match {
          border-left-color: #10b981;
        }

        .match-item.medium-match {
          border-left-color: #f59e0b;
        }

        .match-item.low-match {
          border-left-color: #6b7280;
        }

        .match-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .vendor-name {
          color: rgba(255, 255, 255, 0.9);
          font-size: 13px;
          font-weight: 600;
        }

        .capabilities {
          color: rgba(255, 255, 255, 0.6);
          font-size: 11px;
          font-weight: 400;
        }

        .match-score {
          font-size: 14px;
          font-weight: 700;
        }

        .high-match .match-score {
          color: #10b981;
        }

        .medium-match .match-score {
          color: #f59e0b;
        }

        .low-match .match-score {
          color: #6b7280;
        }

        .award-interface {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
        }

        .award-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          border-left: 3px solid #10b981;
        }

        .award-title {
          color: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          font-weight: 600;
        }

        .award-value {
          color: #10b981;
          font-size: 16px;
          font-weight: 700;
        }

        .selected-vendor {
          width: 100%;
        }

        .vendor-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: rgba(16, 185, 129, 0.1);
          border-radius: 8px;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .vendor-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .vendor-name {
          color: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          font-weight: 600;
        }

        .vendor-details {
          color: rgba(255, 255, 255, 0.6);
          font-size: 11px;
          font-weight: 400;
        }

        .award-badge {
          background: #10b981;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .award-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .action-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
        }

        .action-text {
          color: rgba(255, 255, 255, 0.8);
          font-size: 12px;
          font-weight: 400;
        }

        .action-status {
          font-size: 12px;
          font-weight: 600;
        }

        .action-status.completed {
          color: #10b981;
        }

        .action-status.pending {
          color: #f59e0b;
        }

        .step-info {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .step-badge {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .step-number {
          font-size: 48px;
          font-weight: 900;
          color: #dc2626;
          letter-spacing: -2px;
          line-height: 1;
        }

        .step-label {
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 2px;
        }

        .step-info h3 {
          font-size: 32px;
          font-weight: 700;
          color: white;
          margin: 0;
          letter-spacing: -1px;
        }

        .step-info p {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
          line-height: 1.6;
        }

        .step-metric {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 20px;
          background: rgba(220, 38, 38, 0.1);
          border: 1px solid rgba(220, 38, 38, 0.3);
          border-radius: 12px;
          max-width: 200px;
        }

        .metric-value {
          font-size: 32px;
          font-weight: 700;
          color: #dc2626;
          letter-spacing: -1px;
        }

        .metric-label {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
        }

                 .faq {
           padding: 120px 0;
           background: white;
         }

        .faq .section-header h2 {
          font-size: 48px;
          font-weight: 600;
          color: #000;
          margin: 0 0 16px 0;
          letter-spacing: -1px;
        }

        .faq .section-header p {
          font-size: 20px;
          color: #666;
          margin: 0;
        }

        .faq-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .faq-item {
          background: white;
          border: 1px solid #e6e6e6;
          border-radius: 12px;
          margin-bottom: 20px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .faq-item:hover {
          border-color: #dc2626;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.1);
        }

        .faq-question {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 30px;
          cursor: pointer;
          background: #f9f9f9;
          border-bottom: 1px solid #e6e6e6;
        }

        .faq-question span {
          font-size: 18px;
          font-weight: 500;
          color: #000;
        }

        .faq-icon {
          font-size: 24px;
          color: #dc2626;
          transition: transform 0.3s ease;
        }

        .faq-answer {
          padding: 0 30px 20px 30px;
          font-size: 16px;
          color: #666;
          line-height: 1.6;
          display: none;
        }

        .faq-item.active .faq-answer {
          display: block;
        }

        .faq-item.active .faq-icon {
          transform: rotate(180deg);
        }

        .integrations {
          padding: 120px 0;
          background: #fafafa;
        }

        .integrations .section-header h2 {
          font-size: 48px;
          font-weight: 600;
          color: #000;
          margin: 0 0 16px 0;
          letter-spacing: -1px;
        }

        .integrations .section-header p {
          font-size: 20px;
          color: #666;
          margin: 0;
        }

        .integration-categories {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 40px;
        }

        .integration-category h3 {
          font-size: 28px;
          font-weight: 600;
          color: #000;
          margin: 0 0 20px 0;
          letter-spacing: -0.5px;
        }

        .integration-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 20px;
        }

        .integration-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #e6e6e6;
          text-align: center;
          transition: all 0.2s ease;
        }

        .integration-card:hover {
          border-color: #dc2626;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.1);
          transform: translateY(-2px);
        }

        .integration-logo {
          font-size: 40px;
          color: #dc2626;
          margin-bottom: 10px;
          font-weight: bold;
        }

        .integration-card p {
          font-size: 14px;
          color: #666;
          margin: 0;
        }

        @media (max-width: 768px) {
          .nav {
            display: none;
          }

          .hero-text h1 {
            font-size: 48px;
          }

          .hero-text p {
            font-size: 18px;
          }

          .hero-buttons {
            flex-direction: column;
            align-items: flex-start;
          }

          .hero-stats {
            gap: 24px;
            flex-wrap: wrap;
          }

          .hero-stats .stat-number {
            font-size: 20px;
          }

          .hero-stats .stat-label {
            font-size: 13px;
          }

          .results-header h2 {
            font-size: 36px;
          }

          .results-row {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .result-card {
            padding: 24px;
          }

          .result-card.large {
            grid-column: span 1;
          }

          .result-value {
            font-size: 36px;
          }

          .chart-bars {
            height: 60px;
          }

          .testimonial-content p {
            font-size: 16px;
          }

          .cta-content {
            grid-template-columns: 1fr;
            gap: 40px;
            text-align: center;
          }

          .cta-text {
            text-align: center;
          }

          .cta-content h2 {
            font-size: 40px;
          }

          .cta-content p {
            font-size: 18px;
          }

          .cta-buttons {
            flex-direction: column;
            gap: 12px;
            margin-bottom: 60px;
          }

          .cta-button.primary,
          .cta-button.secondary {
            padding: 14px 28px;
            font-size: 15px;
          }

          .cta-stats {
            flex-direction: column;
            gap: 32px;
            align-items: center;
          }

          .cta-stats .stat {
            align-items: center;
          }

          .cta-stats .stat-number {
            font-size: 28px;
          }

          .cta-toggle {
            margin-bottom: 40px;
          }

          .toggle-button {
            padding: 10px 20px;
            font-size: 13px;
          }

          .mockup-screen {
            max-width: 300px;
          }

          .contract-title, .opportunity-title {
            font-size: 13px;
          }

          .contract-value, .opportunity-value {
            font-size: 14px;
          }

          .footer-content {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .footer-links {
            grid-template-columns: 1fr;
            gap: 24px;
          }



          .footer-bottom-content {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }

          .footer-badges {
            justify-content: center;
            gap: 8px;
          }

          .badge {
            font-size: 11px;
            padding: 4px 8px;
          }

          .how-it-works .section-header h2 {
            font-size: 36px;
          }

          .how-it-works .section-header p {
            font-size: 18px;
          }

          .process-card {
            margin: 0 20px;
          }

          .process-tabs {
            flex-direction: column;
          }

          .tab-button {
            text-align: center;
            padding: 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .tab-button.active {
            border-bottom-color: #dc2626;
          }

          .tab-content {
            padding: 30px 20px;
          }

          .tab-panel {
            grid-template-columns: 1fr;
            gap: 30px;
            text-align: center;
          }

          .step-mockup {
            max-width: 320px;
            margin: 0 auto;
          }

          .step-number {
            font-size: 36px;
          }

          .step-info h3 {
            font-size: 28px;
          }

          .step-info p {
            font-size: 16px;
          }

          .step-metric {
            margin: 0 auto;
          }

          .metric-value {
            font-size: 28px;
          }

          .faq .section-header h2 {
            font-size: 36px;
          }

          .faq .section-header p {
            font-size: 18px;
          }

          .faq-container {
            padding: 0 20px;
          }

          .faq-item {
            padding: 15px 20px;
          }

          .faq-question {
            padding: 15px 20px;
          }

          .faq-answer {
            padding: 0 20px 15px 20px;
          }

          .integrations .section-header h2 {
            font-size: 36px;
          }

          .integrations .section-header p {
            font-size: 18px;
          }

          .integration-categories {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .integration-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .integration-card {
            padding: 15px;
          }

          .integration-logo {
            font-size: 30px;
          }

          .integration-card p {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  )
}

// Main App Router component
const AppRouter = () => {
  const { isAuthenticated, isVendor, isContractor, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route 
        path="/login" 
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login />
          )
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          isAuthenticated ? (
            isVendor ? <VendorDashboard /> : <ContractorDashboard />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRouter />
        <style jsx global>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: #fafafa;
          }
          
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #e6e6e6;
            border-top: 4px solid #dc2626;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 16px;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .loading-container p {
            color: #666;
            font-size: 14px;
          }
        `}</style>
      </Router>
    </AuthProvider>
  )
}

export default App 