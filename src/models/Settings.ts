import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
  industries: string[];
  skills: string[];
  startupStages: string[];
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>({
  industries: [{
    type: String,
    trim: true,
  }],
  skills: [{
    type: String,
    trim: true,
  }],
  startupStages: [{
    type: String,
    trim: true,
  }],
}, {
  timestamps: true,
});

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);