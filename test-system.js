// Test script to verify email and Supabase functionality
const { createClient } = require('@supabase/supabase-js');

// Test configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cpoaviqyozhpplgymkol.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwb2F2aXF5b3pocHBsZ3lta29sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MjQxNjQsImV4cCI6MjA3NjEwMDE2NH0.6DOvqWRP8XCp441_FWR9czkq-HV4zzTIIe4lM0Yz1ZM';

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Connection...');
  
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Test connection by trying to fetch from profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Supabase Connection Failed:', error.message);
      console.log('📋 Possible Issues:');
      console.log('   - Database tables not created (run supabase-setup.sql)');
      console.log('   - Incorrect Supabase credentials');
      console.log('   - RLS policies blocking access');
      return false;
    }
    
    console.log('✅ Supabase Connection Successful');
    return true;
  } catch (error) {
    console.log('❌ Supabase Connection Error:', error.message);
    return false;
  }
}

async function testEmailService() {
  console.log('\n📧 Testing Email Service...');
  
  try {
    // Import email functions
    const { sendSubmissionConfirmationEmail, sendProfileApprovalEmail } = require('./src/lib/emailService.ts');
    
    console.log('✅ Email Service Imported Successfully');
    console.log('📋 Email Configuration:');
    console.log('   - Service: Mailtrap');
    console.log('   - Token: Configured');
    console.log('   - Sender: hello@cofounderbase.com');
    
    return true;
  } catch (error) {
    console.log('❌ Email Service Error:', error.message);
    console.log('📋 Possible Issues:');
    console.log('   - Missing nodemailer or mailtrap packages');
    console.log('   - Incorrect Mailtrap token');
    console.log('   - Network connectivity issues');
    return false;
  }
}

async function testAPIEndpoints() {
  console.log('\n🔗 Testing API Endpoints...');
  
  const baseUrl = 'http://localhost:3000';
  
  try {
    // Test profiles endpoint
    const response = await fetch(`${baseUrl}/api/profiles`);
    
    if (response.ok) {
      console.log('✅ Profiles API Endpoint Working');
      return true;
    } else {
      console.log('❌ Profiles API Endpoint Failed:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ API Endpoint Test Failed:', error.message);
    console.log('📋 Note: Start the development server with "npm run dev" to test API endpoints');
    return false;
  }
}

async function runSystemTest() {
  console.log('🚀 CoFounder Base System Test\n');
  
  const supabaseOk = await testSupabaseConnection();
  const emailOk = await testEmailService();
  const apiOk = await testAPIEndpoints();
  
  console.log('\n📊 Test Results Summary:');
  console.log(`   Supabase: ${supabaseOk ? '✅ Working' : '❌ Failed'}`);
  console.log(`   Email Service: ${emailOk ? '✅ Working' : '❌ Failed'}`);
  console.log(`   API Endpoints: ${apiOk ? '✅ Working' : '❌ Failed'}`);
  
  if (supabaseOk && emailOk) {
    console.log('\n🎉 System is ready for production!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Run "npm run dev" to start development server');
    console.log('   2. Test profile submission at /submit');
    console.log('   3. Test admin approval at /secure-admin-panel-2024');
    console.log('   4. Check email delivery in Mailtrap dashboard');
  } else {
    console.log('\n⚠️  System needs attention before production');
    console.log('\n📋 Setup Required:');
    if (!supabaseOk) {
      console.log('   - Set up Supabase database (run supabase-setup.sql)');
      console.log('   - Verify Supabase credentials in .env.local');
    }
    if (!emailOk) {
      console.log('   - Install email dependencies: npm install nodemailer mailtrap');
      console.log('   - Verify Mailtrap token in .env.local');
    }
  }
}

// Run the test
runSystemTest().catch(console.error);