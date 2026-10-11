import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import AllProperties from './pages/AllProperties';
import PropertyDetails from './pages/PropertyDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import TenantDashboard from './pages/TenantDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/properties" element={<AllProperties />} />
                {/* Property Details: Publicly Accessible per Remontada Specification */}
                <Route path="/properties/:id" element={<PropertyDetails />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Terms />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Dashboards (Role-Based Protected Routes) */}
                <Route
                  path="/dashboard/tenant"
                  element={
                    <PrivateRoute allowedRoles={['Tenant', 'User', 'Admin']}>
                      <TenantDashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/dashboard/user"
                  element={
                    <PrivateRoute allowedRoles={['Tenant', 'User', 'Admin']}>
                      <TenantDashboard />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/dashboard/owner"
                  element={
                    <PrivateRoute allowedRoles={['Owner', 'Admin']}>
                      <OwnerDashboard />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/dashboard/admin"
                  element={
                    <PrivateRoute allowedRoles={['Admin']}>
                      <AdminDashboard />
                    </PrivateRoute>
                  }
                />

                {/* Common Profile Route */}
                <Route
                  path="/dashboard/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />

                {/* 404 Error Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
