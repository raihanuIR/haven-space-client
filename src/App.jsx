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
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Property Details (Private Route per assignment specifications) */}
                <Route
                  path="/properties/:id"
                  element={
                    <PrivateRoute>
                      <PropertyDetails />
                    </PrivateRoute>
                  }
                />

                {/* Dashboards (Role-Based Protected Routes) */}
                <Route
                  path="/dashboard/tenant"
                  element={
                    <PrivateRoute allowedRoles={['Tenant', 'Admin']}>
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
