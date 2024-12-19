import mongoose from "mongoose"

const FlashcardSchema = new mongoose.Schema({
    front: { type: String, required: true },
    back: { type: String, required: true },
    deck: { type: mongoose.Schema.Types.ObjectId, ref: 'Deck', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
})

export const FlashcardModel = mongoose.model('Flashcard', FlashcardSchema)