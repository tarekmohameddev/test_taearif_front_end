/**
 * Merges default data (from editorStoreFunctions) with structure-derived empty keys
 * for full overrideData in Storybook Theme1. Default data wins on conflict.
 */

import type { FieldDefinition, FieldType } from "@/componentsStructure/types";
import { getFieldsForVariant } from "./structureRegistry";

function emptyValueByType(type: FieldType): unknown {
  switch (type) {
    case "object":
      return {};
    case "array":
      return [];
    case "number":
      return 0;
    case "boolean":
      return false;
    case "text":
    case "textarea":
    case "color":
    case "image":
    case "select":
    default:
      return "";
  }
}

function setByPath(obj: Record<string, unknown>, path: string, value: unknown): void {
  const parts = path.split(".");
  let current: Record<string, unknown> = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    if (!(key in current) || typeof current[key] !== "object" || current[key] === null) {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }
  current[parts[parts.length - 1]] = value;
}

function getFieldsToProcess(field: FieldDefinition): FieldDefinition[] {
  if ("fields" in field && field.type === "object" && field.fields) {
    return field.fields;
  }
  if ("groupFields" in field && field.groupFields) {
    return field.groupFields;
  }
  if ("wrappedFields" in field && field.wrappedFields) {
    return field.wrappedFields;
  }
  if ("of" in field && field.type === "array" && field.of) {
    return field.of;
  }
  return [];
}

function buildEmptyFromFields(fields: FieldDefinition[]): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const field of fields) {
    const key = field.key;
    if (key.includes(".")) {
      const value =
        field.type === "object" && "fields" in field && field.fields
          ? buildEmptyFromFields(field.fields)
          : field.type === "array"
            ? []
            : emptyValueByType(field.type as FieldType);
      setByPath(result, key, value);
      continue;
    }
    if (field.type === "object" && "fields" in field && field.fields) {
      result[key] = buildEmptyFromFields(field.fields);
    } else if (field.type === "array" && "of" in field && field.of) {
      result[key] = [];
    } else if (("groupFields" in field && field.groupFields) || ("wrappedFields" in field && field.wrappedFields)) {
      const sub = getFieldsToProcess(field);
      result[key] = sub.length ? buildEmptyFromFields(sub) : {};
    } else {
      result[key] = emptyValueByType(field.type as FieldType);
    }
  }
  return result;
}

function deepMergeDefaultWins(
  defaultData: Record<string, unknown>,
  structureFilled: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...structureFilled };
  for (const key of Object.keys(defaultData)) {
    const defaultVal = defaultData[key];
    const structureVal = result[key];
    if (
      defaultVal !== null &&
      typeof defaultVal === "object" &&
      !Array.isArray(defaultVal) &&
      structureVal !== null &&
      typeof structureVal === "object" &&
      !Array.isArray(structureVal)
    ) {
      result[key] = deepMergeDefaultWins(
        defaultVal as Record<string, unknown>,
        structureVal as Record<string, unknown>
      );
    } else {
      result[key] = defaultVal;
    }
  }
  return result;
}

/**
 * Merges default data with structure-derived empty keys. Default data wins.
 * Call from defaultData.getMergedDefaultDataForStory to avoid circular dependency.
 */
export function mergeDefaultWithStructure(
  componentName: string,
  defaultData: Record<string, unknown> | undefined
): Record<string, unknown> | undefined {
  if (!defaultData) return undefined;
  const fields = getFieldsForVariant(componentName);
  if (!fields || fields.length === 0) return defaultData;
  const structureFilled = buildEmptyFromFields(fields);
  return deepMergeDefaultWins(defaultData, structureFilled);
}

export { emptyValueByType, buildEmptyFromFields, deepMergeDefaultWins };
