const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

// Allow your GitHub Pages domain
app.use(cors({
  origin: [
    "https://sundancenetworks570.github.io",
    "https://sundancenetworks570.github.io/TechHub"
  ]
}));

app.use(express.json());

// Setup Nodemailer using Render Environment Variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Helper to format email
function formatPhoneSlip(data) {
  return `
Date: ${data.date}
Time: ${data.time}
First Name: ${data.firstName}
Last Name: ${data.lastName}
Business: ${data.business}
Phone: ${data.phone}
Extension: ${data.extension}
Email: ${data.email}
Urgency: ${data.urgency}

Description:
${data.description}

Tech: ${data.tech}

Source: ${data.source}
Origin: ${data.origin}
`;
}

// API endpoint for Phone Slip
app.post("/phone-slip", async (req, res) => {
  try {
    const body = req.body;

    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: "support@sundancenetworks.com",
      subject: "New Phone Slip",
      text: formatPhoneSlip(body)
    });

    res.json({ ok: true });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).send("Failed to send email");
  }
});

app.get("/", (req, res) => res.send("Phone Slip Mailer API is running."));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
