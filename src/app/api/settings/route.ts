import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Settings from '@/models/Settings';

// Default settings
const defaultSettings = {
  industries: [
    'Technology', 'Healthcare', 'Finance', 'E-commerce', 'Education', 'Real Estate',
    'Food & Beverage', 'Travel', 'Entertainment', 'Gaming', 'Social Media', 'AI/ML',
    'Blockchain', 'IoT', 'Cybersecurity', 'Marketing', 'HR', 'Logistics', 'Energy', 'Other'
  ],
  skills: [
    'Product Management', 'Engineering', 'Design', 'Marketing', 'Sales', 'Business Development',
    'Operations', 'Finance', 'Legal', 'HR', 'Data Science', 'AI/ML', 'Mobile Development',
    'Web Development', 'DevOps', 'UI/UX', 'Growth Hacking', 'Content Creation', 'SEO/SEM', 'Other'
  ],
  startupStages: ['Idea', 'MVP', 'Growth', 'Scaling']
};

export async function GET() {
  try {
    await connectDB();
    
    let settings = await Settings.findOne();
    
    if (!settings) {
      // Create default settings if none exist
      settings = new Settings(defaultSettings);
      await settings.save();
    }

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    
    // Return default settings if database is not available
    return NextResponse.json({
      success: true,
      settings: defaultSettings,
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings(body);
    } else {
      Object.assign(settings, body);
    }
    
    await settings.save();

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}