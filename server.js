const nodemailer = require('nodemailer');
const { addRSVPToSheet } = require('./rsvp_sheet'); // adjust path if needed

module.exports = function(app) {
  app.post('/rsvp', async (req, res) => {
    const { name, email, emailTwo, attendance } = req.body;

    if (email !== emailTwo) {
      return res.status(400).json({ message: 'Emails do not match.' });
    }


    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      }
    });

    let message;
    switch (attendance.toLowerCase()) {
      case 'yes':
        message = 'yay! can’t wait to see u on may 31 at 8pm!!\n\ndeets:\n3 gloucester st, party room on the 6th floor\nbuzz #5540, then tell concierge u are coming to amelia’s party\n\nalso it’s byob / byow';
        break;
      case 'maybe':
        message = 'hope you can make it! let me know when u decide.\n\ndeets, just in case:\n3 gloucester st, party room on the 3rd floor\nbuzz #5540, then tell concierge u are coming to amelia’s party\n\nalso it’s byob / byow';
        break;
      case 'no':
        message = 'i’ll miss u — thanks for letting me know.';
        break;
      default:
        message = 'Thanks for your response!';
    }

    try {
        await addRSVPToSheet({ name, email, emailTwo, attendance });
      await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: 'RSVP Confirmation',
        text: `hi ${name},\n\n${message}\n\n— amelia`,
      });

      res.status(200).json({ message: 'RSVP received and email sent!' });
    } catch (err) {
      console.error('Email error:', err);
      res.status(500).json({ message: 'RSVP saved but failed to send email.' });
    }
  });
};
