import Project from "../models/projectModel.js";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import slugify from 'slugify';

const parseFeatures = (features) => {
    if (!features) return [];
    if (typeof features === "string") {
        try {
            const parsed = JSON.parse(features);
            return Array.isArray(parsed) ? parsed : [parsed];
        } catch {
            return [features];
        }
    }
    return Array.isArray(features) ? features : [features];
};

const deleteImageFile = async (filename) => {
    const filePath = path.join(process.cwd(), 'uploads', filename);
    try {
        await fs.promises.unlink(filePath);
        console.log(`Deleted image: ${filename}`);
    } catch (err) {
        console.error(`Failed to delete ${filename}:`, err.message);
    }
};

export const cleanupUploadedImages = (files) => {
    const deleteFile = async (filename) => {
        const filePath = path.join(process.cwd(), 'uploads', filename);
        try {
            await fs.promises.unlink(filePath);
            console.log("Deleted image:", filename);
        } catch (err) {
            console.error("Failed to delete image:", filename, err.message);
        }
    };

    if (files?.main?.[0]?.filename) {
        deleteFile(files.main[0].filename);
    }

    if (Array.isArray(files?.gallery)) {
        files.gallery.forEach(file => deleteFile(file.filename));
    }
};

export const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate('category');
        if (!projects.length) {
            return res.status(404).json({ success: false, message: 'No projects found' });
        }

        res.status(200).json({ success: true, data: projects });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching projects', error: err.message });
    }
};

export const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid project ID' });
        }

        const project = await Project.findById(id).populate('category');
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        res.status(200).json({ success: true, data: project });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching project by ID', error: err.message });
    }
};

export const getProjectBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const project = await Project.findOne({ slug }).populate('category');
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        res.status(200).json({ success: true, data: project });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching project by slug', error: err.message });
    }
};

export const createProject = async (req, res) => {
    try {
        const {
            title, category, location, year, area, client,
            description, overview, longDescription, approach, features
        } = req.body;

        const slug = slugify(title, { lower: true, strict: true });
        const image = req.body.image || req.files?.main?.[0]?.filename;
        const gallery = req.files?.gallery?.map(file => file.filename) || [];

        const requiredFields = { title, category, location, year, area, client, description, overview, longDescription, approach, image };
        const missingFields = Object.entries(requiredFields).filter(([_, value]) => !value);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.map(([key]) => key).join(', ')}`
            });
        }

        const parsedFeatures = parseFeatures(features);

        const project = new Project({
            title, slug, category, location, year,
            area, client, description, overview, longDescription, approach,
            image, gallery, features: parsedFeatures
        });

        const saved = await project.save();
        res.status(201).json({ success: true, message: "Project created", data: saved });
    } catch (err) {
        console.error("CREATE ERROR:", err);
        cleanupUploadedImages(req.files);
        res.status(500).json({ success: false, message: "Error creating project", error: err.message });
    }
};

export const updateProject = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            if (req.files) cleanupUploadedImages(req.files);
            return res.status(400).json({ success: false, message: "Invalid ID" });
        }

        const existing = await Project.findById(id);
        if (!existing) {
            if (req.files) cleanupUploadedImages(req.files);
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        let deletedGallery = [];
        try {
            if (req.body.deletedGallery) {
                deletedGallery = JSON.parse(req.body.deletedGallery);
            }
        } catch (parseErr) {
            if (req.files) cleanupUploadedImages(req.files);
            return res.status(400).json({ success: false, message: "Invalid JSON in deletedGallery" });
        }

        await Promise.all(deletedGallery.map(deleteImageFile));

        const newGallery = req.files?.gallery?.map(file => file.filename) || [];
        const updatedGallery = existing.gallery
            .filter(img => !deletedGallery.includes(img))
            .concat(newGallery);

        let updatedFeatures = existing.features;
        try {
            if (req.body.features) {
                updatedFeatures = parseFeatures(req.body.features);
            }
        } catch {
            if (req.files) cleanupUploadedImages(req.files);
            return res.status(400).json({ success: false, message: "Invalid JSON in features" });
        }

        const payload = {
            title: req.body.title ?? existing.title,
            category: req.body.category ?? existing.category,
            location: req.body.location ?? existing.location,
            year: req.body.year ?? existing.year,
            area: req.body.area ?? existing.area,
            client: req.body.client ?? existing.client,
            description: req.body.description ?? existing.description,
            overview: req.body.overview ?? existing.overview,
            longDescription: req.body.longDescription ?? existing.longDescription,
            approach: req.body.approach ?? existing.approach,
            features: updatedFeatures,
            image: req.body.image || req.files?.main?.[0]?.filename || existing.image,
            gallery: updatedGallery,
        };

        if (req.body.title && req.body.title !== existing.title) {
            payload.slug = slugify(req.body.title, { lower: true, strict: true });
        }

        const updated = await Project.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({ success: true, message: "Project updated", data: updated });

    } catch (err) {
        if (req.files) cleanupUploadedImages(req.files);
        console.error("UPDATE ERROR:", err);
        res.status(500).json({ success: false, message: "Update error", error: err.message });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        const project = await Project.findByIdAndDelete(id);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        if (project.image) {
            await deleteImageFile(project.image);
        }

        if (Array.isArray(project.gallery)) {
            await Promise.all(project.gallery.map(deleteImageFile));
        }

        res.status(200).json({ success: true, message: "Project deleted" });

    } catch (err) {
        console.error("DELETE ERROR:", err);
        res.status(500).json({ success: false, message: "Delete error", error: err.message });
    }
};
