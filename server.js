const express = require('express');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    gender: String,
    archetype: String,
    description: String,
    score: Number,
    date: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// API endpoint to handle submissions
app.post('/api/submit', async (req, res) => {
    const { name, email, gender, archetype, description, score } = req.body;

    try {
        // Save to MongoDB
        const user = new User({ name, email, gender, archetype, description, score });
        await user.save();

        // Send email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Archetype Result',
            html: `
                <h2>Hello, ${name}!</h2>
                <p>Your archetype is: <strong>${description}</strong></p>
                <p>Score: ${score}</p>
                <p>Thank you for taking the quiz!</p>
                <p>Visit our site again to explore more: <a href="https://your-netlify-site.netlify.app">Archetype Calculator</a></p>
            `
        };
        await transporter.sendMail(mailOptions);

        res.json({ message: 'Result saved and emailed successfully!' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));