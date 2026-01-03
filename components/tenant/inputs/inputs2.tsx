"use client";

/**
 * Inputs2 Component - Advanced Property Request Form
 *
 * This component follows a 99% default data + 1% visibility control approach:
 * - 99% of the data comes from getDefaultInputs2Data() (default data)
 * - 1% of the data comes from visibility controls (cardVisibility, fieldVisibility)
 *
 * This ensures consistent behavior while allowing fine-grained control over
 * which cards and fields are visible to users.
 */

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  DollarSign,
  Calendar,
  Tag,
  FileText,
  CreditCard,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultInputs2Data } from "../../../context/editorStoreFunctions/inputs2Functions";
import { useTenantId } from "@/hooks/useTenantId";
import axios from "axios";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Generate random ID function
const generateRandomId = (prefix: string = "id"): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${prefix}_${timestamp}_${random}`;
};

// API Data Interfaces
interface City {
  id: number;
  name_ar: string;
}

interface District {
  id: number;
  name_ar: string;
}

// Types
interface InputField {
  id: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "date"
    | "select"
    | "textarea"
    | "currency"
    | "radio";
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  icon?: React.ReactNode;
  description?: string;
}

interface InputCard {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  color?: string;
  customColors?: {
    primary?: string;
    secondary?: string;
    hover?: string;
    shadow?: string;
  };
  fields: InputField[];
  isCollapsible?: boolean;
  showAddButton?: boolean;
  addButtonText?: string;
  onAddNew?: () => void;
  onSave?: (data: any) => void;
  onDelete?: (id: string) => void;
}

interface InputsProps {
  // Editor props
  variant?: string;
  useStore?: boolean;
  id?: string;
  // API endpoint for form submission
  apiEndpoint?: string;
  // Additional props for store integration
  className?: string;
  visible?: boolean;
}

// Use the default data from inputs2Functions

// Helper function to get shadow color from primary color
const getShadowColor = (hex: string): string => {
  if (!hex || !hex.startsWith("#")) return "rgba(5, 150, 105, 0.1)"; // emerald-600 fallback
  const cleanHex = hex.replace("#", "");
  if (cleanHex.length !== 6) return "rgba(5, 150, 105, 0.1)";

  const r = parseInt(cleanHex.substr(0, 2), 16);
  const g = parseInt(cleanHex.substr(2, 2), 16);
  const b = parseInt(cleanHex.substr(4, 2), 16);

  return `rgba(${r}, ${g}, ${b}, 0.1)`;
};

// Main Component
const Inputs2: React.FC<InputsProps> = (props = {}) => {
  // Initialize variant id early so hooks can depend on it
  const variantId = props.variant || "inputs2";
  const uniqueId = props.id || variantId;

  // Tenant ID hook
  const { tenantId: currentTenantId, isLoading: tenantLoading } = useTenantId();

  // Subscribe to editor store updates for this inputs variant
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const inputs2States = useEditorStore((s) => s.inputs2States);

  useEffect(() => {
    if (props.useStore) {
      ensureComponentVariant("inputs2", variantId, props);
    }
  }, [variantId, props.useStore, ensureComponentVariant]);

  // Get tenant data
  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  // Get primary color from WebsiteLayout branding (fallback to emerald-600)
  // emerald-600 in Tailwind = #059669
  const primaryColor =
    tenantData?.WebsiteLayout?.branding?.colors?.primary &&
    tenantData.WebsiteLayout.branding.colors.primary.trim() !== ""
      ? tenantData.WebsiteLayout.branding.colors.primary
      : "#059669"; // emerald-600 default (fallback)

  // Helper function to create darker color for hover states
  const getDarkerColor = (hex: string, amount: number = 20): string => {
    // emerald-700 in Tailwind = #047857 (fallback)
    if (!hex || !hex.startsWith("#")) return "#047857";
    const cleanHex = hex.replace("#", "");
    if (cleanHex.length !== 6) return "#047857";

    const r = Math.max(
      0,
      Math.min(255, parseInt(cleanHex.substr(0, 2), 16) - amount),
    );
    const g = Math.max(
      0,
      Math.min(255, parseInt(cleanHex.substr(2, 2), 16) - amount),
    );
    const b = Math.max(
      0,
      Math.min(255, parseInt(cleanHex.substr(4, 2), 16) - amount),
    );

    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  };

  // Helper function to create lighter color (for hover backgrounds)
  const getLighterColor = (hex: string, opacity: number = 0.1): string => {
    if (!hex || !hex.startsWith("#")) return `${primaryColor}1A`; // 10% opacity default
    // Return hex color with opacity using rgba
    const cleanHex = hex.replace("#", "");
    if (cleanHex.length !== 6) return `${primaryColor}1A`;

    const r = parseInt(cleanHex.substr(0, 2), 16);
    const g = parseInt(cleanHex.substr(2, 2), 16);
    const b = parseInt(cleanHex.substr(4, 2), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const primaryColorHover = getDarkerColor(primaryColor, 20);
  const primaryColorLight = getLighterColor(primaryColor, 0.1); // 10% opacity for hover backgrounds
  const primaryColorShadow = getShadowColor(primaryColor); // Shadow color from primary

  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);

  // Get data from store or tenantData with fallback logic
  const storeData = props.useStore
    ? getComponentData("inputs2", variantId) || {}
    : {};
  const currentStoreData =
    props.useStore && inputs2States ? inputs2States[variantId] || {} : {};

  // Get tenant data for this specific component variant - memoized
  const tenantComponentData = useMemo(() => {
    if (!tenantData?.componentSettings) {
      return {};
    }
    // Search through all pages for this component variant
    for (const [pageSlug, pageComponents] of Object.entries(
      tenantData.componentSettings,
    )) {
      // Handle both array and object structures
      if (Array.isArray(pageComponents)) {
        // Handle array structure (like in JSON file)
        for (const component of pageComponents) {
          // Try exact match first
          if (
            component.type === "inputs2" &&
            component.componentName === variantId &&
            component.id === props.id
          ) {
            return component.data;
          }

          // Fallback: match without ID if props.id is undefined or empty
          if (
            component.type === "inputs2" &&
            component.componentName === variantId &&
            (!props.id || props.id === "" || props.id === component.id)
          ) {
            return component.data;
          }

          // Last resort: match only type and componentName
          if (
            component.type === "inputs2" &&
            component.componentName === variantId
          ) {
            return component.data;
          }
        }
      } else if (
        typeof pageComponents === "object" &&
        !Array.isArray(pageComponents)
      ) {
        // Handle object structure (legacy)
        for (const [componentId, component] of Object.entries(
          pageComponents as any,
        )) {
          if (
            (component as any).type === "inputs2" &&
            (component as any).componentName === variantId &&
            componentId === props.id
          ) {
            return (component as any).data;
          }
        }
      }
    }
    return {};
  }, [tenantData?.componentSettings, variantId, props.id]);

  // Merge data with priority: storeData > tenantComponentData > props > default - memoized
  const mergedData = useMemo(() => {
    const merged = {
      ...props,
      ...tenantComponentData,
      ...storeData,
    };
    return merged;
  }, [props, tenantComponentData, storeData]);

  // Get default data as base (99% of the data) - memoized
  const defaultData = useMemo(() => getDefaultInputs2Data(), []);

  // Only get visibility and required controls from store/tenant data (1% of the data) - memoized
  const visibilityControls = useMemo(
    () => ({
      cardVisibility:
        mergedData.cardVisibility || defaultData.cardVisibility || {},
      fieldVisibility:
        mergedData.fieldVisibility || defaultData.fieldVisibility || {},
      fieldRequired:
        mergedData.fieldRequired || defaultData.fieldRequired || {},
    }),
    [
      mergedData.cardVisibility,
      mergedData.fieldVisibility,
      mergedData.fieldRequired,
      defaultData.cardVisibility,
      defaultData.fieldVisibility,
      defaultData.fieldRequired,
    ],
  );

  // Use default data for everything else (99%) - memoized
  const componentData = useMemo(() => {
    // Use mergedData if it has fieldsLayout, otherwise use defaultData
    const baseData = mergedData.fieldsLayout ? mergedData : defaultData;

    const {
      cards = defaultData.cards,
      theme = defaultData.theme,
      submitButton = defaultData.submitButton,
      cardsLayout = baseData.cardsLayout || defaultData.cardsLayout,
      fieldsLayout = baseData.fieldsLayout || defaultData.fieldsLayout,
      texts = defaultData.texts,
      colors = defaultData.colors,
      settings = defaultData.settings,
      layout = defaultData.layout,
      apiEndpoint = defaultData.submitButton.apiEndpoint,
      className = "",
      visible = defaultData.visible,
    } = baseData;

    const submitButtonText = submitButton.text || "حفظ البيانات";
    const showSubmitButton = submitButton.show !== false;

    // Get cards layout settings
    const columns = cardsLayout.columns || "1";
    const gap = cardsLayout.gap || "24px";
    const responsive = cardsLayout.responsive || {
      mobile: "1",
      tablet: "2",
      desktop: "3",
    };

    // Get fields layout settings
    const fieldsColumns = fieldsLayout.columns || "1";
    const fieldsGap = fieldsLayout.gap || "16px";
    const fieldsResponsive = fieldsLayout.responsive || {
      mobile: "1",
      tablet: "2",
      desktop: "2",
    };

    return {
      cards,
      theme,
      submitButton,
      submitButtonText,
      showSubmitButton,
      cardsLayout,
      fieldsLayout,
      texts,
      colors,
      settings,
      layout,
      apiEndpoint,
      className,
      visible,
      columns,
      gap,
      responsive,
      fieldsColumns,
      fieldsGap,
      fieldsResponsive,
    };
  }, [defaultData]);

  // Destructure memoized data
  const {
    cards,
    theme,
    submitButton,
    submitButtonText,
    showSubmitButton,
    cardsLayout,
    fieldsLayout,
    texts,
    colors,
    settings,
    layout,
    apiEndpoint,
    className,
    visible,
    columns,
    gap,
    responsive,
    fieldsColumns,
    fieldsGap,
    fieldsResponsive,
  } = componentData;

  // Helper function to get card visibility key - memoized
  const getCardVisibilityKey = useCallback((cardId: string): string => {
    const cardIdLower = cardId.toLowerCase();
    if (
      cardIdLower.includes("معلومات العقار") ||
      cardIdLower.includes("property")
    ) {
      return "propertyInfoCard";
    }
    if (cardIdLower.includes("ميزانية") || cardIdLower.includes("budget")) {
      return "budgetCard";
    }
    if (cardIdLower.includes("تفاصيل") || cardIdLower.includes("additional")) {
      return "additionalDetailsCard";
    }
    if (cardIdLower.includes("تواصل") || cardIdLower.includes("contact")) {
      return "contactCard";
    }
    return "propertyInfoCard"; // default
  }, []);

  // Helper function to get field visibility key - memoized
  const getFieldVisibilityKey = useCallback((fieldId: string): string => {
    // Map field IDs to the keys used in backend data (old format)
    const fieldIdMapping: Record<string, string> = {
      property_type: "propertyType",
      category: "propertyCategory",
      region: "city",
      districts_id: "district",
      area_from: "areaFrom",
      area_to: "areaTo",
      purchase_method: "purchaseMethod",
      budget_from: "budgetFrom",
      budget_to: "budgetTo",
      seriousness: "seriousness",
      purchase_goal: "purchaseGoal",
      wants_similar_offers: "similarOffers",
      full_name: "fullName",
      phone: "phone",
      contact_on_whatsapp: "whatsapp",
      notes: "notes",
    };

    // Return the mapped key if it exists, otherwise return the original field ID
    return fieldIdMapping[fieldId] || fieldId;
  }, []);

  // Filter cards and fields based on visibility controls and apply required controls (1% control)
  const safeCards = useMemo(() => {
    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      return [];
    }

    const processedCards = cards
      .filter((card) => {
        if (!card || !card.fields || !Array.isArray(card.fields)) {
          return false;
        }

        // Check if card should be visible based on cardVisibility controls
        const cardId = card.id || card.title;
        const cardVisibilityKey = getCardVisibilityKey(cardId);
        const isCardVisible =
          visibilityControls.cardVisibility[cardVisibilityKey] !== false;

        return isCardVisible;
      })
      .map((card) => ({
        ...card,
        id: card.id || generateRandomId("card"),
        fields: card.fields
          .filter((field: any) => {
            if (!field || typeof field !== "object") {
              return false;
            }

            // Check if field should be visible based on fieldVisibility controls
            const fieldId = field.id;
            const fieldVisibilityKey = getFieldVisibilityKey(fieldId);
            const isFieldVisible =
              visibilityControls.fieldVisibility[fieldVisibilityKey] !== false;

            return isFieldVisible;
          })
          .map((field: any) => {
            // Apply required control from fieldRequired
            const fieldId = field.id;
            const fieldRequiredKey = getFieldVisibilityKey(fieldId); // Use same mapping
            const isFieldRequired =
              visibilityControls.fieldRequired[fieldRequiredKey] !== undefined
                ? visibilityControls.fieldRequired[fieldRequiredKey]
                : field.required; // Fallback to default required value

            return {
              ...field,
              id: field.id || generateRandomId("field"),
              required: isFieldRequired,
            };
          }),
      }));

    return processedCards;
  }, [cards, visibilityControls, getFieldVisibilityKey, getCardVisibilityKey]);

  // Use theme from mergedData
  const safeTheme = theme || getDefaultInputs2Data().theme;

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [collapsedCards, setCollapsedCards] = useState<Set<string>>(new Set());
  const [showPasswords, setShowPasswords] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // API Data States
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(
    null,
  );

  // Dropdown states
  const [cityOpen, setCityOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);

  // Auto-hide status messages after 5 seconds
  useEffect(() => {
    if (submitStatus.type) {
      const timer = setTimeout(() => {
        setSubmitStatus({ type: null, message: "" });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [submitStatus.type]);

  // Fetch cities on component mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoadingCities(true);
        const response = await axios.get(
          "https://nzl-backend.com/api/cities?country_id=1",
        );
        setCities(response.data.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, []);

  // Fetch districts when city is selected
  useEffect(() => {
    if (selectedCityId) {
      const fetchDistricts = async () => {
        try {
          setLoadingDistricts(true);
          const response = await axios.get(
            `https://nzl-backend.com/api/districts?city_id=${selectedCityId}`,
          );
          setDistricts(response.data.data);
        } catch (error) {
          console.error("Error fetching districts:", error);
        } finally {
          setLoadingDistricts(false);
        }
      };
      fetchDistricts();
    } else {
      setDistricts([]);
      setSelectedDistrictId(null);
    }
  }, [selectedCityId]);

  // Initialize form data
  useEffect(() => {
    try {
      const initialData: Record<string, any> = {};
      if (safeCards && Array.isArray(safeCards)) {
        safeCards.forEach((card, index) => {
          if (card && card.fields && Array.isArray(card.fields)) {
            card.fields.forEach((field: InputField, fieldIndex: number) => {
              if (field && field.id) {
                initialData[field.id] = field.type === "select" ? "" : "";
              }
            });
          }
        });
      }

      // Only update if the data has actually changed
      setFormData((prevData) => {
        const hasChanged =
          JSON.stringify(prevData) !== JSON.stringify(initialData);
        return hasChanged ? initialData : prevData;
      });
    } catch (error) {
      console.error("Error initializing form data:", error);
      setFormData({});
    }
  }, [safeCards]);

  // Handle input changes - memoized
  const handleInputChange = useCallback((fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));

    // Clear error when user starts typing
    setErrors((prev) => {
      if (prev[fieldId]) {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      }
      return prev;
    });
  }, []);

  // Handle city selection
  const handleCitySelect = useCallback((cityId: number) => {
    setSelectedCityId(cityId);
    setSelectedDistrictId(null);
    setFormData((prev) => ({
      ...prev,
      region: cityId,
    }));
  }, []);

  // Handle district selection
  const handleDistrictSelect = useCallback((districtId: number) => {
    setSelectedDistrictId(districtId);
    setFormData((prev) => ({
      ...prev,
      districts_id: districtId,
    }));
  }, []);

  // Toggle card collapse - memoized
  const toggleCardCollapse = useCallback((cardId: string) => {
    setCollapsedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  }, []);

  // Toggle password visibility - memoized
  const togglePasswordVisibility = useCallback((fieldId: string) => {
    setShowPasswords((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(fieldId)) {
        newSet.delete(fieldId);
      } else {
        newSet.add(fieldId);
      }
      return newSet;
    });
  }, []);

  // Validate field with enhanced validation for specific field types - memoized
  const validateField = useCallback((field: InputField, value: any): string => {
    if (field.required && (!value || value.toString().trim() === "")) {
      return `${field.label} مطلوب`;
    }

    // Skip validation for empty optional fields
    if (!value || value.toString().trim() === "") {
      return "";
    }

    // Integer validation for specific fields
    const integerFields = ["districts_id", "area_from", "area_to"];
    if (integerFields.includes(field.id)) {
      const numValue = Number(value);
      if (isNaN(numValue) || !Number.isInteger(numValue)) {
        return `${field.label} يجب أن يكون رقماً صحيحاً`;
      }
      if (numValue < 0) {
        return `${field.label} يجب أن يكون رقماً موجباً`;
      }
    }

    // Boolean validation for specific fields
    const booleanFields = ["wants_similar_offers", "contact_on_whatsapp"];
    if (booleanFields.includes(field.id)) {
      const stringValue = value.toString().toLowerCase();
      if (
        !["true", "false", "نعم", "لا", "yes", "no", "1", "0"].includes(
          stringValue,
        )
      ) {
        return `${field.label} يجب أن يكون نعم أو لا`;
      }
    }

    // Phone number validation
    if (field.id === "phone") {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,15}$/;
      if (!phoneRegex.test(value.toString())) {
        return `رقم الهاتف غير صحيح`;
      }
    }

    // Standard validation rules
    if (field.validation) {
      const { min, max, pattern, message } = field.validation;

      if (min !== undefined && value && value < min) {
        return message || `القيمة يجب أن تكون أكبر من أو تساوي ${min}`;
      }

      if (max !== undefined && value && value > max) {
        return message || `القيمة يجب أن تكون أقل من أو تساوي ${max}`;
      }

      if (pattern && value && !new RegExp(pattern).test(value)) {
        return message || `تنسيق ${field.label} غير صحيح`;
      }
    }

    return "";
  }, []);

  // Organize form data by cards - memoized
  const organizeFormDataByCards = useCallback(() => {
    if (!safeCards || !Array.isArray(safeCards)) {
      return {};
    }

    const organizedData: Record<string, any> = {};

    safeCards.forEach((card) => {
      if (card && card.id && card.fields && Array.isArray(card.fields)) {
        const cardData: Record<string, any> = {
          cardId: card.id,
          cardTitle: card.title,
          cardDescription: card.description,
          fields: {},
        };

        card.fields.forEach((field: InputField) => {
          if (field && field.id && formData[field.id] !== undefined) {
            cardData.fields[field.id] = {
              label: field.label,
              type: field.type,
              value: formData[field.id],
              required: field.required || false,
            };
          }
        });

        // Only add card if it has data
        if (Object.keys(cardData.fields).length > 0) {
          organizedData[card.id] = cardData;
        }
      }
    });

    return organizedData;
  }, [safeCards, formData, props.id]);

  // Create a clean summary report
  const createFormSummary = () => {
    const organizedData = organizeFormDataByCards();

    const summary = {
      totalCards: Object.keys(organizedData).length,
      totalFields: Object.values(organizedData).reduce(
        (total: number, card: any) => total + Object.keys(card.fields).length,
        0,
      ),
      cards: Object.values(organizedData).map((cardData: any) => ({
        title: cardData.cardTitle,
        description: cardData.cardDescription,
        fieldCount: Object.keys(cardData.fields).length,
        fields: Object.values(cardData.fields).map((field: any) => ({
          label: field.label,
          value: field.value,
          type: field.type,
          required: field.required,
        })),
      })),
      timestamp: new Date().toISOString(),
      formId: props.id || "inputs2",
    };

    return summary;
  };

  // Export data in different formats
  const exportFormData = (format: "json" | "csv" | "table" = "json") => {
    const organizedData = organizeFormDataByCards();

    switch (format) {
      case "json":
        return JSON.stringify(organizedData, null, 2);

      case "csv":
        const csvRows = [];
        csvRows.push([
          "Card Title",
          "Field Label",
          "Field Type",
          "Value",
          "Required",
        ]);

        Object.values(organizedData).forEach((cardData: any) => {
          Object.values(cardData.fields).forEach((field: any) => {
            csvRows.push([
              cardData.cardTitle,
              field.label,
              field.type,
              field.value,
              field.required ? "Yes" : "No",
            ]);
          });
        });

        return csvRows.map((row) => row.join(",")).join("\n");

      case "table":
        return Object.values(organizedData).map((cardData: any) => ({
          card: cardData.cardTitle,
          fields: Object.values(cardData.fields)
            .map((field: any) => `${field.label}: ${field.value}`)
            .join(" | "),
        }));

      default:
        return organizedData;
    }
  };

  // Map form field IDs to the required JSON field names with proper type conversion
  const mapFormDataToJsonFormat = (formData: Record<string, any>) => {
    // Create a mapping object for field IDs to JSON field names
    const fieldMapping: Record<string, string> = {
      // Property details
      property_type: "property_type",
      category: "category",
      region: "region",
      districts_id: "districts_id",
      area_from: "area_from",
      area_to: "area_to",
      purchase_method: "purchase_method",
      budget_from: "budget_from",
      budget_to: "budget_to",
      seriousness: "seriousness",
      purchase_goal: "purchase_goal",
      wants_similar_offers: "wants_similar_offers",
      // Contact details
      full_name: "full_name",
      phone: "phone",
      contact_on_whatsapp: "contact_on_whatsapp",
      notes: "notes",
    };

    // Create the JSON object with the exact format you specified
    const jsonData: Record<string, any> = {};

    // Map each field from formData to the JSON format with proper type conversion
    Object.keys(fieldMapping).forEach((fieldId) => {
      const jsonFieldName = fieldMapping[fieldId];
      const value = formData[fieldId] || "";

      // Convert data types based on field requirements
      if (["districts_id", "area_from", "area_to"].includes(fieldId)) {
        // Convert to integer for these fields
        jsonData[jsonFieldName] = value ? parseInt(value.toString()) : null;
      } else if (
        ["wants_similar_offers", "contact_on_whatsapp"].includes(fieldId)
      ) {
        // Convert to boolean for these fields
        if (value) {
          const stringValue = value.toString().toLowerCase();
          jsonData[jsonFieldName] = ["true", "نعم", "yes", "1"].includes(
            stringValue,
          );
        } else {
          jsonData[jsonFieldName] = false;
        }
      } else {
        // Keep as string for other fields
        jsonData[jsonFieldName] = value;
      }
    });

    // Add tenant_username with the tenant ID from the store
    const tenantId = useTenantStore.getState().tenantId;
    if (tenantId) {
      jsonData["tenant_username"] = tenantId;
    }

    return jsonData;
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Validate all fields
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    if (safeCards && Array.isArray(safeCards)) {
      safeCards.forEach((card, index) => {
        if (card && card.fields && Array.isArray(card.fields)) {
          card.fields.forEach((field: InputField, fieldIndex: number) => {
            if (field && field.id) {
              const error = validateField(field, formData[field.id]);
              if (error) {
                newErrors[field.id] = error;
                hasErrors = true;
              }
            }
          });
        }
      });
    }

    setErrors(newErrors);

    if (!hasErrors) {
      try {
        // Create the JSON data in the exact format you specified
        const jsonFormData = mapFormDataToJsonFormat(formData);

        // Send data to API endpoint
        if (apiEndpoint && apiEndpoint.trim() !== "") {
          try {
            // Parse custom headers if provided
            let headers: Record<string, string> = {
              "Content-Type": "application/json",
            };

            if (
              submitButton.apiHeaders &&
              submitButton.apiHeaders.trim() !== ""
            ) {
              try {
                const customHeaders = JSON.parse(submitButton.apiHeaders);
                headers = { ...headers, ...customHeaders };
              } catch (headerError) {
                console.warn("Invalid custom headers format:", headerError);
              }
            }

            const response = await fetch(apiEndpoint, {
              method: submitButton.apiMethod || "POST",
              headers,
              body: JSON.stringify(jsonFormData),
            });

            if (response.ok) {
              const result = await response.json();
              console.log("✅ Form submitted successfully:", result);
              setSubmitStatus({
                type: "success",
                message: "تم إرسال البيانات بنجاح!",
              });

              // Clear form data after successful submission
              setFormData({});
            } else {
              const errorText = await response.text();
              console.error(
                "❌ Form submission failed:",
                response.statusText,
                errorText,
              );
              setSubmitStatus({
                type: "error",
                message: `فشل في إرسال البيانات: ${response.statusText}`,
              });
            }
          } catch (apiError) {
            console.error("❌ API Error:", apiError);
            setSubmitStatus({
              type: "error",
              message: "حدث خطأ في الاتصال بالخادم",
            });
          }
        } else {
          // If no API endpoint, just show success message
          setSubmitStatus({
            type: "success",
            message: "تم حفظ البيانات محلياً!",
          });
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }

    setIsSubmitting(false);
  };

  // Render input field
  const renderInputField = (field: InputField) => {
    if (!field || !field.id) {
      console.warn("Inputs2: Invalid field data:", field);
      return null;
    }

    // Debug: console.log("Rendering field:", field.id, "type:", field.type, "options:", field.options);

    // Handle null, undefined, or empty string type - default to 'text'
    const fieldType =
      field.type && field.type.trim() !== "" ? field.type : "text";

    const hasError = !!errors[field.id];
    const isPassword = fieldType === "password";
    const showPassword = showPasswords.has(field.id);

    // Special handling for region (city) field
    if (field.id === "region") {
      const selectedCity = cities.find((city) => city.id === selectedCityId);

      return (
        <motion.div
          key={field.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {field.label}
            {field.required && <span className="text-red-500 mr-1">*</span>}
          </label>

          {field.description && field.description.trim() !== "" && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {field.description}
            </p>
          )}

          <Popover open={cityOpen} onOpenChange={setCityOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-between text-black",
                  hasError
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-300 hover:border-gray-400 dark:hover:border-gray-500",
                )}
                disabled={loadingCities}
              >
                {loadingCities
                  ? "جاري التحميل..."
                  : selectedCity
                    ? selectedCity.name_ar
                    : "اختر المدينة"}
              </Button>
            </PopoverTrigger>
            <PopoverContent side="bottom" align="start" className="w-full p-0">
              <Command>
                <CommandInput placeholder="ابحث عن مدينة..." />
                <CommandList className="text-black max-h-[200px] overflow-y-auto">
                  {cities.map((city) => (
                    <CommandItem
                      key={city.id}
                      onSelect={() => {
                        handleCitySelect(city.id);
                        setCityOpen(false);
                      }}
                      className="text-black"
                    >
                      {city.name_ar}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {hasError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center mt-2 text-red-500 text-sm"
            >
              <AlertCircle size={16} className="mr-1" />
              {errors[field.id]}
            </motion.div>
          )}
        </motion.div>
      );
    }

    // Special handling for districts_id field
    if (field.id === "districts_id") {
      const selectedDistrict = districts.find(
        (district) => district.id === selectedDistrictId,
      );

      return (
        <motion.div
          key={field.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {field.label}
            {field.required && <span className="text-red-500 mr-1">*</span>}
          </label>

          {field.description && field.description.trim() !== "" && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {field.description}
            </p>
          )}

          <Popover open={districtOpen} onOpenChange={setDistrictOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-between text-black",
                  hasError
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-300 hover:border-gray-400 dark:hover:border-gray-500",
                )}
                disabled={!selectedCityId || loadingDistricts}
              >
                {loadingDistricts
                  ? "جاري التحميل..."
                  : selectedDistrict
                    ? selectedDistrict.name_ar
                    : "اختر المنطقة"}
              </Button>
            </PopoverTrigger>
            <PopoverContent side="bottom" align="start" className="w-full p-0">
              <Command>
                <CommandInput placeholder="ابحث عن منطقة..." />
                <CommandList className="text-black max-h-[200px] overflow-y-auto">
                  {districts.map((district) => (
                    <CommandItem
                      key={district.id}
                      onSelect={() => {
                        handleDistrictSelect(district.id);
                        setDistrictOpen(false);
                      }}
                      className="text-black"
                    >
                      {district.name_ar}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {hasError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center mt-2 text-red-500 text-sm"
            >
              <AlertCircle size={16} className="mr-1" />
              {errors[field.id]}
            </motion.div>
          )}
        </motion.div>
      );
    }

    return (
      <motion.div
        key={field.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {field.label}
          {field.required && <span className="text-red-500 mr-1">*</span>}
        </label>

        {field.description && field.description.trim() !== "" && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {field.description}
          </p>
        )}

        <div className="relative">
          {field.icon &&
            typeof field.icon === "object" &&
            field.icon !== null && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {field.icon}
              </div>
            )}
          {field.icon &&
            typeof field.icon === "string" &&
            field.icon !== "" && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <span className="text-lg">{field.icon}</span>
              </div>
            )}
          {field.icon &&
            typeof field.icon === "object" &&
            field.icon !== null &&
            (field.icon as any).type && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <span className="text-lg">{(field.icon as any).type}</span>
              </div>
            )}
          {field.icon &&
            typeof field.icon === "object" &&
            field.icon !== null &&
            (field.icon as any).size && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <span className="text-lg">{(field.icon as any).size}</span>
              </div>
            )}
          {field.icon &&
            typeof field.icon === "object" &&
            field.icon !== null &&
            (field.icon as any).icon && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <span className="text-lg">{(field.icon as any).icon}</span>
              </div>
            )}
          {field.icon &&
            typeof field.icon === "object" &&
            field.icon !== null &&
            (field.icon as any).name && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <span className="text-lg">{(field.icon as any).name}</span>
              </div>
            )}
          {field.icon &&
            typeof field.icon === "object" &&
            field.icon !== null &&
            (field.icon as any).label && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <span className="text-lg">{(field.icon as any).label}</span>
              </div>
            )}
          {field.icon &&
            typeof field.icon === "object" &&
            field.icon !== null &&
            (field.icon as any).value && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <span className="text-lg">{(field.icon as any).value}</span>
              </div>
            )}

          {fieldType === "textarea" ? (
            <textarea
              value={formData[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={field.placeholder || `أدخل ${field.label}`}
              style={
                {
                  "--focus-ring-color": primaryColor,
                } as React.CSSProperties
              }
              className={`
                w-full px-4 py-3 pr-10 border rounded-xl transition-all duration-300
                focus:outline-none focus:ring-2 focus:border-transparent
                dark:bg-gray-800 dark:border-gray-600 dark:text-white
                ${
                  hasError
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-300 hover:border-gray-400 dark:hover:border-gray-500"
                }
              `}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = primaryColor;
                e.currentTarget.style.boxShadow = `0 0 0 2px ${primaryColor}40`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "";
                e.currentTarget.style.boxShadow = "";
              }}
              rows={4}
            />
          ) : fieldType === "select" ? (
            <div className="relative w-full">
              <select
                value={formData[field.id] || ""}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                style={
                  {
                    "--focus-ring-color": primaryColor,
                  } as React.CSSProperties
                }
                className={`
      w-full px-4 py-3 pr-12 border rounded-xl transition-all duration-300
      appearance-none
      focus:outline-none focus:ring-2 focus:border-transparent
      dark:bg-gray-800 dark:border-gray-600 dark:text-white
      ${
        hasError
          ? "border-red-500 bg-red-50 dark:bg-red-900/20"
          : "border-gray-300 hover:border-gray-400 dark:hover:border-gray-500"
      }
    `}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = primaryColor;
                  e.currentTarget.style.boxShadow = `0 0 0 2px ${primaryColor}40`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                <option value="">اختر {field.label}</option>
                {field.options && field.options.length > 0 ? (
                  field.options.map((option, index) => (
                    <option
                      key={`${field.id}_option_${index}_${option.value}`}
                      value={option.value}
                    >
                      {option.label || option.value}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    لا توجد خيارات متاحة
                  </option>
                )}
              </select>

              {/* السهم */}
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </div>
          ) : fieldType === "email" ? (
            <input
              type="email"
              value={formData[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={field.placeholder || `أدخل ${field.label}`}
              style={
                {
                  "--focus-ring-color": primaryColor,
                } as React.CSSProperties
              }
              className={`
                w-full px-4 py-3 pr-10 border rounded-xl transition-all duration-300
                focus:outline-none focus:ring-2 focus:border-transparent
                dark:bg-gray-800 dark:border-gray-600 dark:text-white
                ${
                  hasError
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-300 hover:border-gray-400 dark:hover:border-gray-500"
                }
              `}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = primaryColor;
                e.currentTarget.style.boxShadow = `0 0 0 2px ${primaryColor}40`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "";
                e.currentTarget.style.boxShadow = "";
              }}
            />
          ) : fieldType === "number" ? (
            <input
              type="number"
              value={formData[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={field.placeholder || `أدخل ${field.label}`}
              style={
                {
                  "--focus-ring-color": primaryColor,
                } as React.CSSProperties
              }
              className={`
                w-full px-4 py-3 pr-10 border rounded-xl transition-all duration-300
                focus:outline-none focus:ring-2 focus:border-transparent
                dark:bg-gray-800 dark:border-gray-600 dark:text-white
                ${
                  hasError
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-300 hover:border-gray-400 dark:hover:border-gray-500"
                }
              `}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = primaryColor;
                e.currentTarget.style.boxShadow = `0 0 0 2px ${primaryColor}40`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "";
                e.currentTarget.style.boxShadow = "";
              }}
            />
          ) : fieldType === "date" ? (
            <input
              type="date"
              value={formData[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={field.placeholder || `أدخل ${field.label}`}
              style={
                {
                  "--focus-ring-color": primaryColor,
                } as React.CSSProperties
              }
              className={`
                w-full px-4 py-3 pr-10 border rounded-xl transition-all duration-300
                focus:outline-none focus:ring-2 focus:border-transparent
                dark:bg-gray-800 dark:border-gray-600 dark:text-white
                ${
                  hasError
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-300 hover:border-gray-400 dark:hover:border-gray-500"
                }
              `}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = primaryColor;
                e.currentTarget.style.boxShadow = `0 0 0 2px ${primaryColor}40`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "";
                e.currentTarget.style.boxShadow = "";
              }}
            />
          ) : fieldType === "currency" ? (
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={formData[field.id] || ""}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                placeholder={field.placeholder || `أدخل ${field.label}`}
                style={
                  {
                    "--focus-ring-color": primaryColor,
                  } as React.CSSProperties
                }
                className={`
                  w-full px-4 py-3 pr-10 border rounded-xl transition-all duration-300
                  focus:outline-none focus:ring-2 focus:border-transparent
                  dark:bg-gray-800 dark:border-gray-600 dark:text-white
                  ${
                    hasError
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                      : "border-gray-300 hover:border-gray-400 dark:hover:border-gray-500"
                  }
                `}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = primaryColor;
                  e.currentTarget.style.boxShadow = `0 0 0 2px ${primaryColor}40`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "";
                  e.currentTarget.style.boxShadow = "";
                }}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                $
              </div>
            </div>
          ) : fieldType === "radio" ? (
            <div className="radio-group flex flex-wrap gap-3 mt-2">
              {field.options &&
              Array.isArray(field.options) &&
              field.options.length > 0 ? (
                field.options.map((option, index) => (
                  <div
                    key={`${field.id}_option_${index}_${option.value}`}
                    className={`radio-item flex items-center px-4 py-3 bg-white border-2 border-gray-300 rounded-full cursor-pointer transition-all duration-300 min-w-[120px] justify-center relative text-gray-700 hover:transform hover:-translate-y-1 ${
                      formData[field.id] === option.value
                        ? "text-white border-transparent shadow-lg"
                        : ""
                    }`}
                    style={
                      formData[field.id] === option.value
                        ? {
                            background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColorHover} 100%)`,
                          }
                        : {}
                    }
                    onMouseEnter={(e) => {
                      if (formData[field.id] !== option.value) {
                        e.currentTarget.style.borderColor = primaryColor;
                        e.currentTarget.style.backgroundColor =
                          primaryColorLight;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (formData[field.id] !== option.value) {
                        e.currentTarget.style.borderColor = "";
                        e.currentTarget.style.backgroundColor = "white";
                      }
                    }}
                    onClick={() => handleInputChange(field.id, option.value)}
                  >
                    <input
                      type="radio"
                      name={field.id}
                      value={option.value}
                      checked={formData[field.id] === option.value}
                      onChange={() => handleInputChange(field.id, option.value)}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">
                      {option.label || option.value}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-sm">
                  لا توجد خيارات متاحة
                </div>
              )}
            </div>
          ) : (
            <input
              type={isPassword && !showPassword ? "password" : "text"}
              value={formData[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={field.placeholder || `أدخل ${field.label}`}
              style={
                {
                  "--focus-ring-color": primaryColor,
                } as React.CSSProperties
              }
              className={`
                w-full px-4 py-3 pr-10 border rounded-xl transition-all duration-300
                focus:outline-none focus:ring-2 focus:border-transparent
                dark:bg-gray-800 dark:border-gray-600 dark:text-white
                ${
                  hasError
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-300 hover:border-gray-400 dark:hover:border-gray-500"
                }
              `}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = primaryColor;
                e.currentTarget.style.boxShadow = `0 0 0 2px ${primaryColor}40`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "";
                e.currentTarget.style.boxShadow = "";
              }}
            />
          )}

          {isPassword && (
            <button
              type="button"
              onClick={() => togglePasswordVisibility(field.id)}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>

        {hasError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center mt-2 text-red-500 text-sm"
          >
            <AlertCircle size={16} className="mr-1" />
            {errors[field.id]}
          </motion.div>
        )}
      </motion.div>
    );
  };

  // Render card
  const renderCard = (card: InputCard) => {
    if (!card || !card.id) {
      console.warn("Inputs2: Invalid card data:", card);
      return null;
    }

    const isCollapsed = collapsedCards.has(card.id);

    return (
      <motion.div
        key={card.id}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300"
        style={{
          boxShadow: `0 10px 25px -5px ${primaryColorShadow}, 0 10px 10px -5px ${primaryColorShadow}`,
        }}
      >
        {/* Card Header */}
        <div
          className="p-6 text-white transition-all duration-300"
          style={{
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColorHover} 100%)`,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              {card.icon &&
                typeof card.icon === "object" &&
                card.icon !== null && (
                  <div className="p-2 bg-white/20 rounded-lg">{card.icon}</div>
                )}
              {card.icon &&
                typeof card.icon === "string" &&
                card.icon !== "" && (
                  <div className="p-2 bg-white/20 rounded-lg">
                    <span className="text-2xl">{card.icon}</span>
                  </div>
                )}
              {card.icon &&
                typeof card.icon === "object" &&
                card.icon !== null &&
                (card.icon as any).type && (
                  <div className="p-2 bg-white/20 rounded-lg">
                    <span className="text-2xl">{(card.icon as any).type}</span>
                  </div>
                )}
              {card.icon &&
                typeof card.icon === "object" &&
                card.icon !== null &&
                (card.icon as any).size && (
                  <div className="p-2 bg-white/20 rounded-lg">
                    <span className="text-2xl">{(card.icon as any).size}</span>
                  </div>
                )}
              {card.icon &&
                typeof card.icon === "object" &&
                card.icon !== null &&
                (card.icon as any).icon && (
                  <div className="p-2 bg-white/20 rounded-lg">
                    <span className="text-2xl">{(card.icon as any).icon}</span>
                  </div>
                )}
              {card.icon &&
                typeof card.icon === "object" &&
                card.icon !== null &&
                (card.icon as any).name && (
                  <div className="p-2 bg-white/20 rounded-lg">
                    <span className="text-2xl">{(card.icon as any).name}</span>
                  </div>
                )}
              {card.icon &&
                typeof card.icon === "object" &&
                card.icon !== null &&
                (card.icon as any).label && (
                  <div className="p-2 bg-white/20 rounded-lg">
                    <span className="text-2xl">{(card.icon as any).label}</span>
                  </div>
                )}
              {card.icon &&
                typeof card.icon === "object" &&
                card.icon !== null &&
                (card.icon as any).value && (
                  <div className="p-2 bg-white/20 rounded-lg">
                    <span className="text-2xl">{(card.icon as any).value}</span>
                  </div>
                )}
              <div>
                <h3 className="text-xl font-bold">{card.title}</h3>
                {card.description && (
                  <p className="text-white/80 text-sm mt-1">
                    {card.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              {card.isCollapsible && (
                <button
                  onClick={() => toggleCardCollapse(card.id)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <motion.div
                    animate={{ rotate: isCollapsed ? 0 : 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TrendingUp size={20} />
                  </motion.div>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Card Content */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              <div
                className={`grid gap-4 ${
                  fieldsResponsive.mobile === "1"
                    ? "grid-cols-1"
                    : fieldsResponsive.mobile === "2"
                      ? "grid-cols-2"
                      : fieldsResponsive.mobile === "3"
                        ? "grid-cols-3"
                        : "grid-cols-4"
                } ${
                  fieldsResponsive.tablet === "1"
                    ? "md:grid-cols-1"
                    : fieldsResponsive.tablet === "2"
                      ? "md:grid-cols-2"
                      : fieldsResponsive.tablet === "3"
                        ? "md:grid-cols-3"
                        : "md:grid-cols-4"
                } ${
                  fieldsResponsive.desktop === "1"
                    ? "lg:grid-cols-1"
                    : fieldsResponsive.desktop === "2"
                      ? "lg:grid-cols-2"
                      : fieldsResponsive.desktop === "3"
                        ? "lg:grid-cols-3"
                        : "lg:grid-cols-4"
                }`}
                style={
                  {
                    gap: fieldsGap,
                    "--fields-columns": fieldsColumns,
                    "--fields-mobile": fieldsResponsive.mobile,
                    "--fields-tablet": fieldsResponsive.tablet,
                    "--fields-desktop": fieldsResponsive.desktop,
                  } as React.CSSProperties
                }
              >
                {card.fields && Array.isArray(card.fields)
                  ? card.fields
                      .filter(
                        (field) => field && field.id && field.id.trim() !== "",
                      )
                      .map((field, index) => {
                        return renderInputField(field);
                      })
                  : null}
              </div>

              {card.showAddButton && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
                >
                  <button
                    onClick={card.onAddNew}
                    className="w-full py-3 px-4 text-white rounded-xl hover:opacity-90 transition-all duration-300 flex items-center justify-center space-x-2 rtl:space-x-reverse font-medium"
                    style={{
                      background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColorHover} 100%)`,
                    }}
                  >
                    <Plus size={20} />
                    <span>{card.addButtonText || "إضافة جديد"}</span>
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  // Check if component should be visible
  if (!mergedData.visible) {
    return null;
  }

  // Show loading state while tenant is loading
  if (tenantLoading) {
    return (
      <section className="w-full bg-background py-8">
        <div className="mx-auto max-w-[1600px] px-4">
          <div className="text-center py-12">
            <div
              className="inline-block animate-spin rounded-full h-8 w-8 border-b-2"
              style={{ borderBottomColor: primaryColor }}
            ></div>
            <p className="text-lg text-gray-600 mt-4">
              جاري تحميل بيانات الموقع...
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Show error if no tenant ID
  if (!currentTenantId) {
    return (
      <section className="w-full bg-background py-8">
        <div className="mx-auto max-w-[1600px] px-4">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <p className="text-lg text-yellow-600 font-medium">
              لم يتم العثور على معرف الموقع
            </p>
            <p className="text-sm text-gray-500 mt-2">
              تأكد من أنك تصل إلى الموقع من الرابط الصحيح
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`w-full bg-background py-8 ${mergedData.className || ""}`}
      style={{
        backgroundColor:
          mergedData.background?.color ||
          mergedData.styling?.bgColor ||
          "transparent",
        paddingTop: mergedData.layout?.padding?.top || "2rem",
        paddingBottom: mergedData.layout?.padding?.bottom || "2rem",
      }}
    >
      <div
        className="mx-auto px-4"
        style={{
          maxWidth:
            mergedData.layout?.maxWidth ||
            mergedData.styling?.maxWidth ||
            "1600px",
        }}
      >
        <style jsx>{`
          @keyframes gradientShift {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }

          /* Responsive Grid Layout for Cards */
          .grid {
            display: grid !important;
            grid-template-columns: repeat(
              var(--cards-columns, 1),
              1fr
            ) !important;
          }

          /* Mobile First Approach */
          .grid[data-responsive-mobile="1"] {
            grid-template-columns: repeat(1, 1fr) !important;
          }
          .grid[data-responsive-mobile="2"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .grid[data-responsive-mobile="3"] {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .grid[data-responsive-mobile="4"] {
            grid-template-columns: repeat(4, 1fr) !important;
          }

          /* Tablet Override */
          @media (min-width: 768px) {
            .grid[data-responsive-tablet="1"] {
              grid-template-columns: repeat(1, 1fr) !important;
            }
            .grid[data-responsive-tablet="2"] {
              grid-template-columns: repeat(2, 1fr) !important;
            }
            .grid[data-responsive-tablet="3"] {
              grid-template-columns: repeat(3, 1fr) !important;
            }
            .grid[data-responsive-tablet="4"] {
              grid-template-columns: repeat(4, 1fr) !important;
            }
          }

          /* Desktop Override */
          @media (min-width: 1024px) {
            .grid[data-responsive-desktop="1"] {
              grid-template-columns: repeat(1, 1fr) !important;
            }
            .grid[data-responsive-desktop="2"] {
              grid-template-columns: repeat(2, 1fr) !important;
            }
            .grid[data-responsive-desktop="3"] {
              grid-template-columns: repeat(3, 1fr) !important;
            }
            .grid[data-responsive-desktop="4"] {
              grid-template-columns: repeat(4, 1fr) !important;
            }
          }

          /* Force override with CSS variables */
          .grid {
            grid-template-columns: repeat(
              var(--cards-columns, 1),
              1fr
            ) !important;
          }

          @media (min-width: 768px) {
            .grid {
              grid-template-columns: repeat(
                var(--cards-tablet, var(--cards-columns, 1)),
                1fr
              ) !important;
            }
          }

          @media (min-width: 1024px) {
            .grid {
              grid-template-columns: repeat(
                var(
                  --cards-desktop,
                  var(--cards-tablet, var(--cards-columns, 1))
                ),
                1fr
              ) !important;
            }
          }

          /* Additional force override */
          .grid[data-responsive-mobile="1"] {
            grid-template-columns: repeat(1, 1fr) !important;
          }
          .grid[data-responsive-mobile="2"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .grid[data-responsive-mobile="3"] {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .grid[data-responsive-mobile="4"] {
            grid-template-columns: repeat(4, 1fr) !important;
          }

          /* Responsive Grid Layout for Fields */
          .fields-grid {
            display: grid !important;
            grid-template-columns: repeat(
              var(--fields-columns, 1),
              1fr
            ) !important;
          }
        `}</style>

        <div
          className="grid"
          style={
            {
              gap: gap,
              display: "grid",
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              "--cards-columns": columns,
              "--cards-mobile": responsive.mobile,
              "--cards-tablet": responsive.tablet,
              "--cards-desktop": responsive.desktop,
            } as React.CSSProperties
          }
          data-responsive-mobile={responsive.mobile}
          data-responsive-tablet={responsive.tablet}
          data-responsive-desktop={responsive.desktop}
        >
          {safeCards && Array.isArray(safeCards)
            ? safeCards.map((card, index) => {
                if (card && card.id) {
                  return renderCard(card);
                }
                return null;
              })
            : null}
        </div>

        {showSubmitButton && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex flex-col items-center space-y-4"
          >
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: primaryColor,
                color: "#ffffff",
                borderRadius: submitButton.borderRadius || "8px",
                padding: submitButton.padding || "12px 24px",
                width: "100%",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = primaryColorHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = primaryColor;
              }}
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <>
                  <CheckCircle size={24} />
                  <span>{submitButtonText}</span>
                </>
              )}
            </button>

            {/* Status Messages */}
            <AnimatePresence>
              {submitStatus.type && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`w-full max-w-md p-4 rounded-lg flex items-center space-x-2 rtl:space-x-reverse ${
                    submitStatus.type === "success"
                      ? "border text-gray-800"
                      : "bg-red-50 border border-red-200 text-red-800"
                  }`}
                  style={
                    submitStatus.type === "success"
                      ? {
                          backgroundColor: primaryColorLight,
                          borderColor: primaryColor,
                          color: getDarkerColor(primaryColor, 40),
                        }
                      : {}
                  }
                >
                  {submitStatus.type === "success" ? (
                    <CheckCircle size={20} style={{ color: primaryColor }} />
                  ) : (
                    <AlertCircle size={20} className="text-red-600" />
                  )}
                  <span className="text-sm font-medium">
                    {submitStatus.message}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Inputs2;
