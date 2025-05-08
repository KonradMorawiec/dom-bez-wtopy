// Struktura dokumentu etapu budowy
export interface ConstructionStep {
    isActive: boolean; // Flaga wskazująca, czy krok jest aktywny
    name: string; // Tytuł kroku
    title: string; // Tytuł kroku (duża litera na początku))
    children?: ConstructionStepItem[];
    icon?: string; // Ikona kroku
}

export interface ConstructionStepItem {
    id: string; // Unikalny identyfikator elementu
    title: string; // Tytuł elementu
    icon: string; // Ikona elementu
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