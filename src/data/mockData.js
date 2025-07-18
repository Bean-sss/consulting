// Mock RFP data
export const mockRFPs = [
  {
    id: 1,
    title: 'Cybersecurity Infrastructure Enhancement',
    rfpNumber: 'DOD-2024-001',
    agency: 'Department of Defense',
    submittedDate: '2024-01-15',
    dueDate: '2024-02-15',
    status: 'Active',
    budget: '$2.5M - $5M',
    clearanceRequired: 'Top Secret',
    description: 'Seeking advanced cybersecurity solutions to enhance critical infrastructure protection.',
    requirements: ['FISMA Compliance', 'Zero Trust Architecture', '24/7 SOC', 'Threat Intelligence'],
    matchingScore: 92,
    vendors: ['Defense Solutions Inc.', 'CyberGuard Systems', 'SecureNet Technologies'],
    categories: ['Cybersecurity', 'Infrastructure', 'Monitoring']
  },
  {
    id: 2,
    title: 'Autonomous Vehicle Navigation System',
    rfpNumber: 'ARMY-2024-002',
    agency: 'U.S. Army',
    submittedDate: '2024-01-10',
    dueDate: '2024-03-01',
    status: 'Active',
    budget: '$10M - $20M',
    clearanceRequired: 'Secret',
    description: 'Development of AI-powered navigation systems for autonomous military vehicles.',
    requirements: ['AI/ML Expertise', 'Real-time Processing', 'Ruggedized Hardware', 'GPS-denied Navigation'],
    matchingScore: 88,
    vendors: ['Autonomous Systems Corp.', 'Military AI Solutions', 'Robotics Defense Inc.'],
    categories: ['AI/ML', 'Autonomous Systems', 'Navigation']
  },
  {
    id: 3,
    title: 'Satellite Communication Upgrade',
    rfpNumber: 'SPACEFORCE-2024-003',
    agency: 'Space Force',
    submittedDate: '2024-01-20',
    dueDate: '2024-04-01',
    status: 'Active',
    budget: '$15M - $30M',
    clearanceRequired: 'Top Secret',
    description: 'Modernization of satellite communication systems for enhanced global connectivity.',
    requirements: ['Satellite Systems', 'Encryption', 'Ground Station Integration', 'Latency Optimization'],
    matchingScore: 85,
    vendors: ['Space Communications Ltd.', 'Orbital Systems Inc.', 'Satellite Solutions Corp.'],
    categories: ['Satellite', 'Communications', 'Space Systems']
  },
  {
    id: 4,
    title: 'Drone Swarm Intelligence Platform',
    rfpNumber: 'NAVY-2024-004',
    agency: 'U.S. Navy',
    submittedDate: '2024-01-25',
    dueDate: '2024-05-15',
    status: 'Draft',
    budget: '$5M - $10M',
    clearanceRequired: 'Secret',
    description: 'AI-powered coordination system for autonomous drone swarms in maritime operations.',
    requirements: ['Swarm Intelligence', 'Maritime Operations', 'Autonomous Coordination', 'Real-time Analytics'],
    matchingScore: 78,
    vendors: ['Drone Defense Systems', 'Maritime AI Corp.', 'Swarm Technologies Inc.'],
    categories: ['Drones', 'AI/ML', 'Maritime']
  }
]

