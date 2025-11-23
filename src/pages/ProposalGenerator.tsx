import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { getPropertyById } from '../services/api';
import type { Property, BusinessProposal } from '../types';
import { ArrowLeft, ArrowRight, Check, Download, Printer } from 'lucide-react';

export const ProposalGenerator = () => {
    const { propertyId } = useParams<{ propertyId: string }>();
    const [property, setProperty] = useState<Property | null>(null);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Partial<BusinessProposal>>({
        sports: [],
        partners: []
    });

    const [searchParams] = useSearchParams();
    const customAddress = searchParams.get('address');

    useEffect(() => {
        const fetchProperty = async () => {
            if (propertyId && propertyId !== 'custom') {
                const data = await getPropertyById(propertyId);
                setProperty(data || null);
            } else if (propertyId === 'custom' && customAddress) {
                // Create a mock property object from the custom address
                setProperty({
                    id: 'custom',
                    address: customAddress,
                    price: 0, // Unknown
                    size: 0, // Unknown
                    coordinates: { lat: 0, lng: 0 },
                    description: 'Custom location analysis',
                    zoning: {
                        code: 'Unknown',
                        description: 'Verify Local Zoning',
                        permittedUses: ['Commercial', 'Recreation'],
                        restrictions: ['Check local ordinances'],
                        maxBuildingHeight: 0,
                        setbacks: { front: 0, side: 0, rear: 0 }
                    },
                    imageUrl: '',
                    demographics: {
                        population: 0,
                        growthTrend: 0,
                        medianIncome: 0,
                        trafficScore: 0,
                        schoolProximity: 0,
                        medianAge: 0,
                        historicalPopulation: [],
                        projectedPopulation: [],
                        ageGroups: {
                            '0-15': 0,
                            '15-25': 0,
                            '25-40': 0,
                            '40-55': 0,
                            '55+': 0
                        }
                    }
                });
            }
        };
        fetchProperty();
    }, [propertyId, customAddress]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleSport = (sport: string) => {
        setFormData(prev => {
            const sports = prev.sports || [];
            if (sports.includes(sport)) {
                return { ...prev, sports: sports.filter(s => s !== sport) };
            } else {
                return { ...prev, sports: [...sports, sport] };
            }
        });
    };

    if (!property) return <div className="container" style={{ paddingTop: '4rem' }}>Loading...</div>;

    const renderStep1 = () => (
        <div className="animate-slide-up">
            <h2 style={{ marginBottom: '1.5rem' }}>Business Details</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Business Name</label>
                    <input
                        type="text"
                        name="businessName"
                        value={formData.businessName || ''}
                        onChange={handleInputChange}
                        placeholder="e.g. Manchester Elite Sports"
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border)',
                            background: 'var(--color-bg-primary)',
                            color: 'white'
                        }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Investment Budget ($)</label>
                    <input
                        type="number"
                        name="investmentAmount"
                        value={formData.investmentAmount || ''}
                        onChange={handleInputChange}
                        placeholder="1000000"
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border)',
                            background: 'var(--color-bg-primary)',
                            color: 'white'
                        }}
                    />
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="animate-slide-up">
            <h2 style={{ marginBottom: '1.5rem' }}>Facility Mix</h2>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>Select the sports facilities you plan to include.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                {['Pickleball', 'Tennis', 'Basketball', 'Futsal', 'Volleyball', 'Gym/Fitness'].map(sport => (
                    <div
                        key={sport}
                        onClick={() => toggleSport(sport)}
                        style={{
                            padding: '1rem',
                            borderRadius: 'var(--radius-md)',
                            border: `1px solid ${formData.sports?.includes(sport) ? 'var(--color-accent)' : 'var(--color-border)'}`,
                            background: formData.sports?.includes(sport) ? 'rgba(56, 189, 248, 0.1)' : 'var(--color-bg-card)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '4px',
                            border: '1px solid var(--color-border)',
                            background: formData.sports?.includes(sport) ? 'var(--color-accent)' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {formData.sports?.includes(sport) && <Check size={14} color="white" />}
                        </div>
                        {sport}
                    </div>
                ))}
            </div>
        </div>
    );

    const renderProposal = () => (
        <div className="animate-slide-up">
            <div style={{ background: 'white', color: 'black', padding: '3rem', borderRadius: 'var(--radius-sm)', marginBottom: '2rem' }}>
                <div style={{ borderBottom: '2px solid #eee', paddingBottom: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{formData.businessName || 'New Sports Complex'}</h1>
                        <p style={{ color: '#666' }}>Business Proposal</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 'bold' }}>Date</div>
                        <div>{new Date().toLocaleDateString()}</div>
                    </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>Executive Summary</h3>
                    <p style={{ lineHeight: 1.6, color: '#444' }}>
                        This proposal outlines the development of a premier indoor sports facility at <strong>{property.address}</strong>.
                        Capitalizing on the local population of {property.demographics.population.toLocaleString()} and a strong growth trend of {property.demographics.growthTrend}%,
                        this facility aims to serve the community's need for year-round recreational space.
                    </p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>Property Analysis</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div>
                            <div style={{ fontWeight: 'bold', color: '#666', fontSize: '0.9rem' }}>Location</div>
                            <div>{property.address}</div>
                        </div>
                        <div>
                            <div style={{ fontWeight: 'bold', color: '#666', fontSize: '0.9rem' }}>Zoning</div>
                            <div>{property.zoning.code} - {property.zoning.description}</div>
                        </div>
                        <div>
                            <div style={{ fontWeight: 'bold', color: '#666', fontSize: '0.9rem' }}>Size</div>
                            <div>{property.size} Acres</div>
                        </div>
                        <div>
                            <div style={{ fontWeight: 'bold', color: '#666', fontSize: '0.9rem' }}>Price</div>
                            <div>${property.price.toLocaleString()}</div>
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>Proposed Facilities</h3>
                    <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', listStyle: 'disc', paddingLeft: '1.5rem' }}>
                        {formData.sports?.map(s => (
                            <li key={s}>{s} Courts/Fields</li>
                        ))}
                    </ul>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>Financial Overview</h3>
                    <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>Initial Investment</span>
                            <span style={{ fontWeight: 'bold' }}>${Number(formData.investmentAmount || 0).toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>Land Acquisition</span>
                            <span style={{ fontWeight: 'bold' }}>${property.price.toLocaleString()}</span>
                        </div>
                        <div style={{ borderTop: '1px solid #ddd', marginTop: '0.5rem', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Remaining for Construction</span>
                            <span style={{ fontWeight: 'bold', color: '#16a34a' }}>
                                ${(Number(formData.investmentAmount || 0) - property.price).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button className="btn btn-primary" onClick={() => window.print()}>
                    <Printer size={18} style={{ marginRight: '0.5rem' }} /> Print Proposal
                </button>
                <button className="btn" style={{ border: '1px solid var(--color-border)' }}>
                    <Download size={18} style={{ marginRight: '0.5rem' }} /> Export PDF
                </button>
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
            <Navbar />
            <div className="container" style={{ marginTop: '2rem', maxWidth: '800px' }}>
                <Link to={`/property/${propertyId}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
                    <ArrowLeft size={20} /> Back to Property
                </Link>

                {step < 3 && (
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>Step {step} of 2</span>
                            <span>{step === 1 ? 'Business Info' : 'Facilities'}</span>
                        </div>
                        <div style={{ height: '4px', background: 'var(--color-bg-secondary)', borderRadius: '2px' }}>
                            <div style={{ height: '100%', width: `${step * 50}%`, background: 'var(--color-accent)', borderRadius: '2px', transition: 'width 0.3s ease' }}></div>
                        </div>
                    </div>
                )}

                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderProposal()}

                {step < 3 && (
                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <button className="btn btn-primary" onClick={() => setStep(s => s + 1)}>
                            Next Step <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
