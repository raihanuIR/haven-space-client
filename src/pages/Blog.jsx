import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, User, ArrowRight, Tag, Sparkles } from 'lucide-react';

const Blog = () => {
  const [selectedTag, setSelectedTag] = useState('All');

  const articles = [
    {
      id: 1,
      title: 'Top 7 Things Tenants Must Verify Before Signing a Lease in 2026',
      excerpt: 'From digital escrow deposits to checking utility allocations, here is your essential pre-lease inspection checklist.',
      category: 'Tenant Guide',
      author: 'Marcus Sterling',
      date: 'Oct 8, 2026',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 2,
      title: 'Why Stripe Escrow is Ending Rental Deposit Fraud Once and For All',
      excerpt: 'How modern cryptographic authorization guarantees funds remain protected between tenants and verified landlords.',
      category: 'Fintech & Security',
      author: 'Elena Rostova',
      date: 'Sep 29, 2026',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 3,
      title: 'Maximizing Occupancy Rates: Owner Strategies for High-Demand Metros',
      excerpt: 'Learn how verified photography, fast approvals, and transparent amenities drive premium rental yields.',
      category: 'Property Owners',
      author: 'Michael Vance',
      date: 'Sep 15, 2026',
      readTime: '4 min read',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 4,
      title: 'The Rise of Turnkey Penthouses and Furnished Urban Sanctuaries',
      excerpt: 'Remote tech professionals and digital nomads are reshaping demand for high-end flexible leases in Florida and Texas.',
      category: 'Market Trends',
      author: 'Sarah Jenkins',
      date: 'Aug 22, 2026',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const tags = ['All', 'Tenant Guide', 'Fintech & Security', 'Property Owners', 'Market Trends'];

  const filtered = selectedTag === 'All' ? articles : articles.filter((a) => a.category === selectedTag);

  return (
    <div className="page-wrapper" style={{ padding: '3.5rem 0 5rem 0' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header" style={{ marginBottom: '3rem' }}>
          <span className="badge badge-role" style={{ marginBottom: '0.75rem' }}>
            <BookOpen size={14} /> Rental Insights
          </span>
          <h1 className="section-title">RentalHub Journal & Guides</h1>
          <p className="section-subtitle">
            Expert perspectives on leasing, property management, escrow technology, and residential markets.
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`btn btn-sm ${selectedTag === tag ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)', padding: '0.4rem 1rem' }}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
        }}>
          {filtered.map((article) => (
            <article
              key={article.id}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                <img
                  src={article.image}
                  alt={article.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span className="badge badge-approved" style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                  {article.category}
                </span>
              </div>

              <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} /> {article.date}
                  </span>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>

                <h2 style={{ fontSize: '1.3rem', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                  {article.title}
                </h2>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.5rem', flexGrow: 1 }}>
                  {article.excerpt}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                    <User size={15} color="var(--accent-primary)" />
                    <strong>{article.author}</strong>
                  </div>
                  <Link to="/properties" className="btn btn-outline btn-sm" style={{ gap: '0.35rem' }}>
                    <span>Explore Listings</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
