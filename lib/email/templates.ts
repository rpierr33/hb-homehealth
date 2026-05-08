import { Resend } from 'resend';
import { sanitizeHtml } from '@/lib/sanitize';
import { SITE } from '@/lib/site-config';

const FROM_EMAIL = SITE.contact.emailFromHeader;
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || SITE.contact.email;

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendConfirmationEmail(data: {
  email: string;
  firstName: string;
  type: 'inquiry' | 'referral' | 'application';
}) {
  const subjectMap = {
    inquiry: `We Received Your Inquiry — ${SITE.company.name}`,
    referral: `Your Referral Has Been Received — ${SITE.company.name}`,
    application: `Application Received — ${SITE.company.name}`,
  };

  const bodyMap = {
    inquiry:
      'We have received your inquiry. A member of our care coordination team will get back to you within 1 business day to discuss your home health needs.',
    referral:
      'Thank you for your referral. Our team will review the information and reach out to the patient within 1 business day.',
    application:
      'Thank you for your interest in joining our team! We have received your application and will review it shortly. A member of our HR team will be in touch.',
  };

  await getResend().emails.send({
    from: FROM_EMAIL,
    to: data.email,
    subject: subjectMap[data.type],
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-block; width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #E8476C, #FF6B8A); color: white; font-size: 24px; font-weight: 700; line-height: 48px; text-align: center;">H</div>
        </div>
        <h1 style="color: #E8476C; font-size: 24px; margin-bottom: 16px;">Thank you, ${data.firstName}!</h1>
        <p style="color: #1A2332; font-size: 16px; line-height: 1.6;">
          ${bodyMap[data.type]}
        </p>
        <p style="color: #6B7280; font-size: 14px; line-height: 1.6; margin-top: 24px;">
          If you need immediate assistance, please call us at <strong>${SITE.contact.phone.display}</strong>.
        </p>
        <hr style="border: none; border-top: 1px solid #FCE4EC; margin: 32px 0;" />
        <p style="color: #6B7280; font-size: 12px;">
          ${SITE.company.name}<br />
          ${SITE.address.fullLine}<br />
          ${SITE.contact.email}
        </p>
      </div>
    `,
  });
}

export async function sendNotificationEmail(data: {
  type: 'inquiry' | 'referral' | 'application';
  details: Record<string, string | undefined>;
}) {
  const safe = Object.fromEntries(
    Object.entries(data.details).map(([k, v]) => [k, v ? sanitizeHtml(v) : v])
  );

  const subjectMap = {
    inquiry: `New Inquiry: ${(safe.firstName || '').replace(/[\r\n]/g, '')} ${(safe.lastName || '').replace(/[\r\n]/g, '')}`,
    referral: `New Referral: ${(safe.patientName || '').replace(/[\r\n]/g, '')} (from ${(safe.referrerName || '').replace(/[\r\n]/g, '')})`,
    application: `New Application: ${(safe.firstName || '').replace(/[\r\n]/g, '')} ${(safe.lastName || '').replace(/[\r\n]/g, '')}`,
  };

  const rows = Object.entries(safe)
    .filter(([, val]) => val !== undefined && val !== '')
    .map(
      ([key, val]) =>
        `<tr><td style="padding: 8px; font-weight: bold; text-transform: capitalize;">${key.replace(/([A-Z])/g, ' $1').trim()}</td><td style="padding: 8px;">${val}</td></tr>`
    )
    .join('');

  await getResend().emails.send({
    from: FROM_EMAIL,
    to: NOTIFICATION_EMAIL,
    subject: subjectMap[data.type],
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #E8476C;">${subjectMap[data.type]}</h2>
        <table style="width: 100%; border-collapse: collapse;">
          ${rows}
        </table>
      </div>
    `,
  });
}
