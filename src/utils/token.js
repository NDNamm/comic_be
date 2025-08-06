import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

export const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            username: user.username,
            email: user.email,
            role_id: user.role_id
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    );
};

export const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );
};

// export const verifyRefreshToken = (token) => {
//     return new Promise((resolve, reject) => {
//         jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
//             if (err) reject(err);
//             else resolve(user);
//         });
//     });
// };
