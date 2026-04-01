// API response types (matching Django serializers)

export interface Category {
    id: number;
    name: string;
}

export interface MeterCategory {
    id: number;
    name: string;
    unit: string;
}

export interface Expense {
    id: number;
    amount: string;
    comment: string;
    date: string;
    category: number;
}

export interface Meter {
    id: number;
    read: string;
    date: string;
    category: number;
}

export interface ExpenseSummary {
    date: string;
    category: number;
    total: string;
}

export interface TokenPair {
    access: string;
    refresh: string;
}

export interface UserData {
    id: number;
    username: string;
    access: string;
    refresh: string;
}

export interface LoginData {
    username: string;
    password: string;
}

// Frontend parsed types (after data transformation)

export interface ParsedExpense {
    id: number;
    amount: number;
    comment: string;
    date: Date;
    category: number;
}

export interface ParsedMeter {
    id: number;
    read: number;
    date: Date;
    category: number;
}

export interface ParsedExpenseSummary {
    date: string;
    category: number;
    total: number;
}

// Category mapping types

export type CategoryMapping = Record<number, string>;

export interface MeterCategoryInfo {
    name: string;
    unit: string;
}

export type MeterCategoryMapping = Record<number, MeterCategoryInfo>;

// Summary types

export type SummaryGroup = Record<number, number>;
export type SummaryGroups = Record<string, SummaryGroup>;
