import dotenv from "dotenv"
import app from "./routes/routes.js"
import connectDB from "./db/index.js"

dotenv.config();

(async () => {
    try {
        await connectDB();
        
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on ${process.env.PORT}`)
        })
    } catch (error) {
        console.error("Error in Agenda OR MongoDB Connection: "+error.message)
    }
})();