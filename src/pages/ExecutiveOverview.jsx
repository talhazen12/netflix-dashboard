import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter, Legend } from 'recharts';

export default function ExecutiveOverview({ data, rawData }) {
    const kpis = useMemo(() => {
        const total = data.length;
        const movies = data.filter(d => d.type === 'Movie').length;
        const shows = data.filter(d => d.type === 'TV Show').length;
        
        const genres = new Set();
        data.forEach(d => d.listed_in.forEach(g => genres.add(g)));
        
        const countries = new Set();
        data.forEach(d => d.country.forEach(c => countries.add(c)));

        return { total, movies, shows, uniqueGenres: genres.size, uniqueCountries: countries.size };
    }, [data]);

    const pieData = useMemo(() => {
        return [
            { name: 'Movies', value: kpis.movies },
            { name: 'TV Shows', value: kpis.shows }
        ];
    }, [kpis]);

    const COLORS = ['#E50914', '#555555'];

    const growthData = useMemo(() => {
        const counts = {};
        data.forEach(d => {
            if (d.yearAdded) {
                if (!counts[d.yearAdded]) counts[d.yearAdded] = { year: d.yearAdded, Movie: 0, 'TV Show': 0 };
                counts[d.yearAdded][d.type] += 1;
            }
        });
        return Object.values(counts).sort((a,b) => a.year - b.year);
    }, [data]);

    const scatterData = useMemo(() => {
        return data.filter(d => d.release_year && d.yearAdded)
                   .map(d => ({ x: d.release_year, y: d.yearAdded, type: d.type }))
                   .slice(0, 500); // sample for perf
    }, [data]);

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Executive Overview</h2>
                    <p className="page-subtitle">Growth trends and catalog summary</p>
                </div>
            </div>

            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-title">Total Titles</div>
                    <div className="kpi-value">{kpis.total.toLocaleString()}</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-title">Total Movies</div>
                    <div className="kpi-value">{kpis.movies.toLocaleString()}</div>
                    <div className="kpi-sub">{(kpis.movies/kpis.total*100).toFixed(1)}% of Catalog</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-title">Total TV Shows</div>
                    <div className="kpi-value">{kpis.shows.toLocaleString()}</div>
                    <div className="kpi-sub">{(kpis.shows/kpis.total*100).toFixed(1)}% of Catalog</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-title">Unique Genres</div>
                    <div className="kpi-value">{kpis.uniqueGenres.toLocaleString()}</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-title">Footprint (Countries)</div>
                    <div className="kpi-value">{kpis.uniqueCountries.toLocaleString()}</div>
                </div>
            </div>

            <div className="charts-grid">
                <div className="chart-card">
                    <div className="chart-title">Content Split</div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieData} innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value">
                                    {pieData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card">
                    <div className="chart-title">Content Added Over Time</div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={growthData}>
                                <defs>
                                    <linearGradient id="colorM" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#E50914" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#E50914" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorT" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#555555" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#555555" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="year" stroke="#B3B3B3"/>
                                <YAxis stroke="#B3B3B3"/>
                                <Tooltip />
                                <Legend />
                                <Area type="monotone" dataKey="Movie" stroke="#E50914" fillOpacity={1} fill="url(#colorM)" />
                                <Area type="monotone" dataKey="TV Show" stroke="#555555" fillOpacity={1} fill="url(#colorT)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card full-width">
                    <div className="chart-title">Release Year vs. Platform Addition (Sampled)</div>
                    <div className="chart-container" style={{minHeight: 300}}>
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis type="number" dataKey="x" name="Release Year" domain={['auto', 'auto']} stroke="#B3B3B3"/>
                                <YAxis type="number" dataKey="y" name="Year Added" domain={['auto', 'auto']} stroke="#B3B3B3"/>
                                <Tooltip cursor={{strokeDasharray: '3 3'}} />
                                <Scatter name="Titles" data={scatterData} fill="#E50914" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
