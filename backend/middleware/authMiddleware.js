import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            console.log("Verifying token with secret:", process.env.JWT_SECRET);
            console.log("Token from header:", req.headers.authorization);

            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (err) {
            console.error("JWT Error:", err.message);
            return res.status(401).json({ message: 'Invalid Token' });
        }
    } else {
        return res.status(403).json({ message: 'No Token Provided' });
    }
};
