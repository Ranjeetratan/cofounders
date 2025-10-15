'use client';

import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface FilterBarProps {
  onFiltersChange: (filters: any) => void;
}

const industries = [
  'Technology', 'Healthcare', 'Finance', 'E-commerce', 'Education', 'Real Estate',
  'Food & Beverage', 'Travel', 'Entertainment', 'Gaming', 'Social Media', 'AI/ML',
  'Blockchain', 'IoT', 'Cybersecurity', 'Marketing', 'HR', 'Logistics', 'Energy'
];

const skills = [
  'Product Management', 'Engineering', 'Design', 'Marketing', 'Sales', 'Business Development',
  'Operations', 'Finance', 'Legal', 'HR', 'Data Science', 'AI/ML', 'Mobile Development',
  'Web Development', 'DevOps', 'UI/UX', 'Growth Hacking', 'Content Creation', 'SEO/SEM'
];

export default function FilterBar({ onFiltersChange }: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    industry: '',
    skills: '',
    skillsNeeded: '',
    location: '',
    startupStage: '',
    availability: '',
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      type: '',
      industry: '',
      skills: '',
      skillsNeeded: '',
      location: '',
      startupStage: '',
      availability: '',
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-16 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Search Bar */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, bio, or location..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-3 border rounded-xl transition-colors ${
              showFilters || hasActiveFilters
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Filter size={20} />
            <span>More Filters</span>
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-2 px-4 py-3 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={20} />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Quick Filters - Always Visible */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-gray-700 hidden sm:block">Filter by:</span>
          
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-sm bg-white"
          >
            <option value="">All Types</option>
            <option value="Founder">Founder</option>
            <option value="Co-founder">Co-founder</option>
          </select>

          <select
            value={filters.startupStage}
            onChange={(e) => handleFilterChange('startupStage', e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-sm bg-white"
          >
            <option value="">All Stages</option>
            <option value="Idea">Idea</option>
            <option value="MVP">MVP</option>
            <option value="Growth">Growth</option>
            <option value="Scaling">Scaling</option>
          </select>

          <select
            value={filters.availability}
            onChange={(e) => handleFilterChange('availability', e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-sm bg-white"
          >
            <option value="">All Availability</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Advisory">Advisory</option>
          </select>

          <select
            value={filters.industry}
            onChange={(e) => handleFilterChange('industry', e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-sm bg-white"
          >
            <option value="">All Industries</option>
            {industries.slice(0, 10).map((industry) => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </div>

        {/* Advanced Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 mt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">All Industries</label>
              <select
                value={filters.industry}
                onChange={(e) => handleFilterChange('industry', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
              >
                <option value="">All Industries</option>
                {industries.map((industry) => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills They Have</label>
              <select
                value={filters.skills}
                onChange={(e) => handleFilterChange('skills', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
              >
                <option value="">All Skills</option>
                {skills.map((skill) => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills They Need</label>
              <select
                value={filters.skillsNeeded || ''}
                onChange={(e) => handleFilterChange('skillsNeeded', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
              >
                <option value="">Any Skills Needed</option>
                {skills.map((skill) => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                placeholder="Enter location..."
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}