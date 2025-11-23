import React from 'react';
import type { MonthlyFinancials } from '../../types/analysis';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface FinancialChartsProps {
    data: MonthlyFinancials[];
}

export const FinancialCharts: React.FC<FinancialChartsProps> = ({ data }) => {
    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

    return (
        <div style={{ display: 'grid', gap: '2rem' }}>
            <div className="card">
                <h3 className="card-header" style={{ fontSize: '1.125rem' }}>Monthly Cash Flow</h3>
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="month" stroke="#9CA3AF" tickFormatter={(value) => `M${value}`} />
                            <YAxis stroke="#9CA3AF" tickFormatter={(value) => `$${value / 1000}k`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }}
                                formatter={(value: number) => formatCurrency(value)}
                            />
                            <Legend />
                            <Bar dataKey="revenue" name="Revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="operatingCost" name="Op. Expenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="loanPayment" name="Loan Payment" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="card">
                <h3 className="card-header" style={{ fontSize: '1.125rem' }}>Cumulative Cash Flow (1 Year)</h3>
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="month" stroke="#9CA3AF" tickFormatter={(value) => `M${value}`} />
                            <YAxis stroke="#9CA3AF" tickFormatter={(value) => `$${value / 1000}k`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }}
                                formatter={(value: number) => formatCurrency(value)}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="cumulativeCashFlow"
                                name="Cumulative Balance"
                                stroke="#3B82F6"
                                strokeWidth={3}
                                dot={{ fill: '#3B82F6' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
