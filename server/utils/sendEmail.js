const nodemailer = require('nodemailer');

const sendAdminNotificationEmail = async ({ job, worker, client }) => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'qickfixer70@gmail.com';
        const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER || process.env.GMAIL_USER;
        const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.GMAIL_PASS || process.env.GMAIL_APP_PASSWORD;
        const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
        const smtpPort = parseInt(process.env.SMTP_PORT || '465');

        console.log(`[Email] Attempting to send to ${adminEmail}`);
        console.log(`[Email] SMTP_USER set: ${!!smtpUser}, SMTP_PASS set: ${!!smtpPass}`);
        console.log(`[Email] Job: "${job.title}", Applicant: ${worker.name} (${worker.phone})`);

        if (!smtpUser || !smtpPass) {
            console.warn(`[Email] MISSING CREDENTIALS — set SMTP_USER and SMTP_PASS on Render.`);
            return;
        }

        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465,
            family: 4, // Force IPv4 — Render free tier does not support IPv6
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM || `"KoraFix Platform" <${smtpUser}>`,
            to: adminEmail,
            subject: `🚨 [KoraFix Application Alert] ${job.title}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    <div style="background-color: #0f172a; color: #ffffff; padding: 24px; text-align: center;">
                        <h2 style="margin: 0; font-size: 20px;">New Job Application Received</h2>
                        <p style="margin: 6px 0 0 0; color: #94a3b8; font-size: 14px;">KoraFix Platform Alert</p>
                    </div>
                    
                    <div style="padding: 24px; color: #334155; font-size: 15px;">
                        <p style="margin-top: 0;">Hello Admin,</p>
                        <p style="line-height: 1.5;">An employee has applied for a job posted on <strong>KoraFix.net</strong>. Please review their information below to connect them with the employer.</p>

                        <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 16px; margin: 20px 0; border-radius: 6px;">
                            <h3 style="margin-top: 0; color: #1e40af; font-size: 15px; text-transform: uppercase;">📋 Job Information</h3>
                            <p style="margin: 6px 0;"><strong>Job Title:</strong> ${job.title}</p>
                            <p style="margin: 6px 0;"><strong>Budget:</strong> ${job.budget ? job.budget.toLocaleString() + ' RWF' : 'N/A'}</p>
                            <p style="margin: 6px 0;"><strong>Location:</strong> ${typeof job.location === 'object' ? (job.location.city || job.location.address || 'Rwanda') : (job.location || 'N/A')}</p>
                        </div>

                        <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 16px; margin: 20px 0; border-radius: 6px;">
                            <h3 style="margin-top: 0; color: #166534; font-size: 15px; text-transform: uppercase;">👤 Applicant (Employee)</h3>
                            <p style="margin: 6px 0;"><strong>Name:</strong> ${worker.name || 'Guest Applicant'}</p>
                            <p style="margin: 6px 0;"><strong>Phone:</strong> <a href="tel:${worker.phone}" style="color: #16a34a; font-weight: bold;">${worker.phone || 'N/A'}</a></p>
                            <p style="margin: 6px 0;"><strong>Email:</strong> ${worker.email || 'N/A'}</p>
                            <p style="margin: 6px 0;"><strong>Skills / Experience:</strong> ${worker.skills || 'N/A'}</p>
                        </div>

                        <div style="background-color: #faf5ff; border-left: 4px solid #9333ea; padding: 16px; margin: 20px 0; border-radius: 6px;">
                            <h3 style="margin-top: 0; color: #6b21a8; font-size: 15px; text-transform: uppercase;">🏢 Employer (Client)</h3>
                            <p style="margin: 6px 0;"><strong>Name:</strong> ${client?.name || 'Anonymous'}</p>
                            <p style="margin: 6px 0;"><strong>Phone:</strong> <a href="tel:${job.phone || client?.phone}" style="color: #9333ea; font-weight: bold;">${job.phone || client?.phone || 'N/A'}</a></p>
                            <p style="margin: 6px 0;"><strong>Email:</strong> ${client?.email || 'N/A'}</p>
                        </div>

                        <div style="text-align: center; margin-top: 28px;">
                            <a href="https://korafix.net/admin" style="background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; display: inline-block;">View on Admin Dashboard</a>
                        </div>
                    </div>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`[Email] Sent successfully to ${adminEmail} — MessageId: ${info.messageId}`);
    } catch (error) {
        console.error(`[Email] FAILED to send — ${error.message}`);
        console.error(`[Email] Full error:`, error);
    }
};

module.exports = { sendAdminNotificationEmail };
