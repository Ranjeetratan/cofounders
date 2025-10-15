import mongoose from 'mongoose';
// Dummy data inline since import is causing issues
const dummyProfiles = [
  {
    fullName: "Sarah Chen",
    email: "sarah.chen@email.com",
    location: "San Francisco, CA / PST",
    linkedinUrl: "https://linkedin.com/in/sarahchen",
    profilePicture: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    type: "Founder",
    lookingFor: "Seeking a technical co-founder with full-stack experience to help scale our AI-powered healthcare platform.",
    bio: "Former Google PM with 8 years in healthcare tech. Built and sold a telemedicine startup. Passionate about democratizing healthcare access through AI.",
    industry: ["Healthcare", "AI/ML", "Technology"],
    skills: ["Product Management", "Business Development", "AI/ML"],
    availability: "Full-time",
    startupStage: "MVP",
    startupName: "HealthAI",
    website: "https://healthai.com",
    status: "approved",
    featured: true
  },
  {
    fullName: "Marcus Rodriguez",
    email: "marcus.r@email.com",
    location: "Austin, TX / CST",
    linkedinUrl: "https://linkedin.com/in/marcusrodriguez",
    profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    type: "Co-founder",
    lookingFor: "Looking for a business-minded co-founder to help commercialize our fintech solution for small businesses.",
    bio: "Senior Software Engineer at Stripe. 10+ years building scalable payment systems. Ready to launch my own fintech startup focused on SMB lending.",
    industry: ["Finance", "Technology"],
    skills: ["Engineering", "DevOps", "Finance"],
    availability: "Full-time",
    startupStage: "Idea",
    status: "approved",
    featured: true
  },
  {
    fullName: "Emily Watson",
    email: "emily.watson@email.com",
    location: "London, UK / GMT",
    linkedinUrl: "https://linkedin.com/in/emilywatson",
    profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    type: "Founder",
    lookingFor: "Seeking a technical co-founder to build the next generation of sustainable fashion e-commerce platform.",
    bio: "Former Head of Sustainability at H&M. MBA from INSEAD. Building a circular fashion marketplace that connects conscious consumers with sustainable brands.",
    industry: ["E-commerce", "Fashion", "Sustainability"],
    skills: ["Marketing", "Business Development", "Operations"],
    availability: "Full-time",
    startupStage: "Growth",
    startupName: "CircularStyle",
    website: "https://circularstyle.com",
    status: "approved",
    featured: true
  }
];

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cofounderbase';

// Profile Schema (copied from the model)
const ProfileSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  location: { type: String, required: true, trim: true },
  linkedinUrl: { type: String, required: true, trim: true },
  profilePicture: { type: String, trim: true },
  type: { type: String, enum: ['Founder', 'Co-founder'], required: true },
  lookingFor: { type: String, required: true, trim: true },
  bio: { type: String, required: true, trim: true, maxlength: 300 },
  industry: [{ type: String, trim: true }],
  skills: [{ type: String, trim: true }],
  availability: { type: String, enum: ['Full-time', 'Part-time', 'Advisory'], required: true },
  startupStage: { type: String, enum: ['Idea', 'MVP', 'Growth', 'Scaling'], required: true },
  startupName: { type: String, trim: true },
  website: { type: String, trim: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

const Profile = mongoose.model('Profile', ProfileSchema);

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Profile.deleteMany({});
    console.log('Cleared existing profiles');

    // Insert dummy data
    await Profile.insertMany(dummyProfiles);
    console.log(`Inserted ${dummyProfiles.length} dummy profiles`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();