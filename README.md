# CofounderBase

A minimal, modern, monochrome directory web app where founders and cofounders can discover each other and connect via LinkedIn — with an admin panel for profile approval.

## 🚀 Features

- **Home Page**: Hero section with featured founders and call-to-action
- **Profile Submission**: Comprehensive form with validation using React Hook Form + Zod
- **Public Directory**: Searchable and filterable grid of approved profiles
- **Admin Panel**: Password-protected interface for profile management
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Animations**: Framer Motion for elegant transitions

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4 (monochrome + orange accent)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **Database**: MongoDB with Mongoose ODM
- **Backend**: Next.js API Routes
- **Deployment**: Vercel-ready

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cofounderbase
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/cofounderbase
   NEXT_PUBLIC_ADMIN_PASSWORD=admin123
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system. You can use:
   - Local MongoDB installation
   - MongoDB Atlas (cloud)
   - Docker: `docker run -d -p 27017:27017 mongo`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Design System

### Colors
- **Primary**: Black (#000000)
- **Accent**: Orange (#ff7b00)
- **Background**: White (#ffffff)
- **Gray Scale**: Various shades for text and borders

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Components
- **Rounded Corners**: 2xl (16px) for cards and buttons
- **Shadows**: Soft, subtle shadows
- **Spacing**: Generous padding and margins

## 📱 Pages & Routes

### Public Routes
- `/` - Home page with hero and featured profiles
- `/directory` - Searchable directory of approved profiles
- `/submit` - Profile submission form

### Admin Routes
- `/admin` - Password-protected admin panel

### API Routes
- `GET /api/profiles` - Fetch profiles with filters
- `POST /api/profiles` - Submit new profile
- `PATCH /api/profiles/[id]` - Update profile (admin)
- `DELETE /api/profiles/[id]` - Delete profile (admin)

## 🔧 Configuration

### Admin Access
The admin panel is protected by a simple password check. Update the password in:
- Environment variable: `NEXT_PUBLIC_ADMIN_PASSWORD`
- Default password: `admin123`

### Database Schema
Profiles include:
- Basic info (name, email, location, LinkedIn)
- Profile details (type, bio, looking for)
- Categories (industry, skills, availability, startup stage)
- Status (pending, approved, rejected)
- Featured flag for homepage display

### Filters
The directory supports filtering by:
- Type (Founder/Co-founder)
- Industry
- Skills
- Location (search)
- Startup Stage
- Availability

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production
```env
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password
```

## 🔮 Future Enhancements

- **Authentication**: Replace simple password with proper auth system
- **Image Upload**: Direct image upload instead of URLs
- **Email Notifications**: Notify users when profiles are approved
- **Advanced Search**: Full-text search with better filtering
- **Monetization**: Premium listings and featured placements
- **Analytics**: Track profile views and connections

## 📄 License

MIT License - feel free to use this project for your own cofounder directory!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

Built with ❤️ for the founder community