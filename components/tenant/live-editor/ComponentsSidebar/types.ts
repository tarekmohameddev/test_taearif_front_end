import { ComponentType } from "@/lib/ComponentsList";

export type ThemeTab = "theme1" | "theme2" | "theme3";

export interface Section {
  type: string;
  name: string;
  description: string;
  section: string;
  component: string;
}

export interface CategorySectionProps {
  category: string;
  sections: Section[];
  isExpanded: boolean;
  onToggle: () => void;
  searchTerm: string;
  activeTab: ThemeTab;
  t: (key: string) => string;
}

export interface ComponentCardProps {
  section: Section;
  variantName?: string;
  activeTab: ThemeTab;
  t: (key: string) => string;
}

export interface CategoriesListProps {
  componentsByCategory: Record<string, Section[]>;
  expandedCategories: Set<string>;
  toggleCategory: (category: string) => void;
  searchTerm: string;
  activeTab: ThemeTab;
  t: (key: string) => string;
}
