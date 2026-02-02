"use client";
import React from "react";
import { useEditorStore } from "@/context/editorStore";
import { FieldDefinition } from "@/componentsStructure/types";
import { DynamicFieldsRendererProps } from "../types";
import { normalizePath } from "../utils";
import {
  ColorFieldRenderer,
  BooleanFieldRenderer,
  NumberFieldRenderer,
} from "./FieldRenderers";
import {
  ArrayFieldRenderer,
  ObjectFieldRenderer,
} from "./FieldRenderers/index";

// Hooks
import { useVariantInitialization } from "./DynamicFieldsRenderer/hooks/useVariantInitialization";
import { useValueHelpers } from "./DynamicFieldsRenderer/hooks/useValueHelpers";
import { useIconHelpers } from "./DynamicFieldsRenderer/hooks/useIconHelpers";

// Renderers
import { TextFieldRenderer } from "./DynamicFieldsRenderer/renderers/TextFieldRenderer";
import { TextareaFieldRenderer } from "./DynamicFieldsRenderer/renderers/TextareaFieldRenderer";
import { SelectFieldRenderer } from "./DynamicFieldsRenderer/renderers/SelectFieldRenderer";
import { ColorFieldRendererWithToggle } from "./DynamicFieldsRenderer/renderers/ColorFieldRendererWithToggle";
import { BackgroundColorFieldRendererWithToggle } from "./DynamicFieldsRenderer/renderers/BackgroundColorFieldRendererWithToggle";
import { BackgroundColorObjectRenderer } from "./DynamicFieldsRenderer/renderers/BackgroundColorObjectRenderer";
import { ColorObjectRenderer } from "./DynamicFieldsRenderer/renderers/ColorObjectRenderer";

export function DynamicFieldsRenderer({
  fields,
  componentType,
  variantId,
  onUpdateByPath,
  currentData,
}: DynamicFieldsRendererProps) {
  const { tempData } = useEditorStore();

  // Initialize variant data if needed
  useVariantInitialization({
    variantId: variantId || null,
    componentType: componentType || null,
    tempData,
  });

  // Get value helpers
  const { getValueByPath, updateValue } = useValueHelpers({
    currentData,
    componentType: componentType || null,
    variantId: variantId || null,
    onUpdateByPath,
  });

  // Get icon helpers
  const { getIconComponent, isReactIcon } = useIconHelpers();

  const renderField = (def: FieldDefinition, basePath?: string) => {
    if (!def) {
      return null;
    }

    // إصلاح مشكلة تكرار المفاتيح في المسار
    let path: string;
    if (basePath) {
      // إذا كان basePath ينتهي بـ def.key، لا تضيفه مرة أخرى
      if (basePath.endsWith(`.${def.key}`) || basePath === def.key) {
        path = basePath;
      } else {
        path = `${basePath}.${def.key}`;
      }
    } else {
      path = def.key;
    }

    const normalizedPath = normalizePath(path);
    let value = getValueByPath(normalizedPath);

    // Ensure value is a string for color fields (not an object)
    if (def.type === "color") {
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        // If value is an object, it might contain useDefaultColor and globalColorType
        // Extract the actual color string value
        value = value.value || value.color || "";
      } else if (typeof value !== "string") {
        // If value is not a string, convert it to string or use empty string
        value = value ? String(value) : "";
      }
    }

    // دعم الـ conditional rendering
    if (def.condition) {
      // Build the full path for the condition field
      // If basePath exists, we need to find the parent path and append condition.field
      let conditionPath: string;
      if (basePath) {
        // Check if condition.field is already a full path
        if (def.condition.field.includes('.')) {
          conditionPath = def.condition.field;
        } else {
          // Extract parent path from basePath
          // For example: if basePath is "background.image", parent is "background"
          // Then conditionPath becomes "background.type"
          const pathParts = basePath.split('.');
          // Remove the last part (current field) to get parent path
          const parentPath = pathParts.slice(0, -1).join('.');
          if (parentPath) {
            conditionPath = `${parentPath}.${def.condition.field}`;
          } else {
            // If no parent path, use basePath directly
            conditionPath = `${basePath}.${def.condition.field}`;
          }
        }
      } else {
        conditionPath = def.condition.field;
      }
      
      const conditionFieldValue = getValueByPath(conditionPath);
      if (conditionFieldValue !== def.condition.value) {
        return null; // لا تعرض الحقل إذا لم تتحقق الشروط
      }
    }

    switch (def.type) {
      case "array": {
        return (
          <ArrayFieldRenderer
            def={def}
            normalizedPath={normalizedPath}
            value={Array.isArray(value) ? value : []}
            updateValue={updateValue}
            getValueByPath={getValueByPath}
            renderField={renderField}
          />
        );
      }
      case "text":
      case "image":
        return (
          <TextFieldRenderer
            def={def}
            normalizedPath={normalizedPath}
            value={value}
            updateValue={updateValue}
          />
        );
      case "textarea":
        return (
          <TextareaFieldRenderer
            def={def}
            normalizedPath={normalizedPath}
            value={value}
            updateValue={updateValue}
          />
        );
      case "number":
        return (
          <NumberFieldRenderer
            label={def.label}
            path={normalizedPath}
            value={value ?? 0}
            updateValue={updateValue}
          />
        );
      case "boolean":
        return (
          <BooleanFieldRenderer
            label={def.label}
            path={normalizedPath}
            value={!!value}
            updateValue={updateValue}
          />
        );
      case "color": {
        // Check if this is a background color field with useMainBgColor
        // Use BackgroundColorObjectRenderer to display as object field
        if (def.useMainBgColor !== undefined) {
          return (
            <BackgroundColorObjectRenderer
              def={def}
              normalizedPath={normalizedPath}
              value={value}
              updateValue={updateValue}
              getValueByPath={getValueByPath}
            />
          );
        }
        // Check if this is a color field with useDefaultColor
        // Use ColorObjectRenderer to display as object field (same UI as BackgroundColorObjectRenderer)
        if (def.useDefaultColor !== undefined) {
          return (
            <ColorObjectRenderer
              def={def}
              normalizedPath={normalizedPath}
              value={value}
              updateValue={updateValue}
              getValueByPath={getValueByPath}
            />
          );
        }
        // Otherwise use the regular ColorFieldRenderer (no toggle, no object UI)
        return (
          <ColorFieldRenderer
            label={def.label}
            path={normalizedPath}
            value={typeof value === "string" ? value : ""}
            updateValue={updateValue}
          />
        );
      }
      case "select": {
        return (
          <SelectFieldRenderer
            def={def}
            normalizedPath={normalizedPath}
            value={value}
            updateValue={updateValue}
            getIconComponent={getIconComponent}
            isReactIcon={isReactIcon}
          />
        );
      }
      case "object": {
        return (
          <ObjectFieldRenderer
            def={def}
            normalizedPath={normalizedPath}
            value={value}
            updateValue={updateValue}
            getValueByPath={getValueByPath}
            renderField={renderField}
          />
        );
      }
    }
    return null;
  };

  // عرض جميع الحقول بالترتيب الموجود في المصفوفة فقط
  // بدون أي معالجة خاصة أو تصفية
  return (
    <div className="space-y-4">
      {fields.map((f, i) => (
        <div key={i}>{renderField(f)}</div>
      ))}
    </div>
  );
}
