import Service from '../models/serviceModel.js';
import path from 'path';
import fs from 'fs';

// 🔧 Helper: Delete image from filesystem
const deleteImageFile = async (filename) => {
  const filePath = path.join(process.cwd(), 'uploads', filename);
  try {
    await fs.promises.unlink(filePath);
    console.log('🗑️ Deleted image:', filename);
  } catch (err) {
    console.error(`⚠️ Failed to delete image: ${filename}`, err.message);
  }
};
const deleteImage = async (filename) => {
  const filePath = path.join(process.cwd(), 'uploads', filename);
  try {
    await fs.promises.unlink(filePath);
  } catch (err) {
    console.error("Image deletion error:", err.message);
  }
};

export const createService = async (req, res) => {
  try {
    console.log('▶️ req.body:', req.body);
    console.log('▶️ req.file:', req.file);

    const { title, icon, description, processSteps, isActive } = req.body;

    const image = req.file?.filename || null;
    const steps = typeof processSteps === 'string' ? JSON.parse(processSteps) : processSteps;
    console.log('Raw steps:', processSteps);

    if (!title || !icon || !description || !steps?.length) {
      if (image) await deleteImage(image);
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const service = new Service({
      title,
      icon,
      description,
      image,
      processSteps: steps,
      isActive: isActive === 'false' ? false : true
    });

    const saved = await service.save();
    res.status(201).json({ success: true, message: 'Service created', data: saved });
  } catch (err) {
    if (req.file?.filename) await deleteImage(req.file.filename);
    console.error('❌ Error in createService:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
export const toggleServiceActive = async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;

    const updated = await Service.findByIdAndUpdate(
      id,
      { isActive: active },
      { new: true }
    );

    if (!updated) return res.status(404).json({ success: false, message: 'Service not found' });

    res.status(200).json({ success: true, message: 'Service status updated', data: updated });
  } catch (err) {
    console.error('TOGGLE ACTIVE ERROR:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ✅ GET All Services
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json({ success: true, data: services });
  } catch (err) {
    console.error('UPDATE ERROR:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
// ✅ GET Single Service
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.status(200).json({ success: true, data: service });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
// ✅ UPDATE Service
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Service.findById(id);
    if (!existing) {
      if (req.file?.filename) await deleteImageFile(req.file.filename);
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const steps = req.body.processSteps
      ? typeof req.body.processSteps === 'string'
        ? JSON.parse(req.body.processSteps)
        : req.body.processSteps
      : existing.processSteps;

    const newImage = req.file?.filename;
    const payload = {
      title: req.body.title ?? existing.title,
      icon: req.body.icon ?? existing.icon,
      description: req.body.description ?? existing.description,
      processSteps: steps,
      isActive: req.body.isActive !== 'false',
      image: newImage || existing.image,
    };
    // 🔄 Delete previous image if replaced
    if (newImage && existing.image && newImage !== existing.image) {
      await deleteImageFile(existing.image);
    }

    const updated = await Service.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    if (req.file?.filename) await deleteImageFile(req.file.filename);
    console.error('UPDATE ERROR:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
// ✅ DELETE Service
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Service.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Service not found' });

    if (deleted.image) {
      await deleteImageFile(deleted.image);
    }

    res.status(200).json({ success: true, message: 'Service deleted successfully' });
  } catch (err) {
    console.error('DELETE ERROR:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
