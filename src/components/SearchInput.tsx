import React, { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';

interface SearchInputProps {
    onSearch: (query: string) => void;
    placeholder?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({ onSearch, placeholder = "Enter address, city, or zip code..." }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
            <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                background: 'var(--color-bg-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-full)',
                padding: '0.5rem',
                boxShadow: 'var(--shadow-lg)',
                transition: 'all 0.3s ease'
            }}
                className="search-container"
            >
                <Search size={20} style={{ marginLeft: '1rem', color: 'var(--color-text-secondary)' }} />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        padding: '0.75rem 1rem',
                        color: 'var(--color-text-primary)',
                        fontSize: '1rem',
                        outline: 'none'
                    }}
                />
                <button
                    type="submit"
                    className="btn-primary"
                    style={{
                        borderRadius: 'var(--radius-full)',
                        padding: '0.75rem',
                        minWidth: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <ArrowRight size={20} />
                </button>
            </div>
        </form>
    );
};
