# 🚀 RD Tech Innovations - Portfolio Website

<div align="center">
  <img src="./app/favicon.ico" alt="RD Tech Innovations Logo" width="100" height="100">
  
  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![Firebase](https://img.shields.io/badge/Firebase-10-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
</div>

## 📖 About

Modern company portfolio website showcasing services, projects, and team. Built with cutting-edge technologies for optimal performance and user experience.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Firebase (Firestore, Storage, App Hosting)
- **Animations**: GSAP, Framer Motion
- **State**: Zustand
- **Forms**: React Hook Form + Zod

## 🚀 Quick Start

1. **Clone & Install**
   ```bash
   git clone https://github.com/your-username/rd-tech-innovations.git
   cd rd-tech-innovations
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   Add your Firebase config to `.env.local`:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

3. **Run Development**
   ```bash
   npm run dev
   ```

4. **Firebase Setup**
   ```bash
   firebase login
   firebase init
   firebase emulators:start  # For local development
   ```

## 📂 Project Structure

```
app/                    # Next.js 15 App Router
components/            
  ├── ui/              # shadcn/ui components
  ├── sections/        # Page sections
  └── animations/      # GSAP/Framer Motion components
stores/                # Zustand stores
services/firebase/     # Firebase integration
types/                 # TypeScript definitions
lib/                   # Utilities & validations
```

## 🔥 Firebase Collections

```javascript
// Firestore Structure
sections/     # Dynamic content
submissions/  # Form submissions  
projects/     # Portfolio projects
team/         # Team members
jobs/         # Career listings
```

## 🚢 Deployment

```bash
# Build & Deploy to Firebase
npm run build
firebase deploy

# Deploy hosting only
firebase deploy --only hosting
```

## 📝 Scripts

```bash
npm run dev            # Development server
npm run build          # Production build
npm run lint           # ESLint check
firebase emulators:start  # Local Firebase
firebase deploy        # Deploy to production
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push: `git push origin feature/name`
5. Open Pull Request

## 📞 Contact

**RD Tech Innovations**
- Website: [rdtechinnovations.com](https://rdtechinnovations.com)
- Email: contact@rdtechinnovations.com
- GitHub: [@rdtechinnovations](https://github.com/rdtechinnovations)

---

<div align="center">
  Made with ❤️ by RD Tech Innovations
</div>
