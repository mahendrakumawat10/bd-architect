import multer from "multer";
import path from "path";
import fs from "fs";

// ✅ Ensure uploads/ exists
const uploadsPath = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true }); // recursive = future-proof
}
// Define storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsPath); // ✅ absolute, safe
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // e.g., 12345678.png
  }
});
// File type filter (images only)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed (jpeg, jpg, png, webp)."));
  }
};
// Export upload middleware
const upload = multer({ storage, fileFilter });

export default upload;
