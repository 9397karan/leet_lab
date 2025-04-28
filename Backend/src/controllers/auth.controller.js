import { db } from "../libs/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const existingUser = await db.User.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({ message: "User exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await db.User.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role
            }
        });

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            secure: true
        });

        res.status(200).json({
            message: "User registered",
            data: user
        });

    } catch (err) {
        res.status(400).json({ message: "Error in registration", error: err.message });
    }
};

// Login function
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await db.User.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 7,
            secure: true
        });

        res.status(200).json({
            message: "Login successful",
            data: user
        });

    } catch (err) {
        res.status(500).json({ message: "Error during login", error: err.message });
    }
};

// Logout function
export const logout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
};


export const check = async (req, res) => {
    try{
        res.status(200).json({
            message:"User autjhorized"
        })
    }catch(err){
        res.status(404).json({
            message:"Check User not authorised"
        })
    }
};
