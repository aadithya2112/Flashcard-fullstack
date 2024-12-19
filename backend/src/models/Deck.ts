import mongoose from "mongoose"

const DeckSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    cards: { type: Array, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
})

export const DeckModel = mongoose.model('Deck', DeckSchema)