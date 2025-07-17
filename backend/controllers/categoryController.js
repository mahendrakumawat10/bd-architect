import Category from '../models/categoryModel.js';
import mongoose from 'mongoose';

// Create Category
export const createCategory = async (req, res) => {
    try {
        console.log("req.body:", req.body);
        console.log("req.files:", req.files);
        let { name, type } = req.body;

        if (!name || !type) {
            return res.status(400).json({
                success: false,
                message: 'Name and type are required',
            });
        }

        type = type.toLowerCase();

        const existing = await Category.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') },
            type,
        });

        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'Category with this name and type already exists',
            });
        }

        const category = new Category({ name, type });
        await category.save();

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category,
        });
    } catch (err) {
        console.error('Create category error:', err.message);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

export const getCategories = async (req, res) => {
    try {
        const { type } = req.query;

        if (type && !['project'].includes(type.toLowerCase())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category type',
            });
        }

        const filter = type ? { type: type.toLowerCase() } : {};
        const categories = await Category.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: categories,
        });
    } catch (err) {
        console.error('Fetch categories error:', err.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

// Get category by ID
export const getCategoryById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid Category ID',
        });
    }

    try {
        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        res.status(200).json({
            success: true,
            data: category,
        });
    } catch (err) {
        console.error('Fetch category by ID error:', err.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

// Update Category by ID
export const updateCategory = async (req, res) => {
    try {
        let { name, type } = req.body;
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Category ID',
            });
        }

        if (!name || !type) {
            return res.status(400).json({
                success: false,
                message: 'Name and type are required',
            });
        }

        type = type.toLowerCase();

        const existing = await Category.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') },
            type,
            _id: { $ne: id },
        });

        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'Category with this name and type already exists',
            });
        }

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        category.name = name;
        category.type = type;

        await category.save();

        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            data: category,
        });
    } catch (err) {
        console.error('Update category error:', err.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Category ID',
            });
        }

        const deleted = await Category.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully',
        });
    } catch (err) {
        console.error('Delete category error:', err.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};
