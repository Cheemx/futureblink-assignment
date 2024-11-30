import jwt from "jsonwebtoken"
import {User} from "../models/User.js"

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave : false })
        return {accessToken, refreshToken}
    } catch (error) {
        console.error("Something wrong generating tokens: "+error.message)
    }
}

const homeHandler = (req, res) => {
    res.status(200).json("Welcome to futureblink assignment")
}

const registerUser = async (req, res) => {
    try {
        // get User details from request body
        const { name, email, password } = req.body

        // check if all fields are filled
        if(
            [name, email, password].some((field) => field?.trim() === "")
        ){
            return res.status(401).json({ message: "All fields are necessary." })
        }

        // check if the user already exists
        const existingUser = await User.findOne({email})

        if (existingUser) {
            return res.status(401).json({ message: "The User already exists." })
        }

        // Put the user into DB if not already
        const user = await User.create({
            name, email, password
        })

        const createduser = await User.findById(user._id)

        // check if the user is created
        if (!createduser) {
            return res.status(400).json({ message: "Error while registering the User."})
        }

        // return the user
        return res.status(200).json({
            message: "User created Successfully."
        })
    } catch (error) {
        res.status(500).json({ 
            message: "Error while Registering User: "+error.message,
            data: createduser
            
        })
    }
}

const loginUser = async (req, res) => {
    try {
        // catch the email and password from request body
        const {email, password} = req.body

        // check if all fields are filled
        if (!email || !password) {
            return res.status(401).json({
                message: "All fields are necessary!"
            })
        }

        // check if the user already exists in the db
        const existingUser = await User.findOne({email})

        if(!existingUser) {
            return res.status(401).json({
                message: "User doesn't exist in the DB!"
            })
        }

        // check for hashed pass with one grabbed from req body
        const isPassValid = await existingUser.isPassCorrect(password)

        if(!isPassValid) {
            return res.status(401).json({
                message: "Invalid User credentials"
            })
        }

        // provide user a new refresh token after periodic interval
        const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(existingUser._id)

        // set cookies in the user's db
        const loggedInUser = await User.findById(existingUser._id).select("-password -refreshToken")

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        }

        // return the successful response
        res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            message: "User Logged in Successfully",
            data: loggedInUser
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while Logging in User: "+err.message
        })
    }
}

const logoutUser = async (req, res) => {
    try {
        await User.findByIdAndUpdate(
            req.user._id, 
            {
                $unset: {
                    refreshToken: 1
                }
            },
            {
                new: true
            }
        )

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        }

        res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({message: "User logged out successfully"})

    } catch (err) {
        res.status(500).json("Error while logging out User: "+err.message)
    }
}

export {
    homeHandler,
    registerUser,
    loginUser,
    logoutUser
}