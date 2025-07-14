import React, { useState, useEffect } from 'react'
import { BenefitsSection } from './BenefitsSection'

function App() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  
  const videos = [
    '13668624_3840_2160_25fps.mp4',
    '3309765-uhd_3840_2160_30fps.mp4',
    '6201055-uhd_3840_2160_25fps.mp4',
    '6333333-hd_1920_1080_24fps.mp4'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentVideoIndex((prev) => (prev + 1) % videos.length)
        setTimeout(() => {
          setIsTransitioning(false)
        }, 300) // Match the CSS transition duration
      }, 300) // Half of the transition time
    }, 8000) // Change video every 8 seconds

    return () => clearInterval(interval)
  }, [videos.length])

  // Add scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      setIsScrolled(scrollTop > 50) // Start transition after 50px scroll
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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
                <li><a href="#features">Features</a></li>
                <li><a href="#vendors">Vendors</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </nav>
            <a href="#get-started" className="cta-button">Get Started</a>
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
              <h1>RFP Analysis.<br />Vendor Matching.<br />Done.</h1>
              <p>
                The platform defense contractors trust to analyze RFPs and connect with qualified vendors. 
                Streamline procurement. Accelerate wins.
              </p>
              <div className="hero-buttons">
                <a href="#get-started" className="cta-button">Start Analyzing</a>
                <a href="#learn-more" className="secondary-button">See How It Works</a>
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

      {/* Benefits Section */}
      <BenefitsSection />

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <h2>Why Choose DefenseConnect?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Smart RFP Matching</h3>
              <p>
                Our AI-powered system matches your RFPs with the most qualified vendors based on capabilities, 
                clearance levels, and past performance.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Security Compliance</h3>
              <p>
                All vendors are pre-screened for security clearances and compliance with defense industry 
                standards including DFARS and ITAR.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Trusted Network</h3>
              <p>
                Access to over 10,000 verified defense contractors and suppliers with proven track records 
                in government contracting.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Fast Processing</h3>
              <p>
                Reduce procurement timelines by 60% with automated matching, digital documentation, 
                and streamlined approval workflows.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Analytics & Insights</h3>
              <p>
                Real-time dashboards and comprehensive reporting to track RFP performance, vendor metrics, 
                and procurement efficiency.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Platform</h3>
              <p>
                Enterprise-grade security with encryption, audit trails, and compliance with federal 
                cybersecurity requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Transform Your Procurement Process?</h2>
          <p>
            Join hundreds of defense contractors who trust DefenseConnect to streamline their RFP process 
            and connect with qualified vendors.
          </p>
          <a href="#contact" className="cta-button">Schedule a Demo</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#security">Security</a>
            <a href="#support">Support</a>
          </div>
          <p>&copy; 2024 DefenseConnect. All rights reserved.</p>
          <p>Streamlining defense procurement with secure, efficient RFP matching.</p>
        </div>
      </footer>
    </div>
  )
}

export default App 