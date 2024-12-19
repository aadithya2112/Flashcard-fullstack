import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { UserModel } from "../models/User";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

// Extend the Request interface to include `user`
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                username: string;
            };
        }
    }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    const token = req.headers.authorization?.split(" ")[1]; // Ensure "Bearer <token>" format is handled
    if (!token) {
        res.status(401).json({ status: "error", message: "Token is not provided" });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload; 

        if (!decoded || typeof decoded !== "object" || !decoded.id) {
            res.status(401).json({ status: "error", message: "Invalid token" });
            return;
        }

        const user = await UserModel.findById(decoded.id);
        if (!user) {
            res.status(401).json({ status: "error", message: "Unauthorized" });
            return;
        }

        req.user = {
            id: user._id.toString(),
            email: user.email,
            username: user.username,
        };
        next();
        
    } catch (error) {
        res.status(401).json({ status: "error", message: "Unauthorized" });
    }
}