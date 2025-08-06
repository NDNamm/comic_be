import bcrypt from "bcryptjs";
import dayjs from "dayjs";
import {
    addUser,
    findUserByUserName,
    findUserByEmail
} from "../models/users.model.js";
import {
    generateAccessToken,
    generateRefreshToken
} from "../utils/token.js";
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';

dotenv.config();

export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await findUserByUserName(username);
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const accessToken = await generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.status(200).json({ message: "Login successfully", user, accessToken })
    }
    catch (err) {
        console.log("Loi: ", err)
        res.status(500).json({ error: err.message });
    }

}

export const register = async (req, res) => {
    const { username, email, password, confirm_pass } = req.body;
    try {
        const existingUser = await findUserByUserName(username);
        const existingEmail = await findUserByEmail(email);

        if (existingUser || existingEmail) {
            return res.status(400).json({ message: "User already exists" })
        }

        if (password !== confirm_pass) {
            return res.status(400).json({ message: "Password is not the same" })
        }

        const hashedPass = await bcrypt.hash(password, 15);
        const created_at = dayjs().format('YYYY-MM-DD HH:mm:ss');
        const newUser = await addUser(username, email, hashedPass, created_at);
        res.status(200).json({ message: "Register successfully", newUser })
    }
    catch (err) {
        console.log("Loi: " + err);
        res.status(500).json({ error: err.message });
    }
}

export const refresh = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    console.log("refresh: " + refreshToken);
    try {
        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token required" });
        }
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ error: err.message });
            }
            const newAccessToken = generateAccessToken(user);
            res.json({ accessToken: newAccessToken })
        })
    }
    catch (err) {
        return res.status(500).json({ error: err.message })
    }
};

export const logout = async(req,res) =>{
    res.clearCookie("refreshToken",{
        httpOnly: true,
        secure: true,        
        sameSite: "Strict", 
    });
    return res.status(200).json({ message: "Đăng xuất thành công" });
};