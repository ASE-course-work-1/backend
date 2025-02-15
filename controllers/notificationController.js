import { sendEmail } from '../utils/emailSender.js';

export const sendEmailNotification = async (req, res) => {
  try {
    await sendEmail(
      req.body.to,
      req.body.subject,
      req.body.text,
      req.body.html
    );
    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 