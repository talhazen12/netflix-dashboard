import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

export const parseData = async () => {
    return new Promise((resolve, reject) => {
        Papa.parse('/1.csv', {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const data = results.data;
                const processed = data.map((row) => {
                    const country = row.country ? row.country.split(',').map(c => c.trim()) : ['Unknown Country'];
                    const cast = row.cast ? row.cast.split(',').map(c => c.trim()) : ['Unknown Cast'];
                    const director = row.director ? row.director.split(',').map(d => d.trim()) : ['Unknown Director'];
                    const listed_in = row.listed_in ? row.listed_in.split(',').map(l => l.trim()) : ['Unknown Genre'];
                    
                    let movieDuration = null;
                    let tvDuration = null;
                    if (row.type === 'Movie' && row.duration) {
                        movieDuration = parseInt(row.duration.split(' ')[0], 10);
                    } else if (row.type === 'TV Show' && row.duration) {
                        tvDuration = parseInt(row.duration.split(' ')[0], 10);
                    }

                    let dateAdded = new Date(row.date_added);
                    let yearAdded = dateAdded.getFullYear() || null;
                    let monthAdded = dateAdded.toLocaleString('default', { month: 'short' }) || null;

                    return {
                        ...row,
                        country,
                        cast,
                        director,
                        listed_in,
                        movieDuration,
                        tvDuration,
                        yearAdded,
                        monthAdded,
                    };
                });
                resolve(processed);
            },
            error: (err) => {
                console.error("Error parsing data:", err);
                reject(err);
            }
        });
    });
};
