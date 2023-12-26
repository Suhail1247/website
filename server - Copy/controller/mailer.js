import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import ENV from '../config.js';

let nodeConfig = {
  service: 'gmail',
  auth: {
    user: ENV.EMAIL,
    pass: ENV.PASSWORD,
  },
};

const transporter = nodemailer.createTransport(nodeConfig);

let mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Suhail",
    link: "https://mailgen.js/",
  },
});export const registerMail = async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    const { username, userEmail, text, subject } = req.body;
    console.log('Email Details:', { username, userEmail, text, subject });

    var email = {
      body: {
        name: username,
        intro: text || "Thank you for registering...",
        outro: "Happy to help you",
      },
    };

    var emailBody = mailGenerator.generate(email);

    let message = {
      from: ENV.EMAIL,
      to: userEmail,
      subject: subject || 'Registered successfully',
      html: emailBody,
    };

    await transporter.sendMail(message);
    
    console.log('Email sent successfully');
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (err) {
    console.error('Email Sending Error:', err);
    res.status(500).json({ success: false, error: 'Failed to send registration email' });
  }
};
