
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { SearchInput } from '../components/SearchInput';
import { geocodeAddress } from '../services/googleMaps';


export const Home = () => {
    const navigate = useNavigate();


    const handleSearch = async (query: string) => {
        try {
            // New flow: Geocode and go to location analysis
            const coords = await geocodeAddress(query);
            navigate(`/location-analysis?lat=${coords.lat}&lng=${coords.lng}&address=${encodeURIComponent(query)}`);
        } catch (error) {
            console.error('Search failed:', error);
            alert('Could not find location. Please try a more specific address.');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <main style={{ flex: 1 }}>
                {/* Hero Section */}
                <section style={{
                    padding: '6rem 0 4rem',
                    textAlign: 'center',
                    background: 'radial-gradient(circle at top center, #1e293b 0%, var(--color-bg-primary) 70%)'
                }}>
                    <div className="container">
                        <div className="animate-slide-up">
                            <h1 className="text-gradient" style={{ fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: 1.1 }}>
                                Find the Perfect Ground<br />For Your Sports Empire
                            </h1>
                            <p style={{
                                color: 'var(--color-text-secondary)',
                                fontSize: '1.25rem',
                                maxWidth: '700px',
                                margin: '0 auto 3rem'
                            }}>
                                Advanced analytics for commercial land acquisition.
                                Evaluate demographics, zoning, and growth trends in seconds.
                            </p>

                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4rem' }}>
                                <SearchInput onSearch={handleSearch} />
                            </div>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
};
