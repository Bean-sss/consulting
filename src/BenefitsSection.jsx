import React from 'react'
import { Badge } from './components/ui/badge'
import { Card } from './components/ui/card'
import { Upload, Users, BarChart3, CheckCircle } from 'lucide-react'

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
                Instant vendor matches
              </h3>
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
                Ranked shortlists in seconds—no spreadsheets required.
              </p>
            </div>

            <div>
              {/* Mockup: Vendor Matching Dashboard */}
              <div className="relative max-w-2xl mx-auto">
                <div className="bg-gray-800 rounded-t-xl p-3 shadow-2xl">
                  {/* Browser Top Bar */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex-1 bg-gray-700 rounded px-3 py-1 ml-4">
                      <span className="text-gray-300 text-xs">defenseconnect.com/vendors</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg overflow-hidden">
                    {/* Dashboard Header */}
                    <div className="bg-red-600 text-white px-6 py-3">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-lg">DefenseConnect</div>
                        <div className="text-sm opacity-90">Vendor Matching Results</div>
                      </div>
                    </div>

                    {/* Matching Results */}
                    <div className="p-6">
                      <div className="text-sm text-gray-600 mb-4">Found 12 qualified vendors for your RFP</div>

                      <div className="space-y-4">
                        {/* Top Match */}
                        <div className="border-2 border-green-200 rounded-lg overflow-hidden bg-green-50">
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                                  <Users className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-900">Lockheed Martin</h4>
                                  <p className="text-sm text-gray-600">Aerospace & Defense</p>
                                </div>
                              </div>
                              <Badge className="bg-green-600 text-white">98% Match</Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Security:</span>
                                <span className="font-medium ml-1">Top Secret</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Experience:</span>
                                <span className="font-medium ml-1">15+ years</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Past Performance:</span>
                                <span className="font-medium ml-1">Excellent</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Other Matches */}
                        <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                <Users className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900">Boeing Defense</h4>
                                <p className="text-sm text-gray-600">Defense Systems</p>
                              </div>
                            </div>
                            <Badge variant="secondary">95% Match</Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Security:</span>
                              <span className="font-medium ml-1">Secret</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Experience:</span>
                              <span className="font-medium ml-1">12+ years</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Past Performance:</span>
                              <span className="font-medium ml-1">Very Good</span>
                            </div>
                          </div>
                        </div>

                        <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                                <Users className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900">Raytheon Technologies</h4>
                                <p className="text-sm text-gray-600">Advanced Technology</p>
                              </div>
                            </div>
                            <Badge variant="secondary">92% Match</Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Security:</span>
                              <span className="font-medium ml-1">Top Secret</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Experience:</span>
                              <span className="font-medium ml-1">10+ years</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Past Performance:</span>
                              <span className="font-medium ml-1">Good</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Laptop Base */}
                <div className="bg-gray-300 h-4 rounded-b-2xl shadow-lg"></div>
                <div className="bg-gray-400 h-2 w-16 mx-auto rounded-b-lg"></div>
              </div>
            </div>
          </div>

          {/* Benefit 3: Faster Project Completion */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              {/* Mockup: Deal Velocity Dashboard */}
              <div className="relative max-w-lg mx-auto">
                <Card className="p-6 shadow-2xl bg-white">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="font-bold text-gray-900">Deal Velocity</div>
                    <BarChart3 className="w-5 h-5 text-accent" />
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Traditional</p>
                      <p className="text-2xl font-bold text-red-600">6-8 wks</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">With AI</p>
                      <p className="text-2xl font-bold text-green-600">3 days</p>
                    </div>
                  </div>

                  {/* Simple Bar Chart */}
                  <div className="flex items-end gap-2 h-24">
                    <div className="flex-1 bg-red-200 rounded-t-lg" style={{ height: '80%' }}></div>
                    <div className="flex-1 bg-green-300 rounded-t-lg" style={{ height: '20%' }}></div>
                  </div>
                </Card>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-6">
              <h3 className="text-3xl lg:text-4xl font-bold text-primary">
                Close deals 5× faster
              </h3>
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
                From 6-week cycles to 3-day turnarounds—see the speed on your dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 