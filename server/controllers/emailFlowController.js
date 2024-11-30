import { Flowchart } from "../models/Flowchart.js"
import Agenda from "agenda"
import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

const connectionString = process.env.MONGODB_URI;

if (!connectionString) {
    console.error("Error in getting MONGODB_URI")
}

const agenda = new Agenda({
    db: { 
        address: connectionString,
        options: {
            dbName: "Blink"
        }
    }
})

agenda.on('ready', () => {
    console.log("Agenda is ready!")
})

agenda.on('error', (error) => {
    console.error("Error in agenda configuration!", error)
})

agenda.define('send email', async (job) => {
    try {
        const { to, subject, body } = job.attrs.data
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            },
        })
    
        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to,
            subject,
            text: body
        })
    } catch (error) {
        console.error("Error while defining send email function: ", error.message)
    }
})

const saveFlow = async (req, res) => {
    try {
        const { name, nodes, edges} = req.body

        if (!name || !nodes || !edges) {
            return res.status(400).json({ message: "All fieldsare necessary!" })
        }

        const flowchart = new Flowchart({ name, nodes, edges})
        await flowchart.save()
        
        res.status(201).json({ message: "Flowchart saved!", flowchart})
    } catch (error) {
        return res.status(500).json({ message: "Error while saving the flowchart: "+error.message})
    }
}

const scheduleEmail = async (req, res) => {
    try {
        const  { to, subject, body } = req.body
        
        if(!to || !subject || !body) {
            return res.status(400).json({ message: "All fields are necessary!"})
        }

        await agenda.start()

        await agenda.schedule('in 1 hour', 'send email', { to, subject, body})        

        res.status(200).json({ message: "Email Scheduled"})
    } catch (error) {
        res.status(500).json({ message: "Error while scheduling Email: "+error.message})
    }
}

export {
    saveFlow,
    scheduleEmail,
    agenda
}