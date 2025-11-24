import React from 'react';
import type { RevenueConfig, SportActivity } from '../../types/analysis';
import { TrendingUp, Activity, Users, Plus, X, Target, TrendingDown } from 'lucide-react';

interface RevenueFormProps {
    config: RevenueConfig;
    onChange: (config: RevenueConfig) => void;
    breakEven?: {
        netOperatingIncome: number;
        loanPrincipal: number;
        payoffMonths: number;
        payoffYears: number;
        isProfitable: boolean;
    };
}

export const RevenueForm: React.FC<RevenueFormProps> = ({ config, onChange, breakEven }) => {
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
                                        style={{ fontWeight: 500, paddingLeft: '0.75rem' }}
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
                                        style={{ paddingLeft: '0.75rem' }}
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
                                            style={{ width: '4rem', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}
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

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                <h4 className="card-section-title">
                    <Activity className="text-orange" style={{ display: 'inline', marginRight: '0.5rem' }} /> Seasonality
                </h4>
                <div className="form-grid-2">
                    <div className="input-group">
                        <label className="input-label">Unused Days / Year (Off-Season)</label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                value={config.unusedDays || 0}
                                onChange={(e) => handleChange('unusedDays', parseFloat(e.target.value) || 0)}
                                className="form-input"
                                placeholder="e.g. 30"
                                style={{ paddingRight: '3rem' }}
                            />
                            <div className="input-suffix" style={{ fontSize: '0.75rem', right: '1rem' }}>days</div>
                        </div>
                    </div>
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

            {/* Break-Even Analysis Section */}
            {breakEven && (
                <div className="card" style={{ marginTop: '1.5rem', borderColor: breakEven.isProfitable ? 'var(--color-accent)' : '#ef4444' }}>
                    <h3 className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Target size={20} style={{ color: breakEven.isProfitable ? 'var(--color-accent)' : '#ef4444' }} />
                        Break-Even Analysis
                    </h3>

                    {breakEven.isProfitable ? (
                        <div>
                            <div style={{
                                padding: '1rem',
                                background: 'rgba(34, 197, 94, 0.1)',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: '1rem',
                                border: '1px solid rgba(34, 197, 94, 0.3)'
                            }}>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                    Time to Pay Off Loan
                                </div>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#22c55e' }}>
                                    {breakEven.payoffYears < 100
                                        ? `${Math.floor(breakEven.payoffYears)} years ${Math.round((breakEven.payoffYears % 1) * 12)} months`
                                        : '100+ years'
                                    }
                                </div>
                            </div>

                            <div className="form-grid-3">
                                <div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                        Net Operating Income
                                    </div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#22c55e' }}>
                                        ${breakEven.netOperatingIncome.toLocaleString()}/mo
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                        Total Loan Amount
                                    </div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                                        ${breakEven.loanPrincipal.toLocaleString()}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                        Months to Break Even
                                    </div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-accent)' }}>
                                        {breakEven.payoffMonths < 1200 ? Math.round(breakEven.payoffMonths) : '1200+'} months
                                    </div>
                                </div>
                            </div>

                            <div style={{
                                marginTop: '1rem',
                                padding: '0.75rem',
                                background: 'var(--color-bg-primary)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.875rem',
                                color: 'var(--text-secondary)'
                            }}>
                                <strong>Note:</strong> This calculation assumes your monthly revenue minus operating costs remains constant.
                                The break-even point represents when your cumulative operating profit equals the loan principal.
                            </div>
                        </div>
                    ) : (
                        <div style={{
                            padding: '1.5rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            textAlign: 'center'
                        }}>
                            <TrendingDown size={48} style={{ color: '#ef4444', margin: '0 auto 1rem' }} />
                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ef4444', marginBottom: '0.5rem' }}>
                                Not Profitable
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                Your monthly operating costs exceed your revenue. You need to either increase revenue or reduce costs to achieve profitability.
                            </div>
                            <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                                <strong>Monthly Deficit:</strong> <span style={{ color: '#ef4444' }}>
                                    ${Math.abs(breakEven.netOperatingIncome).toLocaleString()}/mo
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
