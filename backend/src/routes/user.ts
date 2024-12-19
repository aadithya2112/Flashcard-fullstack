import express from "express";
import dotenv from "dotenv"
import { z } from "zod"
import { UserModel } from "../models/User";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { authMiddleware } from "../Middlewares/authMiddleware";

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET as string

const UserSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string()
})

const router = express.Router()

router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body
    const user = UserSchema.safeParse({ username, email, password })
    if (!user.success) {
        res.status(400).json({ status: "error", message: "Invalid request data" })
    } else {
        try {
            const hashedPassword = await bcrypt.hash(password, 10)
            await UserModel.create({
                username,
                email,
                password: hashedPassword
            })
            res.status(201).json({ status: "success", message: "User created successfully" })
        } catch (error: any) {
            res.status(500).json({ status: "error", message: "Username or email already exists" })
        }
    }
})

router.post("/login", async (req, res) => {
    const { username, password } = req.body
    const user = await UserModel.findOne({ username })
    if (!user) {
        res.status(401).json({ status: "error", message: "Invalid username or password" })
    } else {
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            res.status(401).json({ status: "error", message: "Invalid username or password" })
        } else {
            const token = jwt.sign({ id: user._id }, JWT_SECRET)
            res.status(200).json({ status: "success", token })
        }
    }
})

router.get("/profile", authMiddleware, async (req, res) => {
    res.status(200).json({ status: "success", user: req.user })
})


export default router