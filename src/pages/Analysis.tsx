import React, { useState, useMemo } from 'react';
import type { CostConfig, OperatingConfig, RevenueConfig, MonthlyFinancials } from '../types/analysis';
import { CostForm } from '../components/analysis/CostForm';
import { OperatingForm } from '../components/analysis/OperatingForm';
import { RevenueForm } from '../components/analysis/RevenueForm';
import { FinancialCharts } from '../components/analysis/FinancialCharts';
import { Calculator } from 'lucide-react';
import '../styles/analysis.css';

export const Analysis: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'costs' | 'operations' | 'revenue'>('costs');

    // Initial State
    const [costConfig, setCostConfig] = useState<CostConfig>({
        buildingSize: 25000,
        landPrice: 500000,
        constructionPrice: 3000000,
        downPayment: 700000,
        interestRate: 7.0,
        loanTerm: 20,
        legalFees: 15000,
        permitFees: 10000,
        contingencyPercent: 10,
        customCosts: []
    });

    const [opConfig, setOpConfig] = useState<OperatingConfig>({
        electricityMonthly: 2500,
        waterMonthly: 800,
        sewerMonthly: 400,
        propertyTaxRate: 1.5,
        staff: [
            { id: '1', role: 'General Manager', salary: 85000, count: 1 },
            { id: '2', role: 'Front Desk', salary: 35000, count: 2 },
            { id: '3', role: 'Maintenance', salary: 45000, count: 1 }
        ],
        customExpenses: []
    });

    const [revConfig, setRevConfig] = useState<RevenueConfig>({
        activities: [
            { id: '1', name: 'Pickleball', hourlyRate: 40, dailyHours: 10, courts: 8 },
            { id: '2', name: 'Basketball', hourlyRate: 80, dailyHours: 6, courts: 2 }
        ],
        membershipCount: 200,
        membershipMonthlyFee: 50
    });

    // Calculations
    const financials = useMemo(() => {
        // 1. Loan Calculation
        const customCostsTotal = costConfig.customCosts.reduce((acc, item) => acc + item.value, 0);
        const totalProjectCost = costConfig.landPrice + costConfig.constructionPrice + costConfig.legalFees + costConfig.permitFees + customCostsTotal;
        const contingency = totalProjectCost * (costConfig.contingencyPercent / 100);
        const finalProjectCost = totalProjectCost + contingency;
        const loanPrincipal = Math.max(0, finalProjectCost - costConfig.downPayment);

        const monthlyRate = costConfig.interestRate / 100 / 12;
        const numPayments = costConfig.loanTerm * 12;
        const monthlyLoanPayment = loanPrincipal > 0
            ? (loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
            : 0;

        // 2. Operating Costs
        const annualPropertyTax = (costConfig.landPrice + costConfig.constructionPrice) * (opConfig.propertyTaxRate / 100);
        const monthlyPropertyTax = annualPropertyTax / 12;
        const monthlyStaffCost = opConfig.staff.reduce((acc, staff) => acc + (staff.salary * staff.count), 0) / 12;
        const customExpensesTotal = opConfig.customExpenses.reduce((acc, item) => acc + item.value, 0);
        const monthlyUtilities = opConfig.electricityMonthly + opConfig.waterMonthly + opConfig.sewerMonthly + customExpensesTotal;
        const totalMonthlyOpCost = monthlyUtilities + monthlyStaffCost + monthlyPropertyTax;

        // 3. Revenue
        const monthlyActivityRevenue = revConfig.activities.reduce((acc, act) => {
            return acc + (act.hourlyRate * act.dailyHours * act.courts * 30); // Approx 30 days
        }, 0);
        const monthlyMembershipRevenue = revConfig.membershipCount * revConfig.membershipMonthlyFee;
        const totalMonthlyRevenue = monthlyActivityRevenue + monthlyMembershipRevenue;

        // 4. Generate Monthly Data (1 Year)
        const monthlyData: MonthlyFinancials[] = [];
        let cumulativeCashFlow = -costConfig.downPayment; // Start with down payment as initial outflow? Or just operational?
        // Usually analysis starts post-construction, so let's track operational cash flow + initial investment

        for (let i = 1; i <= 12; i++) {
            const netCashFlow = totalMonthlyRevenue - (totalMonthlyOpCost + monthlyLoanPayment);
            cumulativeCashFlow += netCashFlow;
            monthlyData.push({
                month: i,
                revenue: totalMonthlyRevenue,
                operatingCost: totalMonthlyOpCost,
                loanPayment: monthlyLoanPayment,
                netCashFlow,
                cumulativeCashFlow
            });
        }

        return {
            monthlyData,
            summary: {
                totalProjectCost: finalProjectCost,
                monthlyLoanPayment,
                totalMonthlyOpCost,
                totalMonthlyRevenue,
                netMonthly: totalMonthlyRevenue - (totalMonthlyOpCost + monthlyLoanPayment)
            }
        };
    }, [costConfig, opConfig, revConfig]);

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

    return (
        <div className="analysis-page">
            <div className="analysis-container">
                <div className="page-header">
                    <div className="flex items-center gap-4">
                        <a href="/" className="icon-box hover:bg-blue-500/20 transition-colors" title="Back to Home">
                            <Calculator size={32} />
                        </a>
                        <div>
                            <h1 className="page-title">Financial Analysis</h1>
                            <p className="page-subtitle">Project feasibility simulation & forecasting</p>
                        </div>
                    </div>
                </div>

                <div className="analysis-grid">
                    {/* Left Panel: Configuration */}
                    <div className="config-panel">
                        {/* Tabs */}
                        <div className="tabs-container">
                            {(['costs', 'operations', 'revenue'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Forms */}
                        <div className="form-container">
                            {activeTab === 'costs' && <CostForm config={costConfig} onChange={setCostConfig} />}
                            {activeTab === 'operations' && <OperatingForm config={opConfig} onChange={setOpConfig} />}
                            {activeTab === 'revenue' && <RevenueForm config={revConfig} onChange={setRevConfig} />}
                        </div>
                    </div>

                    {/* Right Panel: Dashboard */}
                    <div className="dashboard-panel">
                        {/* Summary Cards */}
                        <div className="summary-grid">
                            <div className="summary-card">
                                <p className="summary-label">Total Project Cost</p>
                                <p className="summary-value">{formatCurrency(financials.summary.totalProjectCost)}</p>
                            </div>
                            <div className={`summary-card ${financials.summary.netMonthly >= 0 ? 'positive' : 'negative'}`}>
                                <p className={`summary-label ${financials.summary.netMonthly >= 0 ? 'text-green' : 'text-red'}`}>
                                    Est. Monthly Net
                                </p>
                                <p className={`summary-value ${financials.summary.netMonthly >= 0 ? 'text-green' : 'text-red'}`}>
                                    {formatCurrency(financials.summary.netMonthly)}
                                </p>
                            </div>
                        </div>

                        <div className="form-grid-3" style={{ marginBottom: '1.5rem' }}>
                            <div className="summary-card" style={{ padding: '1rem' }}>
                                <p className="summary-label">Monthly Revenue</p>
                                <p className="text-green font-bold text-lg">{formatCurrency(financials.summary.totalMonthlyRevenue)}</p>
                            </div>
                            <div className="summary-card" style={{ padding: '1rem' }}>
                                <p className="summary-label">Monthly Op. Cost</p>
                                <p className="text-red font-bold text-lg">{formatCurrency(financials.summary.totalMonthlyOpCost)}</p>
                            </div>
                            <div className="summary-card" style={{ padding: '1rem' }}>
                                <p className="summary-label">Loan Payment</p>
                                <p className="text-orange font-bold text-lg">{formatCurrency(financials.summary.monthlyLoanPayment)}</p>
                            </div>
                        </div>

                        {/* Charts */}
                        <FinancialCharts data={financials.monthlyData} />
                    </div>
                </div>
            </div>
        </div>
    );
};
