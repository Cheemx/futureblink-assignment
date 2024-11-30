import jwt from "jsonwebtoken"
import { User } from "../models/User.js"

const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken

        if (!token) {
            return res.status(404).json({ message: "Invalid access!"})
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            return res.status(404).json({ message: "User not found!"})
        }

        req.user = user
        next()
    } catch (error) {
        res.status(500).json({ message: "Error in the auth middleware: "+error.message})
    }
}

export default verifyJWT