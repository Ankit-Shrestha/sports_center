import type { Demographics } from '../types';

// const CENSUS_API_KEY = import.meta.env.VITE_CENSUS_API_KEY;
// const BASE_URL = 'https://api.census.gov/data';

// Helper to get FIPS code from lat/lng using FCC API (free, no key needed)
export const getFipsFromCoordinates = async (lat: number, lng: number): Promise<string> => {
    try {
        const response = await fetch(`https://geo.fcc.gov/api/census/block/find?latitude=${lat}&longitude=${lng}&showall=true&format=json`);
        const data = await response.json();
        // Return State + County FIPS
        return data.County.FIPS;
    } catch (error) {
        console.error('Error fetching FIPS:', error);
        return '33011'; // Default to Hillsborough County, NH (Manchester/Nashua area)
    }
};

export const getCensusData = async (_fips: string): Promise<Partial<Demographics>> => {
    // In a real app, we would fetch from multiple endpoints:
    // 1. Decennial Census (2010, 2020) for historical population
    // 2. ACS (American Community Survey) for income, age groups

    // For this demo, we will simulate the API response structure but return calculated data
    // based on the FIPS code to ensure reliability without complex API chaining.

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simple seeded random function to ensure consistent data for the same FIPS
    // Use a Linear Congruential Generator (LCG) for better stability
    const seed = _fips.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const seededRandom = (offset: number = 0) => {
        const m = 2147483647;
        const a = 16807;
        const c = 0; // Park-Miller
        let state = (seed + offset) % m;
        if (state === 0) state = 1;
        state = (a * state + c) % m;
        return (state - 1) / (m - 1);
    };

    // Mock logic to generate realistic data based on location
    const basePop = 100000 + Math.floor(seededRandom(1) * 50000);
    const growthRate = 1.02 + (seededRandom(2) * 0.03); // 2-5% growth

    const historicalPopulation = [
        { year: 2010, population: Math.floor(basePop * 0.9) },
        { year: 2015, population: Math.floor(basePop * 0.95) },
        { year: 2020, population: basePop },
    ];

    // Projection algorithm: Linear extrapolation
    const projectedPopulation = [];
    let currentPop = basePop;
    for (let year = 2025; year <= 2040; year += 5) {
        currentPop = Math.floor(currentPop * growthRate);
        projectedPopulation.push({ year, population: currentPop });
    }

    return {
        population: basePop,
        medianAge: 35 + Math.floor(seededRandom(3) * 10),
        medianIncome: 60000 + Math.floor(seededRandom(4) * 30000),
        historicalPopulation,
        projectedPopulation,
        ageGroups: {
            '0-15': Math.floor(basePop * 0.18),
            '15-25': Math.floor(basePop * 0.12),
            '25-40': Math.floor(basePop * 0.25),
            '40-55': Math.floor(basePop * 0.20),
            '55+': Math.floor(basePop * 0.25),
        }
    };
};
