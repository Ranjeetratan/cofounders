'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle, Loader2, ArrowRight, ArrowLeft, Upload, User, Briefcase, Target } from 'lucide-react';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  location: z.string().min(2, 'Location is required'),
  linkedinUrl: z.string().url('Valid LinkedIn URL is required'),
  profilePicture: z.string().optional(),
  type: z.enum(['Founder', 'Co-founder']),
  lookingFor: z.string().min(10, 'Please describe what you\'re looking for (min 10 characters)'),
  bio: z.string().min(50, 'Bio must be at least 50 characters').max(300, 'Bio must be less than 300 characters'),
  industry: z.array(z.string()).min(1, 'Select at least one industry'),
  skills: z.array(z.string()).min(1, 'Select at least one skill you have'),
  skillsNeeded: z.array(z.string()).optional(),
  availability: z.enum(['Full-time', 'Part-time', 'Weekends']),
  startupStage: z.enum(['Idea', 'MVP', 'Growth', 'Scaling']),
  startupName: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  // Founder-specific fields
  companyDescription: z.string().optional(),
  fundingStage: z.string().optional(),
  teamSize: z.string().optional(),
  // Co-founder-specific fields
  experience: z.string().optional(),
  previousStartups: z.string().optional(),
  commitment: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const industries = [
  'Technology', 'Healthcare', 'Finance', 'E-commerce', 'Education', 'Real Estate',
  'Food & Beverage', 'Travel', 'Entertainment', 'Gaming', 'Social Media', 'AI/ML',
  'Blockchain', 'IoT', 'Cybersecurity', 'Marketing', 'HR', 'Logistics', 'Energy', 'Other'
];

const skills = [
  'Product Management', 'Engineering', 'Design', 'Marketing', 'Sales', 'Business Development',
  'Operations', 'Finance', 'Legal', 'HR', 'Data Science', 'AI/ML', 'Mobile Development',
  'Web Development', 'DevOps', 'UI/UX', 'Growth Hacking', 'Content Creation', 'SEO/SEM', 'Other'
];

const fundingStages = [
  'Pre-seed', 'Seed', 'Series A', 'Series B+', 'Bootstrapped', 'Not applicable'
];

const teamSizes = [
  'Just me', '2-5 people', '6-10 people', '11-20 people', '20+ people'
];

const experienceLevels = [
  '0-2 years', '3-5 years', '6-10 years', '10+ years'
];

const commitmentLevels = [
  'Full-time commitment', 'Part-time (20+ hours/week)', 'Advisory role', 'Flexible'
];

