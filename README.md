# MindGuard Frontend

MindGuard is a React-based mental health support interface designed for both patients and doctors. The application includes onboarding, authentication, patient wellness dashboards, analytics views, guided wellness tools, a chat experience, and doctor monitoring screens.

Live demo: https://mind-guard-frontend-zeta.vercel.app

## Tech Stack
- React 19
- Vite
- Tailwind CSS
- JavaScript
- Fetch API

## Features
- Patient and doctor authentication flows
- Backend-connected authentication against the local Nest API
- Patient dashboard with mood tracking, wellness metrics, goals, and recent activity
- Analytics screens for mood, stress, anxiety, sleep, and depression insights
- Patient chat with backend history bootstrap and local reply fallback
- Doctor dashboard with patient monitoring, sessions, and care workflow screens
- Reusable UI primitives, charts, cards, modals, and toast notifications
- Responsive mobile-first layouts

## Project Structure
`	ext
src/
  App.jsx
  main.jsx
  components/
  data/
  hooks/
  pages/
  services/
  styles/
`

## Getting Started
### Prerequisites
- Node.js 18 or newer
- npm

### Installation
`ash
git clone https://github.com/AmmarYasser72/MindGuard-frontend.git
cd MindGuard-frontend
npm install
`

### Development
`ash
npm run dev
`

### Production Build
`ash
npm run build
npm run preview
`

## Available Scripts
`	ext
npm run dev
npm run build
npm run preview
npm run lint
npm run deploy
`

## Demo Accounts
`	ext
Patient: patient@demo.com / demo123
Doctor:  doctor@demo.com  / demo123
`

## License
MIT