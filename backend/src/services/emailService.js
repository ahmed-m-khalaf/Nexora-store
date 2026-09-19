import nodemailer from 'nodemailer';

let transporter = null;

/**
 * Initializes and returns the nodemailer transporter.
 * Supports SMTP credentials if configured via env vars,
 * otherwise creates a local fallback or test transport (or logs to console).
 */
export function getMailTransporter() {
  if (transporter) return transporter;

  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_SECURE,
  } = process.env;

  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: SMTP_SECURE === 'true' || Number(SMTP_PORT) === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  } else {
    // In development or test without SMTP credentials, use a mock transporter or stream to console
    transporter = {
      sendMail: async (options) => {
        if (process.env.NODE_ENV !== 'test') {
          console.log('\n📨 [Email Service Mock Delivery]');
          console.log(`To: ${options.to}`);
          console.log(`Subject: ${options.subject}`);
          console.log(`Content:\n${options.text || options.html}\n`);
        }
        return { messageId: `mock-${Date.now()}` };
      },
    };
  }

  return transporter;
}

/**
 * Send welcome email to a newly registered user
 */
export async function sendWelcomeEmail({ to, name }) {
  try {
    const transport = getMailTransporter();
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Nexora Store" <no-reply@nexorastore.com>',
      to,
      subject: 'Welcome to Nexora Store! 🎉',
      text: `Hello ${name || 'Valued Customer'},\n\nWelcome to Nexora Store! Your account has been successfully created.\n\nStart shopping our latest catalog here: ${process.env.FRONTEND_URL || 'http://localhost:5173'}\n\nHappy Shopping,\nThe Nexora Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a;">Welcome to Nexora Store! 🎉</h2>
          <p>Hello <strong>${name || 'Valued Customer'}</strong>,</p>
          <p>We are thrilled to have you with us. Your account is ready, and you can explore our latest collection anytime.</p>
          <div style="margin: 24px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="background-color: #0284c7; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Start Shopping</a>
          </div>
          <p style="color: #64748b; font-size: 14px;">Best regards,<br>The Nexora Store Team</p>
        </div>
      `,
    };

    return await transport.sendMail(mailOptions);
  } catch (error) {
    console.error('Failed to dispatch welcome email:', error.message);
    return null;
  }
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail({ to, customerName, order }) {
  try {
    const transport = getMailTransporter();
    const itemsListHtml = (order.items || [])
      .map(
        (item) => `
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 8px 0;">${item.productTitle || item.title || 'Product'}</td>
            <td style="padding: 8px 0; text-align: center;">${item.quantity}</td>
            <td style="padding: 8px 0; text-align: right;">$${Number(item.price).toFixed(2)}</td>
            <td style="padding: 8px 0; text-align: right;">$${Number(item.lineTotal || (item.price * item.quantity)).toFixed(2)}</td>
          </tr>
        `,
      )
      .join('');

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Nexora Store" <no-reply@nexorastore.com>',
      to,
      subject: `Order Confirmation #${order.id} — Nexora Store`,
      text: `Hello ${customerName},\n\nThank you for your order!\nOrder ID: ${order.id}\nTotal: $${order.total}\n\nWe are preparing your items for delivery.\n\nThank you,\nNexora Store`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a;">Thank you for your order! 🛍️</h2>
          <p>Hi <strong>${customerName}</strong>,</p>
          <p>We received your order <strong>#${order.id}</strong> and are preparing it for shipment.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="border-bottom: 2px solid #cbd5e1; text-align: left; font-size: 14px; color: #475569;">
                <th style="padding: 8px 0;">Item</th>
                <th style="padding: 8px 0; text-align: center;">Qty</th>
                <th style="padding: 8px 0; text-align: right;">Price</th>
                <th style="padding: 8px 0; text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsListHtml}
            </tbody>
          </table>

          <div style="border-top: 2px solid #e2e8f0; padding-top: 12px; margin-top: 12px; text-align: right;">
            <p style="margin: 4px 0;"><strong>Shipping:</strong> $${Number(order.shipping || 0).toFixed(2)}</p>
            <p style="margin: 4px 0;"><strong>Tax:</strong> $${Number(order.tax || 0).toFixed(2)}</p>
            <p style="margin: 6px 0; font-size: 18px; color: #0f172a;"><strong>Total:</strong> $${Number(order.total).toFixed(2)}</p>
          </div>

          <p style="color: #64748b; font-size: 14px; margin-top: 24px;">Delivery Address: ${order.shippingAddress || 'On file'}</p>
        </div>
      `,
    };

    return await transport.sendMail(mailOptions);
  } catch (error) {
    console.error('Failed to dispatch order confirmation email:', error.message);
    return null;
  }
}
