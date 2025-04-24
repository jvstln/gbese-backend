import "dotenv/config";
import nodemailer from "nodemailer";

// Create a transporter object
const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: 587,
  secure: false, // use SSL
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

// Send the email function
export const sendEmail = (mailOptions: {
  from?: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) => {
  return transporter.sendMail({ from: "Gbese Team", ...mailOptions });
};
