const { Resend } = require('resend');

const sendAdminNotificationEmail = async ({ job, worker, client }) => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'qickfixer70@gmail.com';
        const resendApiKey = process.env.RESEND_API_KEY;

        console.log(`[Email] Attempting to send to ${adminEmail}`);
        console.log(`[Email] RESEND_API_KEY set: ${!!resendApiKey}`);
        console.log(`[Email] Job: "${job.title}", Applicant: ${worker.name} (${worker.phone})`);

        if (!resendApiKey) {
            console.warn(`[Email] MISSING RESEND_API_KEY — set it on Render environment variables.`);
            return;
        }

        const resend = new Resend(resendApiKey);

        const { data, error } = await resend.emails.send({
            from: 'KoraFix <noreply@korafix.net>',
            to: adminEmail,
            subject: `🚨 New Job Application — ${job.title}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    <div style="background-color: #0f172a; color: #ffffff; padding: 24px; text-align: center;">
                        <h2 style="margin: 0; font-size: 20px;">New Job Application Received</h2>
                        <p style="margin: 6px 0 0 0; color: #94a3b8; font-size: 14px;">KoraFix Platform Alert</p>
                    </div>

                    <div style="padding: 24px; color: #334155; font-size: 15px;">
                        <p style="margin-top: 0;">Hello Admin,</p>
                        <p style="line-height: 1.5;">An employee has applied for a job on <strong>KoraFix.net</strong>. Please review their information below and connect them with the employer.</p>

                        <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 16px; margin: 20px 0; border-radius: 6px;">
                            <h3 style="margin-top: 0; color: #1e40af; font-size: 15px; text-transform: uppercase;">📋 Job Information</h3>
                            <p style="margin: 6px 0;"><strong>Job Title:</strong> ${job.title}</p>
                            <p style="margin: 6px 0;"><strong>Budget:</strong> ${job.budget ? Number(job.budget).toLocaleString() + ' RWF' : 'N/A'}</p>
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
                            <a href="https://korafix.net/admin" style="background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; display: inline-block;">View on Admin Dashboard →</a>
                        </div>
                    </div>
                </div>
            `,
        });

        if (error) {
            console.error(`[Email] Resend API error:`, error);
        } else {
            console.log(`[Email] Sent successfully — ID: ${data.id}`);
        }
    } catch (error) {
        console.error(`[Email] FAILED to send — ${error.message}`);
    }
};

module.exports = { sendAdminNotificationEmail };
