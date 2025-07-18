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
              <h1>RFP Analysis.<br />Vendor Matching.<br />Done.</h1>
              <p>
                The platform defense contractors trust to analyze RFPs and connect with qualified vendors. 
                Streamline procurement. Accelerate wins.
              </p>
              <div className="hero-buttons">
                <a href="/login" className="cta-button">Start Analyzing</a>
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

      {/* Logo Carousel */}
      <LogoCarousel />

      {/* Benefits Section */}
      <BenefitsSection />

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <div className="features-header">
            <h2>Why Choose BID?</h2>
            <p>Everything you need to streamline defense procurement</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Smart RFP Matching</h3>
              <p>
                AI-powered system matches RFPs with qualified vendors based on capabilities, 
                clearance levels, and past performance.
              </p>
            </div>
            <div className="feature-card">
              <h3>Security Compliance</h3>
              <p>
                Pre-screened vendors with security clearances and compliance with defense industry 
                standards including DFARS and ITAR.
              </p>
            </div>
            <div className="feature-card">
              <h3>Trusted Network</h3>
              <p>
                Access to verified defense contractors and suppliers with proven track records 
                in government contracting.
              </p>
            </div>
            <div className="feature-card">
              <h3>Fast Processing</h3>
              <p>
                Reduce procurement timelines with automated matching, digital documentation, 
                and streamlined approval workflows.
              </p>
            </div>
            <div className="feature-card">
              <h3>Analytics & Insights</h3>
              <p>
                Real-time dashboards and comprehensive reporting to track RFP performance and 
                procurement efficiency.
              </p>
            </div>
            <div className="feature-card">
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
          <div className="cta-content">
            <h2>Ready to Transform Your Procurement?</h2>
            <p>
              Join defense contractors who trust BID to streamline their RFP process 
              and connect with qualified vendors.
            </p>
            <a href="/login" className="cta-button">Get Started Today</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <span className="logo-text">BID</span>
              <p>Streamlining defense procurement with secure, efficient RFP matching.</p>
            </div>
            <div className="footer-links">
              <div className="footer-section">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#pricing">Pricing</a>
                <a href="#security">Security</a>
              </div>
              <div className="footer-section">
                <h4>Company</h4>
                <a href="#about">About</a>
                <a href="#careers">Careers</a>
                <a href="#contact">Contact</a>
              </div>
              <div className="footer-section">
                <h4>Support</h4>
                <a href="#help">Help Center</a>
                <a href="#privacy">Privacy</a>
                <a href="#terms">Terms</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 BID. All rights reserved.</p>
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
          text-align: center;
          color: white;
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
          margin-left: auto;
          margin-right: auto;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .hero-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          align-items: center;
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

        .features {
          padding: 120px 0;
          background: #fafafa;
        }

        .features-header {
          text-align: center;
          margin-bottom: 80px;
        }

        .features-header h2 {
          font-size: 48px;
          font-weight: 600;
          color: #000;
          margin: 0 0 16px 0;
          letter-spacing: -1px;
        }

        .features-header p {
          font-size: 20px;
          color: #666;
          margin: 0;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 40px;
        }

        .feature-card {
          background: white;
          padding: 40px;
          border-radius: 12px;
          border: 1px solid #e6e6e6;
          transition: all 0.2s ease;
        }

        .feature-card:hover {
          border-color: #dc2626;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.1);
          transform: translateY(-2px);
        }

        .feature-card h3 {
          font-size: 24px;
          font-weight: 600;
          color: #000;
          margin: 0 0 16px 0;
          letter-spacing: -0.5px;
        }

        .feature-card p {
          font-size: 16px;
          color: #666;
          margin: 0;
          line-height: 1.6;
        }

        .cta-section {
          padding: 120px 0;
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          color: white;
        }

        .cta-content {
          text-align: center;
        }

        .cta-content h2 {
          font-size: 48px;
          font-weight: 600;
          margin: 0 0 16px 0;
          letter-spacing: -1px;
        }

        .cta-content p {
          font-size: 20px;
          margin: 0 0 40px 0;
          opacity: 0.8;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .footer {
          background: #fafafa;
          padding: 80px 0 40px 0;
          border-top: 1px solid #e6e6e6;
        }

        .footer-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          margin-bottom: 60px;
        }

        .footer-brand .logo-text {
          font-size: 24px;
          font-weight: 600;
          color: #000;
          letter-spacing: -0.5px;
        }

        .footer-brand p {
          color: #666;
          margin: 16px 0 0 0;
          font-size: 16px;
        }

        .footer-links {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
        }

        .footer-section h4 {
          font-size: 14px;
          font-weight: 600;
          color: #000;
          margin: 0 0 16px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .footer-section a {
          display: block;
          color: #666;
          text-decoration: none;
          margin-bottom: 12px;
          font-size: 14px;
          transition: color 0.2s ease;
        }

        .footer-section a:hover {
          color: #000;
        }

        .footer-bottom {
          text-align: center;
          padding-top: 40px;
          border-top: 1px solid #e6e6e6;
        }

        .footer-bottom p {
          color: #666;
          margin: 0;
          font-size: 14px;
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
            align-items: center;
          }

          .features-header h2 {
            font-size: 36px;
          }

          .features-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .feature-card {
            padding: 24px;
          }

          .cta-content h2 {
            font-size: 36px;
          }

          .footer-content {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .footer-links {
            grid-template-columns: 1fr;
            gap: 24px;
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