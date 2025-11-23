import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { getPropertyById } from '../services/api';
import type { Property } from '../types';
import { ArrowLeft, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const PropertyDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperty = async () => {
            if (id) {
                const data = await getPropertyById(id);
                setProperty(data || null);
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id]);

    if (loading) return <div className="container" style={{ paddingTop: '4rem' }}>Loading...</div>;
    if (!property) return <div className="container" style={{ paddingTop: '4rem' }}>Property not found</div>;

    const demographicsData = [
        { name: 'Traffic', value: property.demographics.trafficScore, fullMark: 100 },
        { name: 'Growth', value: property.demographics.growthTrend * 20, fullMark: 100 }, // Scale for viz
        { name: 'Income', value: property.demographics.medianIncome / 1000, fullMark: 100 }, // Scale for viz
    ];

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
            <Navbar />

            <div className="container" style={{ marginTop: '2rem' }}>
                <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
                    <ArrowLeft size={20} /> Back to Search
                </Link>

                <div className="animate-slide-up">
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                        <div>
                            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{property.address.split(',')[0]}</h1>
                            <p style={{ fontSize: '1.25rem', color: 'var(--color-text-secondary)' }}>
                                {property.address.split(',').slice(1).join(',')}
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-success)' }}>
                                ${(property.price / 1000000).toFixed(2)}M
                            </div>
                            <div style={{ color: 'var(--color-text-secondary)' }}>{property.size} Acres</div>
                        </div>
                    </div>

                    {/* Grid Layout */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>

                        {/* Left Column: Main Info & Charts */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div className="card">
                                <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                                    Location Analytics
                                </h2>
                                <div style={{ height: '300px', width: '100%' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={demographicsData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                            <XAxis type="number" domain={[0, 100]} hide />
                                            <YAxis dataKey="name" type="category" width={80} tick={{ fill: '#94a3b8' }} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                            />
                                            <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
                                                {demographicsData.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={['#38bdf8', '#4ade80', '#fbbf24'][index]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '2rem', textAlign: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{property.demographics.population.toLocaleString()}</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Population</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{property.demographics.schoolProximity} mi</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>School Proximity</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{property.demographics.medianAge}</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Median Age</div>
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                                    Zoning & Regulations
                                </h2>
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <span style={{
                                        background: 'rgba(56, 189, 248, 0.1)',
                                        color: 'var(--color-accent)',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '4px',
                                        fontWeight: 'bold'
                                    }}>
                                        {property.zoning.code}
                                    </span>
                                    <span style={{ color: 'var(--color-text-secondary)' }}>{property.zoning.description}</span>
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>Permitted Uses</h3>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        {property.zoning.permittedUses.map(use => (
                                            <span key={use} style={{
                                                border: '1px solid var(--color-border)',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: 'var(--radius-full)',
                                                fontSize: '0.875rem'
                                            }}>
                                                {use}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>Restrictions</h3>
                                    <ul style={{ listStyle: 'none' }}>
                                        {property.zoning.restrictions.map(r => (
                                            <li key={r} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                                <AlertTriangle size={16} color="var(--color-warning)" /> {r}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Actions */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="card" style={{ position: 'sticky', top: '6rem' }}>
                                <h3 style={{ marginBottom: '1rem' }}>Next Steps</h3>
                                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                                    Generate a comprehensive business proposal for this property to present to partners and lenders.
                                </p>
                                <button className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>
                                    <FileText size={18} style={{ marginRight: '0.5rem' }} /> Generate Proposal
                                </button>
                                <button className="btn" style={{ width: '100%', border: '1px solid var(--color-border)' }}>
                                    Contact Agent
                                </button>

                                <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                                    <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Licensing Checklist</h4>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                                        <CheckCircle size={14} color="var(--color-success)" /> Business Registration
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                                        <CheckCircle size={14} color="var(--color-text-secondary)" /> Health Permit
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                        <CheckCircle size={14} color="var(--color-text-secondary)" /> Fire Inspection
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
