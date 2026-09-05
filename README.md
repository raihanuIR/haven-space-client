# 🏡 RentalHub — Property Rental & Booking Platform (Client)

[![React](https://img.shields.io/badge/React-18.3.1-61dafb?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React Router](https://img.shields.io/badge/React_Router-6.26.1-ca4245?logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.3.31-0055ff?logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Recharts](https://img.shields.io/badge/Recharts-2.12.7-22b5bf)](https://recharts.org/)
[![Stripe](https://img.shields.io/badge/Stripe-Integration-635bff?logo=stripe&logoColor=white)](https://stripe.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-ffca28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?logo=vercel&logoColor=white)](https://haven-space-client.vercel.app/)

A premier, high-converting digital rental marketplace connecting discerning tenants with verified property owners. Designed with modern aesthetics, dark/light themes, fluid micro-animations, and full multi-device responsiveness.

---

## 🌐 Live Deployment & Repositories

- **Front-End Live Application**: [https://haven-space-client.vercel.app/](https://haven-space-client.vercel.app/)
- **Live Backend API**: [https://haven-space-server-theta.vercel.app/api](https://haven-space-server-theta.vercel.app/api)
- **Client GitHub Repository**: [https://github.com/raihanuIR/haven-space-client](https://github.com/raihanuIR/haven-space-client)
- **Server GitHub Repository**: [https://github.com/raihanuIR/haven-space-server](https://github.com/raihanuIR/haven-space-server)

---

## 🔑 Demo Access Credentials

The platform includes pre-seeded accounts across all three user tiers. You can log in manually or use the 1-click fill buttons directly on the **[Login Page](https://haven-space-client.vercel.app/login)**:

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@rentalhub.com` | `AdminPassword123!` | System-wide moderation, change user roles, approve/reject properties with feedback modal, audit paginated bookings and payments. |
| **Owner** | `owner@rentalhub.com` | `OwnerPassword123!` | 12-Month Recharts earnings line chart, Download Earnings PDF, publish new listings, view rejection feedback (👁️), approve/reject booking requests. |
| **Tenant** | `tenant@rentalhub.com` | `TenantPassword123!` | Browse catalog, filter & sort listings, bookmark favorites, reserve properties via Stripe with confetti celebration, submit ratings & reviews. |

---

## 🎯 Purpose & Scope

RentalHub simplifies the end-to-end residential leasing journey. Tenants discover verified listings, make digital reservations with secure Stripe checkout, and track their lease agreements. Property owners gain automated tenant management, transparent financial earnings visualization, and effortless property publishing. Administrators maintain platform integrity through user role controls and transparent listing moderation.

---

## ✨ Key Features Breakdown

### 1. Authentication & Role-Based Access Control (RBAC)
- **JWT Authentication**: Persistent session management backed by Bearer token authorization.
- **Role Enforcement**: Distinct workflows and dashboards for `Tenant`, `Owner`, and `Admin`.
- **Google Social Login**: Firebase Google OAuth integration automatically assigning new users to the `Tenant` role.
- **Zero-Flicker Route Guards**: Deep state reload preservation ensures authenticated users are never booted back to the login screen on refresh.
- **Smart Auth Redirects**: Already signed-in users navigating to `/login` or `/register` are automatically directed to their respective dashboards.

### 2. Public Discovery & Catalog
- **Banner & Hero Section**: Animated hero layout with fluid Framer Motion entrance effects and high-resolution visuals.
- **Multi-Field Search**: Real-time filtering by Location, Property Type, Minimum Price, and Maximum Price.
- **6 Featured Properties**: Limit-enforced backend query with guest login redirects (guests clicking "View Details" are directed to Login; authenticated users go directly to the details page).
- **Why Choose Us & Testimonials**: Highlight benefit cards and verified customer reviews.
- **2 Custom Sections**:
  - *Top Rental Destinations*: Highlighting Miami, New York, Los Angeles, and Austin.
  - *Platform Market Insights*: Real-time statistics on active leases, tenant ratings, and verified owners.
- **All Properties Catalog**: 3-column responsive grid with backend search, type filtering, sorting (Price Low-to-High, High-to-Low, Newest), and server-side pagination.

### 3. Property Details Page (Private Route)
- **High-Res Photo Gallery**: Interactive thumbnail switcher with responsive viewport scaling.
- **Architectural Specs**: Comprehensive breakdown of bedrooms, bathrooms, living area, and billing cycle.
- **Amenities & Extra Features**: Badges for pool, gym, parking, pet allowance, EV charging, etc.
- **Bookmark / Favorites**: Persisted in the database and accessible via the tenant dashboard.
- **Stripe Checkout Simulation**: Complete reservation flow with instant payment processing, celebratory confetti, and automated audit trail generation.
- **Ratings & Reviews**: Star-rating selector allowing tenants to publish feedback.

### 4. Role Dashboards
- **Tenant Dashboard**:
  - *My Bookings*: Comprehensive table showing Property Image, Name, Dates, Amount Paid, Booking Status, and Payment Status.
  - *Saved Favorites*: Bookmarked listings with quick navigation and deletion actions.
  - *Profile Management*: Real-time profile name and avatar updates.
- **Owner Dashboard**:
  - *Analytics Tab*: 3 Summary KPI cards (Total Earnings, Total Properties, Total Bookings) + **Recharts 12-Month Line Chart** + **Download Earnings PDF** button.
  - *Add Property*: Full form validating Title, Description, Location, Type, Rent, Billing Cycle, Specs, Amenities, and Image URLs (defaults to `Pending`).
  - *My Properties*: Management table with status badges (`Pending`, `Approved`, `Rejected`), delete action, and the **👁️ view button** to inspect admin rejection feedback.
  - *Booking Requests*: Moderation table with instant Approve and Reject controls.
- **Admin Dashboard**:
  - *All Users*: User roster with instant role dropdown updates (`Tenant`, `Owner`, `Admin`).
  - *All Properties*: Approve, Reject (with mandatory feedback modal), and Delete actions.
  - *All Bookings*: Paginated system-wide booking monitoring.
  - *Financial Transactions*: Paginated audit trail showing Transaction ID, Property, Tenant, Owner, Amount, and Date.

### 5. Challenge & Optional Requirements
- [x] **JWT Token Middleware**: Protected private routes across all API endpoints.
- [x] **Multi-Page Pagination**: Implemented on All Properties, Admin Bookings, and Admin Transactions.
- [x] **Backend Search & Filtering**: All queries executed on the MongoDB / Express backend.
- [x] **Owner Rejection Feedback View (👁️)**: Owners inspect admin feedback directly from their property table.
- [x] **Download Monthly Earnings Report (PDF)**: Built with `jspdf` and `jspdf-autotable`.
- [x] **Dark / Light Theme Toggle**: Persistent theme switcher for optimal day and night viewing.
- [x] **Share Property**: Copy-link button + direct sharing to X (Twitter), WhatsApp, and LinkedIn.
- [x] **Rebranded X Logo**: Implemented in Footer and Share dialogs.
- [x] **Full Device Responsiveness**: Fluid layouts supporting Mobile ($\le 480\text{px}$, $\le 640\text{px}$), Tablet ($\le 768\text{px}$, $\le 1024\text{px}$), and Desktop.

---

## 📱 Responsive Design System

The application features a responsive design architecture:
- **Extra Small Mobile ($\le 480\text{px}$)**: Fluid containers with `clamp()` paddings, single-column forms, touch-friendly tap targets, and condensed specs cards.
- **Mobile ($\le 640\text{px}$)**: Collapsible navbar with slide-down drawer, stacked search inputs, auto-wrapping footer, and horizontal touch-scrollable data tables.
- **Tablet ($\le 768\text{px}$ / $\le 1024\text{px}$)**: 2-column property catalogs, stacked property details view, and dashboard sidebar transforming into a horizontal scrollable tab strip.
- **Desktop ($> 1024\text{px}$)**: Expansive multi-column layouts, sticky booking sidebar, and wide data presentation tables.

---

## 📦 NPM Packages Used

| Package | Version | Purpose |
| :--- | :--- | :--- |
| `react` & `react-dom` | `^18.3.1` | Core declarative user interface library. |
| `vite` | `^5.4.2` | Fast build tool and development server. |
| `react-router-dom` | `^6.26.1` | Client-side routing, query parameter handling, and private route guards. |
| `framer-motion` | `^11.3.31` | Smooth entrance animations and card hover transitions. |
| `recharts` | `^2.12.7` | Responsive 12-month earnings trendline visualization. |
| `lucide-react` | `^0.439.0` | Crisp, modern iconography. |
| `axios` | `^1.7.7` | HTTP client with automatic Bearer token injection. |
| `canvas-confetti` | `^1.9.3` | Celebratory visual feedback on completed reservations. |
| `jspdf` & `jspdf-autotable` | `^2.5.1` / `^3.8.3` | Client-side PDF generation for monthly earnings reports. |
| `firebase` | `^10.13.1` | Google OAuth social login provider. |
| `@stripe/stripe-js` | `^4.4.0` | Secure Stripe payment workflow integration. |

---

## 🛠️ Environment Configuration

Create a `.env` file inside the `client/` root directory:

```env
# Backend API Base URL
VITE_API_URL=https://haven-space-server-theta.vercel.app/api

# Stripe Publishable Key
VITE_STRIPE_PUBLIC_KEY=pk_test_51MockPublicKeyForRentalHubPlatform

# Firebase Authentication Config
VITE_FIREBASE_API_KEY=AIzaSyCktchvQqak0cPn9ZMhxmxdEtnV2O6hnK8
VITE_FIREBASE_AUTH_DOMAIN=haven-space-ed64d.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=haven-space-ed64d
VITE_FIREBASE_STORAGE_BUCKET=haven-space-ed64d.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=99907910586
VITE_FIREBASE_APP_ID=1:99907910586:web:0beeb3e7f055c646c87b83
```

---

## 💻 Local Setup & Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/raihanuIR/haven-space-client.git
   cd haven-space-client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the Vite development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```
