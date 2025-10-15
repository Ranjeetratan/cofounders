'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { 
  MapPin, 
  Clock, 
  Building, 
  ExternalLink, 
  Linkedin, 
  Globe, 
  Users, 
  Target,
  Share2,
  Copy,
  Check,
  Mail,
  Calendar,
  Briefcase,
  Award,
  TrendingUp,
  ArrowLeft,
  Verified
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const params = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchProfile(params.id as string);
    }
  }, [params.id]);

  const fetchProfile = async (id: string) => {
    try {
      const response = await fetch(`/api/profiles/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setProfile(data.profile);
      } else {
        console.error('Profile not found');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const shareProfile = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.fullName} - CofounderBase`,
          text: `Check out ${profile.fullName}'s profile on CofounderBase`,
          url: url,
        });
      } catch (error) {
        copyToClipboard(url);
      }
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
          <p className="text-gray-600 mb-6">The profile you're looking for doesn't exist or has been removed.</p>
          <Link 
            href="/directory"
            className="bg-accent text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors"
          >
            Browse Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link 
          href="/directory"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Directory</span>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white rounded-3xl shadow-xl overflow-hidden mb-8"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800">
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px)`,
              backgroundSize: '30px 30px'
            }}></div>
          </div>

          <div className="relative z-10 p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
              <div className="flex items-start space-x-6 mb-6 md:mb-0">
                <div className="relative">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center overflow-hidden shadow-lg">
                    {profile.profilePicture ? (
                      <img 
                        src={profile.profilePicture} 
                        alt={profile.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl md:text-4xl font-bold text-gray-600">
                        {profile.fullName.charAt(0)}
                      </span>
                    )}
                  </div>
                  {profile.status === 'approved' && (
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <Verified size={16} className="text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-white">{profile.fullName}</h1>
                    {profile.featured && (
                      <div className="px-3 py-1 bg-accent rounded-full">
                        <span className="text-white text-sm font-medium">Featured</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="px-3 py-1 bg-accent/20 text-accent rounded-lg text-sm font-medium">
                      {profile.type}
                    </span>
                    {profile.startupName && (
                      <span className="text-white/80 text-sm">
                        @ {profile.startupName}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                    <div className="flex items-center space-x-2">
                      <MapPin size={16} />
                      <span>{profile.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock size={16} />
                      <span>{profile.availability}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Building size={16} />
                      <span>{profile.startupStage}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={shareProfile}
                  className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-colors"
                >
                  {copied ? <Check size={20} className="text-white" /> : <Share2 size={20} className="text-white" />}
                </motion.button>
                
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-lg"
                >
                  <Linkedin size={20} />
                  <span>Connect</span>
                </a>
                
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-2xl hover:bg-white/20 transition-colors flex items-center space-x-2"
                  >
                    <Globe size={20} />
                    <span>Website</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-lg p-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <Users className="text-white" size={20} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">About</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">{profile.bio}</p>
            </motion.div>

            {/* What I'm Looking For */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-lg p-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-accent to-orange-600 rounded-2xl flex items-center justify-center">
                  <Target className="text-white" size={20} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile.type === 'Founder' ? 'Looking for Co-founder' : 'Looking to Join'}
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">{profile.lookingFor}</p>
            </motion.div>

            {/* Experience & Background */}
            {(profile.companyDescription || profile.previousStartups) && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-3xl shadow-lg p-8"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Briefcase className="text-white" size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {profile.type === 'Founder' ? 'Company Details' : 'Experience'}
                  </h2>
                </div>
                
                <div className="space-y-6">
                  {profile.companyDescription && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">About the Company</h3>
                      <p className="text-gray-600 leading-relaxed">{profile.companyDescription}</p>
                    </div>
                  )}
                  
                  {profile.previousStartups && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Previous Experience</h3>
                      <p className="text-gray-600 leading-relaxed">{profile.previousStartups}</p>
                    </div>
                  )}
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {profile.fundingStage && (
                      <div className="bg-gray-50 rounded-2xl p-4">
                        <h4 className="font-medium text-gray-900 mb-1">Funding Stage</h4>
                        <p className="text-gray-600">{profile.fundingStage}</p>
                      </div>
                    )}
                    
                    {profile.teamSize && (
                      <div className="bg-gray-50 rounded-2xl p-4">
                        <h4 className="font-medium text-gray-900 mb-1">Team Size</h4>
                        <p className="text-gray-600">{profile.teamSize}</p>
                      </div>
                    )}
                    
                    {profile.experience && (
                      <div className="bg-gray-50 rounded-2xl p-4">
                        <h4 className="font-medium text-gray-900 mb-1">Experience Level</h4>
                        <p className="text-gray-600">{profile.experience}</p>
                      </div>
                    )}
                    
                    {profile.commitment && (
                      <div className="bg-gray-50 rounded-2xl p-4">
                        <h4 className="font-medium text-gray-900 mb-1">Commitment</h4>
                        <p className="text-gray-600">{profile.commitment}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Info</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                  <span className="text-sm text-gray-600">Type</span>
                  <span className="font-medium text-gray-900">{profile.type}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                  <span className="text-sm text-gray-600">Availability</span>
                  <span className="font-medium text-gray-900">{profile.availability}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                  <span className="text-sm text-gray-600">Stage</span>
                  <span className="font-medium text-gray-900">{profile.startupStage}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                  <span className="text-sm text-gray-600">Location</span>
                  <span className="font-medium text-gray-900">{profile.location}</span>
                </div>
              </div>
            </motion.div>

            {/* Industries */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl shadow-lg p-6"
            >
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="text-gray-600" size={20} />
                <h3 className="text-lg font-semibold text-gray-900">Industries</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.industry.map((item: string, index: number) => (
                  <span 
                    key={index}
                    className="px-3 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-sm rounded-xl font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl shadow-lg p-6"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Award className="text-gray-600" size={20} />
                <h3 className="text-lg font-semibold text-gray-900">Skills & Expertise</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    {profile.type === 'Founder' ? 'Skills They Have' : 'Their Skills'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill: string, index: number) => (
                      <span 
                        key={index}
                        className="px-3 py-2 bg-gradient-to-r from-accent to-orange-600 text-white text-sm rounded-xl font-medium shadow-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                {profile.type === 'Founder' && profile.skillsNeeded && profile.skillsNeeded.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Skills They Need</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.skillsNeeded.map((skill: string, index: number) => (
                        <span 
                          key={index}
                          className="px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-xl font-medium shadow-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Contact CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-accent to-orange-600 rounded-3xl shadow-lg p-6 text-white"
            >
              <h3 className="text-lg font-semibold mb-3">Ready to Connect?</h3>
              <p className="text-white/90 text-sm mb-4">
                Reach out to {profile.fullName} and start building something amazing together.
              </p>
              <div className="space-y-3">
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-white/20 backdrop-blur-sm text-white py-3 rounded-2xl hover:bg-white/30 transition-colors flex items-center justify-center space-x-2"
                >
                  <Linkedin size={18} />
                  <span>Connect on LinkedIn</span>
                </a>
                
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-white/20 backdrop-blur-sm text-white py-3 rounded-2xl hover:bg-white/30 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Globe size={18} />
                    <span>Visit Website</span>
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}