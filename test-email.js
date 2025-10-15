// Simple test script to verify email functionality
const { sendSubmissionConfirmationEmail, sendProfileApprovalEmail } = require('./src/lib/emailService.ts');

async function testEmails() {
  try {
    console.log('Testing submission confirmation email...');
    await sendSubmissionConfirmationEmail('test@example.com', 'Test User');
    console.log('✅ Submission confirmation email sent successfully');

    console.log('Testing profile approval email...');
    await sendProfileApprovalEmail('test@example.com', 'Test User', 'test-profile-id');
    console.log('✅ Profile approval email sent successfully');
  } catch (error) {
    console.error('❌ Email test failed:', error);
  }
}

testEmails();