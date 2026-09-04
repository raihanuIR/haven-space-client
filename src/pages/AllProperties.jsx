import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, SlidersHorizontal, RotateCcw } from 'lucide-react';
import API from '../services/api';
import PropertyCard from '../components/PropertyCard';
import ShareModal from '../components/ShareModal';
import LoadingSpinner from '../components/LoadingSpinner';

const AllProperties = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [shareProperty, setShareProperty] = useState(null);

  // Filters state (synced with URL search params)
  const locationParam = searchParams.get('location') || '';
  const propertyTypeParam = searchParams.get('propertyType') || 'All';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const sortParam = searchParams.get('sort') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [localLocation, setLocalLocation] = useState(locationParam);
  const [propertyType, setPropertyType] = useState(propertyTypeParam);
  const [sort, setSort] = useState(sortParam);
  const [page, setPage] = useState(pageParam);

  // Fetch properties whenever filter params change (backend-driven search and filtering!)
  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (locationParam) query.set('location', locationParam);
        if (propertyTypeParam && propertyTypeParam !== 'All') query.set('propertyType', propertyTypeParam);
        if (minPriceParam) query.set('minPrice', minPriceParam);
        if (maxPriceParam) query.set('maxPrice', maxPriceParam);
        if (sortParam) query.set('sort', sortParam);
        query.set('page', page.toString());
        query.set('limit', '6'); // 6 per page (3-column grid x 2 rows)

        const { data } = await API.get(`/properties?${query.toString()}`);
        if (data.success) {
          setProperties(data.properties);
          setTotal(data.total);
          setTotalPages(data.totalPages || 1);
        }
      } catch (err) {
        console.error('Fetch all properties error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [locationParam, propertyTypeParam, minPriceParam, maxPriceParam, sortParam, page]);

  // Sync state if URL changes
  useEffect(() => {
    setLocalLocation(locationParam);
    setPropertyType(propertyTypeParam);
    setSort(sortParam);
    setPage(pageParam);
  }, [searchParams]);

  const updateFilters = (newParams) => {
    const current = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([k, v]) => {
      if (v && v !== 'All') {
        current.set(k, v);
      } else {
        current.delete(k);
      }
    });
    // Reset to page 1 on filter changes unless page itself is changed
    if (!newParams.page) {
      current.set('page', '1');
      setPage(1);
    }
    setSearchParams(current);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilters({ location: localLocation });
  };

  const handleResetFilters = () => {
    setLocalLocation('');
    setPropertyType('All');
    setSort('');
    setPage(1);
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="page-wrapper" style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        {/* Page Title */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>Browse All Properties</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Discover and reserve verified approved rentals matching your exact lifestyle and budget.
          </p>
        </div>

        {/* Filter Bar */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          marginBottom: '2.5rem',
          boxShadow: 'var(--shadow-md)',
        }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr auto auto', gap: '1rem', alignItems: 'flex-end' }}>
            {/* Search by location */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Search Location</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="City, state, or neighborhood..."
                  className="form-input"
                  value={localLocation}
                  onChange={(e) => setLocalLocation(e.target.value)}
                />
              </div>
            </div>

            {/* Filter by Property Type */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Property Type</label>
              <select
                className="form-select"
                value={propertyType}
                onChange={(e) => {
                  setPropertyType(e.target.value);
                  updateFilters({ propertyType: e.target.value });
                }}
              >
                <option value="All">All Types</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Villa">Villa</option>
                <option value="Studio">Studio</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Condo">Condo</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Sort by Price</label>
              <select
                className="form-select"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  updateFilters({ sort: e.target.value });
                }}
              >
                <option value="">Default (Newest)</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            {/* Search Submit */}
            <button type="submit" className="btn btn-primary" style={{ height: '46px' }}>
              <Search size={18} />
              <span>Apply</span>
            </button>

            {/* Reset Button */}
            <button
              type="button"
              onClick={handleResetFilters}
              className="btn btn-secondary"
              style={{ height: '46px' }}
              title="Clear all filters"
            >
              <RotateCcw size={18} />
            </button>
          </form>
        </div>

        {/* Results Metadata */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Showing <strong>{properties.length}</strong> of <strong>{total}</strong> approved listings
          </p>
          {locationParam && (
            <span className="badge badge-role">
              Filtered by: "{locationParam}"
            </span>
          )}
        </div>

        {/* 3-Column Grid Layout */}
        {loading ? (
          <LoadingSpinner text="Searching available properties..." />
        ) : properties.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '5rem 2rem',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
          }}>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>No listings matched your criteria</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Try adjusting your search location, clearing filters, or browsing other property types.
            </p>
            <button onClick={handleResetFilters} className="btn btn-primary">
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="properties-grid">
            {properties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                onShare={(p) => setShareProperty(p)}
              />
            ))}
          </div>
        )}

        {/* Challenge Requirement: Pagination Controls */}
        {totalPages > 1 && (
          <div className="pagination-container">
            <button
              className="page-btn"
              disabled={page <= 1}
              onClick={() => {
                const nextP = page - 1;
                setPage(nextP);
                updateFilters({ page: nextP.toString() });
              }}
              title="Previous Page"
            >
              <ChevronLeft size={18} />
            </button>

            {[...Array(totalPages)].map((_, i) => {
              const pNum = i + 1;
              return (
                <button
                  key={pNum}
                  className={`page-btn ${page === pNum ? 'active' : ''}`}
                  onClick={() => {
                    setPage(pNum);
                    updateFilters({ page: pNum.toString() });
                  }}
                >
                  {pNum}
                </button>
              );
            })}

            <button
              className="page-btn"
              disabled={page >= totalPages}
              onClick={() => {
                const nextP = page + 1;
                setPage(nextP);
                updateFilters({ page: nextP.toString() });
              }}
              title="Next Page"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Share Modal */}
      <ShareModal
        property={shareProperty}
        isOpen={!!shareProperty}
        onClose={() => setShareProperty(null)}
      />
    </div>
  );
};

export default AllProperties;
