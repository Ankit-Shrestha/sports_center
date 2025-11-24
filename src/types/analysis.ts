export interface CustomItem {
    id: string;
    name: string;
    value: number;
}

export interface CostConfig {
    buildingSize: number;
    landPrice: number;
    constructionPrice: number;
    downPayment: number;
    interestRate: number;
    loanTerm: number;
    legalFees: number;
    permitFees: number;
    contingencyPercent: number;
    customCosts: CustomItem[];
}

export interface StaffMember {
    id: string;
    role: string;
    salary: number; // annual
    count: number;
}

export interface OperatingConfig {
    electricityMonthly: number;
    waterMonthly: number;
    sewerMonthly: number;
    propertyTaxRate: number; // percentage
    staff: StaffMember[];
    customExpenses: CustomItem[];
}

export interface SportActivity {
    id: string;
    name: string;
    hourlyRate: number;
    dailyHours: number;
    courts: number; // number of courts/fields
}

export interface RevenueConfig {
    activities: SportActivity[];
    membershipCount: number;
    membershipMonthlyFee: number;
    unusedDays: number;
}

export interface MonthlyFinancials {
    month: number;
    revenue: number;
    operatingCost: number;
    loanPayment: number;
    netCashFlow: number;
    cumulativeCashFlow: number;
}

export interface BreakEvenMetrics {
    netOperatingIncome: number;
    loanPrincipal: number;
    payoffMonths: number;
    isProfitable: boolean;
}
