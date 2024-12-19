import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()
const MONGO_URI = process.env.MONGO_URI

function connectToDB() {
    if (!MONGO_URI) {
        throw new Error("MONGO_URI is not defined")
        return
    } else {
        mongoose.connect(MONGO_URI)
        const db = mongoose.connection
        db.on("error", console.error.bind(console, "connection error:"))
        db.once("open", () => {
            console.log("Connected to database")
        })
    }
}

export default connectToDB