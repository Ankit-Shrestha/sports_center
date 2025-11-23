import type { Property } from '../types';
import { MOCK_PROPERTIES } from './mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const searchProperties = async (query: string): Promise<Property[]> => {
    await delay(800); // Simulate network request

    if (!query) return [];

    const lowerQuery = query.toLowerCase();
    return MOCK_PROPERTIES.filter(p =>
        p.address.toLowerCase().includes(lowerQuery) ||
        p.zoning.code.toLowerCase().includes(lowerQuery) ||
        p.zoning.description.toLowerCase().includes(lowerQuery)
    );
};

export const getPropertyById = async (id: string): Promise<Property | undefined> => {
    await delay(500);
    return MOCK_PROPERTIES.find(p => p.id === id);
};

export const getAllProperties = async (): Promise<Property[]> => {
    await delay(500);
    return MOCK_PROPERTIES;
};
