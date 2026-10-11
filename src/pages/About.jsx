import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, Users, Sparkles, Building2, CheckCircle2, HeartHandshake, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const milestones = [
    { year: '2023', title: 'Platform Launch', desc: 'Introduced transparent, escrow-backed leasing for urban rentals.' },
    { year: '2024', title: 'Verified Owners Network', desc: 'Reached 1,000+ verified listings across Miami, Austin, and New York.' },
    { year: '2025', title: 'Stripe Escrow Integration', desc: 'Processed over $4M in secure deposit transactions with 0% payment fraud.' },
    { year: '2026', title: 'Next-Gen RentalHub', desc: 'Expanding to nationwide smart-leasing with real-time analytics.' },
  ];

  const team = [
    { name: 'Marcus Sterling', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', bio: 'Former real estate developer dedicated to modernizing tenant rights.' },
    { name: 'Elena Rostova', role: 'Head of Product & Security', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', bio: 'Specialized in escrow workflows and zero-friction digital transactions.' },
    { name: 'Derrick Vance', role: 'Operations & Compliance', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', bio: 'Directs the 100% human-verified inspection and moderation team.' },
  ];

  return (
    <div className="page-wrapper" style={{ paddingBottom: '5rem' }}>
      {/* Hero Header */}
      <section style={{
        padding: '5rem 0 4rem 0',
        background: 'radial-gradient(circle at 50% 20%, rgba(79, 70, 229, 0.12) 0%, transparent 60%)',
        textAlign: 'center',
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="badge badge-role" style={{ marginBottom: '1rem' }}>
            <Sparkles size={14} /> Our Mission
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', marginBottom: '1.25rem' }}>
            Revolutionizing Urban Living with <span className="gradient-text">Trust and Clarity</span>
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
            RentalHub was created to eliminate the traditional frictions of property leasing. By combining strict identity verification, automated Stripe reservation deposits, and transparent tenant reviews, we make finding your next home effortless.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div className="section-header">
            <span className="badge badge-approved" style={{ marginBottom: '0.75rem' }}>Core Tenets</span>
            <h2 className="section-title">Built On Uncompromising Standards</h2>
            <p className="section-subtitle">Every decision we make prioritizes integrity, safety, and mutual respect.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <ShieldCheck size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>100% Verified Listings</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Every single property must pass administrative moderation before appearing on our catalog.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <HeartHandshake size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Stripe Buyer Protection</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Deposit payments remain protected under cryptographic security until booking agreements are approved.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Award size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Zero Hidden Markups</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No surprise administrative fees or broker commissions. Total price transparency from the first view.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Globe size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Real Tenant Feedback</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Reviews are posted by authentic verified residents who completed real lease terms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Milestones */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container" style={{ maxWidth: '860px' }}>
          <div className="section-header">
            <span className="badge badge-role" style={{ marginBottom: '0.75rem' }}>Our Journey</span>
            <h2 className="section-title">Evolution of RentalHub</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {milestones.map((m, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '1.75rem',
                  alignItems: 'flex-start',
                  background: 'var(--bg-card)',
                  padding: '1.75rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div style={{
                  background: 'var(--accent-gradient)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  minWidth: '75px',
                  textAlign: 'center',
                }}>
                  {m.year}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.35rem' }}>{m.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="section-header">
            <span className="badge badge-approved" style={{ marginBottom: '0.75rem' }}>The Team</span>
            <h2 className="section-title">Passionate Industry Experts</h2>
            <p className="section-subtitle">Dedicated engineers, property specialists, and support coordinators.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
            {team.map((member, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2rem',
                  textAlign: 'center',
                }}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    margin: '0 auto 1.25rem auto',
                    border: '3px solid var(--accent-primary)',
                  }}
                />
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{member.name}</h3>
                <span className="badge badge-role" style={{ marginBottom: '0.75rem' }}>{member.role}</span>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>{member.bio}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <Link to="/contact" className="btn btn-primary btn-lg">
              Get in Touch with Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
