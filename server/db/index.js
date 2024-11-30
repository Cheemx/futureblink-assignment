import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`, {
            dbName: "Blink",
            socketTimeoutMS: 45000,
            serverSelectionTimeoutMS: 5000,
            heartbeatFrequencyMS: 10000,
            maxPoolSize: 10
        })
        console.log("MongoDB connected Successfully.")        
    } catch (error) {
        console.error("MongoDB Connection Error:" + error.message)
        process.exit(1)
    }
}

export default connectDB