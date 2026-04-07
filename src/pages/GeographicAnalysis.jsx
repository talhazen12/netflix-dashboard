import React, { useMemo } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

export default function GeographicAnalysis({ data }) {
    
    const countryData = useMemo(() => {
        const counts = {};
        data.forEach(d => {
            d.country.forEach(c => {
                if(c === 'Unknown Country' || c === '') return;
                if (!counts[c]) counts[c] = { country: c, Movie: 0, 'TV Show': 0, total: 0 };
                counts[c][d.type] += 1;
                counts[c].total += 1;
            });
        });
        return Object.values(counts).sort((a,b) => b.total - a.total).slice(0, 10);
    }, [data]);

    const ratingData = useMemo(() => {
        const counts = {};
        data.forEach(d => {
            const r = d.rating || 'Unknown';
            if (!counts[r]) counts[r] = { rating: r, total: 0, Movie: 0, 'TV Show': 0 };
            counts[r].total += 1;
            counts[r][d.type] += 1;
        });
        return Object.values(counts).sort((a,b) => b.total - a.total).slice(0,10);
    }, [data]);

    const ratingStacked = useMemo(() => {
        return ratingData.map(d => {
            const total = d.Movie + d['TV Show'];
            return {
                rating: d.rating,
                Movie: (d.Movie / total * 100).toFixed(1),
                'TV Show': (d['TV Show'] / total * 100).toFixed(1)
            }
        });
    }, [ratingData]);

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Geographic & Audience</h2>
                    <p className="page-subtitle">Understand content footprint and target demographics</p>
                </div>
            </div>

            <div className="charts-grid">
                <div className="chart-card full-width">
                    <div className="chart-title">Global Footprint (Preview)</div>
                    <div style={{width: '100%', height: '400px', backgroundColor: '#111', borderRadius: '8px', overflow:'hidden'}}>
                        <ComposableMap projectionConfig={{ scale: 140 }}>
                            <Geographies geography={geoUrl}>
                                {({ geographies }) =>
                                geographies.map(geo => (
                                    <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    fill="#333"
                                    stroke="#555"
                                    style={{
                                        default: { outline: "none" },
                                        hover: { fill: "#E50914", outline: "none" },
                                        pressed: { fill: "#ff4d4d", outline: "none" },
                                    }}
                                    />
                                ))
                                }
                            </Geographies>
                        </ComposableMap>
                    </div>
                </div>

                <div className="chart-card">
                    <div className="chart-title">Top 10 Countries by Content</div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={countryData} layout="vertical" margin={{ left: 50 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis type="number" stroke="#B3B3B3"/>
                                <YAxis dataKey="country" type="category" stroke="#B3B3B3" width={80}/>
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Movie" stackId="a" fill="#E50914" />
                                <Bar dataKey="TV Show" stackId="a" fill="#555555" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card">
                    <div className="chart-title">Target Audience (Rating Dist.)</div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ratingData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333"/>
                                <XAxis dataKey="rating" stroke="#B3B3B3"/>
                                <YAxis stroke="#B3B3B3"/>
                                <Tooltip />
                                <Bar dataKey="total" fill="#E50914" radius={[4,4,0,0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card full-width">
                    <div className="chart-title">Rating by Type (100% Stacked)</div>
                    <div className="chart-container" style={{minHeight: 300}}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ratingStacked}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333"/>
                                <XAxis dataKey="rating" stroke="#B3B3B3"/>
                                <YAxis stroke="#B3B3B3" tickFormatter={(tick) => `${tick}%`}/>
                                <Tooltip formatter={(value) => `${value}%`} />
                                <Legend />
                                <Bar dataKey="Movie" stackId="a" fill="#E50914" />
                                <Bar dataKey="TV Show" stackId="a" fill="#555555" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
