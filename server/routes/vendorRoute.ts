import { Router, Request, Response } from "express";
import multer from "multer";
import fs from "fs/promises";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { detailedCompatibilityChain } from "../ai/chains/compatibilityChain";

const router = Router();
const upload = multer({ dest: "uploads/" });

// Get vendor profile
router.get("/vendor/:vendorId", async (req: Request, res: Response) => {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
      return res.status(500).json({ error: "Missing SUPABASE_URL or SUPABASE_KEY in environment" });
    }

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    const { vendorId } = req.params;

    const { data: vendor, error } = await supabase
      .from("vendor_profiles")
      .select("*")
      .eq("id", vendorId)
      .single();

    if (error) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    res.json({ vendor });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch vendor profile" });
  }
});

// Create or update vendor profile
router.post("/vendor-profile", async (req: Request, res: Response) => {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
      return res.status(500).json({ error: "Missing SUPABASE_URL or SUPABASE_KEY in environment" });
    }

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    const vendorData = req.body;

    // Validate required fields
    if (!vendorData.name || !vendorData.email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const { data: vendor, error } = await supabase
      .from("vendor_profiles")
      .upsert(vendorData, { onConflict: 'email' })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: "Failed to save vendor profile" });
    }

    res.json({ vendor });
  } catch (error) {
    res.status(500).json({ error: "Failed to create vendor profile" });
  }
});

