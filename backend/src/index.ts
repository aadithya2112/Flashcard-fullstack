import connectToDB from "./db";
import express from "express";
import userRoutes from "./routes/user"
import deckRoutes from "./routes/decks"
import flashcardRoutes from "./routes/flashcards"

connectToDB()
const app = express()
app.use(express.json())

app.use("/api/v1/user", userRoutes)
app.use("/api/v1/decks", deckRoutes)
app.use("/api/v1/flashcards", flashcardRoutes)




app.listen(3000)