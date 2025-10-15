import { NextRequest, NextResponse } from 'next/server';
import { featureService } from '@/lib/supabaseService';

// Default features data
const defaultFeatures = [
  {
    title: "AI-Powered Matching",
    description: "Advanced AI algorithm that analyzes profiles, skills, and preferences to suggest the most compatible co-founders based on complementary strengths and shared vision.",
    category: "Core",
    priority: "High",
    status: "Planned",
    estimatedTime: "Q2 2024",
    votes: 0,
    voters: [],
    icon: "ai",
    tags: ["AI", "Machine Learning", "Smart Matching", "Recommendations"]
  },
  {
    title: "Video Introduction Feature",
    description: "Allow founders to upload 60-second video introductions to showcase their personality, passion, and communication skills beyond just text profiles.",
    category: "Core",
    priority: "High",
    status: "Planned",
    estimatedTime: "Q1 2024",
    votes: 0,
    voters: [],
    icon: "video",
    tags: ["Video", "Personal Branding", "Communication", "Profiles"]
  },
  {
    title: "Real-time Chat System",
    description: "Built-in messaging system for founders to communicate directly within the platform, with features like file sharing, voice messages, and video calls.",
    category: "Core",
    priority: "High",
    status: "In Development",
    estimatedTime: "Q1 2024",
    votes: 0,
    voters: [],
    icon: "chat",
    tags: ["Chat", "Communication", "Real-time", "Messaging"]
  },
  {
    title: "Startup Pitch Deck Sharing",
    description: "Secure platform for founders to share pitch decks, business plans, and financial projections with potential co-founders under NDA protection.",
    category: "Premium",
    priority: "Medium",
    status: "Planned",
    estimatedTime: "Q3 2024",
    votes: 0,
    voters: [],
    icon: "presentation",
    tags: ["Pitch Deck", "Business Plans", "NDA", "Document Sharing"]
  },
  {
    title: "Co-founder Compatibility Score",
    description: "Comprehensive compatibility assessment based on working styles, values, risk tolerance, and long-term goals to predict successful partnerships.",
    category: "Premium",
    priority: "Medium",
    status: "Planned",
    estimatedTime: "Q2 2024",
    votes: 0,
    voters: [],
    icon: "target",
    tags: ["Compatibility", "Assessment", "Psychology", "Partnership"]
  },
  {
    title: "Virtual Co-working Sessions",
    description: "Schedule and host virtual co-working sessions where potential co-founders can work together on projects to test compatibility before committing.",
    category: "Community",
    priority: "Medium",
    status: "Planned",
    estimatedTime: "Q3 2024",
    votes: 0,
    voters: [],
    icon: "users",
    tags: ["Co-working", "Virtual", "Collaboration", "Testing"]
  },
  {
    title: "Equity & Legal Framework Tools",
    description: "Built-in tools and templates for equity distribution, vesting schedules, and legal agreements to formalize co-founder relationships.",
    category: "Premium",
    priority: "High",
    status: "Planned",
    estimatedTime: "Q4 2024",
    votes: 0,
    voters: [],
    icon: "scale",
    tags: ["Legal", "Equity", "Contracts", "Vesting"]
  },
  {
    title: "Startup Events & Networking",
    description: "Curated virtual and in-person events, workshops, and networking sessions specifically for founders looking for co-founders.",
    category: "Community",
    priority: "Medium",
    status: "Planned",
    estimatedTime: "Q2 2024",
    votes: 0,
    voters: [],
    icon: "calendar",
    tags: ["Events", "Networking", "Workshops", "Community"]
  },
  {
    title: "Success Stories & Case Studies",
    description: "Showcase successful co-founder matches made through the platform with detailed case studies and lessons learned.",
    category: "Community",
    priority: "Low",
    status: "Planned",
    estimatedTime: "Q3 2024",
    votes: 0,
    voters: [],
    icon: "trophy",
    tags: ["Success Stories", "Case Studies", "Inspiration", "Community"]
  },
  {
    title: "Mobile App (iOS & Android)",
    description: "Native mobile applications for iOS and Android with push notifications, offline access, and mobile-optimized matching experience.",
    category: "Core",
    priority: "High",
    status: "Planned",
    estimatedTime: "Q3 2024",
    votes: 0,
    voters: [],
    icon: "smartphone",
    tags: ["Mobile", "iOS", "Android", "Native App"]
  },
  {
    title: "Advanced Analytics Dashboard",
    description: "Comprehensive analytics for founders to track profile views, connection rates, and optimize their profiles for better matches.",
    category: "Analytics",
    priority: "Medium",
    status: "Planned",
    estimatedTime: "Q4 2024",
    votes: 0,
    voters: [],
    icon: "trending-up",
    tags: ["Analytics", "Dashboard", "Metrics", "Optimization"]
  },
  {
    title: "Integration with LinkedIn & GitHub",
    description: "Seamless integration with professional platforms to auto-populate profiles and verify credentials and experience.",
    category: "Integration",
    priority: "Medium",
    status: "Coming Soon",
    estimatedTime: "Q1 2024",
    votes: 0,
    voters: [],
    icon: "link",
    tags: ["Integration", "LinkedIn", "GitHub", "Verification"]
  },
  {
    title: "Mentor Matching System",
    description: "Connect founders not just with co-founders but also with experienced mentors and advisors in their industry.",
    category: "Community",
    priority: "Medium",
    status: "Planned",
    estimatedTime: "Q4 2024",
    votes: 0,
    voters: [],
    icon: "graduation-cap",
    tags: ["Mentorship", "Advisors", "Guidance", "Experience"]
  },
  {
    title: "Startup Idea Validation Tools",
    description: "Tools and surveys to help founders validate their startup ideas with the community and get feedback from potential co-founders.",
    category: "Premium",
    priority: "Low",
    status: "Planned",
    estimatedTime: "Q4 2024",
    votes: 0,
    voters: [],
    icon: "lightbulb",
    tags: ["Validation", "Ideas", "Feedback", "Community Input"]
  },
  {
    title: "Global Expansion & Localization",
    description: "Multi-language support and region-specific features to serve founders worldwide with local startup ecosystems integration.",
    category: "Core",
    priority: "Medium",
    status: "Planned",
    estimatedTime: "Q4 2024",
    votes: 0,
    voters: [],
    icon: "globe",
    tags: ["Global", "Localization", "Multi-language", "International"]
  }
];

export async function GET() {
  try {
    const features = await featureService.getFeatures();

    return NextResponse.json({
      success: true,
      features,
    });
  } catch (error) {
    console.error('Error fetching features:', error);
    
    // Return default features if Supabase is not available
    return NextResponse.json({
      success: true,
      features: defaultFeatures.sort((a, b) => b.votes - a.votes),
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const feature = await featureService.createFeature(body);

    return NextResponse.json({
      success: true,
      feature,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating feature:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create feature' },
      { status: 500 }
    );
  }
}