import React from 'react'
import { Badge } from './components/ui/badge'
import { Card } from './components/ui/card'
import { Upload, Users, BarChart3, LineChart, CheckCircle } from 'lucide-react'

export function BenefitsSection() {
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
                    <div className="text-center">
                      <Upload className="w-10 h-10 text-accent mx-auto mb-2" />
                      <h4 className="font-bold text-gray-900">Auto-Filled RFP Form</h4>
                      <p className="text-sm text-gray-600">AI populates every field</p>
                    </div>

                    {/* Auto-filled fields */}
                    <div className="space-y-2">
                      {['Project Title', 'Budget Range', 'Security Clearance', 'Timeline'].map((f) => (
                        <div key={f} className="flex justify-between items-center bg-gray-50 border rounded-lg px-3 py-2">
                          <span className="text-sm text-gray-700">{f}</span>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        </div>
                      ))}
                    </div>

                    <div className="text-center pt-2">
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200">0 fields to type</Badge>
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
              {/* Mockup: Computer Screen with Defense Contractor Matching */}
              <div className="relative max-w-4xl mx-auto">
                {/* Computer Screen with Proper Bezels */}
                <div className="bg-gray-900 rounded-t-2xl p-8 shadow-2xl border-8 border-gray-800">
                  {/* Browser Top Bar */}
                  <div className="flex items-center mb-6">
                    <div className="flex gap-2 mr-4">
                      <div className="w-4 h-4 rounded-full bg-red-500"></div>
                      <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                      <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex-1 bg-gray-700 rounded-lg px-4 py-2 border border-gray-600">
                      <span className="text-gray-300 text-sm">bid.com/vendors</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg overflow-hidden aspect-video">
                    {/* Vendor Grid */}
                    <div className="p-8 h-full">
                      <div className="mb-8">
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">Vendor Matches</h3>
                        <div className="text-base text-gray-600">Showing 3 of 47 qualified vendors</div>
                      </div>

                      <div className="space-y-6">
                        {/* Top Match */}
                        <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center">
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
                        <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-gray-800 rounded-lg flex items-center justify-center">
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
                        <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-red-600 rounded-lg flex items-center justify-center">
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

                {/* Laptop Base with Proper Perspective */}
                <div className="bg-gray-300 h-6 rounded-b-2xl shadow-lg border-x-8 border-b-8 border-gray-400"></div>
                <div className="bg-gray-400 h-3 w-24 mx-auto rounded-b-lg shadow-md"></div>
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
