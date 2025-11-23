import React from 'react';
import type { OperatingConfig, StaffMember } from '../../types/analysis';
import { Zap, Droplets, Trash2, Users, Plus, X } from 'lucide-react';

interface OperatingFormProps {
    config: OperatingConfig;
    onChange: (config: OperatingConfig) => void;
}

const InputGroup = ({ label, icon: Icon, value, field, onChange, prefix = '$', step = 100 }: any) => (
    <div className="input-group">
        <label className="input-label">{label}</label>
        <div className="input-wrapper">
            <div className="input-icon">
                <Icon size={16} />
            </div>
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(field, parseFloat(e.target.value) || 0)}
                step={step}
                className="form-input"
            />
            {prefix && <span className="input-suffix">{prefix}</span>}
        </div>
    </div>
);

export const OperatingForm: React.FC<OperatingFormProps> = ({ config, onChange }) => {
    const handleChange = (field: keyof OperatingConfig, value: number) => {
        onChange({ ...config, [field]: value });
    };

    const addStaff = () => {
        const newStaff: StaffMember = {
            id: Math.random().toString(36).substr(2, 9),
            role: 'New Role',
            salary: 40000,
            count: 1
        };
        onChange({ ...config, staff: [...config.staff, newStaff] });
    };

    const updateStaff = (id: string, field: keyof StaffMember, value: any) => {
        const updatedStaff = config.staff.map(s =>
            s.id === id ? { ...s, [field]: value } : s
        );
        onChange({ ...config, staff: updatedStaff });
    };

    const removeStaff = (id: string) => {
        onChange({ ...config, staff: config.staff.filter(s => s.id !== id) });
    };

    return (
        <div className="card">
            <h3 className="card-header">
                <Zap className="text-yellow" /> Operating Expenses
            </h3>

            <div className="form-grid-3" style={{ marginBottom: '2rem' }}>
                <InputGroup label="Monthly Electricity" icon={Zap} value={config.electricityMonthly} field="electricityMonthly" onChange={handleChange} />
                <InputGroup label="Monthly Water" icon={Droplets} value={config.waterMonthly} field="waterMonthly" onChange={handleChange} />
                <InputGroup label="Monthly Sewer" icon={Trash2} value={config.sewerMonthly} field="sewerMonthly" onChange={handleChange} />
            </div>

            {/* Custom Expenses */}
            <div style={{ marginBottom: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                <div className="list-header" style={{ borderTop: 'none', paddingTop: 0 }}>
                    <h4 className="card-section-title" style={{ margin: 0, fontSize: '0.875rem' }}>Additional Expenses</h4>
                    <button
                        onClick={() => {
                            const newItem = { id: Math.random().toString(36).substr(2, 9), name: 'New Expense', value: 0 };
                            onChange({ ...config, customExpenses: [...config.customExpenses, newItem] });
                        }}
                        className="btn-add"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                    >
                        <Plus size={14} /> Add Item
                    </button>
                </div>
                <div className="form-grid-3">
                    {config.customExpenses.map((item) => (
                        <div key={item.id} className="input-group" style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                            <div style={{ flex: 1 }}>
                                <label className="input-label">Description</label>
                                <input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => {
                                        const updated = config.customExpenses.map(c => c.id === item.id ? { ...c, name: e.target.value } : c);
                                        onChange({ ...config, customExpenses: updated });
                                    }}
                                    className="form-input"
                                />
                            </div>
                            <div style={{ width: '100px' }}>
                                <label className="input-label">Amount</label>
                                <div className="input-wrapper">
                                    <div className="input-icon"><span style={{ fontSize: '12px' }}>$</span></div>
                                    <input
                                        type="number"
                                        value={item.value}
                                        onChange={(e) => {
                                            const updated = config.customExpenses.map(c => c.id === item.id ? { ...c, value: parseFloat(e.target.value) || 0 } : c);
                                            onChange({ ...config, customExpenses: updated });
                                        }}
                                        className="form-input"
                                        style={{ paddingLeft: '1.5rem' }}
                                    />
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    const updated = config.customExpenses.filter(c => c.id !== item.id);
                                    onChange({ ...config, customExpenses: updated });
                                }}
                                className="btn-remove"
                                style={{ padding: '0.5rem', marginBottom: '2px' }}
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                <div className="list-header">
                    <h4 className="card-section-title" style={{ margin: 0 }}>
                        <Users className="text-blue" style={{ display: 'inline', marginRight: '0.5rem' }} /> Staffing
                    </h4>
                    <button
                        onClick={addStaff}
                        className="btn-add"
                    >
                        <Plus size={16} /> Add Role
                    </button>
                </div>

                <div className="staff-list">
                    {config.staff.map((member) => (
                        <div key={member.id} className="list-item">
                            <div className="list-item-grid">
                                <div className="col-span-5">
                                    <input
                                        type="text"
                                        value={member.role}
                                        onChange={(e) => updateStaff(member.id, 'role', e.target.value)}
                                        className="form-input"
                                        placeholder="Role Name"
                                        style={{ background: 'transparent', border: 'none', paddingLeft: 0 }}
                                    />
                                </div>
                                <div className="col-span-3">
                                    <div className="input-wrapper">
                                        <span className="input-icon" style={{ left: '0.5rem' }}>$</span>
                                        <input
                                            type="number"
                                            value={member.salary}
                                            onChange={(e) => updateStaff(member.id, 'salary', parseFloat(e.target.value) || 0)}
                                            className="form-input"
                                            placeholder="Annual Salary"
                                            style={{ paddingLeft: '1.5rem' }}
                                        />
                                    </div>
                                </div>
                                <div className="col-span-3 flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span className="text-secondary" style={{ fontSize: '0.75rem' }}>Qty:</span>
                                    <input
                                        type="number"
                                        value={member.count}
                                        onChange={(e) => updateStaff(member.id, 'count', parseFloat(e.target.value) || 0)}
                                        className="form-input"
                                        style={{ width: '4rem', padding: '0.25rem 0.5rem' }}
                                    />
                                </div>
                                <div className="col-span-1 flex justify-end" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button
                                        onClick={() => removeStaff(member.id)}
                                        className="btn-remove"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {config.staff.length === 0 && (
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '1rem', fontStyle: 'italic' }}>No staff added yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};
