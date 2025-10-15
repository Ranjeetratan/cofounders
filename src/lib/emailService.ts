import * as nodemailer from "nodemailer";
import { MailtrapTransport } from "mailtrap";

const TOKEN = "752f148f15826742341a0dfe725f6ead";

const transport = nodemailer.createTransport(
  MailtrapTransport({
    token: TOKEN,
  })
);

const sender = {
  address: "hello@cofounderbase.com",
  name: "CoFounder Base",
};

export async function sendSubmissionConfirmationEmail(email: string, name: string) {
  try {
    await transport.sendMail({
      from: sender,
      to: [email],
      subject: "Thank you for submitting your profile!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank you for submitting your profile!</h2>
          <p>Hi ${name},</p>
          <p>Thank you for submitting your profile to CoFounder Base. We've received your submission and our team will review it shortly.</p>
          <p>We'll notify you once your profile is live on our platform.</p>
          <p>Best regards,<br>The CoFounder Base Team</p>
        </div>
      `,
      text: `Hi ${name},\n\nThank you for submitting your profile to CoFounder Base. We've received your submission and our team will review it shortly.\n\nWe'll notify you once your profile is live on our platform.\n\nBest regards,\nThe CoFounder Base Team`,
      category: "Profile Submission",
    });
    console.log("Submission confirmation email sent successfully");
  } catch (error) {
    console.error("Error sending submission confirmation email:", error);
    throw error;
  }
}

export async function sendProfileApprovalEmail(email: string, name: string, profileId: string) {
  const profileUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/profile/${profileId}`;
  
  try {
    await transport.sendMail({
      from: sender,
      to: [email],
      subject: "Your profile is now live on CoFounder Base!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your profile is now live!</h2>
          <p>Hi ${name},</p>
          <p>Great news! Your profile has been approved and is now live on CoFounder Base.</p>
          <p>You can view your profile here: <a href="${profileUrl}" style="color: #007bff;">${profileUrl}</a></p>
          <p>Start connecting with potential co-founders and grow your network!</p>
          <p>Best regards,<br>The CoFounder Base Team</p>
        </div>
      `,
      text: `Hi ${name},\n\nGreat news! Your profile has been approved and is now live on CoFounder Base.\n\nYou can view your profile here: ${profileUrl}\n\nStart connecting with potential co-founders and grow your network!\n\nBest regards,\nThe CoFounder Base Team`,
      category: "Profile Approval",
    });
    console.log("Profile approval email sent successfully");
  } catch (error) {
    console.error("Error sending profile approval email:", error);
    throw error;
  }
}