// Submit proposal for RFP
router.post("/submit-proposal", upload.array("documents", 10), async (req: Request, res: Response) => {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
      return res.status(500).json({ error: "Missing SUPABASE_URL or SUPABASE_KEY in environment" });
    }

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    const {
      vendor_id,
      rfp_id,
      proposed_budget,
      delivery_timeline,
      technical_approach,
      team_composition
    } = req.body;

    // Validate required fields
    if (!vendor_id || !rfp_id || !proposed_budget || !delivery_timeline) {
      return res.status(400).json({ 
        error: "vendor_id, rfp_id, proposed_budget, and delivery_timeline are required" 
      });
    }

    // Handle file uploads
    const documentPaths: string[] = [];
    const files = req.files as Express.Multer.File[];
    
    if (files && files.length > 0) {
      for (const file of files) {
        const fileBuffer = await fs.readFile(file.path);
        const fileName = `proposals/${vendor_id}_${rfp_id}_${Date.now()}_${file.originalname}`;
        
        const { data: stored, error: storeErr } = await supabase
          .storage
          .from("documents")
          .upload(fileName, fileBuffer, { upsert: false });

        if (!storeErr) {
          documentPaths.push(stored.path);
        }

        // Clean up temp file
        await fs.unlink(file.path);
      }
    }

    // Get vendor and RFP data for compatibility scoring
    const { data: vendor } = await supabase
      .from("vendor_profiles")
      .select("*")
      .eq("id", vendor_id)
      .single();

    const { data: rfp } = await supabase
      .from("rfp_metadata")
      .select("*")
      .eq("id", rfp_id)
      .single();

    if (!vendor || !rfp) {
      return res.status(404).json({ error: "Vendor or RFP not found" });
    }

    // Calculate compatibility score
    let compatibilityAnalysis: any = null;
    let matchScore = 0;

    try {
      const vendorProfile = `
        Name: ${vendor.name}
        Capabilities: ${vendor.capabilities?.join(', ') || 'None'}
        Clearance: ${vendor.clearance_level || 'None'}
        Certifications: ${vendor.certifications?.join(', ') || 'None'}
        Experience: ${vendor.past_performance_score || 0}% performance score
        Location: ${vendor.location || 'Not specified'}
        Company Size: ${vendor.employees_count || 'Not specified'}
        Specialties: ${vendor.specialties?.join(', ') || 'None'}
      `;

      const rfpRequirements = `
        Project: ${rfp.project_title || 'Unknown'}
        Budget: ${rfp.budget_min || 0} - ${rfp.budget_max || 0} ${rfp.currency || 'USD'}
        Clearance Required: ${rfp.security_clearance || 'None'}
        Timeline: ${rfp.timeline || 'Not specified'}
        Requirements: ${rfp.requirements?.join(', ') || 'None'}
        Categories: ${rfp.categories?.join(', ') || 'None'}
        Description: ${rfp.description || 'No description'}
      `;

      const compatibilityResult = await detailedCompatibilityChain.invoke({
        vendor_profile: vendorProfile,
        rfp_requirements: rfpRequirements
      });

      compatibilityAnalysis = JSON.parse(compatibilityResult.content as string);
      matchScore = compatibilityAnalysis?.overall_score || 0;
    } catch (aiError) {
      // Continue with default score if AI fails
      matchScore = 50;
    }

    // Insert proposal
    const { data: proposal, error: proposalError } = await supabase
      .from("vendor_proposals")
      .upsert({
        vendor_id: parseInt(vendor_id),
        rfp_id: parseInt(rfp_id),
        proposed_budget: parseFloat(proposed_budget),
        delivery_timeline,
        technical_approach,
        team_composition,
        documents: documentPaths,
        match_score: matchScore,
        compatibility_analysis: compatibilityAnalysis,
        status: 'submitted'
      }, { onConflict: 'vendor_id,rfp_id' })
      .select()
      .single();

    if (proposalError) {
      return res.status(500).json({ error: "Failed to submit proposal" });
    }

    // Update compatibility scores table
    await supabase
      .from("compatibility_scores")
      .upsert({
        rfp_id: parseInt(rfp_id),
        vendor_id: parseInt(vendor_id),
        score: matchScore,
        rationale: compatibilityAnalysis?.rationale || 'Automated scoring based on proposal submission',
        factors: compatibilityAnalysis?.detailed_scores || {},
        win_probability: compatibilityAnalysis?.win_probability || null,
        competition_level: compatibilityAnalysis?.competition_level || 'medium',
        estimated_cost: compatibilityAnalysis?.estimated_cost || null,
        risk_level: compatibilityAnalysis?.risk_level || 'medium',
        reasons: compatibilityAnalysis?.strengths || []
      }, { onConflict: 'rfp_id,vendor_id' });

    // Create notification for contractor
    await supabase
      .from("notifications")
      .insert({
        user_type: 'contractor',
        user_id: null, // Will be linked based on RFP ownership
        rfp_id: parseInt(rfp_id),
        type: 'proposal_submitted',
        title: 'New Proposal Received',
        message: `${vendor.name} has submitted a proposal for ${rfp.project_title}`,
        metadata: {
          vendor_id: parseInt(vendor_id),
          vendor_name: vendor.name,
          match_score: matchScore
        }
      });

    res.json({ 
      proposal,
      compatibility_analysis: compatibilityAnalysis,
      message: "Proposal submitted successfully" 
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to submit proposal" });
  }
});

