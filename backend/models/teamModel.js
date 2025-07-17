import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    description: String,
    image: { type: String },
}, { timestamps: true });

export default mongoose.model("Team", teamSchema);
