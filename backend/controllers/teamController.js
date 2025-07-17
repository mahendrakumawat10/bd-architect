import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import Team from "../models/teamModel.js";

export const getTeam = async (req, res) => {
    try {
        const id = req.params?.id;

       if (id && id !== 'undefined' && id !== 'null') {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ success: false, message: "Invalid team member ID" });
            }

            const team = await Team.findById(id);
            if (!team) {
                return res.status(404).json({ success: false, message: "Team member not found" });
            }
            return res.status(200).json({
                success: true,
                message: "Team member fetched successfully",
                data: team,
            });
        } else {
            const teams = await Team.find().sort({ createdAt: -1 });
            return res.status(200).json({
                success: true,
                message: "Team members fetched successfully",
                data: teams,
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error fetching team member(s)",
            error: err.message,
        });
    }
};

export const createTeam = async (req, res) => {
    try {
        const { name, role, description } = req.body;
        const image = req.file?.filename;

        if (!name || !role || !image) {
            return res.status(400).json({
                success: false,
                message: "Name, role, and image are required",
            });
        }

        const newTeam = await Team.create({
            name,
            role,
            description,
             image,
        });

        res.status(201).json({
            success: true,
            message: "Team member created successfully",
            data: newTeam,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error creating team member",
            error: err.message,
        });
    }
};

export const updateTeam = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid team member ID" });
        }

        const team = await Team.findById(id);
        if (!team) {
            return res.status(404).json({ success: false, message: "Team member not found" });
        }

        const { name, role, description, deleteOldImage } = req.body;

        if (deleteOldImage === 'true' || req.file) {
            if (team.image) {
                const imagePath = path.join('uploads', team.image);
                fs.unlink(imagePath, err => {
                    if (err) console.error("Error deleting old image:", err.message);
                });
            }
        }

        team.name = name;
        team.role = role;
        team.description = description;

        if (req.file) {
            team.image = req.file.filename;
        } else if (deleteOldImage === 'true') {
            team.image = null;
        }

        await team.save();

        return res.status(200).json({ success: true, data: team });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Error updating team member",
            error: err.message,
        });
    }
};


export const deleteTeam = async (req, res) => {
    try {
        const { id } = req.params;

        const team = await Team.findByIdAndDelete(id);
        if (!team) {
            return res.status(404).json({ success: false, message: "Team member not found" });
        }

        if (team.image) {
            const imagePath = path.join("uploads", team.image);
            fs.unlink(imagePath, err => {
                if (err) console.error("Error deleting image file:", err.message);
            });
        }

        res.status(200).json({
            success: true,
            message: "Team member deleted successfully",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error deleting team member",
            error: err.message,
        });
    }
};


