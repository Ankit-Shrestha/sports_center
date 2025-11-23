import type { Property } from '../types';

export const MOCK_PROPERTIES: Property[] = [
    {
        id: '1',
        address: '123 Industrial Park Dr, Manchester, NH 03109',
        price: 1200000,
        size: 5.5,
        coordinates: { lat: 42.9956, lng: -71.4548 },
        imageUrl: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        description: 'Prime industrial land suitable for large scale sports complex. High visibility from highway.',
        zoning: {
            code: 'IND-2',
            description: 'General Industrial',
            permittedUses: ['Warehousing', 'Light Manufacturing', 'Indoor Recreation', 'Office'],
            restrictions: ['No residential use', 'Noise limits after 10 PM'],
            maxBuildingHeight: 60,
            setbacks: { front: 50, side: 25, rear: 25 }
        },
        demographics: {
            population: 115000,
            medianAge: 36,
            medianIncome: 65000,
            schoolProximity: 1.2,
            trafficScore: 85,
            growthTrend: 2.5,
            historicalPopulation: [
                { year: 2010, population: 100000 },
                { year: 2015, population: 108000 },
                { year: 2020, population: 115000 }
            ],
            projectedPopulation: [
                { year: 2025, population: 120000 },
                { year: 2030, population: 126000 },
                { year: 2035, population: 132000 },
                { year: 2040, population: 138000 }
            ],
            ageGroups: {
                '0-15': 20000,
                '15-25': 15000,
                '25-40': 35000,
                '40-55': 25000,
                '55+': 20000
            }
        }
    },
    {
        id: '2',
        address: '45 Technology Way, Nashua, NH 03060',
        price: 1850000,
        size: 3.2,
        coordinates: { lat: 42.7654, lng: -71.4676 },
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        description: 'Modern tech park location with excellent utilities. Perfect for high-end indoor tennis facility.',
        zoning: {
            code: 'COM-1',
            description: 'Commercial / Tech Park',
            permittedUses: ['Research Labs', 'Corporate Office', 'Indoor Sports', 'Retail'],
            restrictions: ['Architectural review required'],
            maxBuildingHeight: 80,
            setbacks: { front: 40, side: 20, rear: 20 }
        },
        demographics: {
            population: 91000,
            medianAge: 41,
            medianIncome: 82000,
            schoolProximity: 0.8,
            trafficScore: 78,
            growthTrend: 1.8,
            historicalPopulation: [
                { year: 2010, population: 85000 },
                { year: 2015, population: 88000 },
                { year: 2020, population: 91000 }
            ],
            projectedPopulation: [
                { year: 2025, population: 94000 },
                { year: 2030, population: 97000 },
                { year: 2035, population: 100000 },
                { year: 2040, population: 103000 }
            ],
            ageGroups: {
                '0-15': 15000,
                '15-25': 10000,
                '25-40': 25000,
                '40-55': 25000,
                '55+': 16000
            }
        }
    },
    {
        id: '3',
        address: '789 Concord Heights, Concord, NH 03301',
        price: 850000,
        size: 8.0,
        coordinates: { lat: 43.2081, lng: -71.5376 },
        imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        description: 'Expansive lot with room for outdoor expansion. Close to high schools.',
        zoning: {
            code: 'MIX-U',
            description: 'Mixed Use',
            permittedUses: ['Residential', 'Commercial', 'Recreational'],
            restrictions: ['Green space requirement 20%'],
            maxBuildingHeight: 45,
            setbacks: { front: 30, side: 15, rear: 15 }
        },
        demographics: {
            population: 44000,
            medianAge: 39,
            medianIncome: 71000,
            schoolProximity: 0.5,
            trafficScore: 65,
            growthTrend: 1.2,
            historicalPopulation: [
                { year: 2010, population: 40000 },
                { year: 2015, population: 42000 },
                { year: 2020, population: 44000 }
            ],
            projectedPopulation: [
                { year: 2025, population: 46000 },
                { year: 2030, population: 48000 },
                { year: 2035, population: 50000 },
                { year: 2040, population: 52000 }
            ],
            ageGroups: {
                '0-15': 8000,
                '15-25': 5000,
                '25-40': 12000,
                '40-55': 10000,
                '55+': 9000
            }
        }
    }
];
