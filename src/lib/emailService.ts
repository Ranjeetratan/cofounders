import * as nodemailer from "nodemailer";
import { MailtrapTransport } from "mailtrap";

const TOKEN = process.env.MAILTRAP_TOKEN || "752f148f15826742341a0dfe725f6ead";

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
      subject: "Profile Submitted - Thank You!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Thank you for submitting your profile!</h2>
            <p style="font-size: 16px; line-height: 1.6;">Hi ${name},</p>
            <p style="font-size: 16px; line-height: 1.6;">Thank you for submitting your profile to <strong>CoFounder Base</strong>. We've received your submission and our team will review it shortly.</p>
            <p style="font-size: 16px; line-height: 1.6;">We will reach back to you once your profile is approved and live on our platform.</p>
            <div style="margin: 30px 0; padding: 15px; background-color: #ff7b00; color: white; border-radius: 5px; text-align: center;">
              <strong>Your profile is now in our review queue!</strong>
            </div>
            <p style="font-size: 16px; line-height: 1.6;">Best regards,<br><strong>The CoFounder Base Team</strong></p>
          </div>
        </div>
      `,
      text: `Hi ${name},\n\nThank you for submitting your profile to CoFounder Base. We've received your submission and our team will review it shortly.\n\nWe will reach back to you once your profile is approved and live on our platform.\n\nBest regards,\nThe CoFounder Base Team`,
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
      subject: "🎉 Your Profile is Live on CoFounder Base!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">🎉 Your profile is now live!</h2>
            <p style="font-size: 16px; line-height: 1.6;">Hi ${name},</p>
            <p style="font-size: 16px; line-height: 1.6;">Great news! Your profile has been approved and is now <strong>live on CoFounder Base</strong>.</p>
            <div style="margin: 30px 0; padding: 20px; background-color: #f0f9ff; border-left: 4px solid #ff7b00; border-radius: 5px;">
              <p style="margin: 0; font-size: 16px;"><strong>Your live profile:</strong></p>
              <a href="${profileUrl}" style="color: #ff7b00; text-decoration: none; font-weight: bold; font-size: 16px;">${profileUrl}</a>
            </div>
            <p style="font-size: 16px; line-height: 1.6;">Start connecting with potential co-founders and grow your network!</p>
            <p style="font-size: 16px; line-height: 1.6;">Best regards,<br><strong>The CoFounder Base Team</strong></p>
          </div>
        </div>
      `,
      text: `Hi ${name},\n\nGreat news! Your profile has been approved and is now live on CoFounder Base.\n\nYour live profile: ${profileUrl}\n\nStart connecting with potential co-founders and grow your network!\n\nBest regards,\nThe CoFounder Base Team`,
      category: "Profile Approval",
    });
    console.log("Profile approval email sent successfully");
  } catch (error) {
    console.error("Error sending profile approval email:", error);
    throw error;
  }
}