const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER || 'team@nexerawe.com',
    pass: process.env.SMTP_PASS,
  },
});

const sendApprovalEmail = async (studentEmail, studentName, journalTitle, publicationId, journalLink) => {
  const mailOptions = {
    from: `"NexeraWe Journals" <${process.env.SMTP_USER || 'team@nexerawe.com'}>`,
    to: studentEmail,
    subject: `Your Journal Has Been Accepted & Published – NexeraWe`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; color: #0F172A; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
          .header h1 { margin: 0; font-family: 'Playfair Display', serif; font-size: 28px; }
          .content { background: white; padding: 30px; border: 1px solid #E2E8F0; border-top: none; }
          .status-badge { display: inline-block; background: #10B981; color: white; padding: 8px 16px; border-radius: 20px; font-weight: 600; font-size: 14px; margin: 10px 0; }
          .journal-details { background: #F8FAFC; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #B45309; }
          .journal-details h3 { margin-top: 0; color: #0F172A; }
          .cta-button { display: inline-block; background: #2563EB; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { background: #F1F5F9; padding: 20px; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; color: #64748B; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 Journal Accepted!</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${studentName}</strong>,</p>
            <p>Congratulations! We are pleased to inform you that your journal submission has been <span class="status-badge">✓ APPROVED & PUBLISHED</span></p>
            
            <div class="journal-details">
              <h3>📄 Publication Details</h3>
              <p><strong>Journal Title:</strong> ${journalTitle}</p>
              <p><strong>Publication ID:</strong> ${publicationId}</p>
              <p><strong>Publication Date:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            <p>Your journal is now live and accessible to the academic community. You can view your publication and manage your profile through your porthole.</p>
            
            <center>
              <a href="${journalLink}" class="cta-button" style="color: white;">View Your Published Journal</a>
            </center>

            <p style="margin-top: 30px; color: #64748B; font-size: 14px;">Thank you for contributing to NexeraWe Journals. Your work helps advance academic research and knowledge sharing.</p>
          </div>
          <div class="footer">
            <p><strong>NexeraWe Journals</strong> | journals.nexerawe.com</p>
            <p>This is an automated notification. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Dear ${studentName},

Congratulations! Your journal has been approved and published.

Journal Title: ${journalTitle}
Publication ID: ${publicationId}
Publication Date: ${new Date().toLocaleDateString()}

View your published journal: ${journalLink}

Thank you for contributing to NexeraWe Journals.

NexeraWe Journals | journals.nexerawe.com
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Approval email sent to ${studentEmail}`);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return { success: false, message: error.message };
  }
};

module.exports = { sendApprovalEmail };