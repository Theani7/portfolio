# Anil Paneru | Portfolio

A modern, responsive, and interactive portfolio website built with React, Vite, and Tailwind CSS. This project showcases my work as an AI & Data Science student, featuring an AI-integrated chat interface, dynamic multilingual greetings, and a curated project gallery with advanced mobile optimizations.

## 🌟 Overview

This portfolio represents my journey as a Graduate in AI and Data Science, currently working in LLMs and AI Engineering. The site combines cutting-edge web technologies with intelligent features to create an engaging user experience.

## 🚀 Features

### Core Features
- **🤖 Seamless AI Chat**: An integrated AI chat interface (`SeamlessAI.jsx`) that simulates intelligent conversation, answering questions about my background, skills, and projects
- **🌍 Dynamic Multilingual Greeting**: A "Hello" component that smoothly cycles through greetings in English, Spanish, Portuguese, and Hindi with optimized animations
- **📱 Mobile-First Design**: Fully responsive layout with dedicated mobile components including MobileDock and MobileScrollTop
- **🎨 Dark Mode Support**: Built-in support for dark mode with system preference detection and manual toggle
- **⚡ Progressive Web App**: Service Worker integration for offline capabilities and improved performance

### Advanced Features
- **🎵 Live Spotify Integration**: Real-time "Now Playing" widget featuring a live audio equalizer, heartbeat glow, interactive 30-second audio previews, and Vercel Edge caching
- **🔄 Animated Routes**: Smooth page transitions using Framer Motion's AnimatePresence
- **📊 Project Showcase**: Dynamic project gallery with filtering, tags, and detailed views
- **🎯 Accessibility**: Skip links, semantic HTML, and ARIA labels for inclusive design
- **💬 Floating Chatbot**: Persistent chat interface with modal interactions
- **📋 Content Management**: Git-backed CMS integration for easy content updates

## 🛠️ Tech Stack

