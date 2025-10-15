'use client';

import { motion } from 'framer-motion';
import { ExternalLink, MapPin, Clock, Building, Eye, Linkedin, Globe, Verified, Star } from 'lucide-react';
import { IProfile } from '@/models/Profile';
import Link from 'next/link';

interface ProfileCardProps {
  profile: IProfile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 h-full flex flex-col group"
    >
      {/* Header with gradient background */}
      <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6 pb-8">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg">
                {profile.profilePicture ? (
                  <img 
                    src={profile.profilePicture} 
                    alt={profile.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-bold text-gray-600">
                    {profile.fullName.charAt(0)}
                  </span>
                )}
              </div>
              {profile.status === 'approved' && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <Verified size={12} className="text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-bold text-white truncate">{profile.fullName}</h3>
                {profile.featured && (
                  <Star size={16} className="text-accent flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center space-x-2 mb-3">
                <span className="px-2 py-1 bg-accent/20 text-accent rounded-lg text-xs font-medium">
                  {profile.type}
                </span>
                {profile.startupName && (
                  <span className="text-white/70 text-xs truncate">
                    @ {profile.startupName}
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-3 text-xs text-white/70">
                <div className="flex items-center space-x-1">
                  <MapPin size={12} />
                  <span className="truncate">{profile.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock size={12} />
                  <span>{profile.availability}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Building size={12} />
                  <span>{profile.startupStage}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
          {profile.bio}
        </p>
        
        {/* Tags */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 min-h-[2.5rem]">
            {profile.industry.slice(0, 2).map((item, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-xs rounded-xl font-medium"
              >
                {item}
              </span>
            ))}
            {profile.skills.slice(0, 2).map((skill, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-gradient-to-r from-accent to-orange-600 text-white text-xs rounded-xl font-medium shadow-sm"
                title="Skills they have"
              >
                {skill}
              </span>
            ))}
            {profile.type === 'Founder' && profile.skillsNeeded && profile.skillsNeeded.slice(0, 1).map((skill, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-xl font-medium shadow-sm"
                title="Skills they need"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center space-x-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href={`/profile/${profile._id}`}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-sm hover:bg-gray-200 transition-colors flex items-center space-x-2 group"
              >
                <Eye size={14} />
                <span>View Profile</span>
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Linkedin size={14} />
                <span>Connect</span>
              </a>
            </motion.div>
          </div>
          
          {profile.website && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-xl hover:bg-gray-100"
                title="Visit Website"
              >
                <Globe size={16} />
              </a>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"></div>
    </motion.div>
  );
}