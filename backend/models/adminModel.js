import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true },
    password: { type: String, required: true },
});
const adminModel = mongoose.model('Admin', adminSchema);
export default adminModel;
