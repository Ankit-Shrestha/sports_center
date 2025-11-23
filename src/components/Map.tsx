import React, { useEffect, useRef } from 'react';
import { loadGoogleMaps } from '../services/googleMaps';

interface MapProps {
    lat: number;
    lng: number;
    markers?: { lat: number; lng: number; title: string; id?: string }[];
    activeMarkerId?: string | null;
}

export const Map: React.FC<MapProps> = ({ lat, lng, markers = [], activeMarkerId }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const googleMapRef = useRef<google.maps.Map | null>(null);

    useEffect(() => {
        const initMap = async () => {
            await loadGoogleMaps();
            if (mapRef.current && !googleMapRef.current) {
                googleMapRef.current = new google.maps.Map(mapRef.current, {
                    center: { lat, lng },
                    zoom: 13,
                    styles: [
                        {
                            featureType: 'all',
                            elementType: 'geometry',
                            stylers: [{ color: '#242f3e' }]
                        },
                        {
                            featureType: 'all',
                            elementType: 'labels.text.stroke',
                            stylers: [{ color: '#242f3e' }]
                        },
                        {
                            featureType: 'all',
                            elementType: 'labels.text.fill',
                            stylers: [{ color: '#746855' }]
                        },
                        // Add more dark mode styles as needed
                    ]
                });
            }
        };

        initMap();
    }, [lat, lng]);

    useEffect(() => {
        if (googleMapRef.current) {
            googleMapRef.current.setCenter({ lat, lng });

            // Clear existing markers (simplified for now, ideally track marker instances)

            // Add new markers
            markers.forEach(m => {
                new google.maps.Marker({
                    position: { lat: m.lat, lng: m.lng },
                    map: googleMapRef.current,
                    title: m.title,
                    // Highlight active marker
                    animation: m.id === activeMarkerId ? google.maps.Animation.BOUNCE : null,
                    icon: m.id === activeMarkerId ? {
                        url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                    } : undefined
                });
            });
        }
    }, [lat, lng, markers, activeMarkerId]);

    return <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-lg)' }} />;
};
