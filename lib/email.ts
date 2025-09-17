
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPollClosingAlert(to: string, pollQuestion: string) {
  const { data, error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to,
    subject: `Your poll "${pollQuestion}" is closing soon!`,
    html: `<p>Your poll "${pollQuestion}" is closing in 24 hours. Make sure to check the results!</p>`,
  });

  if (error) {
    console.error('Error sending email:', error);
  }

  return data;
}