// Get RFP recommendations for vendor
router.get("/vendor/:vendorId/recommendations", async (req: Request, res: Response) => {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
      return res.status(500).json({ error: "Missing SUPABASE_URL or SUPABASE_KEY in environment" });
    }

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    const { vendorId } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;

    // First, get all active RFPs
    const { data: rfps, error: rfpError } = await supabase
      .from('rfp_metadata')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (rfpError) {
      return res.status(500).json({ error: 'Failed to fetch RFPs' });
    }

    if (!rfps || rfps.length === 0) {
      return res.json({ recommendations: [] });
    }

    // Get compatibility scores for this vendor across all RFPs
    const recommendations = [];
    
    for (const rfp of rfps) {
      // Try to get existing compatibility score
      const { data: score, error: scoreError } = await supabase
        .from('compatibility_scores')
        .select('*')
        .eq('rfp_id', rfp.id)
        .eq('vendor_id', vendorId)
        .single();

      if (score) {
        // Use existing score
        recommendations.push({
          rfp_id: rfp.id,
          project_title: rfp.project_title,
          rfp_number: rfp.rfp_number,
          agency: rfp.agency,
          budget_min: rfp.budget_min,
          budget_max: rfp.budget_max,
          due_date: rfp.due_date,
          security_clearance: rfp.security_clearance,
          score: score.compatibility_score,
          win_probability: score.win_probability,
          risk_level: score.risk_level,
          estimated_cost: score.estimated_cost,
          reasons: score.reasons || []
        });
      } else {
        // If no score exists, create a default one for demo
        const defaultScore = Math.floor(Math.random() * 40) + 60; // Random score between 60-99
        const defaultWinProb = Math.floor(Math.random() * 30) + 50; // Random between 50-79
        
        recommendations.push({
          rfp_id: rfp.id,
          project_title: rfp.project_title,
          rfp_number: rfp.rfp_number,
          agency: rfp.agency,
          budget_min: rfp.budget_min,
          budget_max: rfp.budget_max,
          due_date: rfp.due_date,
          security_clearance: rfp.security_clearance,
          score: defaultScore,
          win_probability: defaultWinProb,
          risk_level: defaultScore > 80 ? 'low' : defaultScore > 65 ? 'medium' : 'high',
          estimated_cost: `$${(Math.random() * 2 + 1).toFixed(1)}M`,
          reasons: [
            'Strong capability match',
            'Appropriate clearance level',
            'Competitive pricing position'
          ]
        });

        // Upsert the new score into the compatibility_scores table
        await supabase
          .from("compatibility_scores")
          .upsert({
            rfp_id: rfp.id,
            vendor_id: parseInt(vendorId),
            score: defaultScore,
            rationale: 'Automated scoring based on RFP details',
            factors: {}, // Placeholder, will be updated by AI
            win_probability: defaultWinProb,
            competition_level: defaultScore > 80 ? 'low' : defaultScore > 65 ? 'medium' : 'high',
            estimated_cost: null, // Placeholder, will be updated by AI
            risk_level: defaultScore > 80 ? 'low' : defaultScore > 65 ? 'medium' : 'high',
            reasons: [] // Placeholder, will be updated by AI
          }, { onConflict: 'rfp_id,vendor_id' });
      }
    }

    // Sort by compatibility score descending
    recommendations.sort((a, b) => b.score - a.score);

    // Apply limit
    const limitedRecommendations = recommendations.slice(0, limit);

    res.json({ 
      recommendations: limitedRecommendations,
      total: recommendations.length 
    });

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get vendor's submitted proposals
router.get("/vendor/:vendorId/proposals", async (req: Request, res: Response) => {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
      return res.status(500).json({ error: "Missing SUPABASE_URL or SUPABASE_KEY in environment" });
    }

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    const { vendorId } = req.params;

    const { data: proposals, error } = await supabase
      .from("vendor_proposals")
      .select(`
        *,
        rfp_metadata (
          project_title,
          rfp_number,
          agency,
          due_date,
          budget_min,
          budget_max,
          currency,
          status
        )
      `)
      .eq("vendor_id", vendorId)
      .order("submitted_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: "Failed to fetch proposals" });
    }

    res.json({ proposals });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch vendor proposals" });
  }
});

