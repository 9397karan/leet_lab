import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";

export const authenticateUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "No token provided. Unauthorized"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await db.User.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                image: true,
                name: true,
                email: true,
                role: true
            }   
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        req.user = user;
        next();

    } catch (error) {
        console.error("Auth error:", error.message);
        return res.status(401).json({
            message: "Not authorized",
            error: error.message
        });
    }
};

export const checkAdmin=async(req,res,next)=>{
const userId=req.user.id
try{
    const user=await db.User.findUnique({
        where:{
            id:userId
        },
        select:{
            role:true
        }
    })
    if(!user || user.role !== "ADMIN"){
        res.status(400).json({
            message:"You're not authorised to perform this action.."
        })
    }
    next();
}catch(err){
res.status(400).json({
    message:"Contact admin"
})
}
}
