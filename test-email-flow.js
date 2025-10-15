// Test email flow end-to-end
const fetch = require('node-fetch');

async function testEmailFlow() {
  console.log('📧 Testing Email Flow End-to-End\n');
  
  const baseUrl = 'http://localhost:3000';
  
  // Test data
  const testProfile = {
    fullName: 'Test User',
    email: 'test@example.com',
    location: 'San Francisco, CA',
    linkedinUrl: 'https://linkedin.com/in/testuser',
    type: 'Founder',
    lookingFor: 'Looking for a technical co-founder',
    bio: 'Test bio for email functionality',
    industry: ['Technology'],
    skills: ['Product Management'],
    availability: 'Full-time',
    startupStage: 'Idea'
  };
  
  try {
    console.log('1️⃣ Testing Profile Submission (should trigger confirmation email)...');
    
    const submitResponse = await fetch(`${baseUrl}/api/profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testProfile)
    });
    
    const submitResult = await submitResponse.json();
    
    if (submitResult.success) {
      console.log('✅ Profile submitted successfully');
      console.log('📧 Confirmation email should be sent to:', testProfile.email);
      
      const profileId = submitResult.profile.id;
      
      if (profileId) {
        console.log('\n2️⃣ Testing Profile Approval (should trigger approval email)...');
        
        const approvalResponse = await fetch(`${baseUrl}/api/profiles/${profileId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'approved'
          })
        });
        
        const approvalResult = await approvalResponse.json();
        
        if (approvalResult.success) {
          console.log('✅ Profile approved successfully');
          console.log('📧 Approval email should be sent to:', testProfile.email);
          console.log('🔗 Profile URL:', `${baseUrl}/profile/${profileId}`);
        } else {
          console.log('❌ Profile approval failed:', approvalResult.error);
        }
      }
    } else {
      console.log('❌ Profile submission failed:', submitResult.error);
    }
    
    console.log('\n📋 Email Flow Test Complete');
    console.log('📧 Check your Mailtrap inbox for:');
    console.log('   1. Profile submission confirmation email');
    console.log('   2. Profile approval notification email');
    console.log('\n🔗 Mailtrap Dashboard: https://mailtrap.io/inboxes');
    
  } catch (error) {
    console.log('❌ Email flow test failed:', error.message);
    console.log('📋 Make sure the development server is running: npm run dev');
  }
}

// Run the test
testEmailFlow().catch(console.error);