import mongoose, { Document, Schema } from 'mongoose';

export interface IProfile extends Document {
    fullName: string;
    email: string;
    location: string;
    linkedinUrl: string;
    profilePicture?: string;
    type: 'Founder' | 'Co-founder';
    lookingFor: string;
    bio: string;
    industry: string[];
    skills: string[]; // Skills they have
    skillsNeeded?: string[]; // Skills they need (only for Founders)
    availability: 'Full-time' | 'Part-time' | 'Advisory';
    startupStage: 'Idea' | 'MVP' | 'Growth' | 'Scaling';
    startupName?: string;
    website?: string;
    // Founder-specific fields
    companyDescription?: string;
    fundingStage?: string;
    teamSize?: string;
    // Co-founder-specific fields
    experience?: string;
    previousStartups?: string;
    commitment?: string;
    status: 'pending' | 'approved' | 'rejected';
    featured: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    linkedinUrl: {
        type: String,
        required: true,
        trim: true,
    },
    profilePicture: {
        type: String,
        trim: true,
    },
    type: {
        type: String,
        enum: ['Founder', 'Co-founder'],
        required: true,
    },
    lookingFor: {
        type: String,
        required: true,
        trim: true,
    },
    bio: {
        type: String,
        required: true,
        trim: true,
        maxlength: 300,
    },
    industry: [{
        type: String,
        trim: true,
    }],
    skills: [{
        type: String,
        trim: true,
    }],
    skillsNeeded: [{
        type: String,
        trim: true,
    }],
    availability: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Advisory'],
        required: true,
    },
    startupStage: {
        type: String,
        enum: ['Idea', 'MVP', 'Growth', 'Scaling'],
        required: true,
    },
    startupName: {
        type: String,
        trim: true,
    },
    website: {
        type: String,
        trim: true,
    },
    // Founder-specific fields
    companyDescription: {
        type: String,
        trim: true,
    },
    fundingStage: {
        type: String,
        trim: true,
    },
    teamSize: {
        type: String,
        trim: true,
    },
    // Co-founder-specific fields
    experience: {
        type: String,
        trim: true,
    },
    previousStartups: {
        type: String,
        trim: true,
    },
    commitment: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    featured: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

export default mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema);