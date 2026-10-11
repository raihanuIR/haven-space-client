# Property Rental & Booking Platform (RentalHub) - Frontend Client

An end-to-end full-stack property rental and leasing platform developed with React 18, Vite, React Router DOM 6, custom Vanilla CSS design tokens, Stripe payment gateway, and Firebase Google authentication. Fully upgraded according to the **Remontada Project Update** specifications.

---

## 🌐 Live Deployment & Repositories

| Entity | Live Link / Repository |
| :--- | :--- |
| **Front-End Live Application** | [https://haven-space-client.vercel.app/](https://haven-space-client.vercel.app/) |
| **Backend REST API Endpoint** | [https://haven-space-server-theta.vercel.app/api](https://haven-space-server-theta.vercel.app/api) |
| **Client Repository (GitHub)** | [https://github.com/raihanuIR/haven-space-client](https://github.com/raihanuIR/haven-space-client) |
| **Server Repository (GitHub)** | [https://github.com/raihanuIR/haven-space-server](https://github.com/raihanuIR/haven-space-server) |

---

## 🔑 Demo Account Credentials

| Role | Email Address | Password | Permissions & Dashboard |
| :--- | :--- | :--- | :--- |
| **User / Tenant** | `tenant@rentalhub.com` | `TenantPassword123!` | Book properties, Stripe deposit payment, add favorites, view spending trends, update password |
| **Admin** | `admin@rentalhub.com` | `AdminPassword123!` | Executive overview with Bar/Line/Pie Recharts, manage users & properties, audit inquiries & transactions |
| **Owner** | `owner@rentalhub.com` | `OwnerPassword123!` | Publish listings, view 12-month earnings chart, download PDF, approve/reject requests |

> **Note:** The login page (`/login`) includes **1-Click Auto-Fill Demo Login buttons** for instant, frictionless sign-in for Demo User, Demo Admin, and Demo Owner.

---

## 🏆 Remontada Upgrade Specifications Checklist

- [x] **Global UI & Design System**: 4px/8px spacing grid, unified border-radius (`var(--radius-lg)`), light & dark mode theme switcher with high-contrast palette.
- [x] **Reusable UI Component Suite**: Dedicated reusable components created in `src/components/ui/` (`Button`, `Input`, `Card`, `Badge`, `Modal`, `Table`, `Dropdown`, `SkeletonCard`).
- [x] **Navbar Navigation & Profile Dropdown**:
  - Logged-out navigation: 5 routes (`Home`, `Explore`, `About`, `Blog`, `Contact`) + Auth buttons.
  - Logged-in navigation: 6 routes (`Home`, `Explore`, `Dashboard`, `About`, `Blog`, `Contact`) + Interactive Profile dropdown menu (with name, role badge, dashboard, profile, settings, and sign-out).
  - Responsive hamburger drawer navigation on mobile.
- [x] **Landing / Home Page (9 Meaningful Sections)**:
  1. *Hero Section*: Viewport height bounded to 65vh with multi-criteria search and interactive escrow counter.
  2. *Dynamic Platform Statistics*: Live metrics fetched from backend (`/api/properties/stats/summary`).
  3. *Featured Properties*: 4-column responsive desktop grid with animated `SkeletonCard` loading states.
  4. *Property Architecture & Typology*: Apartments, Luxury Villas, Penthouses, Urban Studios with direct catalog filters.
  5. *Core Trust Features*: Identity verification, instant escrow, transparent pricing, authentic reviews.
  6. *How It Works*: Dual interactive tabs for Tenants and Property Owners.
  7. *Top Metropolitan Destinations*: Miami, Austin, San Francisco, New York.
  8. *Customer Reviews & Ratings*: Authentic star testimonials fetched from backend.
  9. *FAQ Accordion & Newsletter Digest*: Interactive collapsible questions with zero placeholder text.
- [x] **Core Listing & 4-Column Grid**: Desktop grid configured to 4 cards per row (`repeat(4, 1fr)`), featuring cover image, title, short description snippet, specifications, rating, and "View Details".
- [x] **Public Details Page**: `/properties/:id` is publicly accessible without requiring login. Features multi-image gallery, specs, reviews, and a **Related Properties** recommendation carousel.
- [x] **Authentication & 1-Click Demo Login**: JWT authentication, bcrypt password hashing, token expiration, and 1-click Demo buttons on `/login`.
- [x] **Role-Based User Dashboard (4 Menu Items)**:
  - *Overview*: Dynamic stats cards and Recharts lease spending trend area chart.
  - *My Bookings*: Filterable reservation table with move-in dates, status badges, and details links.
  - *My Favorites*: Bookmarked property management with remove action.
  - *Settings*: Profile editing and embedded password update.
- [x] **Role-Based Admin Dashboard (7 Menu Items & 3 Recharts)**:
  - *Overview*: 4 dynamic metrics cards + 3 Recharts (Bar, Line, Pie charts).
  - *Manage Users*: Directory with role selector (Tenant / Owner / Admin) and search.
  - *Manage Items*: Property moderation (Approve, Reject with Feedback modal, Delete, View).
  - *Reports*: Audited bookings and financial transactions tables with pagination.
  - *Categories*: Typology breakdown and counts.
  - *Inquiries*: Customer contact message management with status toggle (Unread, Read, Replied).
  - *Settings*: System configuration (Stripe mode, auto-moderation, fee percent).
- [x] **Additional Informational Pages**:
  - `/about`: Platform mission, architectural standards, milestones, and team.
  - `/contact`: Interactive form connected to MongoDB database (`POST /api/contact`) with validation and instant alerts.
  - `/blog`: Rental market journal with category filters and guides.
  - `/terms`: Legal terms of service and privacy framework.
- [x] **Profile Password Update**: Form in `/dashboard/profile` connected to `PUT /api/auth/change-password`.

---

## 🛠️ Technology Stack

- **Core**: React 18, Vite, React Router DOM 6
- **Styling**: Vanilla CSS, Custom Design System Tokens, CSS Grid & Flexbox, Glassmorphism
- **Animations**: Framer Motion, Canvas Confetti
- **Data & APIs**: Axios with Bearer token interceptor
- **Payments**: `@stripe/stripe-js`, `@stripe/react-stripe-js`
- **Auth**: Firebase Google Authentication, JWT sessions
- **Reporting & Charts**: Recharts, jsPDF, jspdf-autotable
- **Icons**: Lucide React
