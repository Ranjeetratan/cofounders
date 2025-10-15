import { supabase, supabaseAdmin } from './supabase';

export interface Profile {
  id?: string;
  full_name: string;
  email: string;
  location?: string;
  linkedin_url?: string;
  profile_picture?: string;
  type: 'Founder' | 'Co-founder';
  looking_for: string;
  bio: string;
  industry: string[];
  skills: string[];
  skills_needed?: string[];
  availability: 'Full-time' | 'Part-time' | 'Weekends';
  startup_stage: 'Idea' | 'MVP' | 'Growth' | 'Scaling';
  startup_name?: string;
  website?: string;
  status?: 'pending' | 'approved' | 'rejected';
  featured?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Feature {
  id?: string;
  title: string;
  description: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'planned' | 'in-progress' | 'completed';
  votes: number;
  voters: string[];
  icon: string;
  created_at?: string;
  updated_at?: string;
}

// Profile operations
export const profileService = {
  async getProfiles(filters: any = {}) {
    let query = supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    } else if (!filters.status) {
      query = query.eq('status', 'approved');
    }

    if (filters.featured === 'true') {
      query = query.eq('featured', true);
    }

    if (filters.type) {
      query = query.eq('type', filters.type);
    }

    if (filters.industry) {
      query = query.contains('industry', [filters.industry]);
    }

    if (filters.skills) {
      query = query.contains('skills', [filters.skills]);
    }

    if (filters.skillsNeeded) {
      query = query.contains('skills_needed', [filters.skillsNeeded]);
    }

    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    if (filters.startupStage) {
      query = query.eq('startup_stage', filters.startupStage);
    }

    if (filters.availability) {
      query = query.eq('availability', filters.availability);
    }

    if (filters.limit) {
      query = query.limit(parseInt(filters.limit));
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },

  async getProfileById(id: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createProfile(profile: Omit<Profile, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('profiles')
      .insert([profile])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateProfile(id: string, updates: Partial<Profile>) {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteProfile(id: string) {
    const { error } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Feature operations
export const featureService = {
  async getFeatures() {
    const { data, error } = await supabase
      .from('features')
      .select('*')
      .order('votes', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getFeatureById(id: string) {
    const { data, error } = await supabase
      .from('features')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async voteFeature(id: string, clientIP: string) {
    // Get current feature
    const feature = await this.getFeatureById(id);
    
    if (!feature) {
      throw new Error('Feature not found');
    }

    const hasVoted = feature.voters.includes(clientIP);
    
    let newVotes = feature.votes;
    let newVoters = [...feature.voters];

    if (hasVoted) {
      // Remove vote
      newVotes -= 1;
      newVoters = newVoters.filter(voter => voter !== clientIP);
    } else {
      // Add vote
      newVotes += 1;
      newVoters.push(clientIP);
    }

    const { data, error } = await supabase
      .from('features')
      .update({ 
        votes: newVotes, 
        voters: newVoters 
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async createFeature(feature: Omit<Feature, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabaseAdmin
      .from('features')
      .insert([feature])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Settings operations
export const settingsService = {
  async getSettings() {
    const { data, error } = await supabaseAdmin
      .from('settings')
      .select('*');
    
    if (error) throw error;
    
    // Convert to key-value object
    const settings: Record<string, any> = {};
    data?.forEach(setting => {
      settings[setting.key] = setting.value;
    });
    
    return settings;
  },

  async updateSetting(key: string, value: any) {
    const { data, error } = await supabaseAdmin
      .from('settings')
      .upsert({ key, value })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};