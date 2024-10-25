import emailjs from 'emailjs-com';

interface SendEmailProps {
  to: string[];
  subject: string;
  attachments: Blob[];
}

export async function sendEmail({ to, subject, attachments }: SendEmailProps) {
  const templateParams = {
    to_email: to.join(', '),
    subject,
    message: `Veuillez trouver ci-joint le rapport d'activité et la facture du mois.`,
    attachments,
  };

  try {
    await emailjs.send(
      'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
      'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
      templateParams,
      'YOUR_USER_ID' // Replace with your EmailJS user ID
    );
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}