// Get compatibility scores for vendors against a specific RFP
router.get("/rfp/:rfpId/compatibility-scores", async (req: Request, res: Response) => {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
      return res.status(500).json({ error: "Missing SUPABASE_URL or SUPABASE_KEY in environment" });
    }

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    const { rfpId } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;

    // Get vendors with their compatibility scores for this RFP
    const { data: vendorScores, error } = await supabase
      .from("compatibility_scores")
      .select(`
        *,
        vendor_profiles (
          id,
          name,
          location,
          clearance_level,
          capabilities,
          certifications,
          past_performance_score,
          employees_count,
          total_contract_value
        )
      `)
      .eq("rfp_id", parseInt(rfpId))
      .order("score", { ascending: false })
      .limit(limit);

    if (error) {
      return res.status(500).json({ error: "Failed to fetch vendor scores" });
    }

    // Get all vendors
    const { data: allVendors } = await supabase
      .from("vendor_profiles")
      .select("id, name, location, clearance_level, capabilities, certifications, past_performance_score, employees_count, total_contract_value");

    // Map existing scores for quick lookup
    const existingMap = new Map<number, any>();
    (vendorScores || []).forEach((row: any) => {
      existingMap.set(row.vendor_id, row);
    });

    // Generate scores for vendors without an entry yet (demo logic)
    for (const vendor of allVendors || []) {
      if (!existingMap.has(vendor.id)) {
        const defaultScore = Math.floor(Math.random() * 40) + 60; // 60-99
        const defaultWinProb = Math.floor(Math.random() * 30) + 50; // 50-79
        const riskLevel = defaultScore > 80 ? 'low' : defaultScore > 65 ? 'medium' : 'high';

        // Persist new compatibility score
        const { data: newScoreRow } = await supabase
          .from('compatibility_scores')
          .upsert({
            rfp_id: parseInt(rfpId),
            vendor_id: vendor.id,
            score: defaultScore,
            rationale: 'Demo auto-generated score',
            factors: {},
            win_probability: defaultWinProb,
            competition_level: riskLevel,
            estimated_cost: `$${(Math.random() * 2 + 1).toFixed(1)}M`,
            risk_level: riskLevel,
            reasons: []
          }, { onConflict: 'rfp_id,vendor_id' })
          .select()
          .single();

        if (newScoreRow) {
          // Push into vendorScores array for formatting
          (vendorScores as any).push({
            ...newScoreRow,
            vendor_profiles: vendor
          });
        }
      }
    }

    // Transform the data to a more convenient format
    const formattedScores = (vendorScores || []).map((score: any) => ({
      ...score.vendor_profiles,
      compatibility_score: score.score,
      win_probability: score.win_probability,
      risk_level: score.risk_level,
      estimated_cost: score.estimated_cost,
      rationale: score.rationale,
      factors: score.factors,
      reasons: score.reasons,
      rating: score.vendor_profiles?.past_performance_score 
        ? (score.vendor_profiles.past_performance_score / 20).toFixed(1) 
        : '4.5',
      employees: score.vendor_profiles?.employees_count || 'Not specified'
    })) || [];

    res.json({ vendor_scores: formattedScores });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch vendor compatibility scores" });
  }
});

