import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

import {
    homeHandler,
    loginUser,
    registerUser,
    logoutUser
} from "../controllers/userController.js"

import verifyJWT from "../middleware/auth.js"

import {
    saveFlow,
    scheduleEmail
} from "../controllers/emailFlowController.js"

const app = express()

app.use(cors({
    origin: "*",
    credentials: true,
    methods: ['GET', 'POST']
}))
app.use(express.json())
app.use(cookieParser())

// User routes
app.get("/api", homeHandler)
app.post("/api/register", registerUser)
app.post("/api/login", loginUser)
app.post("/api/logout", verifyJWT, logoutUser)

// Email routes
app.post("/api/save-flowchart", verifyJWT, saveFlow)
app.post("/api/schedule-email", verifyJWT, scheduleEmail)

export default app