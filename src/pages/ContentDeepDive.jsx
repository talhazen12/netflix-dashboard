import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function ContentDeepDive({ data }) {
    
    const topGenres = useMemo(() => {
        const counts = {};
        data.forEach(d => {
            d.listed_in.forEach(g => {
                if(g === 'Unknown Genre') return;
                counts[g] = (counts[g] || 0) + 1;
            });
        });
        return Object.keys(counts).map(k => ({ genre: k, count: counts[k] })).sort((a,b) => b.count - a.count).slice(0, 15);
    }, [data]);

    const durationBins = useMemo(() => {
        const bins = { '0-60': 0, '61-90': 0, '91-120': 0, '120+': 0 };
        data.forEach(d => {
            if (d.type === 'Movie' && d.movieDuration) {
                if (d.movieDuration <= 60) bins['0-60']++;
                else if (d.movieDuration <= 90) bins['61-90']++;
                else if (d.movieDuration <= 120) bins['91-120']++;
                else bins['120+']++;
            }
        });
        return Object.keys(bins).map(k => ({ bin: k, count: bins[k] }));
    }, [data]);

    const seasonPie = useMemo(() => {
        const counts = { '1 Season': 0, '2 Seasons': 0, '3+ Seasons': 0 };
        data.forEach(d => {
            if (d.type === 'TV Show' && d.tvDuration) {
                if (d.tvDuration === 1) counts['1 Season']++;
                else if (d.tvDuration === 2) counts['2 Seasons']++;
                else counts['3+ Seasons']++;
            }
        });
        return Object.keys(counts).map(k => ({ name: k, value: counts[k] })).filter(d => d.value > 0);
    }, [data]);

    const topDirectors = useMemo(() => {
        const counts = {};
        data.forEach(d => {
            d.director.forEach(dir => {
                if(dir === 'Unknown Director' || dir === '') return;
                counts[dir] = (counts[dir] || 0) + 1;
            });
        });
        return Object.keys(counts).map(k => ({ name: k, count: counts[k] })).sort((a,b) => b.count - a.count).slice(0,10);
    }, [data]);

    const topActors = useMemo(() => {
        const counts = {};
        data.forEach(d => {
            d.cast.forEach(c => {
                if(c === 'Unknown Cast' || c === '') return;
                counts[c] = (counts[c] || 0) + 1;
            });
        });
        return Object.keys(counts).map(k => ({ name: k, count: counts[k] })).sort((a,b) => b.count - a.count).slice(0, 15);
    }, [data]);

    const COLORS = ['#E50914', '#B3B3B3', '#555555'];

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Content Deep-Dive</h2>
                    <p className="page-subtitle">Analyze genres, durations, and top talent</p>
                </div>
            </div>

            <div className="charts-grid">
                <div className="chart-card full-width">
                    <div className="chart-title">Most Popular Genres</div>
                    <div className="chart-container" style={{minHeight: 250}}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topGenres} margin={{ bottom: 40}}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333"/>
                                <XAxis dataKey="genre" stroke="#B3B3B3" interval={0} angle={-(45)} textAnchor="end"/>
                                <YAxis stroke="#B3B3B3"/>
                                <Tooltip />
                                <Bar dataKey="count" fill="#E50914" radius={[4,4,0,0]}/>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card">
                    <div className="chart-title">Movie Duration Distribution (Mins)</div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={durationBins}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333"/>
                                <XAxis dataKey="bin" stroke="#B3B3B3"/>
                                <YAxis stroke="#B3B3B3"/>
                                <Tooltip />
                                <Bar dataKey="count" fill="#B3B3B3" radius={[4,4,0,0]}/>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card">
                    <div className="chart-title">TV Show Seasons Distribution</div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={seasonPie} innerRadius={60} outerRadius={110} dataKey="value">
                                    {seasonPie.map((entry, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card">
                    <div className="chart-title">Top 10 Directors</div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topDirectors} layout="vertical" margin={{left: 70}}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333"/>
                                <XAxis type="number" stroke="#B3B3B3"/>
                                <YAxis dataKey="name" type="category" stroke="#B3B3B3" width={100}/>
                                <Tooltip />
                                <Bar dataKey="count" fill="#E50914"/>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card">
                    <div className="chart-title">Top 15 Most Frequent Actors</div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topActors} layout="vertical" margin={{left: 80}}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333"/>
                                <XAxis type="number" stroke="#B3B3B3"/>
                                <YAxis dataKey="name" type="category" stroke="#B3B3B3" width={120}/>
                                <Tooltip />
                                <Bar dataKey="count" fill="#B3B3B3"/>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}