// Mock vendor data
export const mockVendors = [
  {
    id: 1,
    name: 'Defense Solutions Inc.',
    logo: '/api/placeholder/50/50',
    rating: 4.8,
    location: 'Arlington, VA',
    employees: '500-1000',
    founded: '2010',
    clearanceLevel: 'Top Secret',
    certifications: ['DFARS', 'ITAR', 'ISO 27001', 'CMMC Level 3'],
    capabilities: ['Cybersecurity', 'Software Development', 'Systems Integration', 'Cloud Solutions'],
    pastPerformance: 98,
    activeContracts: 12,
    totalContractValue: '$45M',
    specialties: ['Zero Trust Architecture', 'Threat Intelligence', 'Incident Response'],
    matchingRFPs: [1, 2],
    description: 'Leading cybersecurity solutions provider specializing in defense applications.',
    keyPersonnel: ['Dr. Sarah Chen - CTO', 'Michael Rodriguez - VP Engineering'],
    recentWins: ['NSA Cybersecurity Enhancement', 'Army Network Defense']
  },
  {
    id: 2,
    name: 'Autonomous Systems Corp.',
    logo: '/api/placeholder/50/50',
    rating: 4.6,
    location: 'San Diego, CA',
    employees: '200-500',
    founded: '2015',
    clearanceLevel: 'Secret',
    certifications: ['ITAR', 'AS9100', 'ISO 9001'],
    capabilities: ['AI/ML', 'Robotics', 'Autonomous Systems', 'Computer Vision'],
    pastPerformance: 95,
    activeContracts: 8,
    totalContractValue: '$25M',
    specialties: ['Autonomous Navigation', 'Machine Learning', 'Sensor Fusion'],
    matchingRFPs: [2, 4],
    description: 'Cutting-edge autonomous systems and AI solutions for defense applications.',
    keyPersonnel: ['Dr. James Liu - Chief Scientist', 'Lisa Thompson - Project Director'],
    recentWins: ['DARPA Autonomous Vehicle Program', 'Navy Unmanned Systems']
  },
  {
    id: 3,
    name: 'Space Communications Ltd.',
    logo: '/api/placeholder/50/50',
    rating: 4.7,
    location: 'Colorado Springs, CO',
    employees: '1000+',
    founded: '2005',
    clearanceLevel: 'Top Secret',
    certifications: ['ITAR', 'ISO 27001', 'AS9100'],
    capabilities: ['Satellite Systems', 'RF Communications', 'Ground Systems', 'Encryption'],
    pastPerformance: 97,
    activeContracts: 15,
    totalContractValue: '$78M',
    specialties: ['Satellite Communications', 'Ground Station Integration', 'Secure Communications'],
    matchingRFPs: [3],
    description: 'Premier satellite communication systems integrator with global reach.',
    keyPersonnel: ['Col. Robert Hayes (Ret.) - CEO', 'Dr. Maria Santos - Chief Engineer'],
    recentWins: ['Space Force SATCOM Upgrade', 'Army Tactical Communications']
  },
  {
    id: 4,
    name: 'Maritime AI Corp.',
    logo: '/api/placeholder/50/50',
    rating: 4.5,
    location: 'Norfolk, VA',
    employees: '100-200',
    founded: '2018',
    clearanceLevel: 'Secret',
    certifications: ['ITAR', 'ISO 9001'],
    capabilities: ['AI/ML', 'Maritime Systems', 'Autonomous Vehicles', 'Data Analytics'],
    pastPerformance: 92,
    activeContracts: 6,
    totalContractValue: '$18M',
    specialties: ['Maritime AI', 'Autonomous Underwater Vehicles', 'Naval Analytics'],
    matchingRFPs: [4],
    description: 'Specialized AI solutions for maritime and naval operations.',
    keyPersonnel: ['Dr. Admiral Susan Clark (Ret.) - Founder', 'Tom Wilson - Lead Developer'],
    recentWins: ['Navy Maritime AI Initiative', 'Coast Guard Autonomous Patrol']
  }
]

// Mock contractor data
export const mockContractors = [
  {
    id: 1,
    name: 'John Mitchell',
    title: 'Senior Acquisition Specialist',
    agency: 'Department of Defense',
    location: 'Pentagon, VA',
    clearanceLevel: 'Top Secret',
    experience: '15 years',
    specialties: ['Cybersecurity Procurement', 'Systems Integration', 'Vendor Management'],
    activeRFPs: 8,
    completedRFPs: 45,
    averageProcessingTime: '45 days',
    preferredVendors: ['Defense Solutions Inc.', 'Space Communications Ltd.'],
    recentActivity: 'Reviewing cybersecurity proposals for DOD-2024-001'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    title: 'Contracting Officer',
    agency: 'U.S. Army',
    location: 'Fort Belvoir, VA',
    clearanceLevel: 'Secret',
    experience: '12 years',
    specialties: ['Autonomous Systems', 'R&D Contracts', 'Technology Assessment'],
    activeRFPs: 6,
    completedRFPs: 38,
    averageProcessingTime: '52 days',
    preferredVendors: ['Autonomous Systems Corp.', 'Maritime AI Corp.'],
    recentActivity: 'Evaluating autonomous vehicle navigation proposals'
  }
]

// Mock matching algorithm results
export const mockMatches = {
  vendor: {
    recommendedRFPs: [
      {
        rfpId: 1,
        matchScore: 92,
        reasons: ['Cybersecurity expertise', 'Top Secret clearance', 'DFARS compliance'],
        competitionLevel: 'Medium',
        winProbability: 78
      },
      {
        rfpId: 2,
        matchScore: 88,
        reasons: ['AI/ML capabilities', 'Systems integration experience'],
        competitionLevel: 'High',
        winProbability: 65
      }
    ],
    competitorAnalysis: [
      { name: 'CyberGuard Systems', threat: 'High', sharedRFPs: 3 },
      { name: 'SecureNet Technologies', threat: 'Medium', sharedRFPs: 2 }
    ]
  },
  contractor: {
    recommendedVendors: [
      {
        vendorId: 1,
        matchScore: 95,
        reasons: ['Perfect capability match', 'Excellent past performance', 'Required clearance'],
        riskLevel: 'Low',
        estimatedCost: '$3.2M'
      },
      {
        vendorId: 2,
        matchScore: 88,
        reasons: ['Strong AI expertise', 'Proven autonomous systems experience'],
        riskLevel: 'Medium',
        estimatedCost: '$4.1M'
      }
    ],
    marketAnalysis: {
      totalVendors: 156,
      qualifiedVendors: 23,
      averageBidPrice: '$3.8M',
      competitionLevel: 'High'
    }
  }
} 