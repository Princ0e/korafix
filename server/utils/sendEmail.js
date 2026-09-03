const nodemailer = require('nodemailer');

const sendAdminNotificationEmail = async ({ job, worker, client }) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER || process.env.EMAIL_USER || '',
                pass: process.env.SMTP_PASS || process.env.EMAIL_PASS || '',
            },
        });

        const adminEmail = process.env.ADMIN_EMAIL || 'qickfixer70@gmail.com';

        const mailOptions = {
            from: process.env.EMAIL_FROM || '"KoraFix Platform" <noreply@korafix.net>',
            to: adminEmail,
            subject: `[KoraFix Alert] New Job Application: ${job.title}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #0f172a; color: #ffffff; padding: 20px; text-align: center;">
                        <h2 style="margin: 0;">New Job Application Received</h2>
                        <p style="margin: 5px 0 0 0; color: #94a3b8;">KoraFix Admin Notification</p>
                    </div>
                    
                    <div style="padding: 24px; color: #334155;">
                        <p style="font-size: 16px; margin-top: 0;">Hello Admin,</p>
                        <p style="font-size: 15px; line-height: 1.5;">An employee has applied for a job posted on KoraFix. Please review the details below and connect them.</p>

                        <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 16px; margin: 20px 0; border-radius: 4px;">
                            <h3 style="margin-top: 0; color: #1e3a8a; font-size: 16px;">📋 Job Information</h3>
                            <p style="margin: 4px 0;"><strong>Job Title:</strong> ${job.title}</p>
                            <p style="margin: 4px 0;"><strong>Budget:</strong> ${job.budget ? job.budget.toLocaleString() + ' RWF' : 'N/A'}</p>
                            <p style="margin: 4px 0;"><strong>Location:</strong> ${job.location || 'N/A'}</p>
                        </div>

                        <div style="background-color: #f8fafc; border-left: 4px solid #16a34a; padding: 16px; margin: 20px 0; border-radius: 4px;">
                            <h3 style="margin-top: 0; color: #14532d; font-size: 16px;">👤 Applicant (Employee) Details</h3>
                            <p style="margin: 4px 0;"><strong>Name:</strong> ${worker.name || 'N/A'}</p>
                            <p style="margin: 4px 0;"><strong>Email:</strong> ${worker.email || 'N/A'}</p>
                            <p style="margin: 4px 0;"><strong>Phone:</strong> ${worker.phone || (worker.socialLinks?.whatsapp ? 'WA: ' + worker.socialLinks.whatsapp : 'N/A')}</p>
                        </div>

                        <div style="background-color: #f8fafc; border-left: 4px solid #9333ea; padding: 16px; margin: 20px 0; border-radius: 4px;">
                            <h3 style="margin-top: 0; color: #581c87; font-size: 16px;">🏢 Employer (Client) Details</h3>
                            <p style="margin: 4px 0;"><strong>Name:</strong> ${client?.name || 'Anonymous'}</p>
                            <p style="margin: 4px 0;"><strong>Email:</strong> ${client?.email || 'N/A'}</p>
                            <p style="margin: 4px 0;"><strong>Phone:</strong> ${job.phone || client?.phone || 'N/A'}</p>
                        </div>

                        <p style="font-size: 14px; color: #64748b; margin-bottom: 0;">
                            Log in to the Admin Dashboard at <a href="https://korafix.net/admin" style="color: #2563eb;">korafix.net/admin</a> to manage job requests.
                        </p>
                    </div>
                </div>
            `,
        };

        if (!process.env.SMTP_USER && !process.env.EMAIL_USER) {
            console.log('--- [ADMIN EMAIL NOTIFICATION LOG] ---');
            console.log(`To: ${adminEmail}`);
            console.log(`Subject: ${mailOptions.subject}`);
            console.log(`Job: ${job.title} | Worker: ${worker.name} (${worker.email}, ${worker.phone}) | Client: ${client?.name} (${job.phone || client?.phone})`);
            console.log('Note: To send live emails over SMTP, configure SMTP_USER and SMTP_PASS in server environment variables.');
            return;
        }

        const info = await transporter.sendMail(mailOptions);
        console.log('Admin notification email sent successfully:', info.messageId);
    } catch (error) {
        console.error('Error sending admin notification email:', error.message);
    }
};

module.exports = { sendAdminNotificationEmail };
