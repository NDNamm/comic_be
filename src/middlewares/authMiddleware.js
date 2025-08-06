import jwt from "jsonwebtoken";

export const authentication = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.ACCESS_TOKEN_SECRET) {
        return res.status(500).json({ message: "Server configuration error" })
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Access token expired" })
        }
        req.user = user
        next();
    })
};

export const authorization = (req, res, next) => {
    if (!req.user || req.user.role_id !== 2) {
        return res.status(403).json({ message: "Forbidden" })
    }
    next();
}