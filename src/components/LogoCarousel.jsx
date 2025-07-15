import React from 'react'

export function LogoCarousel() {
  const logos = [
    {
      name: 'Boeing',
      src: '/assets/Boeing_full_logo.svg.png',
      alt: 'Boeing Logo'
    },
    {
      name: 'Lockheed Martin',
      src: '/assets/Lockheed_Martin_logo.svg.png',
      alt: 'Lockheed Martin Logo'
    },
    {
      name: 'Raytheon Technologies',
      src: '/assets/Raytheon_Technologies_logo.svg.png',
      alt: 'Raytheon Technologies Logo'
    },
    {
      name: 'Palantir',
      src: '/assets/Palantir_company_logo.png',
      alt: 'Palantir Logo'
    },
    {
      name: 'Canadian Forces',
      src: '/assets/Canadian_Forces_emblem.svg.png',
      alt: 'Canadian Forces Emblem'
    },
    {
      name: 'Government of Canada',
      src: '/assets/canada-wordmark-colour.png',
      alt: 'Government of Canada Wordmark'
    }
  ]

  return (
    <section className="logo-carousel-section">
      <div className="container">
        <div className="logo-carousel">
          <div className="logo-track">
            {/* First set of logos */}
            {logos.map((logo, index) => (
              <div key={`first-${index}`} className="logo-item">
                <img 
                  src={logo.src} 
                  alt={logo.alt}
                  className="logo-image"
                />
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {logos.map((logo, index) => (
              <div key={`second-${index}`} className="logo-item">
                <img 
                  src={logo.src} 
                  alt={logo.alt}
                  className="logo-image"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 