'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { Search, ArrowRight, Users, Target, Zap, CheckCircle, Plus, Bot, Video, MessageCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import ProfileCard from '@/components/ProfileCard';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

function AnimatedText() {
  const words = ['cofounder', 'founder'];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <motion.div 
      key={currentIndex}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0
      }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="text-accent block"
    >
      {words[currentIndex]}
    </motion.div>
  );
}

const painPoints = [
  {
    problem: "Finding the right cofounder is like finding a needle in a haystack",
    solution: "We curate and verify every profile to ensure quality matches"
  },
  {
    problem: "Networking events are time-consuming and often ineffective",
    solution: "Browse hundreds of founders from your couch, filter by exactly what you need"
  },
  {
    problem: "LinkedIn searches return irrelevant results and spam",
    solution: "Purpose-built platform with detailed founder profiles and clear intentions"
  },
  {
    problem: "No way to know if someone is seriously looking for a cofounder",
    solution: "Every profile shows availability, stage, and exactly what they're looking for"
  }
];

const faqs = [
  {
    question: "How do you verify profiles?",
    answer: "Every profile goes through manual review. We check LinkedIn profiles, validate startup information, and ensure all details are accurate before approval."
  },
  {
    question: "Is CofounderBase free to use?",
    answer: "Yes! Browsing profiles and basic features are completely free. We may introduce premium features in the future for enhanced visibility."
  },
  {
    question: "How do I connect with founders?",
    answer: "Simply click the 'Connect' button on any profile to reach out via LinkedIn. We facilitate the introduction, but conversations happen directly between founders."
  },
  {
    question: "What makes a good cofounder match?",
    answer: "Look for complementary skills, shared vision, similar commitment levels, and compatible working styles. Our filters help you find founders who match your criteria."
  },
  {
    question: "Can I edit my profile after submission?",
    answer: "Currently, profile edits need to go through our admin team. Contact us with any changes and we'll update your profile within 24 hours."
  },
  {
    question: "How long does profile approval take?",
    answer: "Most profiles are reviewed and approved within 24-48 hours. We'll notify you via email once your profile is live."
  }
];

export default function Home() {
  const [featuredProfiles, setFeaturedProfiles] = useState<any[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [userCount, setUserCount] = useState(100);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    // Fetch featured profiles
    fetch('/api/profiles?featured=true&limit=3')
      .then(res => res.json())
      .then(data => setFeaturedProfiles(data.profiles || []))
      .catch(err => console.error('Error fetching featured profiles:', err));

    // Fetch total user count
    fetch('/api/profiles?status=approved')
      .then(res => res.json())
      .then(data => {
        const totalCount = Math.max(100, data.count || 100); // Start from 100 minimum
        setUserCount(totalCount);
      })
      .catch(err => {
        console.error('Error fetching user count:', err);
        setUserCount(100); // Fallback to 100
      });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Parallax */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          />
        </div>

        <motion.div 
          style={{ y, opacity }}
          className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm mb-6">
              <span className="w-2 h-2 bg-accent rounded-full mr-2 animate-pulse"></span>
              Join {userCount}+ founders already connected
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            <div className="mb-2">Find your perfect</div>
            <AnimatedText />
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Stop wasting time on endless networking events. Connect with verified founders 
            and cofounders who are serious about building the future.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/submit"
                className="bg-accent text-white px-8 py-4 rounded-2xl hover:bg-orange-600 transition-all duration-300 flex items-center space-x-2 text-lg font-medium shadow-lg hover:shadow-xl"
              >
                <span>Submit Your Profile</span>
                <ArrowRight size={20} />
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/directory"
                className="border-2 border-accent text-white px-8 py-4 rounded-2xl hover:bg-accent/20 transition-all duration-300 flex items-center space-x-2 text-lg font-medium backdrop-blur-sm"
              >
                <Search size={20} />
                <span>Browse Directory</span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/50 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-gray-900 mb-4">
              The Cofounder Search Problem
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-gray-600 max-w-2xl mx-auto">
              Finding the right cofounder shouldn't be harder than building your startup.
            </motion.p>
          </motion.div>
          
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-8"
          >
            {painPoints.map((point, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{point.problem}</h3>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                      <p className="text-gray-600 text-sm">{point.solution}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-gray-900 mb-4">
              Why CofounderBase Works
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built by founders, for founders. We understand what makes a great cofounder match.
            </motion.p>
          </motion.div>
          
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Users,
                title: "Curated Community",
                description: "Every profile is manually reviewed. No spam, no fake profiles, just serious founders."
              },
              {
                icon: Target,
                title: "Perfect Matching",
                description: "Advanced filters help you find founders with complementary skills and shared vision."
              },
              {
                icon: Zap,
                title: "Direct Connection",
                description: "Skip the middleman. Connect directly via LinkedIn and start building together."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6"
                >
                  <feature.icon className="text-accent" size={32} />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Profiles Section */}
      {featuredProfiles.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-gray-900 mb-4">
                Featured Founders
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-lg text-gray-600">
                Meet some of the amazing entrepreneurs in our community.
              </motion.p>
            </motion.div>
            
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {featuredProfiles.map((profile, index) => (
                <motion.div
                  key={profile._id}
                  variants={fadeInUp}
                >
                  <ProfileCard profile={profile} />
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link 
                href="/directory"
                className="inline-flex items-center space-x-2 text-accent hover:text-orange-600 font-medium text-lg group"
              >
                <span>View all founders</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-gray-600">
              Everything you need to know about finding your cofounder.
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-4"
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openFaq === index ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Plus size={20} className="text-gray-500" />
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: openFaq === index ? "auto" : 0,
                    opacity: openFaq === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-8 pb-6 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Upcoming Features Teaser */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-gray-900 mb-4">
              What's Coming Next?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-gray-600 max-w-2xl mx-auto">
              Help shape the future of CofounderBase by voting on upcoming features. Your voice matters!
            </motion.p>
          </motion.div>
          
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8 mb-12"
          >
            {[
              {
                icon: Bot,
                title: "AI-Powered Matching",
                description: "Smart algorithms to find your perfect co-founder match",
                votes: 127
              },
              {
                icon: Video,
                title: "Video Introductions",
                description: "60-second video profiles to showcase your personality",
                votes: 89
              },
              {
                icon: MessageCircle,
                title: "Real-time Chat",
                description: "Built-in messaging system for seamless communication",
                votes: 156
              }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="text-accent" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <ArrowRight size={16} className="text-accent" />
                    <span>{feature.votes} votes</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link 
              href="/upcoming-features"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-accent to-orange-600 text-white px-8 py-4 rounded-2xl hover:shadow-lg transition-all duration-300 font-medium"
            >
              <span>View All Features & Vote</span>
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-white mb-6">
              Ready to find your cofounder?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-white/80 mb-8">
              Join the community of founders building the future together.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href="/submit"
                  className="bg-accent text-white px-8 py-4 rounded-2xl hover:bg-orange-600 transition-all duration-300 inline-flex items-center space-x-2 text-lg font-medium shadow-lg hover:shadow-xl"
                >
                  <span>Get Started Today</span>
                  <ArrowRight size={20} />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}