// Seed fake vendor data (for demo purposes)
router.post("/seed-vendors", async (req: Request, res: Response) => {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
      return res.status(500).json({ error: "Missing SUPABASE_URL or SUPABASE_KEY in environment" });
    }

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

    const fakeVendors = [
      {
        name: 'Defense Solutions Inc.',
        email: 'contact@defensesolutions.com',
        location: 'Arlington, VA',
        website: 'https://defensesolutions.com',
        employees_count: '500-1000',
        founded_year: 2010,
        clearance_level: 'Top Secret',
        description: 'Leading cybersecurity solutions provider specializing in defense applications.',
        phone: '+1-555-0101',
        certifications: ['DFARS', 'ITAR', 'ISO 27001', 'CMMC Level 3'],
        capabilities: ['Cybersecurity', 'Software Development', 'Systems Integration', 'Cloud Solutions'],
        specialties: ['Zero Trust Architecture', 'Threat Intelligence', 'Incident Response'],
        past_performance_score: 98,
        active_contracts_count: 12,
        total_contract_value: '$45M',
        key_personnel: ['Dr. Sarah Chen - CTO', 'Michael Rodriguez - VP Engineering']
      },
      {
        name: 'Autonomous Systems Corp.',
        email: 'info@autonomoussystems.com',
        location: 'San Diego, CA',
        website: 'https://autonomoussystems.com',
        employees_count: '200-500',
        founded_year: 2015,
        clearance_level: 'Secret',
        description: 'Cutting-edge autonomous systems and AI solutions for defense applications.',
        phone: '+1-555-0102',
        certifications: ['ITAR', 'AS9100', 'ISO 9001'],
        capabilities: ['AI/ML', 'Robotics', 'Autonomous Systems', 'Computer Vision'],
        specialties: ['Autonomous Navigation', 'Machine Learning', 'Sensor Fusion'],
        past_performance_score: 95,
        active_contracts_count: 8,
        total_contract_value: '$25M',
        key_personnel: ['Dr. James Liu - Chief Scientist', 'Lisa Thompson - Project Director']
      },
      {
        name: 'Space Communications Ltd.',
        email: 'contact@spacecomms.com',
        location: 'Colorado Springs, CO',
        website: 'https://spacecomms.com',
        employees_count: '1000+',
        founded_year: 2005,
        clearance_level: 'Top Secret',
        description: 'Premier satellite communication systems integrator with global reach.',
        phone: '+1-555-0103',
        certifications: ['ITAR', 'ISO 27001', 'AS9100'],
        capabilities: ['Satellite Systems', 'RF Communications', 'Ground Systems', 'Encryption'],
        specialties: ['Satellite Communications', 'Ground Station Integration', 'Secure Communications'],
        past_performance_score: 97,
        active_contracts_count: 15,
        total_contract_value: '$78M',
        key_personnel: ['Col. Robert Hayes (Ret.) - CEO', 'Dr. Maria Santos - Chief Engineer']
      },
      {
        name: 'Maritime AI Corp.',
        email: 'admin@maritimeai.com',
        location: 'Norfolk, VA',
        website: 'https://maritimeai.com',
        employees_count: '100-200',
        founded_year: 2018,
        clearance_level: 'Secret',
        description: 'Specialized AI solutions for maritime and naval operations.',
        phone: '+1-555-0104',
        certifications: ['ITAR', 'ISO 9001'],
        capabilities: ['AI/ML', 'Maritime Systems', 'Autonomous Vehicles', 'Data Analytics'],
        specialties: ['Maritime AI', 'Autonomous Underwater Vehicles', 'Naval Analytics'],
        past_performance_score: 92,
        active_contracts_count: 6,
        total_contract_value: '$18M',
        key_personnel: ['Dr. Admiral Susan Clark (Ret.) - Founder', 'Tom Wilson - Lead Developer']
      },
      {
        name: 'CyberGuard Systems',
        email: 'sales@cyberguard.com',
        location: 'Washington, DC',
        website: 'https://cyberguard.com',
        employees_count: '300-500',
        founded_year: 2012,
        clearance_level: 'Top Secret',
        description: 'Advanced cybersecurity and threat detection solutions for government agencies.',
        phone: '+1-555-0105',
        certifications: ['DFARS', 'ITAR', 'ISO 27001', 'FedRAMP'],
        capabilities: ['Cybersecurity', 'Threat Detection', 'Network Security', 'Compliance'],
        specialties: ['SOC Operations', 'Penetration Testing', 'Compliance Automation'],
        past_performance_score: 94,
        active_contracts_count: 10,
        total_contract_value: '$32M',
        key_personnel: ['Mark Stevens - CISO', 'Jennifer Wong - Security Architect']
      },
      {
        name: 'Advanced Defense Technologies',
        email: 'contact@advdeftech.com',
        location: 'Huntsville, AL',
        website: 'https://advdeftech.com',
        employees_count: '500-1000',
        founded_year: 2008,
        clearance_level: 'Secret',
        description: 'Innovative defense technologies and systems integration services.',
        phone: '+1-555-0106',
        certifications: ['ITAR', 'AS9100', 'ISO 9001', 'DFARS'],
        capabilities: ['Systems Integration', 'Hardware Development', 'Software Engineering', 'Testing'],
        specialties: ['Missile Systems', 'Radar Technology', 'Electronic Warfare'],
        past_performance_score: 91,
        active_contracts_count: 14,
        total_contract_value: '$55M',
        key_personnel: ['Dr. Patricia Miller - Chief Engineer', 'Robert Johnson - Program Manager']
      },
      {
        name: 'Quantum Security Solutions',
        email: 'info@quantumsec.com',
        location: 'Austin, TX',
        website: 'https://quantumsec.com',
        employees_count: '100-200',
        founded_year: 2019,
        clearance_level: 'Secret',
        description: 'Next-generation quantum encryption and secure communications.',
        phone: '+1-555-0107',
        certifications: ['ITAR', 'ISO 27001', 'NIST'],
        capabilities: ['Quantum Computing', 'Encryption', 'Secure Communications', 'Cryptography'],
        specialties: ['Quantum Key Distribution', 'Post-Quantum Cryptography', 'Secure Protocols'],
        past_performance_score: 89,
        active_contracts_count: 4,
        total_contract_value: '$12M',
        key_personnel: ['Dr. Alan Chen - Quantum Physicist', 'Sarah Martinez - Cryptographer']
      },
      {
        name: 'Drone Defense Systems',
        email: 'contact@dronedefense.com',
        location: 'Phoenix, AZ',
        website: 'https://dronedefense.com',
        employees_count: '200-300',
        founded_year: 2016,
        clearance_level: 'Secret',
        description: 'Specialized in anti-drone technology and aerial defense systems.',
        phone: '+1-555-0108',
        certifications: ['ITAR', 'AS9100', 'ISO 9001'],
        capabilities: ['Drone Technology', 'Counter-UAS', 'Aerial Systems', 'Surveillance'],
        specialties: ['Drone Detection', 'Electronic Countermeasures', 'Swarm Technology'],
        past_performance_score: 93,
        active_contracts_count: 7,
        total_contract_value: '$28M',
        key_personnel: ['Captain Mike Thompson (Ret.) - CEO', 'Dr. Lisa Park - R&D Director']
      }
    ];

    // Insert vendors (use upsert to avoid duplicates)
    const { data: vendors, error } = await supabase
      .from("vendor_profiles")
      .upsert(fakeVendors, { onConflict: 'email', ignoreDuplicates: false })
      .select();

    if (error) {
      return res.status(500).json({ error: "Failed to seed vendor data" });
    }

    res.json({ 
      message: `Successfully seeded ${vendors?.length || 0} vendors`,
      vendors 
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to seed vendor data" });
  }
});

