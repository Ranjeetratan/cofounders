'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Loader2 } from 'lucide-react';
import ProfileCard from '@/components/ProfileCard';
import FilterBar from '@/components/FilterBar';

export default function DirectoryPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<any>({});

  const fetchProfiles = async (currentFilters: any = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      // Add filters to params
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value && value !== '') {
          params.append(key, value as string);
        }
      });

      const response = await fetch(`/api/profiles?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        let filteredProfiles = data.profiles;
        
        // Client-side search filtering for name and bio
        if (currentFilters.search) {
          const searchTerm = currentFilters.search.toLowerCase();
          filteredProfiles = filteredProfiles.filter((profile: any) =>
            profile.fullName.toLowerCase().includes(searchTerm) ||
            profile.bio.toLowerCase().includes(searchTerm) ||
            profile.location.toLowerCase().includes(searchTerm)
          );
        }
        
        setProfiles(filteredProfiles);
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    fetchProfiles(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-black pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              Founder Directory
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Discover and connect with founders and cofounders from around the world.
              Find your perfect match to build something amazing together.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filters */}
      <FilterBar onFiltersChange={handleFiltersChange} />

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-gray-400" size={32} />
            <span className="ml-2 text-gray-600">Loading profiles...</span>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-2 text-gray-600">
                <Users size={20} />
                <span>
                  {profiles.length} {profiles.length === 1 ? 'founder' : 'founders'} found
                </span>
              </div>
            </div>

            {/* Profiles Grid */}
            {profiles.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
              >
                {profiles.map((profile, index) => (
                  <motion.div
                    key={profile._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="h-full"
                  >
                    <ProfileCard profile={profile} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No founders found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search terms to find more results.
                </p>
                <button
                  onClick={() => handleFiltersChange({})}
                  className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}