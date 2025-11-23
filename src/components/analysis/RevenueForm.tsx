import React from 'react';
import type { RevenueConfig, SportActivity } from '../../types/analysis';
import { TrendingUp, Activity, Users, Plus, X } from 'lucide-react';

interface RevenueFormProps {
    config: RevenueConfig;
    onChange: (config: RevenueConfig) => void;
}

export const RevenueForm: React.FC<RevenueFormProps> = ({ config, onChange }) => {
    const handleChange = (field: keyof RevenueConfig, value: number) => {
        onChange({ ...config, [field]: value });
    };

    const addActivity = () => {
        const newActivity: SportActivity = {
            id: Math.random().toString(36).substr(2, 9),
            name: 'New Sport',
            hourlyRate: 50,
            dailyHours: 8,
            courts: 1
        };
        onChange({ ...config, activities: [...config.activities, newActivity] });
    };

    const updateActivity = (id: string, field: keyof SportActivity, value: any) => {
        const updatedActivities = config.activities.map(a =>
            a.id === id ? { ...a, [field]: value } : a
        );
        onChange({ ...config, activities: updatedActivities });
    };

    const removeActivity = (id: string) => {
        onChange({ ...config, activities: config.activities.filter(a => a.id !== id) });
    };

    return (
        <div className="card">
            <h3 className="card-header">
                <TrendingUp className="text-green" /> Revenue Streams
            </h3>

            <div style={{ marginBottom: '2rem' }}>
                <div className="list-header">
                    <h4 className="card-section-title" style={{ margin: 0 }}>
                        <Activity className="text-purple" style={{ display: 'inline', marginRight: '0.5rem' }} /> Sports Activities
                    </h4>
                    <button
                        onClick={addActivity}
                        className="btn-add purple"
                    >
                        <Plus size={16} /> Add Sport
                    </button>
                </div>

                <div className="activity-list">
                    {config.activities.map((activity) => (
                        <div key={activity.id} className="list-item">
                            <div className="list-item-grid">
                                <div className="col-span-3">
                                    <input
                                        type="text"
                                        value={activity.name}
                                        onChange={(e) => updateActivity(activity.id, 'name', e.target.value)}
                                        className="form-input"
                                        placeholder="Sport Name"
                                        style={{ background: 'transparent', border: 'none', paddingLeft: 0, fontWeight: 500 }}
                                    />
                                </div>
                                <div className="col-span-3">
                                    <label className="input-label" style={{ fontSize: '0.75rem' }}>Rate/Hr</label>
                                    <div className="input-wrapper">
                                        <span className="input-icon" style={{ left: '0.5rem' }}>$</span>
                                        <input
                                            type="number"
                                            value={activity.hourlyRate}
                                            onChange={(e) => updateActivity(activity.id, 'hourlyRate', parseFloat(e.target.value) || 0)}
                                            className="form-input"
                                            style={{ paddingLeft: '1.5rem' }}
                                        />
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label className="input-label" style={{ fontSize: '0.75rem' }}>Hrs/Day</label>
                                    <input
                                        type="number"
                                        value={activity.dailyHours}
                                        onChange={(e) => updateActivity(activity.id, 'dailyHours', parseFloat(e.target.value) || 0)}
                                        className="form-input"
                                    />
                                </div>
                                <div className="col-span-3 flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div>
                                        <label className="input-label" style={{ fontSize: '0.75rem' }}>Courts</label>
                                        <input
                                            type="number"
                                            value={activity.courts}
                                            onChange={(e) => updateActivity(activity.id, 'courts', parseFloat(e.target.value) || 0)}
                                            className="form-input"
                                            style={{ width: '4rem' }}
                                        />
                                    </div>
                                    <button
                                        onClick={() => removeActivity(activity.id)}
                                        className="btn-remove"
                                        style={{ marginLeft: 'auto', marginTop: '1rem' }}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {config.activities.length === 0 && (
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '1rem', fontStyle: 'italic' }}>No activities added yet.</p>
                    )}
                </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                <h4 className="card-section-title">
                    <Users className="text-blue" style={{ display: 'inline', marginRight: '0.5rem' }} /> Memberships
                </h4>
                <div className="form-grid-2">
                    <div className="input-group">
                        <label className="input-label">Projected Members</label>
                        <input
                            type="number"
                            value={config.membershipCount}
                            onChange={(e) => handleChange('membershipCount', parseFloat(e.target.value) || 0)}
                            className="form-input"
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Monthly Fee</label>
                        <div className="input-wrapper">
                            <div className="input-icon">
                                <span style={{ color: 'var(--text-secondary)' }}>$</span>
                            </div>
                            <input
                                type="number"
                                value={config.membershipMonthlyFee}
                                onChange={(e) => handleChange('membershipMonthlyFee', parseFloat(e.target.value) || 0)}
                                className="form-input"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
