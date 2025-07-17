# Bhardwaj Architect - Backend

This is the backend API for the Bhardwaj Architect full stack application.


It provides:
- RESTful APIs for projects, services, categories, team, and admin auth
- Image upload support
- Admin authentication with JWT
- Nodemailer for email handling

---
## 🛠 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **Multer** (file/image uploads)
- **JWT** (JSON Web Token for auth)
- **Nodemailer** (email service)
- **Dotenv** (env config)

---

## 📁 Folder Structure
backend/
├── controllers/
├── middlewares/
│ ├── authMiddleware.js
│ └── uploadMiddleware.js
├── models/
├── routes/
├── uploads/
├── .env
├── .gitignore
└── server.js


## 🚀 Getting Started
```bash
cd backend
npm install
node server.js

🔐 Environment Variables (.env)
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

📤 Image Upload
All uploaded files are stored in /uploads/.
