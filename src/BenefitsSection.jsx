import React, { useState } from 'react'
import { Badge } from './components/ui/badge'
import { Card } from './components/ui/card'
import { Upload, Users, BarChart3, LineChart, CheckCircle } from 'lucide-react'
import AutoFillRfpCard from "./components/AutoFillrfpCard"

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
              {/* Mockup: RFP Upload Interface */}
              <div className="relative max-w-md mx-auto">
                <Card className="p-6 shadow-2xl bg-white">
                  <div className="space-y-4">
                    <AutoFillRfpCard onDataExtracted={handleDataExtracted} />


                    {/* Auto-filled fields */}
                    <div className="space-y-2">
                      {fieldConfig.map((field) => (
                        <div key={field.key} className="flex justify-between items-center bg-gray-50 border rounded-lg px-3 py-2">
                          <span className="text-sm text-gray-700">{field.label}</span>
                          {fieldStates[field.key] && (
                            <CheckCircle className="w-4 h-4 text-green-500 animate-pulse" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
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
              {/* Mockup: Modern Monitor with Defense Contractor Matching */}
              <div className="relative max-w-4xl mx-auto">
                {/* Monitor Container */}
                <div className="relative">
                  {/* Monitor Bezel - Like Apple Studio Display */}
                  <div className="bg-gradient-to-b from-gray-200 to-gray-300 rounded-2xl p-6 shadow-2xl" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)' }}>
                    {/* Inner Screen Frame */}
                    <div className="bg-gray-700 rounded-xl p-4 relative overflow-hidden">
                      {/* Browser Chrome */}
                      <div className="flex items-center mb-3">
                        <div className="flex gap-2 mr-4">
                          <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors cursor-pointer shadow-sm"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors cursor-pointer shadow-sm"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors cursor-pointer shadow-sm"></div>
                        </div>
                        <div className="flex-1 bg-gray-100 rounded-md px-4 py-1.5 border border-gray-200 shadow-inner">
                          <span className="text-gray-700 text-sm">🔒 bid.com/vendors</span>
                        </div>
                      </div>

                      {/* Screen Content */}
                      <div className="bg-white rounded-md overflow-hidden shadow-lg" style={{ aspectRatio: '16/9' }}>
                        {/* App Interface */}
                        <div className="p-8 h-full">
                          <div className="mb-8">
                            <h3 className="text-3xl font-bold text-gray-900 mb-2">Vendor Matches</h3>
                            <div className="text-base text-gray-600">Showing 3 of 47 qualified vendors</div>
                          </div>

                          <div className="space-y-6">
                            {/* Top Match */}
                            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
                                    <span className="text-white font-bold text-xl">P</span>
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-gray-900 text-lg">Palantir Technologies</h4>
                                    <p className="text-gray-600">Data Analytics & AI Platform</p>
                                  </div>
                                </div>
                                <div className="text-3xl font-bold text-blue-600">97%</div>
                              </div>
                            </div>

                            {/* Second Match */}
                            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-gray-400">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="w-14 h-14 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center shadow-md">
                                    <span className="text-white font-bold text-xl">L</span>
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-gray-900 text-lg">Lockheed Martin</h4>
                                    <p className="text-gray-600">Aerospace & Defense Systems</p>
                                  </div>
                                </div>
                                <div className="text-3xl font-bold text-gray-600">94%</div>
                              </div>
                            </div>

                            {/* Third Match */}
                            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-red-300">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-md">
                                    <span className="text-white font-bold text-xl">R</span>
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-gray-900 text-lg">Raytheon Technologies</h4>
                                    <p className="text-gray-600">Integrated Defense Solutions</p>
                                  </div>
                                </div>
                                <div className="text-3xl font-bold text-gray-600">91%</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Monitor Base */}
                  <div className="relative mt-4">
                    {/* Slim Monitor Stand */}
                    <div className="w-24 h-6 bg-gradient-to-b from-gray-300 to-gray-400 rounded-lg mx-auto shadow-md"></div>
                    {/* Monitor Base */}
                    <div className="w-32 h-3 bg-gradient-to-b from-gray-400 to-gray-500 rounded-full mx-auto mt-1 shadow-sm"></div>
                  </div>

                  {/* Subtle Screen Glow */}
                  <div className="absolute inset-6 bg-gradient-to-t from-blue-500/3 to-transparent rounded-xl pointer-events-none"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Benefit 3: Faster Project Completion */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              {/* Mockup: Pipeline Velocity Dashboard */}
              <div className="relative max-w-xl mx-auto">
                <Card className="p-6 shadow-2xl bg-white">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="font-bold text-gray-900">Pipeline Velocity</div>
                    <LineChart className="w-5 h-5 text-accent" />
                  </div>

                  {/* Line Graph */}
                  <svg viewBox="0 0 160 60" className="w-full h-24 text-accent mb-6">
                    <polyline
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points="0,55 20,45 40,35 60,25 80,28 100,18 120,12 140,8 160,5"
                    />
                  </svg>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Traditional</p>
                      <p className="text-2xl font-bold text-red-600">6-8 wks</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">With AI</p>
                      <p className="text-2xl font-bold text-green-600">3 days</p>
                    </div>
                  </div>
                </Card>
              </div>
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
