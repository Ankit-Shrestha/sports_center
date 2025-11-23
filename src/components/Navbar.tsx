import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

export const Navbar = () => {
    return (
        <nav style={{
            borderBottom: '1px solid var(--color-border)',
            padding: '1rem 0',
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(10px)',
            position: 'sticky',
            top: 0,
            zIndex: 50
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ fontWeight: 'bold', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        background: 'linear-gradient(135deg, var(--color-accent), #818cf8)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                    }}>
                        <MapPin size={20} />
                    </div>
                    <span>SportsLand<span style={{ color: 'var(--color-accent)' }}>.AI</span></span>
                </Link>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <Link to="/" style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Search</Link>
                    <Link to="/analysis" style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Analysis</Link>
                    <Link to="/saved" style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Saved</Link>
                    <button className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                        Login
                    </button>
                </div>
            </div>
        </nav>
    );
};
