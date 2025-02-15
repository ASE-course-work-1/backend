import { sendEmail } from '../utils/emailSender.js';
import Notification from '../models/Notification.js';

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

export const getNotifications = async (req, res) => {
  try {
    // Implementation to fetch notifications
    const notifications = await Notification.find({ userId: req.user.id });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 