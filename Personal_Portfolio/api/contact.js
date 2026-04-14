/* ============================================================
   VERCEL SERVERLESS FUNCTION — CONTACT FORM API
   POST /api/contact
   Sends email via Nodemailer (Gmail SMTP)
   ============================================================ */

const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    /* ── CORS Headers ── */
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed.' });
    }

    /* ── Extract & Validate ── */
    const { name, email, phone, subject, message } = req.body || {};

    if (!name || !name.trim()) {
        return res.status(400).json({ success: false, message: 'Name is required.' });
    }
    if (!message || !message.trim()) {
        return res.status(400).json({ success: false, message: 'Message is required.' });
    }
    if (!email && !phone) {
        return res.status(400).json({ success: false, message: 'Please provide an email or phone number.' });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }
    if (phone && !/^\+?[\d\s\-()]{7,15}$/.test(phone)) {
        return res.status(400).json({ success: false, message: 'Please enter a valid phone number.' });
    }

    /* ── Sanitize ── */
    const clean = (str) => (str || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const safeName = clean(name.trim());
    const safeEmail = email ? clean(email.trim()) : null;
    const safePhone = phone ? clean(phone.trim()) : null;
    const safeSubject = subject ? clean(subject.trim()) : '';
    const safeMessage = clean(message.trim());

    const isWhatsApp = !!safePhone && !safeEmail;

    /* ── Create Transporter ── */
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    /* ── Compose Email ── */
    const mailOptions = {
        from: `"Portfolio Contact" <${process.env.SMTP_EMAIL}>`,
        to: process.env.SMTP_EMAIL || 'hari04022005@gmail.com',
        replyTo: safeEmail || undefined,
        subject: isWhatsApp
            ? `📱 [WhatsApp Lead] ${safeName} contacted via portfolio`
            : `✉️ ${safeSubject || `Portfolio message from ${safeName}`}`,
        html: `
            <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0d24;color:#f8fafc;border-radius:12px;overflow:hidden;">
                <div style="background:linear-gradient(135deg,#7c3aed,#06b6d4);padding:24px 32px;">
                    <h1 style="margin:0;font-size:20px;color:#fff;">🚀 New Portfolio Message</h1>
                </div>
                <div style="padding:28px 32px;">
                    <table style="width:100%;border-collapse:collapse;">
                        <tr>
                            <td style="padding:8px 0;color:#94a3b8;font-size:13px;width:90px;">Name</td>
                            <td style="padding:8px 0;color:#f8fafc;font-size:15px;font-weight:600;">${safeName}</td>
                        </tr>
                        ${safeEmail ? `<tr>
                            <td style="padding:8px 0;color:#94a3b8;font-size:13px;">Email</td>
                            <td style="padding:8px 0;"><a href="mailto:${safeEmail}" style="color:#a855f7;text-decoration:none;">${safeEmail}</a></td>
                        </tr>` : ''}
                        ${safePhone ? `<tr>
                            <td style="padding:8px 0;color:#94a3b8;font-size:13px;">Phone</td>
                            <td style="padding:8px 0;color:#22d3ee;font-size:15px;">${safePhone}</td>
                        </tr>` : ''}
                        ${safeSubject ? `<tr>
                            <td style="padding:8px 0;color:#94a3b8;font-size:13px;">Subject</td>
                            <td style="padding:8px 0;color:#f8fafc;font-size:15px;">${safeSubject}</td>
                        </tr>` : ''}
                    </table>
                    <div style="margin-top:20px;padding:16px;background:rgba(124,58,237,0.1);border-left:3px solid #7c3aed;border-radius:0 8px 8px 0;">
                        <p style="margin:0 0 6px;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Message</p>
                        <p style="margin:0;color:#f8fafc;font-size:14px;line-height:1.7;">${safeMessage.replace(/\n/g, '<br>')}</p>
                    </div>
                </div>
                <div style="padding:16px 32px;border-top:1px solid rgba(139,92,246,0.2);text-align:center;">
                    <p style="margin:0;color:#64748b;font-size:11px;">
                        Sent via portfolio contact form${isWhatsApp ? ' (WhatsApp mode)' : ''} · ${new Date().toUTCString()}
                    </p>
                </div>
            </div>
        `,
    };

    /* ── Send ── */
    try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('SMTP Error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again later.',
        });
    }
};
