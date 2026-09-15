import nodemailer from "nodemailer";

export function getEmailTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const rawPass = process.env.SMTP_PASS;
  const pass = rawPass ? rawPass.replace(/['"]/g, "").replace(/\s+/g, "") : undefined;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export function isSmtpConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export function generateOtpCode(): string {
  // Cryptographically secure 6-digit numeric OTP between 100000 and 999999
  const crypto = require("crypto");
  return crypto.randomInt(100000, 999999).toString();
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  if (local.length <= 2) return `${local[0]}*@${domain}`;
  const visiblePrefix = local.slice(0, 2);
  const visibleSuffix = local.slice(-1);
  return `${visiblePrefix}${"*".repeat(Math.min(4, Math.max(1, local.length - 3)))}${visibleSuffix}@${domain}`;
}

export async function sendLoginOtpEmail({
  to,
  otp,
  name,
  purpose = "login",
}: {
  to: string;
  otp: string;
  name?: string;
  purpose?: "login" | "registration" | "verification";
}): Promise<{ success: boolean; messageId?: string; simulated?: boolean }> {
  const transporter = getEmailTransporter();
  const from = process.env.SMTP_FROM || "Open Analytics <noreply@openanalytics.org.in>";

  const displayName = name || to.split("@")[0] || "User";

  const isRegister = purpose === "registration";
  const isVerification = purpose === "verification";
  const headerTitle = isRegister
    ? "Verify your email address"
    : isVerification
    ? "Verify your account"
    : "Verify your login";

  const messageIntro = isRegister
    ? "Thank you for creating an account with Open Analytics. Please use the one-time verification code below to verify your email address and activate your account:"
    : isVerification
    ? "Your account requires email verification before signing in. Please use the one-time verification code below to complete verification:"
    : "A sign-in attempt was detected for your account. Please use the one-time verification code below to complete your authentication:";

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Open Analytics Verification Code</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #050811;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #e2e8f0;
    }
    .wrapper {
      width: 100%;
      background-color: #050811;
      padding: 40px 16px;
      box-sizing: border-box;
    }
    .card {
      max-width: 520px;
      margin: 0 auto;
      background-color: #0b1020;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 20px;
      padding: 36px 32px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 28px;
    }
    .brand-text {
      font-size: 20px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.5px;
    }
    .brand-badge {
      display: inline-block;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      background-color: rgba(6, 182, 212, 0.15);
      color: #22d3ee;
      border: 1px solid rgba(6, 182, 212, 0.3);
      border-radius: 9999px;
      padding: 3px 9px;
      margin-left: 6px;
    }
    h1 {
      font-size: 22px;
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 12px 0;
      letter-spacing: -0.3px;
    }
    p {
      font-size: 14px;
      line-height: 1.6;
      color: #94a3b8;
      margin: 0 0 24px 0;
    }
    .otp-container {
      background: linear-gradient(145deg, rgba(6, 182, 212, 0.08), rgba(99, 102, 241, 0.08));
      border: 1px solid rgba(6, 182, 212, 0.35);
      border-radius: 16px;
      padding: 24px;
      text-align: center;
      margin: 28px 0;
    }
    .otp-code {
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
      font-size: 34px;
      font-weight: 900;
      letter-spacing: 10px;
      color: #38bdf8;
      margin: 0;
      text-indent: 10px;
    }
    .otp-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #64748b;
      margin-top: 10px;
    }
    .security-notice {
      background-color: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 12px;
      padding: 14px 18px;
      margin-top: 24px;
      font-size: 12px;
      color: #94a3b8;
      line-height: 1.5;
    }
    .footer {
      text-align: center;
      margin-top: 32px;
      font-size: 11px;
      color: #475569;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="brand">
        <span class="brand-text">Open Analytics</span>
        <span class="brand-badge">${isRegister ? "Registration" : "Email Auth"}</span>
      </div>
      <h1>${headerTitle}</h1>
      <p>Hello ${displayName},</p>
      <p>${messageIntro}</p>
      
      <div class="otp-container">
        <div class="otp-code">${otp}</div>
        <div class="otp-label">Expires in 10 minutes</div>
      </div>

      <div class="security-notice">
        <strong>Security tip:</strong> Never share this verification code with anyone. Open Analytics staff will never ask for your code. If you did not initiate this login request, please disregard this email.
      </div>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Open Analytics Inc. • Standalone Multi-Tenant Web Observability<br>
      Privacy &amp; Security by design • No tracking cookies required.
    </div>
  </div>
</body>
</html>
  `;

  if (!transporter) {
    console.log("\n=======================================================");
    console.log(" [Open Analytics Nodemailer OTP Dispatch]");
    console.log(` To: ${to} (${displayName})`);
    console.log(` OTP Verification Code: ${otp}`);
    console.log(" Note: SMTP credentials not set in .env.local; logged for development.");
    console.log("=======================================================\n");
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject: `${otp} is your Open Analytics verification code`,
      text: `Your Open Analytics verification code is: ${otp}\n\nThis code expires in 10 minutes. Do not share it with anyone.`,
      html: htmlContent,
    });

    console.log(`[Email Sent] Nodemailer dispatched OTP to ${to} (Message ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error(`[Nodemailer Error] Failed to send email to ${to}:`, err.message);
    // Even if remote SMTP fails during development, log the OTP to stdout so user isn't locked out
    console.log(`\n>>> [FALLBACK OTP LOG] Code for ${to}: ${otp} <<<\n`);
    return { success: false, simulated: true };
  }
}