export default function SubmitPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string>('');
  const [formData, setFormData] = useState<ProfileFormData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      industry: [],
      skills: [],
      skillsNeeded: [],
    },
  });

  const watchedType = watch('type');
  const watchedIndustry = watch('industry');
  const watchedSkills = watch('skills');
  const watchedSkillsNeeded = watch('skillsNeeded');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileImage(result);
        setValue('profilePicture', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof ProfileFormData)[] = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ['fullName', 'email', 'location', 'linkedinUrl', 'type'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['lookingFor', 'bio', 'industry', 'skills'];
    } else if (currentStep === 3) {
      fieldsToValidate = ['availability', 'startupStage'];
    }
    
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      if (currentStep === 3) {
        // Store form data for review
        const data = watch();
        setFormData(data);
      }
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (currentStep !== 4) return; // Only submit on step 4
    
    setIsLoading(true);
    try {
      const submitData = formData || data;
      console.log('Submitting profile data:', submitData);
      
      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();
      console.log('API Response:', result);

      if (response.ok && result.success) {
        setIsSubmitted(true);
      } else {
        throw new Error(result.error || 'Failed to submit profile');
      }
    } catch (error) {
      console.error('Error submitting profile:', error);
      alert(`Failed to submit profile: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleArrayValue = (array: string[], value: string, fieldName: 'industry' | 'skills' | 'skillsNeeded') => {
    const newArray = array.includes(value)
      ? array.filter(item => item !== value)
      : [...array, value];
    setValue(fieldName, newArray);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4 text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your profile has been submitted for review. We'll notify you once it's approved and live on the directory.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  const stepIcons = [User, Briefcase, Target, CheckCircle];
  const stepTitles = ['Basic Info', 'Profile Details', 'Final Details', 'Review & Submit'];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((step) => {
              const Icon = stepIcons[step - 1];
              return (
                <div key={step} className="flex items-center">
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentStep >= step
                        ? 'bg-accent text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                    animate={{
                      scale: currentStep === step ? 1.1 : 1,
                    }}
                  >
                    <Icon size={20} />
                  </motion.div>
                  <span className={`ml-2 text-sm font-medium ${
                    currentStep >= step ? 'text-accent' : 'text-gray-500'
                  }`}>
                    {stepTitles[step - 1]}
                  </span>
                  {step < 4 && (
                    <div className={`w-12 h-1 mx-2 rounded ${
                      currentStep > step ? 'bg-accent' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <form onSubmit={(e) => {
            e.preventDefault();
            if (currentStep === 4) {
              handleSubmit(onSubmit)(e);
            }
          }}>
            <AnimatePresence mode="wait">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
                    <p className="text-gray-600">Let's start with the basics</p>
                  </div>

                  {/* Profile Picture Upload */}
                  <div className="text-center">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Profile Picture (Upload your headshot)
                    </label>
                    <div className="flex justify-center">
                      <div className="relative">
                        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                          {profileImage ? (
                            <img 
                              src={profileImage} 
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
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Click to upload your photo</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      {...register('fullName')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                      placeholder="John Doe"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email (Private - Admin use only) *
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location / Country / Timezone *
                    </label>
                    <input
                      {...register('location')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                      placeholder="San Francisco, CA / PST"
                    />
                    {errors.location && (
                      <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      LinkedIn URL *
                    </label>
                    <input
                      {...register('linkedinUrl')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                      placeholder="https://linkedin.com/in/johndoe"
                    />
                    {errors.linkedinUrl && (
                      <p className="text-red-500 text-sm mt-1">{errors.linkedinUrl.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      I'm a *
                    </label>
                    <select
                      {...register('type')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                    >
                      <option value="">Select type</option>
                      <option value="Founder">Founder (I have a startup and need a co-founder)</option>
                      <option value="Co-founder">Co-founder (I want to join a startup as co-founder)</option>
                    </select>
                    {errors.type && (
                      <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Profile Details */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Details</h2>
                    <p className="text-gray-600">Tell us about yourself and what you're looking for</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {watchedType === 'Founder' 
                        ? 'What kind of co-founder are you looking for? *'
                        : 'What kind of founder/startup are you looking to join? *'
                      }
                    </label>
                    <textarea
                      {...register('lookingFor')}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                      placeholder={
                        watchedType === 'Founder'
                          ? "I'm looking for a technical co-founder with full-stack experience to help build..."
                          : "I'm looking to join an early-stage startup as CTO where I can lead the technical vision..."
                      }
                    />
                    {errors.lookingFor && (
                      <p className="text-red-500 text-sm mt-1">{errors.lookingFor.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio / About Me (50-300 characters) *
                    </label>
                    <textarea
                      {...register('bio')}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                      placeholder="Tell us about your background, experience, and what drives you..."
                    />
                    {errors.bio && (
                      <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry / Sector *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {industries.map((industry) => (
                        <button
                          key={industry}
                          type="button"
                          onClick={() => toggleArrayValue(watchedIndustry, industry, 'industry')}
                          className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                            watchedIndustry.includes(industry)
                              ? 'bg-accent text-white border-accent'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {industry}
                        </button>
                      ))}
                    </div>
                    {errors.industry && (
                      <p className="text-red-500 text-sm mt-1">{errors.industry.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {watchedType === 'Founder' ? 'Skills You Have *' : 'Your Skills & Expertise *'}
                    </label>
                    <p className="text-sm text-gray-500 mb-3">
                      {watchedType === 'Founder' 
                        ? 'Select the skills and expertise you bring to your startup'
                        : 'Select your skills and expertise that you can contribute as a co-founder'
                      }
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {skills.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleArrayValue(watchedSkills, skill, 'skills')}
                          className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                            watchedSkills.includes(skill)
                              ? 'bg-accent text-white border-accent'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                    {errors.skills && (
                      <p className="text-red-500 text-sm mt-1">{errors.skills.message}</p>
                    )}
                  </div>

                  {/* Skills Needed - Only for Founders */}
                  {watchedType === 'Founder' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Skills You Need in a Co-founder
                      </label>
                      <p className="text-sm text-gray-500 mb-3">
                        Select the skills you're looking for in your ideal co-founder to complement your abilities
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {skills.map((skill) => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => toggleArrayValue(watchedSkillsNeeded || [], skill, 'skillsNeeded')}
                            className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                              (watchedSkillsNeeded || []).includes(skill)
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {skill}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        💡 Tip: Select skills that complement yours to find the perfect co-founder match
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 3: Final Details */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Final Details</h2>
                    <p className="text-gray-600">Almost done! Just a few more details</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Availability *
                      </label>
                      <select
                        {...register('availability')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                      >
                        <option value="">Select availability</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Weekends">Weekends</option>
                      </select>
                      {errors.availability && (
                        <p className="text-red-500 text-sm mt-1">{errors.availability.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {watchedType === 'Founder' ? 'Current Startup Stage *' : 'Preferred Startup Stage *'}
                      </label>
                      <select
                        {...register('startupStage')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                      >
                        <option value="">Select stage</option>
                        <option value="Idea">Idea</option>
                        <option value="MVP">MVP</option>
                        <option value="Growth">Growth</option>
                        <option value="Scaling">Scaling</option>
                      </select>
                      {errors.startupStage && (
                        <p className="text-red-500 text-sm mt-1">{errors.startupStage.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Founder-specific fields */}
                  {watchedType === 'Founder' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Startup Name
                        </label>
                        <input
                          {...register('startupName')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                          placeholder="My Awesome Startup"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Website
                        </label>
                        <input
                          {...register('website')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                          placeholder="https://myawesomestartup.com"
                        />
                        {errors.website && (
                          <p className="text-red-500 text-sm mt-1">{errors.website.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Brief Company Description
                        </label>
                        <textarea
                          {...register('companyDescription')}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                          placeholder="What does your startup do? What problem are you solving?"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Funding Stage
                          </label>
                          <select
                            {...register('fundingStage')}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                          >
                            <option value="">Select funding stage</option>
                            {fundingStages.map((stage) => (
                              <option key={stage} value={stage}>{stage}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Current Team Size
                          </label>
                          <select
                            {...register('teamSize')}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                          >
                            <option value="">Select team size</option>
                            {teamSizes.map((size) => (
                              <option key={size} value={size}>{size}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Co-founder-specific fields */}
                  {watchedType === 'Co-founder' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Years of Experience
                        </label>
                        <select
                          {...register('experience')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                        >
                          <option value="">Select experience level</option>
                          {experienceLevels.map((level) => (
                            <option key={level} value={level}>{level}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Previous Startup Experience
                        </label>
                        <textarea
                          {...register('previousStartups')}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                          placeholder="Tell us about any previous startups you've worked with or founded..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Commitment Level
                        </label>
                        <select
                          {...register('commitment')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                        >
                          <option value="">Select commitment level</option>
                          {commitmentLevels.map((level) => (
                            <option key={level} value={level}>{level}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                </motion.div>
              )}

              {/* Step 4: Review & Submit */}
              {currentStep === 4 && formData && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Profile</h2>
                    <p className="text-gray-600">Please review all information before submitting</p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-6 space-y-6 max-w-full overflow-hidden">
                    {/* Basic Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="min-w-0">
                          <span className="text-sm text-gray-500">Full Name</span>
                          <p className="font-medium break-words">{formData.fullName}</p>
                        </div>
                        <div className="min-w-0">
                          <span className="text-sm text-gray-500">Type</span>
                          <p className="font-medium break-words">{formData.type}</p>
                        </div>
                        <div className="min-w-0">
                          <span className="text-sm text-gray-500">Location</span>
                          <p className="font-medium break-words">{formData.location}</p>
                        </div>
                        <div className="min-w-0">
                          <span className="text-sm text-gray-500">Availability</span>
                          <p className="font-medium break-words">{formData.availability}</p>
                        </div>
                      </div>
                    </div>

                    {/* Profile Details */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Profile Details</h3>
                      <div className="space-y-3">
                        <div className="min-w-0">
                          <span className="text-sm text-gray-500">What I'm Looking For</span>
                          <p className="text-gray-700 break-words whitespace-pre-wrap">{formData.lookingFor}</p>
                        </div>
                        <div className="min-w-0">
                          <span className="text-sm text-gray-500">Bio</span>
                          <p className="text-gray-700 break-words whitespace-pre-wrap">{formData.bio}</p>
                        </div>
                      </div>
                    </div>

                    {/* Industries & Skills */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Industries & Skills</h3>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-gray-500">Industries</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {formData.industry.map((item, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">
                            {formData.type === 'Founder' ? 'Skills You Have' : 'Your Skills'}
                          </span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {formData.skills.map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-accent text-white text-xs rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {formData.type === 'Founder' && formData.skillsNeeded && formData.skillsNeeded.length > 0 && (
                          <div>
                            <span className="text-sm text-gray-500">Skills You Need</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {formData.skillsNeeded.map((skill, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Information</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-gray-500">Startup Stage</span>
                          <p className="font-medium">{formData.startupStage}</p>
                        </div>
                        {formData.startupName && (
                          <div>
                            <span className="text-sm text-gray-500">Startup Name</span>
                            <p className="font-medium">{formData.startupName}</p>
                          </div>
                        )}
                        {formData.website && (
                          <div>
                            <span className="text-sm text-gray-500">Website</span>
                            <p className="font-medium">{formData.website}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-blue-800 text-sm">
                      <strong>Note:</strong> Your profile will be reviewed by our admin team before going live. 
                      You'll receive an email notification once it's approved and published to the directory.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={prevStep}
                  className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft size={20} />
                  <span>Previous</span>
                </motion.button>
              )}

              <div className="ml-auto">
                {currentStep < 4 ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={nextStep}
                    className="flex items-center space-x-2 bg-accent text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors"
                  >
                    <span>{currentStep === 3 ? 'Review' : 'Next'}</span>
                    <ArrowRight size={20} />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isLoading}
                    className="bg-accent text-white px-8 py-3 rounded-xl hover:bg-orange-600 transition-colors font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Submit Profile for Review</span>
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}