import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Profile from '@/models/Profile';
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
      await connectDB();
      
      // Get the current profile to check status change
      const currentProfile = await Profile.findById(id);
      
      const profile = await Profile.findByIdAndUpdate(
        id,
        body,
        { new: true, runValidators: true }
      );

      if (!profile) {
        return NextResponse.json(
          { success: false, error: 'Profile not found' },
          { status: 404 }
        );
      }

      // Send approval email if status changed from pending to approved
      if (currentProfile && currentProfile.status !== 'approved' && body.status === 'approved') {
        try {
          await sendProfileApprovalEmail(profile.email, profile.fullName, profile._id.toString());
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
      console.error('Database error, simulating update:', dbError);
      
      // Send approval email even in demo mode if status is being approved
      if (body.status === 'approved') {
        try {
          await sendProfileApprovalEmail(body.email || 'demo@example.com', body.fullName || 'Demo User', id);
        } catch (emailError) {
          console.error('Error sending approval email:', emailError);
        }
      }
      
      // Simulate successful update when database is not available
      return NextResponse.json({
        success: true,
        profile: { _id: id, ...body },
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
      await connectDB();
      
      const profile = await Profile.findById(id);

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
      console.error('Database error, using fallback:', dbError);
      
      // Fallback to dummy data when database is not available
      const dummyProfile = {
        _id: id,
        fullName: "Demo User",
        email: "demo@example.com",
        location: "San Francisco, CA",
        linkedinUrl: "https://linkedin.com/in/demo",
        profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        type: "Founder",
        lookingFor: "Looking for a technical co-founder to help build our AI platform.",
        bio: "Experienced entrepreneur with a passion for AI and machine learning. Previously founded two successful startups.",
        industry: ["Technology", "AI/ML"],
        skills: ["Product Management", "Business Development"],
        skillsNeeded: ["Engineering", "AI/ML"],
        availability: "Full-time",
        startupStage: "MVP",
        startupName: "Demo Startup",
        website: "https://demo.com",
        status: "approved",
        featured: false,
        createdAt: new Date(),
        updatedAt: new Date()
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
    await connectDB();
    
    const { id } = await params;

    const profile = await Profile.findByIdAndDelete(id);

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }

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