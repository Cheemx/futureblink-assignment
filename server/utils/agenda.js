import Agenda from "agenda"
import nodemailer from "nodemailer"

const agenda = new Agenda({
    db: { 
        address: `${process.env.MONGODB_URI}`,
    }
})

agenda.define('send email', async (job) => {
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
})

agenda.start()
