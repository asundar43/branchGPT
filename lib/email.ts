import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendTrialStartEmail(email: string, trialEndDate: Date) {
  try {
    await resend.emails.send({
      from: 'BranchGPT <noreply@branchgpt.org>',
      to: email,
      subject: 'Welcome to BranchGPT - Your Free Trial Has Started!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">Welcome to BranchGPT!</h1>
          <p>Thank you for starting your free trial with BranchGPT. We're excited to have you on board!</p>
          <p>Your trial will end on ${trialEndDate.toLocaleDateString()}.</p>
          <p>During your trial, you'll have access to:</p>
          <ul>
            <li>10 chats per day</li>
            <li>Basic AI models</li>
            <li>Core branching features</li>
          </ul>
          <p>To get the most out of your trial:</p>
          <ol>
            <li>Try creating different branches in your conversations</li>
            <li>Experiment with different AI models</li>
            <li>Explore the export and sharing features</li>
          </ol>
          <p>Need help getting started? Check out our <a href="https://branchgpt.org/docs">documentation</a> or reach out to our support team.</p>
          <p>Best regards,<br>The BranchGPT Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send trial start email:', error);
  }
}

export async function sendTrialMidpointEmail(email: string, trialEndDate: Date) {
  try {
    await resend.emails.send({
      from: 'BranchGPT <noreply@branchgpt.org>',
      to: email,
      subject: 'Halfway Through Your BranchGPT Trial!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">Halfway Through Your Trial!</h1>
          <p>You're halfway through your BranchGPT trial! We hope you're enjoying the experience.</p>
          <p>Your trial will end on ${trialEndDate.toLocaleDateString()}.</p>
          <p>Upgrade now to unlock:</p>
          <ul>
            <li>Unlimited branching conversations</li>
            <li>Advanced AI models with memory</li>
            <li>Custom AI personality settings</li>
            <li>Priority support & updates</li>
          </ul>
          <p>Ready to upgrade? Visit our <a href="https://branchgpt.org/pricing">pricing page</a> to choose the plan that's right for you.</p>
          <p>Best regards,<br>The BranchGPT Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send trial midpoint email:', error);
  }
}

export async function sendTrialEndingEmail(email: string, trialEndDate: Date) {
  try {
    await resend.emails.send({
      from: 'BranchGPT <noreply@branchgpt.org>',
      to: email,
      subject: 'Your BranchGPT Trial is Ending Soon',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">Your Trial is Ending Soon</h1>
          <p>Your BranchGPT trial will end on ${trialEndDate.toLocaleDateString()}.</p>
          <p>Don't lose access to your conversations and features! Upgrade now to keep:</p>
          <ul>
            <li>All your branching conversations</li>
            <li>Advanced AI capabilities</li>
            <li>Custom settings and preferences</li>
          </ul>
          <p>Choose from our flexible plans:</p>
          <ul>
            <li>Monthly: $20/month</li>
            <li>Annual: $192/year (save 20%)</li>
          </ul>
          <p><a href="https://branchgpt.org/pricing" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Upgrade Now</a></p>
          <p>Questions? Our support team is here to help!</p>
          <p>Best regards,<br>The BranchGPT Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send trial ending email:', error);
  }
} 