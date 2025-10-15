# CoFounder Base - Deployment Guide

This guide will help you deploy CoFounder Base to production with Supabase and email functionality.

## Prerequisites

- Supabase account
- Mailtrap account
- Vercel account (recommended) or any hosting platform
- GitHub repository access

## Step 1: Supabase Setup

1. **Create a Supabase Project**
   - Go to https://supabase.com
   - Create a new project
   - Note down your project URL and API keys

2. **Set up Database Schema**
   - Go to SQL Editor in your Supabase dashboard
   - Copy and paste the entire content from `supabase-setup.sql`
   - Run the script to create all tables, indexes, and policies

3. **Verify Database Setup**
   - Check that the following tables are created:
     - `profiles`
     - `features` 
     - `settings`
   - Verify Row Level Security (RLS) is enabled
   - Confirm initial data is inserted

## Step 2: Email Configuration

1. **Set up Mailtrap**
   - Create account at https://mailtrap.io
   - Create a new inbox
   - Get your API token from the settings

2. **Configure Email Templates**
   - The system uses HTML and plain text templates
   - Templates are defined in `src/lib/emailService.ts`
   - Customize sender information and branding as needed

## Step 3: Environment Variables

Set up the following environment variables in your deployment platform:

```env
# Basic Configuration
NEXT_PUBLIC_ADMIN_PASSWORD=CofounderBase@2024!Secure
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Email Configuration
MAILTRAP_TOKEN=your_mailtrap_token
```

## Step 4: Vercel Deployment

1. **Connect Repository**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Select the `cofounderbase` folder as root

2. **Configure Environment Variables**
   - Add all environment variables from Step 3
   - Make sure `NEXT_PUBLIC_BASE_URL` points to your production domain

3. **Deploy**
   - Vercel will automatically build and deploy
   - Monitor the deployment logs for any issues

## Step 5: Post-Deployment Testing

1. **Test Profile Submission**
   - Go to `/submit` on your live site
   - Submit a test profile
   - Verify confirmation email is received

2. **Test Admin Panel**
   - Access `/secure-admin-panel-2024`
   - Use the admin password to login
   - Approve the test profile
   - Verify approval email is sent

3. **Test Feature Voting**
   - Go to `/upcoming-features`
   - Vote on features
   - Verify votes are saved in Supabase

## Step 6: Production Optimizations

1. **Security**
   - Change the default admin password
   - Review Supabase RLS policies
   - Enable HTTPS (automatic with Vercel)

2. **Performance**
   - Enable Vercel Analytics
   - Monitor Core Web Vitals
   - Optimize images if needed

3. **Monitoring**
   - Set up Supabase monitoring
   - Monitor email delivery rates
   - Track user engagement

## Troubleshooting

### Common Issues

1. **Email not sending**
   - Check Mailtrap token is correct
   - Verify network connectivity
   - Check Vercel function logs

2. **Database connection errors**
   - Verify Supabase credentials
   - Check RLS policies
   - Ensure service role key has proper permissions

3. **Build failures**
   - Check TypeScript errors
   - Verify all dependencies are installed
   - Review environment variable names

### Debug Steps

1. **Check Vercel Logs**
   ```bash
   vercel logs your-deployment-url
   ```

2. **Test API Endpoints**
   - Use browser dev tools
   - Check network requests
   - Verify response status codes

3. **Supabase Dashboard**
   - Monitor real-time database activity
   - Check authentication logs
   - Review API usage

## Maintenance

### Regular Tasks

1. **Database Maintenance**
   - Monitor storage usage
   - Review query performance
   - Update RLS policies as needed

2. **Email Monitoring**
   - Check delivery rates
   - Monitor bounce rates
   - Update email templates

3. **Security Updates**
   - Keep dependencies updated
   - Review access logs
   - Rotate API keys periodically

### Backup Strategy

1. **Database Backups**
   - Supabase provides automatic backups
   - Consider additional backup strategy for critical data

2. **Code Backups**
   - GitHub repository serves as code backup
   - Tag releases for easy rollback

## Support

For issues with:
- **Supabase**: Check Supabase documentation and support
- **Vercel**: Review Vercel documentation and community
- **Mailtrap**: Contact Mailtrap support for email issues

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Mailtrap Documentation](https://help.mailtrap.io/)

---

**Note**: Always test in a staging environment before deploying to production.