import React from 'react';
import type { CostConfig } from '../../types/analysis';
import { DollarSign, Percent, Ruler, FileText, ShieldAlert, Plus, X } from 'lucide-react';

interface CostFormProps {
    config: CostConfig;
    onChange: (config: CostConfig) => void;
}

const InputGroup = ({ label, icon: Icon, value, field, onChange, prefix = '$', step = 1000 }: any) => (
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

export const CostForm: React.FC<CostFormProps> = ({ config, onChange }) => {
    const handleChange = (field: keyof CostConfig, value: number) => {
        onChange({ ...config, [field]: value });
    };

    return (
        <div className="card">
            <h3 className="card-header">
                <DollarSign className="text-green" /> Project Costs
            </h3>

            <div className="form-grid-2">
                <div className="form-section">
                    <h4 className="card-section-title">Asset Costs</h4>
                    <InputGroup label="Building Size (sq ft)" icon={Ruler} value={config.buildingSize} field="buildingSize" onChange={handleChange} prefix="sq ft" step={100} />
                    <InputGroup label="Land Price" icon={DollarSign} value={config.landPrice} field="landPrice" onChange={handleChange} />
                    <InputGroup label="Construction Price" icon={DollarSign} value={config.constructionPrice} field="constructionPrice" onChange={handleChange} />
                </div>

                <div className="form-section">
                    <h4 className="card-section-title">Financing</h4>
                    <InputGroup label="Down Payment" icon={DollarSign} value={config.downPayment} field="downPayment" onChange={handleChange} />
                    <InputGroup label="Interest Rate" icon={Percent} value={config.interestRate} field="interestRate" onChange={handleChange} prefix="%" step={0.1} />
                    <InputGroup label="Loan Term (Years)" icon={FileText} value={config.loanTerm} field="loanTerm" onChange={handleChange} prefix="yrs" step={1} />
                </div>

                <div className="form-section col-span-2">
                    <h4 className="card-section-title">Fees & Contingencies</h4>
                    <div className="form-grid-3">
                        <InputGroup label="Legal Fees" icon={FileText} value={config.legalFees} field="legalFees" onChange={handleChange} step={100} />
                        <InputGroup label="Permit Fees" icon={FileText} value={config.permitFees} field="permitFees" onChange={handleChange} step={100} />
                        <InputGroup label="Contingency" icon={ShieldAlert} value={config.contingencyPercent} field="contingencyPercent" onChange={handleChange} prefix="%" step={1} />
                    </div>

                    {/* Custom Costs */}
                    <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                        <div className="list-header" style={{ borderTop: 'none', paddingTop: 0 }}>
                            <h4 className="card-section-title" style={{ margin: 0, fontSize: '0.875rem' }}>Additional Costs</h4>
                            <button
                                onClick={() => {
                                    const newItem = { id: Math.random().toString(36).substr(2, 9), name: 'New Cost', value: 0 };
                                    onChange({ ...config, customCosts: [...config.customCosts, newItem] });
                                }}
                                className="btn-add"
                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                            >
                                <Plus size={14} /> Add Item
                            </button>
                        </div>
                        <div className="form-grid-2">
                            {config.customCosts.map((item) => (
                                <div key={item.id} className="input-group" style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                                    <div style={{ flex: 1 }}>
                                        <label className="input-label">Description</label>
                                        <input
                                            type="text"
                                            value={item.name}
                                            onChange={(e) => {
                                                const updated = config.customCosts.map(c => c.id === item.id ? { ...c, name: e.target.value } : c);
                                                onChange({ ...config, customCosts: updated });
                                            }}
                                            className="form-input"
                                        />
                                    </div>
                                    <div style={{ width: '120px' }}>
                                        <label className="input-label">Amount</label>
                                        <div className="input-wrapper">
                                            <div className="input-icon"><DollarSign size={14} /></div>
                                            <input
                                                type="number"
                                                value={item.value}
                                                onChange={(e) => {
                                                    const updated = config.customCosts.map(c => c.id === item.id ? { ...c, value: parseFloat(e.target.value) || 0 } : c);
                                                    onChange({ ...config, customCosts: updated });
                                                }}
                                                className="form-input"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            const updated = config.customCosts.filter(c => c.id !== item.id);
                                            onChange({ ...config, customCosts: updated });
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
                </div>
            </div>
        </div>
    );
};
