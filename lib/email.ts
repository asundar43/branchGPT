import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY environment variable is not set');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendTrialStartEmail(email: string, daysRemaining: number) {
  try {
    await resend.emails.send({
      from: 'BranchGPT <noreply@branchgpt.org>',
      to: email,
      subject: 'Welcome to BranchGPT - Your Free Trial Has Started! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">Welcome to BranchGPT!</h1>
          <p>Thank you for starting your free trial with BranchGPT. We're excited to have you on board!</p>
          
          <h2 style="color: #4F46E5;">What's Included in Your Trial:</h2>
          <ul>
            <li>14 days of full access to BranchGPT</li>
            <li>10 chats per day</li>
            <li>Basic AI models</li>
            <li>Branch and merge conversations</li>
          </ul>

          <p>You have <strong>${daysRemaining} days</strong> remaining in your trial.</p>

          <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #4F46E5;">Ready to Upgrade?</h3>
            <p>Get unlimited access to all features including:</p>
            <ul>
              <li>Unlimited chats</li>
              <li>Advanced AI models</li>
              <li>Custom AI personality settings</li>
              <li>Priority support</li>
            </ul>
            <a href="https://branchgpt.org/pricing" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">Upgrade Now</a>
          </div>

          <p>If you have any questions, feel free to reply to this email.</p>
          
          <p>Best regards,<br>The BranchGPT Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send trial start email:', error);
  }
}

export async function sendTrialMidpointEmail(email: string, daysRemaining: number) {
  try {
    await resend.emails.send({
      from: 'BranchGPT <noreply@branchgpt.org>',
      to: email,
      subject: 'Halfway Through Your BranchGPT Trial! 🎯',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">Halfway Through Your Trial!</h1>
          <p>You're halfway through your BranchGPT trial! We hope you're enjoying the experience.</p>
          
          <p>You have <strong>${daysRemaining} days</strong> remaining in your trial.</p>

          <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #4F46E5;">Don't Miss Out!</h3>
            <p>Upgrade now to keep all your conversations and get access to:</p>
            <ul>
              <li>Unlimited chats</li>
              <li>Advanced AI models</li>
              <li>Custom AI personality settings</li>
              <li>Priority support</li>
            </ul>
            <a href="https://branchgpt.org/pricing" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">Upgrade Now</a>
          </div>

          <p>If you have any questions, feel free to reply to this email.</p>
          
          <p>Best regards,<br>The BranchGPT Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send trial midpoint email:', error);
  }
}

export async function sendTrialEndingEmail(email: string, daysRemaining: number) {
  try {
    await resend.emails.send({
      from: 'BranchGPT <noreply@branchgpt.org>',
      to: email,
      subject: 'Your BranchGPT Trial is Ending Soon ⏰',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">Your Trial is Ending Soon!</h1>
          <p>Your BranchGPT trial will end in <strong>${daysRemaining} days</strong>. Don't lose access to your conversations!</p>
          
          <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #4F46E5;">Special Offer!</h3>
            <p>Upgrade now to keep all your conversations and get access to:</p>
            <ul>
              <li>Unlimited chats</li>
              <li>Advanced AI models</li>
              <li>Custom AI personality settings</li>
              <li>Priority support</li>
            </ul>
            <a href="https://branchgpt.org/pricing" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">Upgrade Now</a>
          </div>

          <p>If you have any questions, feel free to reply to this email.</p>
          
          <p>Best regards,<br>The BranchGPT Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send trial ending email:', error);
  }
} 