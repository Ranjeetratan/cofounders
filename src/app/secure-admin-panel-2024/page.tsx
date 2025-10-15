'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  X, 
  Trash2, 
  Star, 
  StarOff, 
  Eye, 
  Edit, 
  Loader2,
  Shield,
  Users,
  Clock,
  CheckCircle,
  Settings,
  Plus,
  Minus,
  Save,
  Upload,
  Search,
  Filter,
  BarChart3,
  TrendingUp,
  UserCheck,
  UserX,
  Crown
} from 'lucide-react';

export default function SecureAdminPage() {
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingProfile, setEditingProfile] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [settings, setSettings] = useState({
    industries: [],
    skills: [],
    startupStages: []
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    featured: 0,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const authenticate = () => {
    // Check password
    if (password === 'CofounderBase@2024!Secure') {
      setIsAuthenticated(true);
      fetchProfiles();
      fetchSettings();
    } else {
      alert('Invalid password');
    }
  };

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/profiles?status=all');
      const data = await response.json();
      
      if (data.success) {
        setProfiles(data.profiles);
        
        // Calculate stats
        const total = data.profiles.length;
        const pending = data.profiles.filter((p: any) => p.status === 'pending').length;
        const approved = data.profiles.filter((p: any) => p.status === 'approved').length;
        const rejected = data.profiles.filter((p: any) => p.status === 'rejected').length;
        const featured = data.profiles.filter((p: any) => p.featured).length;
        
        setStats({ total, pending, approved, rejected, featured });
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const updateProfile = async (id: string, updates: any) => {
    try {
      console.log('Updating profile:', id, updates);
      
      const response = await fetch(`/api/profiles/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const result = await response.json();
      console.log('Update response:', result);

      if (response.ok && result.success) {
        // Update local state immediately for better UX
        setProfiles(prev => prev.map(profile => 
          profile._id === id ? { ...profile, ...updates } : profile
        ));
        setEditingProfile(null);
        
        // Optionally refresh from server
        setTimeout(() => fetchProfiles(), 100);
      } else {
        throw new Error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(`Failed to update profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const deleteProfile = async (id: string) => {
    if (!confirm('Are you sure you want to delete this profile?')) return;

    try {
      const response = await fetch(`/api/profiles/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchProfiles();
      } else {
        throw new Error('Failed to delete profile');
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      alert('Failed to delete profile');
    }
  };

  const filteredProfiles = profiles.filter((profile: any) => {
    const matchesFilter = filter === 'all' || profile.status === filter;
    const matchesSearch = profile.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="animate-spin w-8 h-8 mx-auto mb-4 text-gray-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4"
        >
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-gradient-to-r from-accent to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Shield className="text-white" size={32} />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Secure Admin Access</h2>
            <p className="text-gray-600">Enter your secure credentials to continue</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && authenticate()}
                placeholder="Enter secure password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={authenticate}
              className="w-full bg-gradient-to-r from-accent to-orange-600 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
            >
              Access Admin Panel
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-accent to-orange-600 rounded-xl flex items-center justify-center">
                <Crown className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-xs text-gray-500">CofounderBase Management</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
          
          {/* Modern Tabs */}
          <div className="flex space-x-8 -mb-px">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'profiles', label: 'Profiles', icon: Users },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-accent text-accent'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                {[
                  { label: 'Total Profiles', value: stats.total, icon: Users, color: 'blue' },
                  { label: 'Pending Review', value: stats.pending, icon: Clock, color: 'yellow' },
                  { label: 'Approved', value: stats.approved, icon: UserCheck, color: 'green' },
                  { label: 'Rejected', value: stats.rejected, icon: UserX, color: 'red' },
                  { label: 'Featured', value: stats.featured, icon: Star, color: 'purple' }
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">{stat.label}</p>
                          <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${stat.color}-100`}>
                          <Icon className={`text-${stat.color}-600`} size={24} />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Submissions</h3>
                <div className="space-y-4">
                  {profiles.slice(0, 5).map((profile) => (
                    <div key={profile._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          {profile.profilePicture ? (
                            <img 
                              src={profile.profilePicture} 
                              alt={profile.fullName}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <span className="text-sm font-medium text-gray-600">
                              {profile.fullName.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{profile.fullName}</p>
                          <p className="text-sm text-gray-500">{profile.type} • {profile.location}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        profile.status === 'approved' 
                          ? 'bg-green-100 text-green-800'
                          : profile.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {profile.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Profiles Tab */}
        {activeTab === 'profiles' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Profile Management</h2>
              
              {/* Search and Filter */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search profiles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                </div>
                
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Profiles Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-gray-400" size={32} />
                <span className="ml-2 text-gray-600">Loading profiles...</span>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredProfiles.map((profile) => (
                  <ProfileCard 
                    key={profile._id} 
                    profile={profile} 
                    onEdit={setEditingProfile}
                    onUpdate={updateProfile}
                    onDelete={deleteProfile}
                  />
                ))}
                
                {filteredProfiles.length === 0 && (
                  <div className="text-center py-20">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No profiles found matching your criteria.</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <SettingsPanel settings={settings} onSettingsUpdate={fetchSettings} />
        )}
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {editingProfile && (
          <EditProfileModal 
            profile={editingProfile}
            onClose={() => setEditingProfile(null)}
            onSave={(updates: any) => updateProfile(editingProfile._id, updates)}
            settings={settings}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Modern Profile Card Component
function ProfileCard({ profile, onEdit, onUpdate, onDelete }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center overflow-hidden">
            {profile.profilePicture ? (
              <img 
                src={profile.profilePicture} 
                alt={profile.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl font-semibold text-gray-600">
                {profile.fullName.charAt(0)}
              </span>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{profile.fullName}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                profile.status === 'approved' 
                  ? 'bg-green-100 text-green-800'
                  : profile.status === 'rejected'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {profile.status}
              </span>
              {profile.featured && (
                <Star className="text-accent" size={16} />
              )}
            </div>
            
            <p className="text-accent font-medium mb-2">{profile.type}</p>
            <p className="text-sm text-gray-600 mb-2">{profile.email}</p>
            <p className="text-sm text-gray-500">{profile.location} • {profile.availability}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {profile.status === 'pending' && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onUpdate(profile._id, { status: 'approved' })}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Approve"
              >
                <Check size={16} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onUpdate(profile._id, { status: 'rejected' })}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Reject"
              >
                <X size={16} />
              </motion.button>
            </>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onUpdate(profile._id, { featured: !profile.featured })}
            className={`p-2 rounded-lg transition-colors ${
              profile.featured 
                ? 'text-accent hover:bg-orange-50' 
                : 'text-gray-400 hover:bg-gray-50'
            }`}
            title={profile.featured ? 'Remove from featured' : 'Add to featured'}
          >
            {profile.featured ? <Star size={16} /> : <StarOff size={16} />}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(profile)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit Profile"
          >
            <Edit size={16} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(profile._id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </motion.button>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 line-clamp-2">{profile.bio}</p>
        
        <div className="flex flex-wrap gap-2 mt-3">
          {profile.industry?.slice(0, 3).map((item: string, index: number) => (
            <span 
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg"
            >
              {item}
            </span>
          ))}
          {profile.skills?.slice(0, 2).map((skill: string, index: number) => (
            <span 
              key={index}
              className="px-2 py-1 bg-black text-white text-xs rounded-lg"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Edit Profile Modal Component
function EditProfileModal({ profile, onClose, onSave, settings }: any) {
  const [formData, setFormData] = useState({
    ...profile,
    industry: profile.industry || [],
    skills: profile.skills || [],
    skillsNeeded: profile.skillsNeeded || []
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData({ ...formData, profilePicture: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleArrayValue = (array: string[], value: string, fieldName: string) => {
    const newArray = array.includes(value)
      ? array.filter(item => item !== value)
      : [...array, value];
    setFormData({ ...formData, [fieldName]: newArray });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Profile Picture */}
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-2xl flex items-center justify-center overflow-hidden mx-auto mb-4">
              {formData.profilePicture ? (
                <img 
                  src={formData.profilePicture} 
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Upload className="text-gray-400" size={24} />
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="profile-upload"
            />
            <label
              htmlFor="profile-upload"
              className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Change Photo
            </label>
          </div>

          {/* Form Fields */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
              <input
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                <option value="Founder">Founder</option>
                <option value="Co-founder">Co-founder</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
              <select
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Advisory">Advisory</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Startup Stage</label>
              <select
                value={formData.startupStage}
                onChange={(e) => setFormData({ ...formData, startupStage: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                <option value="Idea">Idea</option>
                <option value="MVP">MVP</option>
                <option value="Growth">Growth</option>
                <option value="Scaling">Scaling</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">What I'm Looking For</label>
            <textarea
              value={formData.lookingFor}
              onChange={(e) => setFormData({ ...formData, lookingFor: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          {/* Industries */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Industries</label>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-xl p-4">
              {settings.industries?.map((industry: string) => (
                <button
                  key={industry}
                  type="button"
                  onClick={() => toggleArrayValue(formData.industry, industry, 'industry')}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    formData.industry.includes(industry)
                      ? 'bg-accent text-white border-accent'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {industry}
                </button>
              ))}
            </div>
          </div>

          {/* Skills They Have */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Skills They Have</label>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-xl p-4">
              {settings.skills?.map((skill: string) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleArrayValue(formData.skills, skill, 'skills')}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    formData.skills.includes(skill)
                      ? 'bg-accent text-white border-accent'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Skills They Need (for Founders) */}
          {formData.type === 'Founder' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skills They Need</label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-xl p-4">
                {settings.skills?.map((skill: string) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleArrayValue(formData.skillsNeeded, skill, 'skillsNeeded')}
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                      formData.skillsNeeded.includes(skill)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Additional Fields */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Startup Name</label>
              <input
                type="text"
                value={formData.startupName || ''}
                onChange={(e) => setFormData({ ...formData, startupName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input
                type="url"
                value={formData.website || ''}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
          </div>

          {/* Founder-specific fields */}
          {formData.type === 'Founder' && (
            <div className="space-y-4 border-t border-gray-200 pt-6">
              <h4 className="text-lg font-semibold text-gray-900">Founder Details</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Description</label>
                <textarea
                  value={formData.companyDescription || ''}
                  onChange={(e) => setFormData({ ...formData, companyDescription: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Funding Stage</label>
                  <input
                    type="text"
                    value={formData.fundingStage || ''}
                    onChange={(e) => setFormData({ ...formData, fundingStage: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
                  <input
                    type="text"
                    value={formData.teamSize || ''}
                    onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Co-founder-specific fields */}
          {formData.type === 'Co-founder' && (
            <div className="space-y-4 border-t border-gray-200 pt-6">
              <h4 className="text-lg font-semibold text-gray-900">Co-founder Details</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                <input
                  type="text"
                  value={formData.experience || ''}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Previous Startups</label>
                <textarea
                  value={formData.previousStartups || ''}
                  onChange={(e) => setFormData({ ...formData, previousStartups: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Commitment Level</label>
                <input
                  type="text"
                  value={formData.commitment || ''}
                  onChange={(e) => setFormData({ ...formData, commitment: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Featured Toggle */}
          <div className="flex items-center space-x-3 border-t border-gray-200 pt-6">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 text-accent focus:ring-accent border-gray-300 rounded"
            />
            <label htmlFor="featured" className="text-sm font-medium text-gray-700">
              Featured Profile
            </label>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-accent text-white rounded-xl hover:bg-orange-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save Changes</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Settings Panel Component (same as before but with modern styling)
function SettingsPanel({ settings, onSettingsUpdate }: { settings: any, onSettingsUpdate: () => void }) {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [newItem, setNewItem] = useState('');

  const updateSettings = async (updatedSettings: any) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSettings),
      });

      if (response.ok) {
        onSettingsUpdate();
        setEditingSection(null);
        setNewItem('');
      } else {
        throw new Error('Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to update settings');
    }
  };

  const addItem = (section: string) => {
    if (!newItem.trim()) return;
    
    const updatedSettings = {
      ...settings,
      [section]: [...settings[section], newItem.trim()]
    };
    updateSettings(updatedSettings);
  };

  const removeItem = (section: string, index: number) => {
    const updatedSettings = {
      ...settings,
      [section]: settings[section].filter((_: any, i: number) => i !== index)
    };
    updateSettings(updatedSettings);
  };

  const sections = [
    { key: 'industries', title: 'Industries', description: 'Manage available industry options' },
    { key: 'skills', title: 'Skills', description: 'Manage available skill options' },
    { key: 'startupStages', title: 'Startup Stages', description: 'Manage available startup stage options' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Platform Settings</h2>
        <p className="text-gray-600">Manage the options available in forms and filters</p>
      </div>

      {sections.map((section) => (
        <div key={section.key} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                <p className="text-sm text-gray-600">{section.description}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setEditingSection(editingSection === section.key ? null : section.key)}
                className="bg-accent text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition-colors flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Add New</span>
              </motion.button>
            </div>
          </div>

          <div className="p-6">
            {editingSection === section.key && (
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder={`Enter new ${section.title.toLowerCase().slice(0, -1)}`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && addItem(section.key)}
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => addItem(section.key)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add
                  </motion.button>
                  <button
                    onClick={() => {
                      setEditingSection(null);
                      setNewItem('');
                    }}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {settings[section.key]?.map((item: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl group hover:bg-gray-100 transition-colors"
                >
                  <span className="text-gray-900">{item}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeItem(section.key, index)}
                    className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 transition-all p-1 rounded"
                    title="Remove"
                  >
                    <Minus size={16} />
                  </motion.button>
                </motion.div>
              ))}
            </div>

            {(!settings[section.key] || settings[section.key].length === 0) && (
              <div className="text-center py-8 text-gray-500">
                No {section.title.toLowerCase()} configured yet.
              </div>
            )}
          </div>
        </div>
      ))}
    </motion.div>
  );
}