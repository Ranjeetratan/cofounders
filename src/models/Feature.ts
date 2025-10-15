import mongoose, { Document, Schema } from 'mongoose';

export interface IFeature extends Document {
  title: string;
  description: string;
  category: 'Core' | 'Premium' | 'Integration' | 'Analytics' | 'Community';
  priority: 'High' | 'Medium' | 'Low';
  status: 'Planned' | 'In Development' | 'Coming Soon' | 'Released';
  estimatedTime: string;
  votes: number;
  voters: string[]; // Array of IP addresses or user IDs
  icon: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const FeatureSchema = new Schema<IFeature>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ['Core', 'Premium', 'Integration', 'Analytics', 'Community'],
    required: true,
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium',
  },
  status: {
    type: String,
    enum: ['Planned', 'In Development', 'Coming Soon', 'Released'],
    default: 'Planned',
  },
  estimatedTime: {
    type: String,
    required: true,
  },
  votes: {
    type: Number,
    default: 0,
  },
  voters: [{
    type: String,
  }],
  icon: {
    type: String,
    required: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
}, {
  timestamps: true,
});

export default mongoose.models.Feature || mongoose.model<IFeature>('Feature', FeatureSchema);