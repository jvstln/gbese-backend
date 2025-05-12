import "dotenv/config";
import nodemailer from "nodemailer";

// Create a transporter object
const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  // port: 587,
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

export const sendEmail = async (mailOptions: {
  from?: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) => {
  try {
    return await transporter.sendMail({ from: "Gbese Team", ...mailOptions });
  } catch (error) {
    console.log("Error sending email:", error);
  }
};
