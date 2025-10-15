-- CoFounder Base Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    location VARCHAR(255),
    linkedin_url VARCHAR(500),
    profile_picture VARCHAR(500),
    type VARCHAR(50) CHECK (type IN ('Founder', 'Co-founder')) NOT NULL,
    looking_for TEXT NOT NULL,
    bio TEXT NOT NULL,
    industry TEXT[] DEFAULT '{}',
    skills TEXT[] DEFAULT '{}',
    skills_needed TEXT[] DEFAULT '{}',
    availability VARCHAR(50) CHECK (availability IN ('Full-time', 'Part-time', 'Weekends')) NOT NULL,
    startup_stage VARCHAR(50) CHECK (startup_stage IN ('Idea', 'MVP', 'Growth', 'Scaling')) NOT NULL,
    startup_name VARCHAR(255),
    website VARCHAR(500),
    status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Features table for upcoming features voting
CREATE TABLE IF NOT EXISTS features (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    priority VARCHAR(20) CHECK (priority IN ('High', 'Medium', 'Low')) DEFAULT 'Medium',
    status VARCHAR(20) CHECK (status IN ('planned', 'in-progress', 'completed')) DEFAULT 'planned',
    votes INTEGER DEFAULT 0,
    voters TEXT[] DEFAULT '{}',
    icon VARCHAR(50) DEFAULT 'feature',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings table for admin configuration
CREATE TABLE IF NOT EXISTS settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_featured ON profiles(featured);
CREATE INDEX IF NOT EXISTS idx_profiles_type ON profiles(type);
CREATE INDEX IF NOT EXISTS idx_profiles_industry ON profiles USING GIN(industry);
CREATE INDEX IF NOT EXISTS idx_profiles_skills ON profiles USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);

CREATE INDEX IF NOT EXISTS idx_features_status ON features(status);
CREATE INDEX IF NOT EXISTS idx_features_category ON features(category);
CREATE INDEX IF NOT EXISTS idx_features_votes ON features(votes);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (true);

-- RLS Policies for features
CREATE POLICY "Features are viewable by everyone" ON features
    FOR SELECT USING (true);

CREATE POLICY "Features can be updated by everyone for voting" ON features
    FOR UPDATE USING (true);

-- RLS Policies for settings (admin only)
CREATE POLICY "Settings are viewable by service role only" ON settings
    FOR ALL USING (auth.role() = 'service_role');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_features_updated_at BEFORE UPDATE ON features
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some initial data
INSERT INTO features (title, description, category, priority, icon) VALUES
('Advanced Search Filters', 'Add more sophisticated filtering options including experience level, funding stage, and geographic preferences.', 'Search & Discovery', 'High', 'search'),
('Video Introductions', 'Allow users to upload short video introductions to make profiles more engaging and personal.', 'Profile Enhancement', 'Medium', 'video'),
('Matching Algorithm', 'Implement an AI-powered matching system that suggests compatible co-founders based on skills, experience, and goals.', 'AI & Automation', 'High', 'ai'),
('In-App Messaging', 'Enable direct messaging between potential co-founders within the platform.', 'Communication', 'High', 'message'),
('Event Integration', 'Connect with startup events and networking opportunities in your area.', 'Networking', 'Medium', 'calendar'),
('Skill Verification', 'Add a system to verify skills and experience through LinkedIn integration or portfolio reviews.', 'Trust & Safety', 'Medium', 'verified'),
('Mobile App', 'Develop native iOS and Android applications for better mobile experience.', 'Platform', 'Low', 'mobile'),
('Analytics Dashboard', 'Provide users with insights about their profile views, connection requests, and market trends.', 'Analytics', 'Low', 'chart')
ON CONFLICT DO NOTHING;

INSERT INTO settings (key, value) VALUES
('platform_name', '"CoFounder Base"'),
('max_profiles_per_page', '12'),
('email_notifications_enabled', 'true'),
('featured_profiles_limit', '6'),
('auto_approve_profiles', 'false')
ON CONFLICT (key) DO NOTHING;