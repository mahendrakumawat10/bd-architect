import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
    },
    area: {
        type: Number,
        required: true,
    },
    client: {
        type: String,
    },
    description: {
        type: String,
        required: true,
    },
    overview: {
        type: String,
        required: true,
    },
    longDescription: {
        type: String,
        required: true,
    },
    approach: {
        type: String,
    },
    features: {
        type: [String],
        default: [],
    },
    image: {
        type: String,
        required: true,
    },
    gallery: {
        type: [String],
        default: [],
    },
}, {
    timestamps: true,
});

const Project = mongoose.model('Project', projectSchema);
export default Project;