// Get all vendors (for contractor dashboard) with filtering support
router.get("/vendors", async (req: Request, res: Response) => {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
      return res.status(500).json({ error: "Missing SUPABASE_URL or SUPABASE_KEY in environment" });
    }

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    const { capabilities, clearance_level, company_size, limit = 50 } = req.query;
    
    let query = supabase
      .from("vendor_profiles")
      .select("*")
      .order("past_performance_score", { ascending: false })
      .limit(parseInt(limit as string));

    // Filter by capabilities if provided
    if (capabilities && capabilities !== 'All Capabilities') {
      query = query.contains("capabilities", [capabilities]);
    }

    // Filter by clearance level if provided
    if (clearance_level && clearance_level !== 'All Levels') {
      query = query.eq("clearance_level", clearance_level);
    }

    // Filter by company size if provided
    if (company_size && company_size !== 'All Sizes') {
      let sizeFilter = '';
      switch (company_size) {
        case 'Small (1-100)':
          sizeFilter = '1-100';
          break;
        case 'Medium (101-500)':
          sizeFilter = '101-500';
          break;
        case 'Large (500+)':
          sizeFilter = '500+';
          break;
        default:
          sizeFilter = company_size as string;
      }
      if (sizeFilter) {
        query = query.eq("employees_count", sizeFilter);
      }
    }

    const { data: vendors, error } = await query;

    if (error) {
      return res.status(500).json({ error: "Failed to fetch vendors" });
    }

    // Add compatibility scores for each vendor if available
    const vendorsWithScores = await Promise.all(vendors.map(async (vendor) => {
      // Get average compatibility score for this vendor
      const { data: avgScore } = await supabase
        .from("compatibility_scores")
        .select("score")
        .eq("vendor_id", vendor.id)
        .then(result => {
          const scores = result.data?.map((s: any) => s.score) || [];
          const avg = scores.length > 0 ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length : 0;
          return { data: Math.round(avg) };
        });

      return {
        ...vendor,
        average_score: avgScore || 0,
        rating: vendor.past_performance_score ? (vendor.past_performance_score / 20).toFixed(1) : '4.5', // Convert to 5-star rating
        employees: vendor.employees_count || 'Not specified',
        total_contract_value: vendor.total_contract_value || 'Not disclosed'
      };
    }));

    res.json({ vendors: vendorsWithScores });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch vendors" });
  }
});

export default router; 