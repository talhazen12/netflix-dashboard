import React, { useState, useEffect, useMemo } from 'react';
import { parseData } from './utils/dataParser';
import { LayoutDashboard, Globe, Film, Activity } from 'lucide-react';
import ExecutiveOverview from './pages/ExecutiveOverview';
import GeographicAnalysis from './pages/GeographicAnalysis';
import ContentDeepDive from './pages/ContentDeepDive';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Filters
  const [typeFilter, setTypeFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');

  useEffect(() => {
    parseData().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      if (typeFilter !== 'All' && item.type !== typeFilter) return false;
      if (yearFilter !== 'All' && item.release_year?.toString() !== yearFilter) return false;
      if (ratingFilter !== 'All' && item.rating !== ratingFilter) return false;
      return true;
    });
  }, [data, typeFilter, yearFilter, ratingFilter]);

  const uniqueYears = useMemo(() => {
    const years = new Set(data.map(d => d.release_year).filter(Boolean));
    return Array.from(years).sort((a,b)=>b-a);
  }, [data]);

  const uniqueRatings = useMemo(() => {
    const ratings = new Set(data.map(d => d.rating).filter(Boolean));
    return Array.from(ratings).sort();
  }, [data]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <h2>Loading Netflix Datasets...</h2>
      </div>
    );
  }

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="logo">NETFLIX VIS</div>
        <div className="nav-links">
          <div className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <LayoutDashboard size={20} />
            Executive Overview
          </div>
          <div className={`nav-item ${activeTab === 'geographic' ? 'active' : ''}`} onClick={() => setActiveTab('geographic')}>
            <Globe size={20} />
            Geographical
          </div>
          <div className={`nav-item ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>
            <Film size={20} />
            Content Deep-Dive
          </div>
        </div>

        <div className="filter-group" style={{marginTop: 'auto'}}>
          <span className="filter-label" style={{color: 'var(--accent-red)'}}><Activity size={12} style={{display:'inline', marginRight: 4}}/>Live Dataset Info</span>
          <p style={{fontSize: '0.8rem', color: '#888'}}>Analyzing elements in real-time</p>
        </div>
      </aside>

      <main className="main-content">
        <div className="filters-bar">
          <div className="filter-group">
            <span className="filter-label">Content Type</span>
            <select className="filter-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="All">All Types</option>
              <option value="Movie">Movies</option>
              <option value="TV Show">TV Shows</option>
            </select>
          </div>
          <div className="filter-group">
            <span className="filter-label">Release Year</span>
            <select className="filter-select" value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
              <option value="All">All Years</option>
              {uniqueYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <span className="filter-label">Content Rating</span>
            <select className="filter-select" value={ratingFilter} onChange={e => setRatingFilter(e.target.value)}>
              <option value="All">All Ratings</option>
              {uniqueRatings.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div style={{marginLeft: 'auto', textAlign: 'right'}}>
            <h3 style={{fontSize: '1.2rem', color: 'white'}}>{filteredData.length.toLocaleString()} Titles</h3>
          </div>
        </div>

        {activeTab === 'overview' && <ExecutiveOverview data={filteredData} rawData={data} />}
        {activeTab === 'geographic' && <GeographicAnalysis data={filteredData} />}
        {activeTab === 'content' && <ContentDeepDive data={filteredData} />}

      </main>
    </div>
  );
}

export default App;
