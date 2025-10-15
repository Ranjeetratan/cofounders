'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 bg-black rounded-full flex items-center justify-center"
            >
              <div className="w-2 h-2 bg-accent rounded-full"></div>
            </motion.div>
            <span className={`text-xl font-semibold transition-colors ${
              isScrolled ? 'text-gray-900' : 'text-white'
            }`}>
              CofounderBase
            </span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link 
              href="/directory" 
              className={`transition-colors hover:text-accent ${
                isScrolled ? 'text-gray-600' : 'text-white/80'
              }`}
            >
              Directory
            </Link>
            <Link 
              href="/upcoming-features" 
              className={`transition-colors hover:text-accent ${
                isScrolled ? 'text-gray-600' : 'text-white/80'
              }`}
            >
              Features
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/submit" 
                className="bg-accent text-white px-4 py-2 rounded-2xl hover:bg-orange-600 transition-colors font-medium"
              >
                Submit Profile
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}