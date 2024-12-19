import express from "express"
import { authMiddleware } from "../Middlewares/authMiddleware"
import { DeckModel } from "../models/Deck"

const router = express.Router()

// const DeckSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     description: { type: String, required: true },
//     cards: { type: Array },
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     createdAt: { type: Date, default: Date.now },
//     lastUpdated: { type: Date, default: Date.now },
// })
// Create a Deck
router.post("/", authMiddleware, async (req, res) => {
    const {name, description} = req.body
    const createdBy = req.user?.id
    try {
        const deck = await DeckModel.create({
            name,
            description,
            createdBy,
            cards: []
        })
        res.status(201).json({status: "success", deck})
    } catch (error) {
        res.status(500).json({status: "error", message: "Unable to create deck"})
    }
})


// Get all Decks
router.get("/", authMiddleware, async (req, res) => {
    const decks = await DeckModel.find({ createdBy: req.user?.id })
    res.status(200).json({status: "success", decks})
})


// Get a Deck by ID
router.get("/:id", async (req, res) => {
    try {
        const deck = await DeckModel.findById(req.params.id).populate("cards")
        if (!deck) {
            res.status(404).json({ status: "error", message: "Deck not found" })
        } else {
            res.status(200).json({ status: "success", deck })
        }
    } catch (error) {
        res.status(500).json({ status: "error", message: "Unable to get deck" })
    }
})

// Update a Deck by ID
router.put("/:id", async (req, res) => {
    const { name, description } = req.body
    try {
        const deck = await DeckModel.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true }
        )
        if (!deck) {
            res.status(404).json({ status: "error", message: "Deck not found" })
        } else {
            res.status(200).json({ status: "success", deck })
        }
    } catch (error) {
        res.status(500).json({ status: "error", message: "Unable to update deck" })
    }
})

// Delete a Deck by ID
router.delete("/:id", async (req, res) => {
    try {
        await DeckModel.findByIdAndDelete(req.params.id)
        res.status(204).json({ status: "success", message: "Deck deleted successfully" })
    } catch (error) {
        res.status(500).json({ status: "error", message: "Unable to delete deck" })
    }
})


export default router