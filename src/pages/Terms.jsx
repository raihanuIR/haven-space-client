import React from 'react';
import { Shield, FileText, CheckCircle2 } from 'lucide-react';

const Terms = () => {
  return (
    <div className="page-wrapper" style={{ padding: '4rem 0 5rem 0' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="badge badge-approved" style={{ marginBottom: '0.75rem' }}>
            <FileText size={14} /> Legal & Privacy Framework
          </span>
          <h1 style={{ fontSize: '2.4rem', marginBottom: '1rem' }}>Terms of Service & Privacy Policy</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Last revised: October 1, 2026 • Governing platform guidelines for Tenants and Property Owners
          </p>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: 'clamp(1.5rem, 5vw, 3rem)',
          boxShadow: 'var(--shadow-md)',
          lineHeight: 1.8,
          color: 'var(--text-secondary)',
        }}>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>1. Platform Purpose & Scope</h2>
          <p style={{ marginBottom: '1.75rem' }}>
            RentalHub operates as an intermediary marketplace connecting prospective tenants with verified residential property owners. All listings submitted by owners are subject to administrative audit before publication.
          </p>

          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>2. Stripe Escrow & Reservation Deposits</h2>
          <p style={{ marginBottom: '1.75rem' }}>
            Reservation payments conducted through RentalHub are handled via cryptographic tokenization using Stripe. Funds are held in escrow pending booking confirmation by the designated property owner. In the event of a listing cancellation or administrative rejection, funds are returned immediately.
          </p>

          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>3. Privacy, Data Collection & Cookies</h2>
          <p style={{ marginBottom: '1.75rem' }}>
            We only collect personal information necessary to facilitate lease inquiries, account authentication (including Google Firebase OAuth), and payment transaction processing. We do not sell or monetize personal identity data.
          </p>

          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>4. Tenant & Owner Obligations</h2>
          <p style={{ marginBottom: '1rem' }}>
            Both property owners and tenants agree to maintain accurate identity credentials, provide truthful descriptions and photography, and respect local tenancy legislation.
          </p>

          <div style={{
            background: 'var(--bg-secondary)',
            borderLeft: '4px solid var(--accent-primary)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
            marginTop: '2rem',
          }}>
            <strong style={{ color: 'var(--text-primary)' }}>Questions about our policies?</strong> Contact our legal team at <a href="mailto:legal@rentalhub.com" style={{ color: 'var(--accent-primary)' }}>legal@rentalhub.com</a>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
