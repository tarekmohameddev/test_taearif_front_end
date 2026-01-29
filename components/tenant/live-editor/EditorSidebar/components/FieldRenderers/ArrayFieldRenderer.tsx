"use client";
import React, { useState } from "react";
import { FieldDefinition } from "@/componentsStructure/types";
import { useEditorT, useEditorLocale } from "@/context/editorI18nStore";

interface ArrayFieldRendererProps {
  def: FieldDefinition;
  normalizedPath: string;
  value: any[];
  updateValue: (path: string, value: any) => void;
  getValueByPath: (path: string) => any;
  renderField: (def: FieldDefinition, basePath?: string) => React.ReactNode;
}

export function ArrayFieldRenderer({
  def,
  normalizedPath,
  value,
  updateValue,
  getValueByPath,
  renderField,
}: ArrayFieldRendererProps) {
  const t = useEditorT();
  const { locale } = useEditorLocale();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [allCollapsed, setAllCollapsed] = useState(false);
  const [nestedExpanded, setNestedExpanded] = useState<Record<string, boolean>>(
    {},
  );
  const [fieldTypes, setFieldTypes] = useState<Record<string, string>>({});
  const arrDef = def as any;

  // Update field types when value changes
  React.useEffect(() => {
    if (Array.isArray(value)) {
      const newFieldTypes: Record<string, string> = {};
      value.forEach((item, idx) => {
        if (item && typeof item === "object" && item.type) {
          newFieldTypes[`${normalizedPath}.${idx}`] = item.type;
        }
      });
      setFieldTypes(newFieldTypes);
    }
  }, [value, normalizedPath]);

  // Primitive array support (e.g., movingServices.en: string[])
  if (arrDef.itemType === "text") {
    const items: string[] = Array.isArray(value) ? value : [];
    const addItem = () => {
      const newItems = [...items, ""];
      updateValue(normalizedPath, newItems);
    };
    const updateItem = (idx: number, v: string) => {
      const next = items.slice();
      next[idx] = v;
      updateValue(normalizedPath, next);
    };
    const removeItem = (idx: number) => {
      const next = items.slice();
      next.splice(idx, 1);
      updateValue(normalizedPath, next);
    };
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">
            {def.label}
          </span>
          <button
            type="button"
            onClick={addItem}
            className="px-3 py-1.5 text-xs rounded-lg bg-slate-100 hover:bg-blue-100 border border-transparent hover:border-blue-300 transition-all duration-200"
          >
            {locale === "ar" ? t("live_editor.add") : "Add"}
          </button>
        </div>
        {items.map((it, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              type="text"
              value={it}
              onChange={(e) => updateItem(idx, e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => removeItem(idx)}
              className="px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-600"
            >
              {locale === "ar" ? t("live_editor.remove") : "Remove"}
            </button>
          </div>
        ))}
      </div>
    );
  }

  // Enhanced Object array support with universal compatibility
  const items: any[] = Array.isArray(value) ? value : [];

  // Smart default value generator based on field definitions
  const generateDefaultItem = (): any => {
    const newItem: any = {};
    if (arrDef.of && Array.isArray(arrDef.of)) {
      for (const f of arrDef.of) {
        // Generate smart defaults based on field type
        switch (f.type) {
          case "text":
            newItem[f.key] = f.defaultValue || "";
            break;
          case "number":
            newItem[f.key] = f.defaultValue || 0;
            break;
          case "boolean":
            newItem[f.key] = f.defaultValue || false;
            break;
          case "color":
            newItem[f.key] = f.defaultValue || "#000000";
            break;
          case "image":
            newItem[f.key] = f.defaultValue || "";
            break;
          case "select":
            newItem[f.key] = f.defaultValue || f.options?.[0]?.value || "";
            break;
          case "object":
            newItem[f.key] = f.defaultValue || {};
            break;
          case "array":
            newItem[f.key] = f.defaultValue || [];
            break;
          default:
            newItem[f.key] = f.defaultValue || "";
        }
      }

      // Auto-generate ID if not in field definitions but needed for the array
      // Check if the path suggests this is a partners or logos array that needs IDs
      if (
        !newItem.id &&
        (normalizedPath.includes("partners") ||
          normalizedPath.includes("logos"))
      ) {
        // Generate unique ID using timestamp + random number
        newItem.id = `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }

      return newItem;
    }
    return {};
  };
  const addItem = () => {
    const newItem = generateDefaultItem();
    updateValue(normalizedPath, [...items, newItem]);
  };

  const expandAll = () => {
    setExpanded((s) => {
      const next = { ...s } as Record<string, boolean>;
      for (let i = 0; i < items.length; i++)
        next[`${normalizedPath}.${i}`] = true;
      return next;
    });
  };

  const collapseAll = () => {
    setExpanded((s) => {
      const next = { ...s } as Record<string, boolean>;
      for (let i = 0; i < items.length; i++)
        next[`${normalizedPath}.${i}`] = false;
      return next;
    });
  };

  const toggleCollapseAll = () => {
    if (allCollapsed) {
      // Expand all
      setExpanded((s) => {
        const next = { ...s } as Record<string, boolean>;
        for (let i = 0; i < items.length; i++)
          next[`${normalizedPath}.${i}`] = true;
        return next;
      });
      setAllCollapsed(false);
    } else {
      // Collapse all
      setExpanded((s) => {
        const next = { ...s } as Record<string, boolean>;
        for (let i = 0; i < items.length; i++)
          next[`${normalizedPath}.${i}`] = false;
        return next;
      });
      setAllCollapsed(true);
    }
  };

  const toggleNestedItem = (nestedKey: string) => {
    setNestedExpanded((s) => ({
      ...s,
      [nestedKey]: !s[nestedKey],
    }));
  };

  // Enhanced item title generation with multiple fallback strategies
  const getItemTitle = (item: any, idx: number): string => {
    // Try multiple common title patterns
    const titlePatterns = [
      item?.title?.en,
      item?.title,
      item?.text?.en,
      item?.text,
      item?.name?.en,
      item?.name,
      item?.label?.en,
      item?.label,
      item?.heading?.en,
      item?.heading,
      item?.id,
      item?.key,
      item?.value,
    ];

    const candidate = titlePatterns.find(
      (pattern) =>
        pattern && typeof pattern === "string" && pattern.trim().length > 0,
    );

    const base = candidate
      ? String(candidate).trim()
      : `${arrDef.itemLabel || (locale === "ar" ? t("live_editor.item") : "Item")} ${idx + 1}`;

    // Truncate long titles
    return base.length > 50 ? base.substring(0, 47) + "..." : base;
  };

  // Enhanced nested array support for complex structures like menu items
  const renderNestedArray = (field: any, itemPath: string, item: any) => {
    if (field.type !== "array") return null;

    const nestedItems = Array.isArray(item[field.key]) ? item[field.key] : [];

    return (
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-slate-700 text-sm">{field.label}</h5>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
              {nestedItems.length} {locale === "ar" ? t("live_editor.items") : "items"}
            </span>
            <button
              type="button"
              onClick={() => {
                const newItem = field.of
                  ? field.of.reduce((acc: any, f: any) => {
                      acc[f.key] =
                        f.defaultValue ||
                        (f.type === "text"
                          ? ""
                          : f.type === "number"
                            ? 0
                            : f.type === "boolean"
                              ? false
                              : "");
                      return acc;
                    }, {})
                  : {};
                const updatedItem = { ...item };
                updatedItem[field.key] = [...nestedItems, newItem];
                updateValue(itemPath, updatedItem);
              }}
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              {locale === "ar" ? t("live_editor.add") : "Add"} {field.itemLabel || (locale === "ar" ? t("live_editor.item") : "Item")}
            </button>
          </div>
        </div>

        {nestedItems.map((nestedItem: any, nestedIdx: number) => (
          <div
            key={nestedIdx}
            className={`rounded-lg p-3 border transition-all duration-200 ${
              nestedExpanded[`${itemPath}.${field.key}.${nestedIdx}`]
                ? "bg-slate-50 border-slate-200"
                : "bg-orange-50 border-orange-200 opacity-75"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    toggleNestedItem(`${itemPath}.${field.key}.${nestedIdx}`)
                  }
                  className={`p-1 rounded-lg border border-transparent transition-all duration-200 ${
                    nestedExpanded[`${itemPath}.${field.key}.${nestedIdx}`]
                      ? "bg-slate-100 hover:bg-purple-100 hover:border-purple-300"
                      : "bg-orange-100 hover:bg-orange-200 hover:border-orange-300"
                  }`}
                  title={
                    nestedExpanded[`${itemPath}.${field.key}.${nestedIdx}`]
                      ? (locale === "ar" ? t("live_editor.collapse") : "Collapse")
                      : (locale === "ar" ? t("live_editor.expand") : "Expand")
                  }
                >
                  <svg
                    className={`w-3 h-3 transition-all duration-200 ${
                      nestedExpanded[`${itemPath}.${field.key}.${nestedIdx}`]
                        ? "rotate-180 text-slate-600"
                        : "text-orange-600"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <span
                  className={`text-sm font-medium transition-all duration-200 ${
                    nestedExpanded[`${itemPath}.${field.key}.${nestedIdx}`]
                      ? "text-slate-600"
                      : "text-orange-700"
                  }`}
                >
                  {field.itemLabel || (locale === "ar" ? t("live_editor.item") : "Item")} {nestedIdx + 1}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const updatedItem = { ...item };
                  updatedItem[field.key] = nestedItems.filter(
                    (_: any, i: number) => i !== nestedIdx,
                  );
                  updateValue(itemPath, updatedItem);
                }}
                className={`text-xs transition-all duration-200 ${
                  nestedExpanded[`${itemPath}.${field.key}.${nestedIdx}`]
                    ? "text-red-500 hover:text-red-700"
                    : "text-orange-600 hover:text-orange-800"
                }`}
              >
                {locale === "ar" ? t("live_editor.remove") : "Remove"}
              </button>
            </div>

            {nestedExpanded[`${itemPath}.${field.key}.${nestedIdx}`] &&
              field.of &&
              field.of.map((nestedField: any) => {
                // Conditional rendering for Options field in nested arrays
                if (
                  nestedField.key === "options" &&
                  (nestedField.label === "Select Options" ||
                    nestedField.label === "Field Options (for Select/Radio)")
                ) {
                  // Only show Options if Field Type is "select" or "radio"
                  const fieldType = getValueByPath(
                    `${itemPath}.${field.key}.${nestedIdx}.type`,
                  );

                  if (fieldType !== "select" && fieldType !== "radio") {
                    return null;
                  }
                }

                return (
                  <div key={nestedField.key} className="mb-2">
                    {renderField(
                      nestedField,
                      `${itemPath}.${field.key}.${nestedIdx}`,
                    )}
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    );
  };

  // Enhanced item subtitle for menu items (shows type and submenu count)
  const getItemSubtitle = (item: any): string => {
    const parts: string[] = [];

    if (item?.type) {
      parts.push(`${locale === "ar" ? t("live_editor.type") : "Type"}: ${item.type}`);
    }

    if (item?.submenu && Array.isArray(item.submenu)) {
      const totalSubItems = item.submenu.reduce((total: number, sub: any) => {
        return total + (Array.isArray(sub.items) ? sub.items.length : 0);
      }, 0);
      const submenuText = locale === "ar" ? t("live_editor.submenu") : "submenu";
      const itemsText = locale === "ar" ? t("live_editor.items") : "items";
      parts.push(
        `${item.submenu.length} ${submenuText}${item.submenu.length !== 1 && locale !== "ar" ? "s" : ""} (${totalSubItems} ${itemsText})`,
      );
    }

    if (item?.url) {
      parts.push(`${locale === "ar" ? t("live_editor.url") : "URL"}: ${item.url}`);
    }

    return parts.join(" • ");
  };

  // Enhanced validation for array items with better error messages
  const validateItem = (
    item: any,
    index: number,
  ): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Check required fields based on field definitions
    if (arrDef.of && Array.isArray(arrDef.of)) {
      for (const f of arrDef.of) {
        if (
          f.type === "text" &&
          (!item[f.key] ||
            (typeof item[f.key] === "string" && item[f.key].trim() === ""))
        ) {
          // Only mark as error if it's a critical field
          if (
            f.key.includes("title") ||
            f.key.includes("name") ||
            f.key.includes("text")
          ) {
            errors.push(`${f.label || f.key} ${locale === "ar" ? t("live_editor.is_required") : "is required"}`);
          }
        }
      }
    }

    return { isValid: errors.length === 0, errors };
  };

  return (
    <div
      className={`group rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
        allCollapsed
          ? "border-orange-200 shadow-orange-100 shadow-lg bg-gradient-to-br from-orange-50 to-red-50"
          : "bg-white border-slate-200 shadow-sm hover:shadow-lg"
      }`}
    >
      <div
        className={`flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 transition-all duration-300 ${
          allCollapsed
            ? "bg-gradient-to-r from-orange-50 to-red-50 border-orange-200"
            : ""
        }`}
      >
        <div className="flex items-center space-x-3">
          <div>
            <span
              className={`font-bold transition-all duration-300  ${
                allCollapsed ? "text-orange-800" : "text-slate-800"
              }`}
            >
              {def.label}
            </span>
            <p
              className={`text-xs mt-1 transition-all duration-300 ${
                allCollapsed ? "text-orange-600" : "text-slate-500"
              }`}
            >
              {items.length} {locale === "ar" ? t("live_editor.items") : "items"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={expandAll}
            className="px-3 py-2 text-xs rounded-lg bg-slate-100 hover:bg-blue-100 border border-transparent hover:border-blue-300 transition-all duration-200"
          >
            {locale === "ar" ? t("live_editor.expand_all") : "Expand All"}
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="px-3 py-2 text-xs rounded-lg bg-slate-100 hover:bg-purple-100 border border-transparent hover:border-purple-300 transition-all duration-200"
          >
            {locale === "ar" ? t("live_editor.collapse_all") : "Collapse All"}
          </button>
          <button
            type="button"
            onClick={toggleCollapseAll}
            className={`px-3 py-2 text-xs rounded-lg border transition-all duration-200 ${
              allCollapsed
                ? "bg-orange-100 hover:bg-orange-200 border-orange-300 text-orange-700"
                : "bg-slate-100 hover:bg-orange-100 border-transparent hover:border-orange-300 text-slate-700"
            }`}
          >
            {allCollapsed 
              ? (locale === "ar" ? t("live_editor.expand") : "Expand")
              : (locale === "ar" ? t("live_editor.collapse") : "Collapse")}
          </button>
          <button
            onClick={addItem}
            className="group/btn relative overflow-hidden px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200"></div>
            <div className="relative flex items-center space-x-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span className="text-sm">{arrDef.addLabel || (locale === "ar" ? t("live_editor.add") : "Add")}</span>
            </div>
          </button>
        </div>
      </div>
      <div
        className={`p-4 space-y-4 transition-all duration-300 ${
          allCollapsed
            ? "opacity-75 bg-gradient-to-b from-orange-50 to-red-50"
            : "opacity-100 bg-gradient-to-b from-white to-slate-50"
        }`}
      >
        {items.map((item: any, idx: number) => {
          const key = `${normalizedPath}.${idx}`;
          const isOpen = expanded[key] ?? false;
          const validation = validateItem(item, idx);

          const toggle = () => setExpanded((s) => ({ ...s, [key]: !isOpen }));

          const move = (dir: -1 | 1) => {
            const next = items.slice();
            const newIdx = idx + dir;
            if (newIdx < 0 || newIdx >= items.length) {
              return;
            }

            const tmp = next[idx];
            next[idx] = next[newIdx];
            next[newIdx] = tmp;

            updateValue(normalizedPath, next);
          };

          const duplicateItem = () => {
            const duplicatedItem = { ...item };
            const newItems = [...items];
            newItems.splice(idx + 1, 0, duplicatedItem);
            updateValue(normalizedPath, newItems);
          };

          const clearItem = () => {
            const clearedItem = generateDefaultItem();
            const newItems = [...items];
            newItems[idx] = clearedItem;
            updateValue(normalizedPath, newItems);
          };
          return (
            <div
              key={idx}
              className={`bg-white rounded-xl border-2 shadow-sm overflow-hidden transition-all duration-200 ${
                validation.isValid
                  ? "border-slate-200 hover:border-slate-300"
                  : "border-red-200 hover:border-red-300"
              } ${
                allCollapsed && !isOpen
                  ? "opacity-60 scale-95 border-orange-200 bg-orange-50"
                  : "opacity-100 scale-100"
              }`}
            >
              <div
                className={`flex items-center justify-between px-4 py-3 border-b transition-all duration-200 ${
                  allCollapsed && !isOpen
                    ? "bg-gradient-to-r from-orange-50 to-red-50 border-orange-200"
                    : "bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={toggle}
                    className={`p-2 rounded-lg border border-transparent transition-all duration-200 ${
                      allCollapsed && !isOpen
                        ? "bg-orange-100 hover:bg-orange-200 hover:border-orange-300"
                        : "bg-slate-100 hover:bg-purple-100 hover:border-purple-300"
                    }`}
                    aria-expanded={isOpen}
                  >
                    <svg
                      className={`w-3 h-3 transition-all duration-200 ${isOpen ? "rotate-180" : ""} ${
                        allCollapsed && !isOpen
                          ? "text-orange-600"
                          : "text-slate-600"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 ${
                      allCollapsed && !isOpen
                        ? "bg-gradient-to-br from-orange-500 to-red-600"
                        : validation.isValid
                          ? "bg-gradient-to-br from-blue-500 to-indigo-600"
                          : "bg-gradient-to-br from-red-500 to-red-600"
                    }`}
                  >
                    <span className="text-white text-xs font-bold">
                      {idx + 1}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-sm font-semibold truncate max-w-[280px] transition-all duration-200 ${
                        allCollapsed && !isOpen
                          ? "text-orange-800"
                          : "text-slate-700"
                      }`}
                    >
                      {getItemTitle(item, idx)}
                    </span>
                    {/* Enhanced subtitle for menu items */}
                    {arrDef.itemLabel === "Item" && getItemSubtitle(item) && (
                      <span
                        className={`text-xs truncate max-w-[280px] transition-all duration-200 ${
                          allCollapsed && !isOpen
                            ? "text-orange-600"
                            : "text-slate-500"
                        }`}
                      >
                        {getItemSubtitle(item)}
                      </span>
                    )}
                    {/* Show menu item type badge */}
                    {arrDef.itemLabel === "Item" && item?.type && (
                      <div className="flex items-center space-x-1 mt-1">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                            allCollapsed && !isOpen
                              ? "bg-orange-100 text-orange-800"
                              : item.type === "link"
                                ? "bg-blue-100 text-blue-800"
                                : item.type === "mega_menu"
                                  ? "bg-purple-100 text-purple-800"
                                  : item.type === "dropdown"
                                    ? "bg-green-100 text-green-800"
                                    : item.type === "button"
                                      ? "bg-orange-100 text-orange-800"
                                      : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {item.type}
                        </span>
                        {item?.submenu &&
                          Array.isArray(item.submenu) &&
                          item.submenu.length > 0 && (
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                                allCollapsed && !isOpen
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-indigo-100 text-indigo-800"
                              }`}
                            >
                              {item.submenu.length} {locale === "ar" ? t("live_editor.submenu") : "submenu"}
                              {item.submenu.length !== 1 && locale !== "ar" ? "s" : ""}
                            </span>
                          )}
                      </div>
                    )}
                    {!validation.isValid && (
                      <span
                        className={`text-xs transition-all duration-200 ${
                          allCollapsed && !isOpen
                            ? "text-orange-600"
                            : "text-red-500"
                        }`}
                      >
                        {validation.errors[0]}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {/* Move Up Button */}
                  <button
                    type="button"
                    onClick={() => move(-1)}
                    disabled={idx === 0}
                    className={`p-2 rounded-lg border border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                      allCollapsed && !isOpen
                        ? "bg-orange-100 hover:bg-orange-200 hover:border-orange-300"
                        : "bg-slate-100 hover:bg-blue-100 hover:border-blue-300"
                    }`}
                    title={locale === "ar" ? t("live_editor.move_up") : "Move Up"}
                  >
                    <svg
                      className={`w-3 h-3 transition-all duration-200 ${
                        allCollapsed && !isOpen
                          ? "text-orange-600"
                          : "text-slate-600"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  </button>

                  {/* Move Down Button */}
                  <button
                    type="button"
                    onClick={() => move(1)}
                    disabled={idx === items.length - 1}
                    className={`p-2 rounded-lg border border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                      allCollapsed && !isOpen
                        ? "bg-orange-100 hover:bg-orange-200 hover:border-orange-300"
                        : "bg-slate-100 hover:bg-blue-100 hover:border-blue-300"
                    }`}
                    title={locale === "ar" ? t("live_editor.move_down") : "Move Down"}
                  >
                    <svg
                      className={`w-3 h-3 transition-all duration-200 ${
                        allCollapsed && !isOpen
                          ? "text-orange-600"
                          : "text-slate-600"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Duplicate Button */}
                  <button
                    type="button"
                    onClick={duplicateItem}
                    className={`p-2 rounded-lg border border-transparent transition-all duration-200 ${
                      allCollapsed && !isOpen
                        ? "bg-orange-100 hover:bg-orange-200 hover:border-orange-300"
                        : "bg-slate-100 hover:bg-green-100 hover:border-green-300"
                    }`}
                    title={locale === "ar" ? t("live_editor.duplicate_item") : "Duplicate Item"}
                  >
                    <svg
                      className={`w-3 h-3 transition-all duration-200 ${
                        allCollapsed && !isOpen
                          ? "text-orange-600"
                          : "text-slate-600"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>

                  {/* Clear Button */}
                  <button
                    type="button"
                    onClick={clearItem}
                    className={`p-2 rounded-lg border border-transparent transition-all duration-200 ${
                      allCollapsed && !isOpen
                        ? "bg-orange-100 hover:bg-orange-200 hover:border-orange-300"
                        : "bg-slate-100 hover:bg-yellow-100 hover:border-yellow-300"
                    }`}
                    title={locale === "ar" ? t("live_editor.clear_item") : "Clear Item"}
                  >
                    <svg
                      className={`w-3 h-3 transition-all duration-200 ${
                        allCollapsed && !isOpen
                          ? "text-orange-600"
                          : "text-slate-600"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => {
                      const next = items.slice();
                      next.splice(idx, 1);
                      updateValue(normalizedPath, next);
                    }}
                    className={`p-2 rounded-lg border transition-all duration-200 ${
                      allCollapsed && !isOpen
                        ? "bg-orange-50 hover:bg-orange-100 border-orange-200 hover:border-orange-300 text-orange-600"
                        : "bg-red-50 hover:bg-red-100 border-red-200 hover:border-red-300 text-red-600"
                    }`}
                    title={locale === "ar" ? t("live_editor.delete_item") : "Delete Item"}
                  >
                    <svg
                      className={`w-3 h-3 transition-all duration-200 ${
                        allCollapsed && !isOpen
                          ? "text-orange-600"
                          : "text-red-600"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              {isOpen && (
                <div
                  className={`p-4 space-y-4 transition-all duration-200 ${
                    allCollapsed && !isOpen
                      ? "bg-gradient-to-b from-orange-50 to-red-50"
                      : "bg-gradient-to-b from-white to-slate-50"
                  }`}
                >
                  {arrDef.of &&
                    Array.isArray(arrDef.of) &&
                    arrDef.of.map((f: any) => {
                      // Conditional rendering for Options field
                      if (
                        f.key === "options" &&
                        f.label === "Field Options (for Select/Radio)"
                      ) {
                        // Get current field type from multiple sources
                        const currentFieldType =
                          fieldTypes[`${normalizedPath}.${idx}`] ||
                          value?.[idx]?.type ||
                          getValueByPath(`${normalizedPath}.${idx}.type`);

                        // Hide options field if field type is not select or radio
                        if (
                          currentFieldType !== "radio" &&
                          currentFieldType !== "select"
                        ) {
                          return null;
                        }
                      }

                      return (
                        <div key={f.key}>
                          {/* Render nested arrays specially */}
                          {f.type === "array"
                            ? renderNestedArray(
                                f,
                                `${normalizedPath}.${idx}`,
                                item,
                              )
                            : renderField(f, `${normalizedPath}.${idx}`)}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          );
        })}
        {items.length === 0 && (
          <div
            className={`text-center py-12 transition-all duration-200 ${
              allCollapsed ? "opacity-75" : "opacity-100"
            }`}
          >
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-200 ${
                allCollapsed
                  ? "bg-gradient-to-br from-orange-100 to-red-200"
                  : "bg-gradient-to-br from-slate-100 to-slate-200"
              }`}
            >
              <svg
                className={`w-10 h-10 transition-all duration-200 ${
                  allCollapsed ? "text-orange-400" : "text-slate-400"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3
              className={`text-lg font-semibold mb-2 transition-all duration-200 ${
                allCollapsed ? "text-orange-700" : "text-slate-700"
              }`}
            >
              {locale === "ar" 
                ? `لا توجد ${arrDef.itemLabel || t("live_editor.items")} بعد`
                : `No ${arrDef.itemLabel || "items"} yet`}
            </h3>
            <p
              className={`text-sm mb-4 max-w-sm mx-auto transition-all duration-200 ${
                allCollapsed ? "text-orange-600" : "text-slate-500"
              }`}
            >
              {arrDef.itemLabel
                ? (locale === "ar" 
                    ? `أضف أول ${arrDef.itemLabel.toLowerCase()} للبدء`
                    : `Add your first ${arrDef.itemLabel.toLowerCase()} to get started`)
                : (locale === "ar" ? t("live_editor.click_add_to_create") : "Click the Add button to create your first item")}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={addItem}
                className={`px-4 py-2 text-white rounded-lg transition-all duration-200 font-medium ${
                  allCollapsed
                    ? "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                    : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                }`}
              >
                {locale === "ar" ? t("live_editor.add") : "Add"} {arrDef.itemLabel || (locale === "ar" ? t("live_editor.item") : "Item")}
              </button>
              {arrDef.of &&
                Array.isArray(arrDef.of) &&
                arrDef.of.length > 0 && (
                  <button
                    onClick={() => {
                      // Add multiple items at once
                      const multipleItems = Array.from({ length: 3 }, () =>
                        generateDefaultItem(),
                      );
                      updateValue(normalizedPath, multipleItems);
                    }}
                    className={`px-4 py-2 text-white rounded-lg transition-all duration-200 font-medium ${
                      allCollapsed
                        ? "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                        : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    }`}
                  >
                    {locale === "ar" ? t("live_editor.add_3_items") : `Add 3 ${arrDef.itemLabel || "Items"}`}
                  </button>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
