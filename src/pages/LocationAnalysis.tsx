import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { getCensusData, getFipsFromCoordinates } from '../services/census';
import { getNearbyPlaces } from '../services/googleMaps';
import type { Demographics } from '../types';
import { ArrowLeft, School, ShoppingBag, Activity, ExternalLink, FileText, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { useNavigate } from 'react-router-dom';

export const LocationAnalysis = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');
    const address = searchParams.get('address') || 'Unknown Location';

    const [demographics, setDemographics] = useState<Partial<Demographics> | null>(null);
    const [categories, setCategories] = useState<{
        schools: any[];
        gas: any[];
        food: any[];
        malls: any[];
        parks: any[];
        competitors: any[];
    }>({
        schools: [],
        gas: [],
        food: [],
        malls: [],
        parks: [],
        competitors: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (lat && lng) {
                try {
                    // 1. Get Census Data
                    const fips = await getFipsFromCoordinates(lat, lng);
                    const census = await getCensusData(fips);
                    setDemographics(census);

                    // 2. Get Nearby Places by Category
                    // Standard radius: 5 miles (8046 meters)
                    // Competitor radius: 50 miles (80467 meters)

                    const [schools, gas, food, malls, parks, competitors] = await Promise.all([
                        getNearbyPlaces(lat, lng, 'school', 8046),
                        getNearbyPlaces(lat, lng, 'gas_station', 8046),
                        getNearbyPlaces(lat, lng, 'restaurant', 8046),
                        getNearbyPlaces(lat, lng, 'shopping_mall', 8046),
                        getNearbyPlaces(lat, lng, 'park', 8046),
                        getNearbyPlaces(lat, lng, '', 80467, 'indoor sports complex') // 50 miles, keyword search
                    ]);

                    setCategories({
                        schools,
                        gas,
                        food,
                        malls,
                        parks,
                        competitors
                    });

                } catch (error) {
                    console.error('Error fetching analysis data:', error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchData();
    }, [lat, lng]);

    if (loading) return <div className="container" style={{ paddingTop: '4rem' }}>Analyzing Location...</div>;

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
            <Navbar />

            <div className="container" style={{ marginTop: '2rem' }}>
                <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
                    <ArrowLeft size={20} /> Back to Search
                </Link>

                <div className="animate-slide-up">
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Location Analysis</h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>{address}</p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                        {/* Map Section */}
                        {/* Map Section - Commented out to save API usage
                        <div className="card" style={{ height: '400px', padding: 0, overflow: 'hidden' }}>
                            <GoogleMap
                                lat={lat}
                                lng={lng}
                                markers={[
                                  ...categories.schools, 
                                  ...categories.gas, 
                                  ...categories.food, 
                                  ...categories.malls, 
                                  ...categories.parks, 
                                  ...categories.competitors
                                ].map(p => ({
                                    lat: p.geometry.location.lat(),
                                    lng: p.geometry.location.lng(),
                                    title: p.name,
                                    id: p.place_id
                                }))}
                                activeMarkerId={activePlaceId}
                            />
                        </div>
                        */}

                        {/* Key Metrics */}
                        <div className="card">
                            <h2 style={{ marginBottom: '1.5rem' }}>Demographics</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div>
                                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{demographics?.population?.toLocaleString()}</div>
                                    <div style={{ color: 'var(--color-text-secondary)' }}>Total Population</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>${demographics?.medianIncome?.toLocaleString()}</div>
                                    <div style={{ color: 'var(--color-text-secondary)' }}>Median Income</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{demographics?.medianAge}</div>
                                    <div style={{ color: 'var(--color-text-secondary)' }}>Median Age</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                                        {categories.schools.length + categories.gas.length + categories.food.length + categories.malls.length + categories.parks.length}
                                    </div>
                                    <div style={{ color: 'var(--color-text-secondary)' }}>Nearby Amenities</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div className="card">
                            <h3 style={{ marginBottom: '1rem' }}>Population Growth Projection</h3>
                            <div style={{ height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={demographics?.projectedPopulation}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                        <XAxis dataKey="year" stroke="#94a3b8" />
                                        <YAxis stroke="#94a3b8" />
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                                        <Line type="monotone" dataKey="population" stroke="#38bdf8" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="card">
                            <h3 style={{ marginBottom: '1rem' }}>Age Distribution</h3>
                            <div style={{ height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={Object.entries(demographics?.ageGroups || {}).map(([name, value]) => ({ name, value }))}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                        <XAxis dataKey="name" stroke="#94a3b8" />
                                        <YAxis stroke="#94a3b8" />
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                                        <Bar dataKey="value" fill="#4ade80" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Amenities Sections */}
                    <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* Helper to render a section */}
                        {([
                            { title: 'Schools', data: categories.schools, icon: <School size={16} /> },
                            { title: 'Gas Stations', data: categories.gas, icon: <span style={{ fontSize: '16px' }}>⛽</span> },
                            { title: 'Restaurants', data: categories.food, icon: <span style={{ fontSize: '16px' }}>🍽️</span> },
                            { title: 'Shopping Malls', data: categories.malls, icon: <ShoppingBag size={16} /> },
                            { title: 'Public Parks', data: categories.parks, icon: <span style={{ fontSize: '16px' }}>🌳</span> },
                        ]).map((section) => (
                            <div key={section.title} className="card">
                                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {section.icon} {section.title}
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                                    {section.data.slice(0, 6).map((place, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                padding: '1rem',
                                                background: 'var(--color-bg-primary)',
                                                borderRadius: 'var(--radius-md)',
                                                border: '1px solid transparent',
                                                position: 'relative',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <a
                                                href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(address)}&destination=${encodeURIComponent(place.name)}&destination_place_id=${place.place_id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    position: 'absolute',
                                                    top: '0.75rem',
                                                    right: '0.75rem',
                                                    color: 'var(--color-text-secondary)',
                                                    cursor: 'pointer'
                                                }}
                                                title="Get Directions"
                                            >
                                                <ExternalLink size={16} />
                                            </a>

                                            <div style={{ fontWeight: 'bold', marginBottom: '0.25rem', paddingRight: '1.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {place.name}
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>{place.vicinity || place.formatted_address}</div>
                                                <div style={{ fontWeight: 'bold', color: 'var(--color-accent)', whiteSpace: 'nowrap' }}>
                                                    {place.distance} mi
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {section.data.length === 0 && <div style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>No {section.title.toLowerCase()} found nearby.</div>}
                                </div>
                            </div>
                        ))}

                        {/* Competitors Section (50 miles) */}
                        <div className="card" style={{ border: '1px solid var(--color-accent)' }}>
                            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)' }}>
                                <Activity size={16} /> Competitors (Indoor Sports within 50 miles)
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                                {categories.competitors.map((place, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            padding: '1rem',
                                            background: 'var(--color-bg-primary)',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid transparent',
                                            position: 'relative',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <a
                                            href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(address)}&destination=${encodeURIComponent(place.name)}&destination_place_id=${place.place_id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                position: 'absolute',
                                                top: '0.75rem',
                                                right: '0.75rem',
                                                color: 'var(--color-text-secondary)',
                                                cursor: 'pointer'
                                            }}
                                            title="Get Directions"
                                        >
                                            <ExternalLink size={16} />
                                        </a>

                                        <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                                            {place.name}
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}>{place.vicinity}</div>
                                            <div style={{ fontWeight: 'bold', color: 'var(--color-accent)', whiteSpace: 'nowrap' }}>
                                                {place.distance} mi
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {categories.competitors.length === 0 && <div style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>No competitors found within 50 miles.</div>}
                            </div>
                        </div>

                        {/* Zoning & Proposal Section */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div className="card">
                                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Info size={16} /> Zoning Information
                                </h3>
                                <div style={{ padding: '1rem', background: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                                    <div style={{ fontWeight: 'bold', color: 'var(--color-accent)', marginBottom: '0.5rem' }}>Likely Zone: IND-2 / COM-1</div>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                                        Based on the location, this area typically supports commercial and light industrial uses.
                                        Indoor sports facilities are generally <strong>Permitted by Right</strong> or require a <strong>Special Exception</strong>.
                                    </p>
                                </div>
                                <ul style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', listStyle: 'disc', paddingLeft: '1.5rem' }}>
                                    <li>Max Building Height: 45-60 ft</li>
                                    <li>Lot Coverage: Max 50-70%</li>
                                    <li>Parking: 1 space per 200 sq ft</li>
                                </ul>
                            </div>

                            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                                <FileText size={48} style={{ color: 'var(--color-accent)', marginBottom: '1rem' }} />
                                <h3 style={{ marginBottom: '0.5rem' }}>Ready to Move Forward?</h3>
                                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                                    Generate a professional business proposal for this location, including demographic data and financial projections.
                                </p>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => navigate(`/proposal/custom?address=${encodeURIComponent(address)}&lat=${lat}&lng=${lng}`)}
                                >
                                    Generate Proposal
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
