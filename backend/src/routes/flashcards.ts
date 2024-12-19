import express from "express"
import { FlashcardModel } from "../models/Flashcard"
import { authMiddleware } from "../Middlewares/authMiddleware"

const router = express.Router()

// const FlashcardSchema = new mongoose.Schema({
//     front: { type: String, required: true },
//     back: { type: String, required: true },
//     deck: { type: mongoose.Schema.Types.ObjectId, ref: 'Deck', required: true },
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     createdAt: { type: Date, default: Date.now },
//     lastUpdated: { type: Date, default: Date.now },
// })

// Create a Flashcard
router.post("/", authMiddleware, async (req, res) => {
    const { front, back, deckId } = req.body
    const createdBy = req.user?.id
    try {
        const flashcard = await FlashcardModel.create({
            front,
            back,
            deck: deckId,
            createdBy
        })
        res.status(201).json({status: "success", flashcard})
    } catch (error) {
        res.status(500).json({status: "error", message: "Unable to create flashcard"})
    }
})

// Get Flashcards for a Deck
router.get("/deck/:deckId", authMiddleware, async (req, res) => {
    try {
        const flashcards = await FlashcardModel.find({ deck: req.params.deckId })
        res.status(200).json({status: "success", flashcards})
    } catch (error) {
        res.status(500).json({status: "error", message: "Unable to get flashcards"})
    }
})

// Update a Flashcard by ID
router.put("/:id", authMiddleware, async (req, res) => {
    const { front, back } = req.body
    try {
        const flashcard = await FlashcardModel.findByIdAndUpdate(
            req.params.id,
            { front, back },
            { new: true }
        )
        res.status(200).json({status: "success", flashcard})
    } catch (error) {
        res.status(500).json({status: "error", message: "Unable to update flashcard"})
    }
})

// Delete a Flashcard by ID
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        await FlashcardModel.findByIdAndDelete(req.params.id)
        res.status(200).json({status: "success", message: "Flashcard deleted"})
    } catch (error) {
        res.status(500).json({status: "error", message: "Unable to delete flashcard"})
    }
})

export default router