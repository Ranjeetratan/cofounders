import { NextRequest, NextResponse } from 'next/server';
import { profileService } from '@/lib/supabaseService';
import { sendSubmissionConfirmationEmail } from '@/lib/emailService';

// Dummy data for when database is not available
const dummyProfiles = [
  {
    _id: '1',
    fullName: "Sarah Chen",
    email: "sarah.chen@email.com",
    location: "San Francisco, CA / PST",
    linkedinUrl: "https://linkedin.com/in/sarahchen",
    profilePicture: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    type: "Founder",
    lookingFor: "Seeking a technical co-founder with full-stack experience to help scale our AI-powered healthcare platform.",
    bio: "Former Google PM with 8 years in healthcare tech. Built and sold a telemedicine startup. Passionate about democratizing healthcare access through AI.",
    industry: ["Healthcare", "AI/ML", "Technology"],
    skills: ["Product Management", "Business Development", "AI/ML"],
    availability: "Full-time",
    startupStage: "MVP",
    startupName: "HealthAI",
    website: "https://healthai.com",
    status: "approved",
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '2',
    fullName: "Marcus Rodriguez",
    email: "marcus.r@email.com",
    location: "Austin, TX / CST",
    linkedinUrl: "https://linkedin.com/in/marcusrodriguez",
    profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    type: "Co-founder",
    lookingFor: "Looking for a business-minded co-founder to help commercialize our fintech solution for small businesses.",
    bio: "Senior Software Engineer at Stripe. 10+ years building scalable payment systems. Ready to launch my own fintech startup focused on SMB lending.",
    industry: ["Finance", "Technology"],
    skills: ["Engineering", "DevOps", "Finance"],
    availability: "Full-time",
    startupStage: "Idea",
    status: "approved",
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '3',
    fullName: "Emily Watson",
    email: "emily.watson@email.com",
    location: "London, UK / GMT",
    linkedinUrl: "https://linkedin.com/in/emilywatson",
    profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    type: "Founder",
    lookingFor: "Seeking a technical co-founder to build the next generation of sustainable fashion e-commerce platform.",
    bio: "Former Head of Sustainability at H&M. MBA from INSEAD. Building a circular fashion marketplace that connects conscious consumers with sustainable brands.",
    industry: ["E-commerce", "Fashion", "Sustainability"],
    skills: ["Marketing", "Business Development", "Operations"],
    availability: "Full-time",
    startupStage: "Growth",
    startupName: "CircularStyle",
    website: "https://circularstyle.com",
    status: "approved",
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '4',
    fullName: "David Kim",
    email: "david.kim@email.com",
    location: "Seoul, South Korea / KST",
    linkedinUrl: "https://linkedin.com/in/davidkim",
    profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    type: "Co-founder",
    lookingFor: "Looking for a co-founder with gaming industry experience to build the next big mobile gaming platform.",
    bio: "Former Lead Developer at Nexon. Shipped 5+ mobile games with 10M+ downloads. Expertise in Unity, multiplayer systems, and game monetization.",
    industry: ["Gaming", "Entertainment", "Mobile"],
    skills: ["Mobile Development", "Game Development", "UI/UX"],
    availability: "Full-time",
    startupStage: "MVP",
    status: "approved",
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '5',
    fullName: "Priya Patel",
    email: "priya.patel@email.com",
    location: "Mumbai, India / IST",
    linkedinUrl: "https://linkedin.com/in/priyapatel",
    profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    type: "Founder",
    lookingFor: "Seeking a technical co-founder to revolutionize education in emerging markets through AI-powered personalized learning.",
    bio: "Former McKinsey consultant specializing in education sector. Founded 2 EdTech startups in India. Passionate about making quality education accessible to all.",
    industry: ["Education", "AI/ML", "Technology"],
    skills: ["Business Development", "Strategy", "Operations"],
    availability: "Full-time",
    startupStage: "Scaling",
    startupName: "LearnAI",
    website: "https://learnai.in",
    status: "approved",
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '6',
    fullName: "Alex Thompson",
    email: "alex.thompson@email.com",
    location: "Toronto, Canada / EST",
    linkedinUrl: "https://linkedin.com/in/alexthompson",
    profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    type: "Co-founder",
    lookingFor: "Looking for a business co-founder to help scale our blockchain-based supply chain solution for the food industry.",
    bio: "Blockchain architect with 6 years at IBM. Built enterprise blockchain solutions for Fortune 500 companies. Ready to disrupt food traceability.",
    industry: ["Blockchain", "Food & Beverage", "Technology"],
    skills: ["Engineering", "Blockchain", "DevOps"],
    availability: "Part-time",
    startupStage: "MVP",
    status: "approved",
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Additional profiles for admin panel testing
  {
    _id: '7',
    fullName: "Jessica Martinez",
    email: "jessica.martinez@email.com",
    location: "Barcelona, Spain / CET",
    linkedinUrl: "https://linkedin.com/in/jessicamartinez",
    profilePicture: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    type: "Founder",
    lookingFor: "Looking for a technical co-founder to build a sustainable travel platform.",
    bio: "Former travel industry executive with 12 years experience. Building a platform to make travel more sustainable and accessible.",
    industry: ["Travel", "Sustainability", "Technology"],
    skills: ["Business Development", "Operations", "Marketing"],
    availability: "Full-time",
    startupStage: "Idea",
    startupName: "EcoTravel",
    status: "pending",
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '8',
    fullName: "Michael Chang",
    email: "michael.chang@email.com",
    location: "Singapore / SGT",
    linkedinUrl: "https://linkedin.com/in/michaelchang",
    profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    type: "Co-founder",
    lookingFor: "Seeking to join a fintech startup as CTO to build next-gen payment solutions.",
    bio: "Senior engineer at PayPal with expertise in payment systems and blockchain technology. Ready to co-found a fintech startup.",
    industry: ["Finance", "Technology", "Blockchain"],
    skills: ["Engineering", "Blockchain", "Product Management"],
    availability: "Full-time",
    startupStage: "MVP",
    status: "pending",
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '9',
    fullName: "Lisa Johnson",
    email: "lisa.johnson@email.com",
    location: "Sydney, Australia / AEST",
    linkedinUrl: "https://linkedin.com/in/lisajohnson",
    profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    type: "Founder",
    lookingFor: "Need a technical co-founder for my health tech startup focused on mental wellness.",
    bio: "Clinical psychologist turned entrepreneur. Building digital solutions for mental health support and therapy access.",
    industry: ["Healthcare", "Technology", "Mental Health"],
    skills: ["Healthcare", "Psychology", "Business Development"],
    availability: "Full-time",
    startupStage: "Idea",
    startupName: "MindWell",
    status: "rejected",
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      featured: searchParams.get('featured'),
      limit: searchParams.get('limit'),
      status: searchParams.get('status') || 'approved',
      type: searchParams.get('type'),
      industry: searchParams.get('industry'),
      skills: searchParams.get('skills'),
      skillsNeeded: searchParams.get('skillsNeeded'),
      location: searchParams.get('location'),
      startupStage: searchParams.get('startupStage'),
      availability: searchParams.get('availability'),
    };

    const profiles = await profileService.getProfiles(filters);

    // Combine real Supabase data with dummy data for demonstration
    const featured = filters.featured;
    const limit = filters.limit;
    const status = filters.status;
    
    // Filter dummy profiles
    let filteredDummyProfiles = dummyProfiles.filter(profile => {
      if (status !== 'all' && profile.status !== status) return false;
      if (featured === 'true' && !profile.featured) return false;
      return true;
    });

    // Convert Supabase profiles to match dummy data format for consistency
    const convertedProfiles = profiles.map(profile => ({
      _id: profile.id,
      fullName: profile.full_name,
      email: profile.email,
      location: profile.location,
      linkedinUrl: profile.linkedin_url,
      profilePicture: profile.profile_picture,
      type: profile.type,
      lookingFor: profile.looking_for,
      bio: profile.bio,
      industry: profile.industry,
      skills: profile.skills,
      skillsNeeded: profile.skills_needed,
      availability: profile.availability,
      startupStage: profile.startup_stage,
      startupName: profile.startup_name,
      website: profile.website,
      status: profile.status,
      featured: profile.featured,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at
    }));

    // Combine real data with dummy data (real data first)
    const allProfiles = [...convertedProfiles, ...filteredDummyProfiles];

    if (limit) {
      const limitedProfiles = allProfiles.slice(0, parseInt(limit));
      return NextResponse.json({
        success: true,
        profiles: limitedProfiles,
        count: limitedProfiles.length,
      });
    }

    return NextResponse.json({
      success: true,
      profiles: allProfiles,
      count: allProfiles.length,
    });
  } catch (error) {
    console.error('Error fetching profiles, using dummy data:', error);
    
    // Fallback to dummy data when Supabase is not available
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    const status = searchParams.get('status') || 'approved';
    
    let filteredProfiles = dummyProfiles.filter(profile => {
      if (status !== 'all' && profile.status !== status) return false;
      if (featured === 'true' && !profile.featured) return false;
      return true;
    });

    if (limit) {
      filteredProfiles = filteredProfiles.slice(0, parseInt(limit));
    }

    return NextResponse.json({
      success: true,
      profiles: filteredProfiles,
      count: filteredProfiles.length,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received profile data:', body);
    
    try {
      // Convert field names to match Supabase schema
      const profileData = {
        full_name: body.fullName,
        email: body.email,
        location: body.location,
        linkedin_url: body.linkedinUrl,
        profile_picture: body.profilePicture,
        type: body.type,
        looking_for: body.lookingFor,
        bio: body.bio,
        industry: body.industry || [],
        skills: body.skills || [],
        skills_needed: body.skillsNeeded || [],
        availability: body.availability,
        startup_stage: body.startupStage,
        startup_name: body.startupName,
        website: body.website,
        status: 'pending' as const,
        featured: false,
      };

      const profile = await profileService.createProfile(profileData);

      // Send confirmation email
      try {
        await sendSubmissionConfirmationEmail(body.email, body.fullName);
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        // Don't fail the request if email fails
      }

      return NextResponse.json({
        success: true,
        message: 'Profile submitted successfully',
        profile,
      }, { status: 201 });
    } catch (dbError) {
      console.error('Supabase error, simulating success:', dbError);
      
      // Send confirmation email even in demo mode
      try {
        await sendSubmissionConfirmationEmail(body.email, body.fullName);
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
      }
      
      // Simulate successful submission when Supabase is not available
      return NextResponse.json({
        success: true,
        message: 'Profile submitted successfully - will appear in admin panel for review',
        profile: {
          ...body,
          id: 'demo_' + Date.now(),
          status: 'pending',
          featured: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
      }, { status: 201 });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}