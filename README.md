# RentalHub - Property Rental & Booking Platform (Client)

A modern, high-converting digital rental marketplace connecting tenants and verified property owners.

## Purpose
Enables tenants to browse verified properties, execute digital reservations with Stripe payments, submit ratings & reviews, and track leases. Provides property owners with automated booking management, performance analytics charts, and listing publishing tools. Delivers administrators full moderation powers over users, properties, and payment transactions.

## Live Deployment
- **Front-End Live URL**: [https://haven-space-client.vercel.app/](https://haven-space-client.vercel.app/)
- **Live API Endpoint**: [https://haven-space-server-theta.vercel.app/api](https://haven-space-server-theta.vercel.app/api)
- **Client Repository**: [https://github.com/raihanuIR/haven-space-client](https://github.com/raihanuIR/haven-space-client)
- **Server Repository**: [https://github.com/raihanuIR/haven-space-server](https://github.com/raihanuIR/haven-space-server)

## Key Features
- **Role-Based Authentication (RBAC)**: Supports Tenant, Owner, and Admin roles with secure JWT validation and Google social login (defaulting role to Tenant).
- **Zero-Flicker Route Guards**: Preserves authenticated state during page reload without kicking users to the login screen.
- **Dynamic Search & Filtering**: Multi-criteria search (Location, Property Type, Min/Max Price) and price sorting executed on the backend.
- **Framer Motion Animations**: Smooth page transitions, animated banner components, and responsive cards.
- **Stripe Secure Payments**: Seamless reservation checkout with instant receipts, transaction history, and celebration confetti.
- **Owner Analytics & Recharts**: 12-month earnings trendline with dynamic revenue summary cards and PDF export capability.
- **Admin Moderation**: Comprehensive listing approval/rejection modal that collects mandatory feedback for owners.
- **Owner Rejection Feedback Viewer**: View button (👁️) in property status column allowing owners to inspect rejection reasons directly.
- **Dark / Light Theme Toggle**: Persistent theme switcher for optimal visual comfort.
- **Social Sharing**: One-click link copying and instant social network distribution.

## NPM Packages Used
- `react` & `react-dom`: Modern React 18 frontend engine.
- `react-router-dom`: Dynamic client-side routing and protected route guards.
- `framer-motion`: Fluid declarative animations for banners and property cards.
- `recharts`: Composable charting library for the 12-month owner earnings line chart.
- `lucide-react`: Crisp modern iconography.
- `axios`: Promise-based HTTP client with Bearer token interceptor.
- `canvas-confetti`: Delightful celebratory feedback on completed Stripe reservations.
- `jspdf` & `jspdf-autotable`: Client-side PDF export of owner earnings reports.
- `firebase`: Authentication provider supporting Google Social Login.
- `@stripe/stripe-js` & `@stripe/react-stripe-js`: Stripe payment integration components.

## Environment Configuration
Create a `.env` file in the `client/` root:
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_51MockPublicKeyForRentalHubPlatform
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

## Running the Application Locally
```bash
npm install
npm run dev
```
Application will be live at `http://localhost:5173`.