### Frontend Framework
- **[React](https://react.dev/)** (v19.2.0) - Modern UI framework with hooks and concurrent features
- **[Vite](https://vitejs.dev/)** (v7.2.4) - Lightning-fast build tool and development server
- **[React Router](https://reactrouter.com/)** (v7.13.0) - Client-side routing with nested routes

### Styling & Design
- **[Tailwind CSS](https://tailwindcss.com/)** (v4.1.18) - Utility-first CSS framework with custom configurations
- **[Framer Motion](https://www.framer.com/motion/)** (v12.31.0) - Production-ready motion library for animations
- **[Lucide React](https://lucide.dev/)** (v0.563.0) - Beautiful & consistent icon toolkit

### Development Tools
- **[ESLint](https://eslint.org/)** (v9.39.1) - Code quality and style enforcement
- **[PostCSS](https://postcss.org/)** (v8.5.6) - CSS transformation and optimization
- **[Autoprefixer](https://github.com/postcss/autoprefixer)** (v10.4.24) - CSS vendor prefixing

## 📂 Project Structure

```
portfolio/
├── public/                    # Static assets
│   ├── admin/                # Decap CMS configuration
│   ├── manifest.webmanifest  # PWA manifest
│   ├── sw.js                 # Service Worker
│   └── favicon.png           # Site favicon
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ChatModal.jsx     # Chat interface modal
│   │   ├── Container.jsx     # Layout wrapper
│   │   ├── FloatingChatbot.jsx # Persistent chat button
│   │   ├── Footer.jsx        # Site footer
│   │   ├── Hello.jsx         # Multilingual greeting
│   │   ├── Hero.jsx          # Homepage hero section
│   │   ├── MobileDock.jsx    # Mobile navigation dock
│   │   ├── MobileScrollTop.jsx # Mobile scroll-to-top button
│   │   ├── PageWrapper.jsx   # Page transition wrapper
│   │   ├── Projects.jsx      # Project gallery component
│   │   ├── SeamlessAI.jsx    # AI chat interface
│   │   ├── Sidebar.jsx       # Desktop navigation sidebar
│   │   ├── SocialLinks.jsx   # Social media links
│   │   ├── TerminalModal.jsx # Terminal-style modal
│   │   └── ThemeToggle.jsx   # Dark mode toggle
│   ├── context/              # React contexts
│   │   └── ThemeContext.jsx  # Theme management context
│   ├── data/                 # Static data files
│   │   └── projects.json     # Projects data
│   ├── pages/                # Page components
│   │   ├── Home.jsx          # Homepage
│   │   ├── Intelligence.jsx  # Intelligence showcase
│   │   ├── ProjectsPage.jsx  # Projects listing page
│   │   └── ProjectDetailPage.jsx # Individual project page
│   ├── constants/            # Application constants
│   │   └── index.js          # Content, skills, and navigation data
│   ├── App.jsx               # Main application component
│   ├── index.css             # Global styles
│   └── main.jsx              # Application entry point
├── api/                      # Backend API endpoints
│   ├── auth.js               # Authentication endpoint
│   ├── callback.js           # OAuth callback
│   ├── admin-login.js        # Admin login
│   └── admin-session.js      # Session management
├── .env.example              # Environment variables template
├── eslint.config.js          # ESLint configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── vite.config.js            # Vite build configuration
└── package.json              # Project dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Theani7/portfolio.git
   cd portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   ```bash
   cp .env.example .env
   # Add your environment variables to .env file
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

5. **Build for production:**
   ```bash
   npm run build
   ```

6. **Preview production build:**
   ```bash
   npm run preview
   ```

## 🎨 Customization Guide

### Content Management

#### Personal Information
Edit `src/constants/index.js` to update:
- Name, role, and bio information
- Social media links
- Call-to-action buttons
- Skills and expertise levels

#### Projects
Manage projects through:
- **JSON Method**: Edit `src/data/projects.json`
- **CMS Method**: Use `/admin` interface (requires setup)

#### Styling Customization
- **Theme Colors**: Modify `tailwind.config.js`
- **Global Styles**: Update `src/index.css`
- **Component Styles**: Edit individual component files

### Adding New Components

1. Create component in `src/components/`
2. Export from component file
3. Import and use in `App.jsx` or page components

## 🧩 Content Management System (CMS)

This portfolio includes Decap CMS for content management without code editing.

### Local Development Setup

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Start CMS proxy (new terminal):**
   ```bash
   npx decap-server
   ```

3. **Access CMS interface:**
   Navigate to [http://localhost:5173/admin](http://localhost:5173/admin)

### Production Deployment (Vercel)

#### Required Environment Variables
Set these in your Vercel dashboard:

```env
ADMIN_PASSWORD=your_secure_password
ADMIN_SESSION_SECRET=32_character_random_string
GITHUB_CLIENT_ID=your_github_app_client_id
GITHUB_CLIENT_SECRET=your_github_app_client_secret
OAUTH_BASE_URL=https://your-domain.vercel.app
OAUTH_CALLBACK_URL=https://your-domain.vercel.app/api/callback
GITHUB_OAUTH_SCOPE=repo
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REFRESH_TOKEN=your_spotify_refresh_token
```

#### GitHub OAuth App Setup

1. Create OAuth App in GitHub Settings
2. Set **Homepage URL**: `https://your-domain.vercel.app`
3. Set **Authorization callback URL**: `https://your-domain.vercel.app/api/callback`
4. Copy Client ID and Client Secret to Vercel environment variables

#### CMS Configuration
Update `public/admin/config.yml`:
- Replace `https://YOUR_SITE_DOMAIN` with your actual domain
- Configure backend settings for GitHub integration

## 📱 Mobile Features

### Mobile-Optimized Components
- **MobileDock**: Bottom navigation bar for mobile devices
- **MobileScrollTop**: Floating scroll-to-top button
- **Responsive Sidebar**: Collapsible navigation for mobile
- **Touch-Friendly**: Optimized tap targets and gestures

### Progressive Web App (PWA)
- Service Worker for offline functionality
- Web App Manifest for native app experience
- Responsive design for all screen sizes

## 🎯 Performance Optimizations

### Build Optimizations
- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Dead code elimination
- **Asset Optimization**: Image and font optimization
- **Bundle Analysis**: Built-in bundle analyzer

### Runtime Optimizations
- **Lazy Loading**: Components and images load on demand
- **Memoization**: React.memo for component optimization
- **Service Worker**: Caching strategies for offline access

## 🔧 Development Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# CMS
npx decap-server     # Start CMS development server
```

## 🌐 Deployment

### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Netlify
1. Connect repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables

### Static Hosting
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📊 Project Analytics

### Tech Debt Management
- ESLint configuration for code quality
- TypeScript support for type safety
- Component documentation with JSDoc

### Performance Metrics
- Lighthouse scores: 95+ Performance, 100+ Accessibility
- Core Web Vitals optimization
- Bundle size monitoring

## 🔒 Security Features

- **Environment Variables**: Secure API key management
- **Content Security Policy**: XSS protection headers
- **HTTPS Enforcement**: Secure connection requirements
- **Input Validation**: Form sanitization and validation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://react.dev/) - UI framework
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide](https://lucide.dev/) - Icon library

## 📞 Contact

- **Email**: theanilpaneru@gmail.com
- **GitHub**: [@Theani7](https://github.com/Theani7)
- **LinkedIn**: [Anil Paneru](https://www.linkedin.com/in/theanilpaneru/)
- **Portfolio**: [https://your-portfolio-url.com](https://your-portfolio-url.com)

---

**Built with ❤️ by Anil Paneru**
