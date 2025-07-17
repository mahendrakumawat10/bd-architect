// controllers/contactController.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendContactEmail = async (req, res) => {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message || !phone || !subject)
        return res.status(400).json({ success: false, message: 'All fields are required' });

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"${name}" <${process.env.GMAIL_USER}>`,
            to: process.env.GMAIL_USER,
            replyTo: email,
            subject: `New Contact Inquiry from ${name}`,
            html: `
        <h3>New Inquiry</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
        });

        res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Email sending failed:', error);
        res.status(500).json({ success: false, message: 'Failed to send email' });
    }
};

// ✅ Add this
export const sendEnquiryEmail = async (req, res) => {
    const { name, email, phone, subject, location, message } = req.body;

    if (!name || !email || !message || !phone || !subject)
        return res.status(400).json({ success: false, message: 'All required fields must be filled' });

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"${name}" <${process.env.GMAIL_USER}>`,
            to: process.env.GMAIL_USER,
            replyTo: email,
            subject: `New Enquiry from ${name} at ${new Date().toLocaleString()}`,
            html: `
        <h3>New Enquiry</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Service:</strong> ${subject}</p>
        <p><strong>Location:</strong> ${location || 'Not Provided'}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
            headers: {
                'X-Entity-Ref-ID': Date.now().toString(),
            }
        });

        res.status(200).json({ success: true, message: 'Enquiry sent successfully' });
    } catch (error) {
        console.error('Enquiry email sending failed:', error);
        res.status(500).json({ success: false, message: 'Failed to send enquiry' });
    }
};
