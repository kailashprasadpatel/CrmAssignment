import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  status: {
    connected: Boolean,
    response: String,
    updatedAt: Date,
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Lead', leadSchema);