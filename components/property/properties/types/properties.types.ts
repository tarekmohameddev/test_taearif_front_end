export interface PropertiesManagementPageProps {
  isIncompletePage?: boolean;
}

export interface PropertyCardProps {
  property: any;
  allProperties?: any[];
  currentIndex?: number;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (property: any) => void;
  onToggleStatus?: (property: any) => void;
  onShare?: (property: any) => void;
  setReorderPopup?: any;
  showIncompleteOnly?: boolean;
  onCompleteDraft?: (id: string) => void;
}

export interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  property: any;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  from: number;
  to: number;
}

export interface ImportResult {
  status: "success" | "partial_success" | "error" | null;
  message: string;
  code?: string;
  imported_count?: number;
  updated_count?: number;
  failed_count?: number;
  incomplete_count?: number;
  errors?: Array<{
    row: number;
    field: string;
    error: string;
    expected: string;
    actual: string | null;
    severity: string;
    suggestion: string;
  }>;
  details?: {
    suggestion?: string;
    [key: string]: any;
  };
}

export interface ReorderPopup {
  open: boolean;
  type: "featured" | "normal";
}
