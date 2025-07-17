import mongoose from 'mongoose';
import slugify from 'slugify';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    type: {
  type: String,
  enum: ['project'],
  required: true,
},
  },
  { timestamps: true }
);

categorySchema.index({ name: 1, type: 1 }, { unique: true });

// Auto-generate slug with type
categorySchema.pre('validate', function (next) {
  if (!this.slug && this.name && this.type) {
    this.slug = slugify(`${this.name}-${this.type}`, { lower: true });
  }
  next();
});

export default mongoose.model('Category', categorySchema);
