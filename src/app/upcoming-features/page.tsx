'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowUp, 
  Clock, 
  Filter, 
  Search, 
  Sparkles, 
  TrendingUp,
  Users,
  Zap,
  Star,
  CheckCircle,
  Code,
  Rocket,
  Heart,
  Bot,
  Video,
  MessageCircle,
  Presentation,
  Target,
  Calendar,
  Trophy,
  Smartphone,
  Link,
  GraduationCap,
  Lightbulb,
  Globe,
  Scale
} from 'lucide-react';

interface Feature {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  estimatedTime: string;
  votes: number;
  voters: string[];
  icon: string;
  tags: string[];
}

export default function UpcomingFeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('votes');
  const [votedFeatures, setVotedFeatures] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchFeatures();
    // Load voted features from localStorage
    const saved = localStorage.getItem('votedFeatures');
    if (saved) {
      setVotedFeatures(new Set(JSON.parse(saved)));
    }
  }, []);

  const fetchFeatures = async () => {
    try {
      const response = await fetch('/api/features');
      const data = await response.json();
      
      if (data.success) {
        setFeatures(data.features);
      }
    } catch (error) {
      console.error('Error fetching features:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (featureId: string) => {
    try {
      const response = await fetch(`/api/features/${featureId}/vote`, {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update local state
        setFeatures(prev => prev.map(feature => 
          feature._id === featureId 
            ? { ...feature, votes: data.votes }
            : feature
        ));
        
        // Update voted features
        const newVoted = new Set(votedFeatures);
        newVoted.add(featureId);
        setVotedFeatures(newVoted);
        localStorage.setItem('votedFeatures', JSON.stringify([...newVoted]));
      } else {
        alert(data.error || 'Failed to vote');
      }
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to vote. Please try again.');
    }
  };

  const filteredFeatures = features
    .filter(feature => {
      const matchesFilter = filter === 'all' || feature.category.toLowerCase() === filter.toLowerCase();
      const matchesSearch = feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           feature.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           feature.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'votes') return b.votes - a.votes;
      if (sortBy === 'priority') {
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
      }
      return new Date((b as any).createdAt || 0).getTime() - new Date((a as any).createdAt || 0).getTime();
    });

  const getFeatureIcon = (iconName: string) => {
    const iconProps = { size: 20, className: "text-gray-600" };
    switch (iconName) {
      case 'ai': return <Bot {...iconProps} />;
      case 'video': return <Video {...iconProps} />;
      case 'chat': return <MessageCircle {...iconProps} />;
      case 'presentation': return <Presentation {...iconProps} />;
      case 'target': return <Target {...iconProps} />;
      case 'users': return <Users {...iconProps} />;
      case 'scale': return <Scale {...iconProps} />;
      case 'calendar': return <Calendar {...iconProps} />;
      case 'trophy': return <Trophy {...iconProps} />;
      case 'smartphone': return <Smartphone {...iconProps} />;
      case 'trending-up': return <TrendingUp {...iconProps} />;
      case 'link': return <Link {...iconProps} />;
      case 'graduation-cap': return <GraduationCap {...iconProps} />;
      case 'lightbulb': return <Lightbulb {...iconProps} />;
      case 'globe': return <Globe {...iconProps} />;
      default: return <Sparkles {...iconProps} />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Core': return <Zap className="text-blue-500" size={16} />;
      case 'Premium': return <Star className="text-purple-500" size={16} />;
      case 'Integration': return <Code className="text-green-500" size={16} />;
      case 'Analytics': return <TrendingUp className="text-orange-500" size={16} />;
      case 'Community': return <Users className="text-pink-500" size={16} />;
      default: return <Sparkles className="text-gray-500" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planned': return 'bg-gray-100 text-gray-800';
      case 'In Development': return 'bg-blue-100 text-blue-800';
      case 'Coming Soon': return 'bg-orange-100 text-orange-800';
      case 'Released': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading upcoming features...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm mb-6">
              <Rocket className="mr-2" size={16} />
              Shape the Future of CofounderBase
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Upcoming Features
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/80 mb-8 max-w-3xl mx-auto"
          >
            Vote for the features you want to see next! Your input directly influences our development roadmap 
            and helps us build the tools that matter most to founders like you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-8 text-sm"
          >
            <div className="flex items-center space-x-2">
              <Heart className="text-red-400" size={16} />
              <span>Community Driven</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="text-green-400" size={16} />
              <span>Data Informed</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="text-yellow-400" size={16} />
              <span>Rapidly Delivered</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search features..."
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
                <option value="all">All Categories</option>
                <option value="core">Core Features</option>
                <option value="premium">Premium Features</option>
                <option value="integration">Integrations</option>
                <option value="analytics">Analytics</option>
                <option value="community">Community</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
              >
                <option value="votes">Most Voted</option>
                <option value="priority">Priority</option>
                <option value="recent">Recently Added</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          <AnimatePresence>
            {filteredFeatures.map((feature, index) => (
              <motion.div
                key={feature._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 hover:shadow-lg hover:border-gray-200 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center group-hover:from-accent/10 group-hover:to-accent/20 transition-all duration-300">
                      {getFeatureIcon(feature.icon)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                        {getCategoryIcon(feature.category)}
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-lg ${getStatusColor(feature.status)}`}>
                          {feature.status}
                        </span>
                        <span className="text-xs text-gray-500">{feature.estimatedTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Vote Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleVote(feature._id)}
                    disabled={votedFeatures.has(feature._id)}
                    className={`flex flex-col items-center px-4 py-3 rounded-2xl transition-all duration-300 min-w-[70px] ${
                      votedFeatures.has(feature._id)
                        ? 'bg-accent text-white cursor-not-allowed'
                        : 'bg-gray-50 hover:bg-accent hover:text-white text-gray-700 border border-gray-200 hover:border-accent'
                    }`}
                  >
                    <ArrowUp size={16} className="mb-1" />
                    <span className="text-lg font-bold">{feature.votes}</span>
                    <span className="text-xs">
                      {votedFeatures.has(feature._id) ? 'Voted' : 'Vote'}
                    </span>
                  </motion.button>
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed text-sm">{feature.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {feature.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span 
                        key={tagIndex}
                        className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-lg border border-gray-100"
                      >
                        {tag}
                      </span>
                    ))}
                    {feature.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-50 text-gray-400 text-xs rounded-lg border border-gray-100">
                        +{feature.tags.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-400">Priority:</span>
                    <span className={`text-xs font-medium ${getPriorityColor(feature.priority)}`}>
                      {feature.priority}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredFeatures.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No features found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters to find more features.
            </p>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-accent to-orange-600 rounded-2xl p-8 mt-12 text-white text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Have a Feature Idea?</h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            We're always looking for new ways to improve CofounderBase. If you have an idea for a feature 
            that would help founders connect better, we'd love to hear from you!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-accent px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
            onClick={() => window.open('mailto:hello@cofounderbase.com?subject=Feature Request', '_blank')}
          >
            Suggest a Feature
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}