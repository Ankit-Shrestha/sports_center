export interface Coordinates {
    lat: number;
    lng: number;
}

export interface Demographics {
    population: number;
    medianAge: number;
    medianIncome: number;
    schoolProximity: number; // in miles
    trafficScore: number; // 0-100
    growthTrend: number; // percentage

    // New detailed fields
    historicalPopulation: { year: number; population: number }[];
    projectedPopulation: { year: number; population: number }[];
    ageGroups: {
        '0-15': number;
        '15-25': number;
        '25-40': number;
        '40-55': number;
        '55+': number;
    };
}

export interface ZoningInfo {
    code: string;
    description: string;
    permittedUses: string[];
    restrictions: string[];
    maxBuildingHeight: number; // in feet
    setbacks: {
        front: number;
        side: number;
        rear: number;
    };
}

export interface Property {
    id: string;
    address: string;
    price: number;
    size: number; // in acres
    coordinates: Coordinates;
    zoning: ZoningInfo;
    demographics: Demographics;
    imageUrl: string;
    description: string;
}

export interface BusinessProposal {
    propertyId: string;
    businessName: string;
    investmentAmount: number;
    partners: string[];
    sports: string[]; // e.g., ['Pickleball', 'Tennis']
    projectedRevenue: number;
    timeline: string;
}
