import { ComponentData, ComponentInstance } from "@/lib/types";
import type {
  FieldDefinition,
  ComponentStructure,
  VariantDefinition,
} from "@/componentsStructure/types";

export interface EditorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  view: "main" | "add-section" | "edit-component" | "branding-settings";
  setView: (
    view: "main" | "add-section" | "edit-component" | "branding-settings",
  ) => void;
  selectedComponent: ComponentInstance | null;
  onComponentUpdate: (id: string, newData: ComponentData) => void;
  onComponentThemeChange?: (id: string, newTheme: string) => void;
  onPageThemeChange?: (
    themeId: string,
    components: Record<string, string>,
  ) => void;
  onSectionAdd: (type: string) => void;
  onComponentReset?: (id: string) => void;
  width: number;
  setWidth: (w: number) => void;
}

export interface AvailableSection {
  type: string;
  name: string;
  section: string;
  component: string;
  description: string;
}

export interface AdvancedSimpleSwitcherProps {
  type: string;
  componentName: string;
  componentId?: string;
  onUpdateByPath?: (path: string, value: any) => void;
  currentData?: any;
  mode?: "simple" | "advanced";
  setMode?: (mode: "simple" | "advanced") => void;
}

export interface DynamicFieldsRendererProps {
  fields: FieldDefinition[];
  componentType?: string;
  variantId?: string;
  onUpdateByPath?: (path: string, value: any) => void;
  currentData?: any;
}

export interface FieldRendererProps {
  def: FieldDefinition;
  basePath?: string;
  getValueByPath: (path: string) => any;
  updateValue: (path: string, value: any) => void;
  expanded: Record<string, boolean>;
  setExpanded: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}
