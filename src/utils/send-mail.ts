import nodemailer from 'nodemailer'
import * as dotenv from "dotenv"
dotenv.config()
const { MAIL_TRANSPORT_HOST, MAIL_AUTH_USERNAME, MAIL_AUTH_PASSWORD } = process.env


const sendEmail = async (to: string, subject: string, content: string, attachments?: any) => {
  const transporter = nodemailer.createTransport({
    host: MAIL_TRANSPORT_HOST,
    port: 465,
    secure: true,
    auth: {
      user: MAIL_AUTH_USERNAME,
      pass: MAIL_AUTH_PASSWORD,
    },
  })

  transporter.verify((error, success) => {
    if (error) {
      console.log("error", error.toString())
      return false
    }
  })

  const mailOptions = {
    from: MAIL_AUTH_USERNAME,
    to: to,
    subject: subject,
    html: content,
    attachments: attachments
  }
  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent:', info.response)
    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}

export default sendEmail
