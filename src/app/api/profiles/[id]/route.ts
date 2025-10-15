import { NextRequest, NextResponse } from 'next/server';
import { profileService } from '@/lib/supabaseService';
import { sendProfileApprovalEmail } from '@/lib/emailService';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id } = await params;
    
    console.log('PATCH request for profile:', id, body);

    try {
      // Get the current profile to check status change
      const currentProfile = await profileService.getProfileById(id);
      
      // Convert field names to match Supabase schema if needed
      const updateData: any = {};
      if (body.fullName) updateData.full_name = body.fullName;
      if (body.email) updateData.email = body.email;
      if (body.location) updateData.location = body.location;
      if (body.linkedinUrl) updateData.linkedin_url = body.linkedinUrl;
      if (body.profilePicture) updateData.profile_picture = body.profilePicture;
      if (body.type) updateData.type = body.type;
      if (body.lookingFor) updateData.looking_for = body.lookingFor;
      if (body.bio) updateData.bio = body.bio;
      if (body.industry) updateData.industry = body.industry;
      if (body.skills) updateData.skills = body.skills;
      if (body.skillsNeeded) updateData.skills_needed = body.skillsNeeded;
      if (body.availability) updateData.availability = body.availability;
      if (body.startupStage) updateData.startup_stage = body.startupStage;
      if (body.startupName) updateData.startup_name = body.startupName;
      if (body.website) updateData.website = body.website;
      if (body.status) updateData.status = body.status;
      if (body.featured !== undefined) updateData.featured = body.featured;

      const profile = await profileService.updateProfile(id, updateData);

      if (!profile) {
        return NextResponse.json(
          { success: false, error: 'Profile not found' },
          { status: 404 }
        );
      }

      // Send approval email if status changed from pending to approved
      if (currentProfile && currentProfile.status !== 'approved' && body.status === 'approved') {
        try {
          await sendProfileApprovalEmail(profile.email, profile.full_name, profile.id);
        } catch (emailError) {
          console.error('Error sending approval email:', emailError);
          // Don't fail the request if email fails
        }
      }

      return NextResponse.json({
        success: true,
        profile,
        message: 'Profile updated successfully'
      });
    } catch (dbError) {
      console.error('Supabase error, simulating update:', dbError);
      
      // Send approval email even in demo mode if status is being approved
      if (body.status === 'approved') {
        try {
          await sendProfileApprovalEmail(body.email || 'demo@example.com', body.fullName || 'Demo User', id);
        } catch (emailError) {
          console.error('Error sending approval email:', emailError);
        }
      }
      
      // Simulate successful update when Supabase is not available
      return NextResponse.json({
        success: true,
        profile: { id: id, ...body },
        message: 'Profile updated successfully (demo mode)'
      });
    }
  } catch (error) {
    console.error('Error processing update request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update profile: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    try {
      const profile = await profileService.getProfileById(id);

      if (!profile) {
        return NextResponse.json(
          { success: false, error: 'Profile not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        profile,
      });
    } catch (dbError) {
      console.error('Supabase error, using fallback:', dbError);
      
      // Fallback to dummy data when Supabase is not available
      const dummyProfile = {
        id: id,
        full_name: "Demo User",
        email: "demo@example.com",
        location: "San Francisco, CA",
        linkedin_url: "https://linkedin.com/in/demo",
        profile_picture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        type: "Founder",
        looking_for: "Looking for a technical co-founder to help build our AI platform.",
        bio: "Experienced entrepreneur with a passion for AI and machine learning. Previously founded two successful startups.",
        industry: ["Technology", "AI/ML"],
        skills: ["Product Management", "Business Development"],
        skills_needed: ["Engineering", "AI/ML"],
        availability: "Full-time",
        startup_stage: "MVP",
        startup_name: "Demo Startup",
        website: "https://demo.com",
        status: "approved",
        featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return NextResponse.json({
        success: true,
        profile: dummyProfile,
      });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await profileService.deleteProfile(id);

    return NextResponse.json({
      success: true,
      message: 'Profile deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete profile' },
      { status: 500 }
    );
  }
}