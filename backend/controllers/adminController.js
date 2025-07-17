import Admin from '../models/adminModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const ensureAdminExists = async () => {
  const email = "sokalmahi1432@gmail.com";
  const plainPassword = "mahi1432";

  const existing = await Admin.findOne({ email });
  if (!existing) {
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const newAdmin = new Admin({  name: "Default Admin", email, password: hashedPassword });
    await newAdmin.save();
    // Default admin created
  } else {
    // Admin already exists
  }
};

export const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({ name, email, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ msg: "Admin created successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// Login Admin
export const loginAdmin = async (req, res) => {
  console.log("Signing token with secret:", process.env.JWT_SECRET);
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) return res.status(401).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) return res.status(401).json({ msg: 'Invalid credentials' });

   const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '365d' });

    res.status(200).json({
      status: true,
      msg: "Login successful",
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
};
