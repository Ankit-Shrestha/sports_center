/// <reference types="google.maps" />
import type { Coordinates } from '../types';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

let mapsLoaded = false;

export const loadGoogleMaps = (): Promise<void> => {
    if (mapsLoaded) return Promise.resolve();
    if (!API_KEY) return Promise.reject('Google Maps API Key is missing');

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
            mapsLoaded = true;
            resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
};

export const geocodeAddress = async (address: string): Promise<Coordinates> => {
    await loadGoogleMaps();
    const geocoder = new google.maps.Geocoder();

    return new Promise((resolve, reject) => {
        geocoder.geocode({ address }, (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
            if (status === 'OK' && results && results[0]) {
                const location = results[0].geometry.location;
                resolve({ lat: location.lat(), lng: location.lng() });
            } else {
                reject(`Geocoding failed: ${status}`);
            }
        });
    });
};

// Haversine formula to calculate distance in miles
export const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 3958.8; // Radius of Earth in miles
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10; // Round to 1 decimal place
};

export const getNearbyPlaces = async (lat: number, lng: number, type: string, radius: number = 8046, keyword?: string): Promise<any[]> => {
    await loadGoogleMaps();
    const dummyDiv = document.createElement('div');
    const service = new google.maps.places.PlacesService(dummyDiv);

    const location = new google.maps.LatLng(lat, lng);

    const request: google.maps.places.PlaceSearchRequest = {
        location,
        radius,
        type
    };

    if (keyword) {
        request.keyword = keyword;
        // When using keyword, type is optional or can be combined
        if (type === '') delete request.type;
    }

    return new Promise((resolve) => {
        service.nearbySearch(request, (results: google.maps.places.PlaceResult[] | null, status: google.maps.places.PlacesServiceStatus) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                // Add distance to each result
                const resultsWithDistance = results.map(place => {
                    const placeLat = place.geometry?.location?.lat() || 0;
                    const placeLng = place.geometry?.location?.lng() || 0;
                    return {
                        ...place,
                        distance: calculateDistance(lat, lng, placeLat, placeLng)
                    };
                });
                // Sort by distance
                resolve(resultsWithDistance.sort((a, b) => a.distance - b.distance));
            } else {
                if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
                    resolve([]);
                } else {
                    // Don't reject, just return empty to avoid breaking Promise.all
                    console.warn(`Places search failed for ${type}: ${status}`);
                    resolve([]);
                }
            }
        });
    });
};
