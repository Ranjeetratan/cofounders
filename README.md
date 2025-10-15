# CoFounder Base

A modern platform connecting entrepreneurs with potential co-founders. Built with Next.js, TypeScript, Tailwind CSS, and Supabase with automated email notifications.

## 🚀 Features

- **Profile Creation**: Detailed founder profiles with skills, experience, and startup information
- **Email Notifications**: Automated emails for profile submissions and approvals via Mailtrap
- **Smart Filtering**: Advanced search and filtering capabilities
- **Admin Panel**: Secure admin interface for profile management
- **Feature Voting**: Community-driven feature request system
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Clean, professional interface with smooth animations

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Email**: Nodemailer with Mailtrap
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- Supabase account
- Mailtrap account (for email functionality)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ranjeetratan/cofounders.git
   cd cofounderbase
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Basic Configuration
   NEXT_PUBLIC_ADMIN_PASSWORD=CofounderBase@2024!Secure
   NEXT_PUBLIC_BASE_URL=http://localhost:3000

   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://cpoaviqyozhpplgymkol.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwb2F2aXF5b3pocHBsZ3lta29sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MjQxNjQsImV4cCI6MjA3NjEwMDE2NH0.6DOvqWRP8XCp441_FWR9czkq-HV4zzTIIe4lM0Yz1ZM
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwb2F2aXF5b3pocHBsZ3lta29sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MjQxNjQsImV4cCI6MjA3NjEwMDE2NH0.6DOvqWRP8XCp441_FWR9czkq-HV4zzTIIe4lM0Yz1ZM

   # Email Configuration (Mailtrap)
   MAILTRAP_TOKEN=752f148f15826742341a0dfe725f6ead
   ```

4. **Set up Supabase database**
   - Create a new Supabase project at https://supabase.com
   - Go to the SQL Editor in your Supabase dashboard
   - Run the SQL script from `supabase-setup.sql` to create all tables and policies

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

The project uses Supabase (PostgreSQL) with the following tables:

- **profiles**: Founder profiles with personal and startup information
- **features**: Feature requests with voting system  
- **settings**: Platform configuration settings

**Important**: Run the `supabase-setup.sql` script in your Supabase SQL editor to set up the complete database schema with proper indexes and Row Level Security policies.

## 📧 Email Configuration

The platform sends automated emails for:

1. **Profile Submission Confirmation**: Sent immediately when a user submits their profile
2. **Profile Approval Notification**: Sent when an admin approves a profile with live profile link

Email service is configured with Mailtrap for reliable delivery. The system includes:
- HTML and plain text email templates
- Error handling and fallback mechanisms
- Professional email styling

## 📱 Pages & Routes

### Public Routes
- `/` - Home page with hero and featured profiles
- `/directory` - Searchable directory of approved profiles
- `/submit` - Profile submission form
- `/profile/[id]` - Individual profile pages
- `/upcoming-features` - Feature voting system
- `/info` - Platform information and testing details

### Admin Routes
- `/secure-admin-panel-2024` - Password-protected admin panel

### API Routes

#### Profiles
- `GET /api/profiles` - Fetch profiles with filtering
- `POST /api/profiles` - Create new profile (sends confirmation email)
- `GET /api/profiles/[id]` - Get specific profile
- `PATCH /api/profiles/[id]` - Update profile (sends approval email if approved)
- `DELETE /api/profiles/[id]` - Delete profile

#### Features
- `GET /api/features` - Get all features
- `POST /api/features` - Create new feature
- `POST /api/features/[id]/vote` - Vote for a feature
- `DELETE /api/features/[id]/vote` - Remove vote

#### Settings
- `GET /api/settings` - Get platform settings
- `PUT /api/settings` - Update platform settings

## 🔧 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── profiles/      # Profile management
│   │   ├── features/      # Feature voting system
│   │   └── settings/      # Platform settings
│   ├── directory/         # Profile directory page
│   ├── submit/            # Profile submission page
│   ├── profile/[id]/      # Individual profile pages
│   ├── upcoming-features/ # Feature voting page
│   └── secure-admin-panel-2024/ # Admin panel
├── components/            # Reusable components
├── lib/                   # Utility functions and services
│   ├── supabase.ts       # Supabase client configuration
│   ├── supabaseService.ts # Database operations
│   └── emailService.ts   # Email functionality
└── models/                # TypeScript interfaces
```

## 👨‍💼 Admin Panel

Access the admin panel at `/secure-admin-panel-2024` with the configured password: `CofounderBase@2024!Secure`

### Features:
- View all profiles (pending, approved, rejected)
- Approve/reject profiles (triggers approval emails automatically)
- Edit profile information
- Delete profiles
- Platform statistics and analytics
- Bulk operations for efficiency

## 🔗 Git Repository

The project is connected to: https://github.com/Ranjeetratan/cofounders.git

To push changes:
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

Note: You may need to authenticate with GitHub first if you encounter permission errors.

## 🌍 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | Admin panel password | Yes |
| `NEXT_PUBLIC_BASE_URL` | Base URL for email links | Yes |
| `MAILTRAP_TOKEN` | Mailtrap API token for emails | Yes |

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy automatically

### Production Checklist
- [ ] Update `NEXT_PUBLIC_BASE_URL` to your production domain
- [ ] Verify Supabase RLS policies are properly configured
- [ ] Test email functionality in production
- [ ] Update admin password for security

## 🔮 Future Enhancements

- **Advanced Matching Algorithm**: AI-powered co-founder recommendations
- **Video Introductions**: Allow founders to upload video profiles
- **Real-time Chat**: Built-in messaging system
- **Mobile App**: Native iOS and Android applications
- **Analytics Dashboard**: Comprehensive user and platform analytics
- **Integration APIs**: LinkedIn and GitHub profile integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly (especially email functionality)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ for the founder community. Connecting entrepreneurs worldwide to build the next generation of startups together.