import { NextRequest, NextResponse } from 'next/server';
import { settingsService } from '@/lib/supabaseService';

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
    const settings = await settingsService.getSettings();

    return NextResponse.json({
      success: true,
      settings: { ...defaultSettings, ...settings },
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    
    // Return default settings if Supabase is not available
    return NextResponse.json({
      success: true,
      settings: defaultSettings,
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Update each setting individually
    const promises = Object.entries(body).map(([key, value]) =>
      settingsService.updateSetting(key, value)
    );
    
    await Promise.all(promises);

    return NextResponse.json({
      success: true,
      settings: body,
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}