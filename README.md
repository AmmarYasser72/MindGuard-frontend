# MindGuard React Frontend

MindGuard is a React-based mental health support interface for patients and doctors. The application includes onboarding, authentication, patient wellness dashboards, analytics views, guided wellness tools, a NOVA chat experience, and doctor monitoring screens.

This repository contains the frontend application built with Vite, React, and Tailwind CSS.

## Features

- Patient and doctor authentication flows
- Demo login and local fallback storage for development
- Patient dashboard with mood tracking, wellness metrics, goals, and recent activity
- Analytics screens for mood, stress, anxiety, sleep, and depression insights
- patient chat with WebSocket echo fallback behavior
- Doctor dashboard with patient monitoring, sessions, and care workflow screens
- Reusable UI primitives, icons, charts, cards, modals, and toast notifications
- Responsive mobile-first layouts with a bottom navigation experience

## Tech Stack

- React 19
- Tailwind CSS 
- JavaScript 
- Fetch API
- WebSocket API

## Project Structure

```text
src/
  App.jsx                         Route selection and app providers
  main.jsx                        React entry point
  components/
    auth/                         Authentication form components
    common/                       Shared UI primitives, icons, charts, modal, toast
    patient/                      Patient-specific reusable cards and layouts
  data/                           Static dashboard, analytics, onboarding, and doctor data
  hooks/                          Auth and router context hooks
  pages/
    auth/                         Splash, onboarding, sign in, signup pages
    doctor/                       Doctor dashboard
    patient/                      Patient dashboard, analytics, chat, and tool pages
  services/                       Auth, chat, and storage services
  styles/                         Theme tokens and application styles
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Installation

```bash
git clone https://github.com/AmmarYasser72/MindGuard-frontend.git
cd MindGuard-frontend
npm install
```

### Development

```bash
npm run dev
```

The Vite development server runs on:

```text
http://localhost:5173
```

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Available Scripts

```text
npm run dev        Start the local Vite development server
npm run build      Create a production build in dist/
npm run preview    Preview the production build locally
npm run lint       Run ESLint across the project
npm run deploy     Deploy the dist/ folder with gh-pages
```


## Demo Accounts

```text
Patient: patient@demo.com / demo123
Doctor:  doctor@demo.com  / demo123
```

## License

Graduation project by Ammar Yasser.
