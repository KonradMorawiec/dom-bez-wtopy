// Struktura dokumentu etapu budowy
export interface ConstructionStep {
    id?: string;
    title: string;
    order: number;
    articleId: string; // ID powiązanego artykułu
    children: string[];
    checklist: ChecklistItem[];
    completed: boolean;
}

// Struktura dokumentu artykułu
export interface Article {
    id?: string;
    title: string;
    content: string;
    createdAt: Date;
    stepId?: string; // ID powiązanego etapu (opcjonalne)
}

export interface ChecklistItem {
    id: number;
    text: string;
    checked: boolean;
}