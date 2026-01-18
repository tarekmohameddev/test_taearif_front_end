// ============================================================================
// Hook for component event handlers
// ============================================================================

import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { createDefaultData } from "../../EditorSidebar/utils";
import { useEditorStore } from "@/context/editorStore";
import {
  positionTracker,
  PositionDebugInfo,
  validateComponentPositions,
} from "@/services/live-editor/dragDrop/enhanced-position-tracker";
import {
  logBefore,
  logAfter,
  logBeforeAfter,
  logDuring,
  logError,
} from "@/lib/fileLogger";
import { findThemeForComponent } from "@/lib/themes/themeComponentLookup";

import type { Theme } from "@/components/settings/themes/types";

interface UseComponentHandlersProps {
  pageComponents: any[];
  state: any;
  selectedComponentId: string | null;
  setDebugInfo: (info: PositionDebugInfo | null) => void;
  setPositionValidation: (validation: any) => void;
  setWasComponentsSidebarManuallyClosed: (value: boolean) => void;
  onPremiumComponentDetected?: (theme: {
    themeName: string;
    themePrice: string;
    currency: string;
    themeId: string;
  }) => void;
  themes?: Theme[];
}

export function useComponentHandlers({
  pageComponents,
  state,
  selectedComponentId,
  setDebugInfo,
  setPositionValidation,
  setWasComponentsSidebarManuallyClosed,
  onPremiumComponentDetected,
  themes = [],
}: UseComponentHandlersProps) {
  // دالة بسيطة لإضافة رقم 1 لكل مكون
  const getComponentNameWithOne = useCallback(
    (componentType: string): string => {
      // إذا كان المكون يحتوي بالفعل على رقم، لا نضيف رقم آخر
      if (componentType.match(/\d+$/)) {
        return componentType;
      }
      return `${componentType}1`;
    },
    [],
  );

  // دالة إضافة مكون جديد - محسنة لتعمل مع النظام الجديد مع logging شامل
  const handleAddComponent = useCallback(
    (componentData: {
      type: string;
      zone: string;
      index: number;
      data?: any;
      variant?: string;
      sourceData?: any;
    }) => {
      // ========== LOG BEFORE ==========
      logBefore(
        "COMPONENT_ADD",
        "ADD_COMPONENT_START",
        {
          componentData,
          currentPageComponentsCount: pageComponents.length,
          targetIndex: componentData.index,
        },
        {
          componentType: componentData.type,
        }
      );

      // تحويل componentType إلى camelCase
      const normalizedComponentType = componentData.type
        .replace(/\s+/g, "")
        .replace(/^\w/, (c) => c.toLowerCase());

      // استخدام variant من sourceData إذا كان موجوداً، وإلا استخدم getComponentNameWithOne
      const componentName =
        componentData.variant ||
        getComponentNameWithOne(normalizedComponentType);

      // ========== PREMIUM CHECK: Verify theme access ==========
      const themeId = findThemeForComponent(componentName);
      if (themeId && themes.length > 0) {
        // البحث عن الثيم في themes array
        const theme = themes.find((t) => t.id === themeId);
        if (theme && !theme.has_access && process.env.NODE_ENV !== "development") {
          // منع الإضافة وإظهار PremiumDialog
          logDuring(
            "COMPONENT_ADD",
            "PREMIUM_COMPONENT_BLOCKED",
            {
              componentName,
              themeId,
              themeName: theme.name,
            }
          );

          if (onPremiumComponentDetected) {
            onPremiumComponentDetected({
              themeName: theme.name,
              themePrice: theme.price || "0",
              currency: theme.currency || "SAR",
              themeId: theme.id,
            });
          }
          return; // منع الإضافة
        }
      }

      // ========== LOG DURING: Creating component ==========
      logDuring(
        "COMPONENT_ADD",
        "CREATING_COMPONENT",
        {
          normalizedComponentType,
          componentName,
        }
      );

      const defaultData = createDefaultData(normalizedComponentType, componentName);

      const newComponent = {
        id: uuidv4(),
        type: normalizedComponentType,
        name:
          componentData.type.charAt(0).toUpperCase() +
          componentData.type.slice(1),
        componentName,
        data: defaultData,
        layout: {
          row: pageComponents.length,
          col: 0,
          span: 2,
        },
      };

      // ========== LOG BEFORE: Store state ==========
      const store = useEditorStore.getState();
      const currentPage = store.currentPage || "homepage";

      logBefore(
        "COMPONENT_ADD",
        "STORE_STATE_BEFORE",
        {
          currentPage,
          pageComponentsByPageCount: store.pageComponentsByPage[currentPage]?.length || 0,
          existingComponentStates: Object.keys(store).filter(k => k.includes("States") && typeof (store as any)[k] === "object").reduce((acc: any, k) => {
            acc[k] = Object.keys((store as any)[k] || {}).length;
            return acc;
          }, {}),
        },
        {
          componentId: newComponent.id,
          componentName: newComponent.componentName,
          componentType: newComponent.type,
        }
      );

      // إضافة المكون في الموضع المحدد مع تحديث محسن
      const updatedComponents = [...pageComponents];
      const targetIndex = Math.min(
        componentData.index,
        updatedComponents.length,
      );
      updatedComponents.splice(targetIndex, 0, newComponent);

      // ========== CRITICAL: Initialize component in store ==========
      logDuring(
        "COMPONENT_ADD",
        "INITIALIZING_IN_STORE",
        {
          componentId: newComponent.id,
          componentType: newComponent.type,
          componentName: newComponent.componentName,
          defaultDataKeys: Object.keys(defaultData),
        },
        {
          componentId: newComponent.id,
          componentName: newComponent.componentName,
          componentType: newComponent.type,
        }
      );

      // ✅ Initialize component in store with ensureComponentVariant
      try {
        // For halfTextHalfImage components, pass componentName as variantId to ensure correct theme data
        const variantId = normalizedComponentType === "halfTextHalfImage" ? componentName : newComponent.id;

        store.ensureComponentVariant(
          newComponent.type,
          variantId, // ✅ Use componentName for halfTextHalfImage, component.id for others
          {
            ...defaultData,
            ...newComponent.data,
          }
        );

        logAfter(
          "COMPONENT_ADD",
          "STORE_INITIALIZED",
          {
            componentId: newComponent.id,
            storeData: store.getComponentData(newComponent.type, newComponent.id),
          },
          {
            componentId: newComponent.id,
            componentName: newComponent.componentName,
            componentType: newComponent.type,
          }
        );
      } catch (error) {
        logError(
          "COMPONENT_ADD",
          "STORE_INITIALIZATION_FAILED",
          error,
          {
            componentId: newComponent.id,
            componentName: newComponent.componentName,
            componentType: newComponent.type,
          }
        );
      }

      // تحديث الحالة المحلية
      logDuring(
        "COMPONENT_ADD",
        "UPDATING_LOCAL_STATE",
        {
          updatedComponentsCount: updatedComponents.length,
          targetIndex,
        },
        {
          componentId: newComponent.id,
          componentName: newComponent.componentName,
          componentType: newComponent.type,
        }
      );

      state.setPageComponents(updatedComponents);

      // ========== CRITICAL: Update pageComponentsByPage in store ==========
      setTimeout(() => {
        try {
          const store = useEditorStore.getState();
          const currentPage = store.currentPage || "homepage";
          const currentPageComponents = store.pageComponentsByPage[currentPage] || [];

          logBefore(
            "COMPONENT_ADD",
            "UPDATING_PAGE_COMPONENTS_BY_PAGE",
            {
              currentPage,
              beforeCount: currentPageComponents.length,
              newComponent,
            },
            {
              componentId: newComponent.id,
              componentName: newComponent.componentName,
              componentType: newComponent.type,
            }
          );

          const updatedPageComponents = [...currentPageComponents];
          const storeTargetIndex = Math.min(
            componentData.index,
            updatedPageComponents.length,
          );
          updatedPageComponents.splice(storeTargetIndex, 0, newComponent);

          store.forceUpdatePageComponents(currentPage, updatedPageComponents);

          logAfter(
            "COMPONENT_ADD",
            "PAGE_COMPONENTS_BY_PAGE_UPDATED",
            {
              currentPage,
              afterCount: updatedPageComponents.length,
              pageComponentsByPage: store.pageComponentsByPage[currentPage],
            },
            {
              componentId: newComponent.id,
              componentName: newComponent.componentName,
              componentType: newComponent.type,
            }
          );

          // Verify component is in store
          const storeData = store.getComponentData(newComponent.type, newComponent.id);
          if (!storeData || Object.keys(storeData).length === 0) {
            logError(
              "COMPONENT_ADD",
              "COMPONENT_NOT_FOUND_IN_STORE",
              {
                componentId: newComponent.id,
                componentType: newComponent.type,
                storeData,
              },
              {
                componentId: newComponent.id,
                componentName: newComponent.componentName,
                componentType: newComponent.type,
              }
            );
          } else {
            logAfter(
              "COMPONENT_ADD",
              "STORE_VERIFICATION_SUCCESS",
              {
                componentId: newComponent.id,
                storeDataKeys: Object.keys(storeData),
              },
              {
                componentId: newComponent.id,
                componentName: newComponent.componentName,
                componentType: newComponent.type,
              }
            );
          }
        } catch (error) {
          logError(
            "COMPONENT_ADD",
            "STORE_UPDATE_FAILED",
            error,
            {
              componentId: newComponent.id,
              componentName: newComponent.componentName,
              componentType: newComponent.type,
            }
          );
        }
      }, 0);

      // تحديد المكون الجديد تلقائياً
      setTimeout(() => {
        state.setSelectedComponentId?.(newComponent.id);
      }, 100);

      // إعادة تعيين علامة الإغلاق اليدوي عند إضافة مكون جديد
      setWasComponentsSidebarManuallyClosed(false);

      // ========== LOG AFTER ==========
      logAfter(
        "COMPONENT_ADD",
        "ADD_COMPONENT_COMPLETE",
        {
          newComponent: {
            id: newComponent.id,
            type: newComponent.type,
            componentName: newComponent.componentName,
            layout: newComponent.layout,
          },
          updatedComponentsCount: updatedComponents.length,
          targetIndex,
        },
        {
          componentId: newComponent.id,
          componentName: newComponent.componentName,
          componentType: newComponent.type,
        }
      );

      // ========== LOG BEFORE/AFTER ==========
      logBeforeAfter(
        "ADD_COMPONENT",
        {
          pageComponentsBefore: pageComponents.map(c => ({ id: c.id, type: c.type, componentName: c.componentName })),
          pageComponentsByPageBefore: store.pageComponentsByPage[currentPage]?.map((c: any) => ({ id: c.id, type: c.type, componentName: c.componentName })) || [],
        },
        {
          pageComponentsAfter: updatedComponents.map(c => ({ id: c.id, type: c.type, componentName: c.componentName })),
        },
        {
          componentId: newComponent.id,
          componentName: newComponent.componentName,
          componentType: newComponent.type,
        }
      );
    },
    [
      pageComponents,
      state,
      getComponentNameWithOne,
      setWasComponentsSidebarManuallyClosed,
    ],
  );

  // دالة نقل مكون محسنة - تستقبل النتيجة المعالجة مسبقاً
  const handleMoveComponent = useCallback(
    (
      sourceIndex: number,
      sourceZone: string,
      finalIndex: number,
      destinationZone: string,
      updatedComponents?: any[],
      debugInfo?: PositionDebugInfo,
    ) => {
      // إذا كانت البيانات المحدثة متوفرة، استخدمها مباشرة
      if (updatedComponents && debugInfo) {
        // تحديث الحالة بالمكونات المحدثة
        state.setPageComponents(updatedComponents);

        // Update pageComponentsByPage in the store
        setTimeout(() => {
          const store = useEditorStore.getState();
          const currentPage = store.currentPage;
          store.forceUpdatePageComponents(currentPage, updatedComponents);
        }, 0);

        // حفظ معلومات التصحيح
        setDebugInfo(debugInfo);

        // إبقاء المكون محدداً بعد النقل
        const movedComponent = updatedComponents[finalIndex];
        if (selectedComponentId === movedComponent?.id) {
          setTimeout(() => {
            state.setSelectedComponentId?.(movedComponent.id);
          }, 100);
        }

        // التحقق من صحة الحالة بعد النقل
        const validation = validateComponentPositions(updatedComponents);
        setPositionValidation(validation);

        // تحديث position tracker
        positionTracker.recordState(updatedComponents, "enhanced-move");

        return;
      }

      // Fallback: المعالجة التقليدية إذا لم تكن البيانات متوفرة

      // تحديث position properties لجميع المكونات قبل النقل
      const componentsWithPositions = pageComponents.map(
        (comp: any, index: number) => ({
          ...comp,
          position: index,
          layout: {
            ...comp.layout,
            row: index,
          },
        }),
      );

      // استخدام position tracker المحسن
      const result = positionTracker.trackComponentMove(
        componentsWithPositions,
        sourceIndex,
        sourceZone,
        finalIndex,
        destinationZone,
      );

      if (result.success) {
        state.setPageComponents(result.updatedComponents);
        setDebugInfo(result.debugInfo);

        // Update pageComponentsByPage in the store
        setTimeout(() => {
          const store = useEditorStore.getState();
          const currentPage = store.currentPage;
          store.forceUpdatePageComponents(
            currentPage,
            result.updatedComponents,
          );
        }, 0);

        const validation = validateComponentPositions(result.updatedComponents);
        setPositionValidation(validation);

        // تحديث position tracker
        positionTracker.recordState(result.updatedComponents, "fallback-move");
      } else {
        setDebugInfo(result.debugInfo);
      }
    },
    [
      pageComponents,
      state,
      selectedComponentId,
      setDebugInfo,
      setPositionValidation,
    ],
  );

  // دالة معالجة معلومات التصحيح
  const handlePositionDebug = useCallback(
    (debugInfo: PositionDebugInfo) => {
      setDebugInfo(debugInfo);
    },
    [setDebugInfo],
  );

  // دالة تنظيف وإعادة تعيين المواضع
  const handleResetPositions = useCallback(() => {
    const resetComponents = pageComponents.map((comp: any, index: number) => ({
      ...comp,
      position: index,
      layout: {
        ...comp.layout,
        row: index,
      },
    }));

    state.setPageComponents(resetComponents);
    positionTracker.recordState(resetComponents, "manual-reset");

    // Update pageComponentsByPage in the store
    setTimeout(() => {
      const store = useEditorStore.getState();
      const currentPage = store.currentPage;
      store.forceUpdatePageComponents(currentPage, resetComponents);
    }, 0);

    const validation = validateComponentPositions(resetComponents);
    setPositionValidation(validation);
  }, [pageComponents, state, setPositionValidation]);

  return {
    handleAddComponent,
    handleMoveComponent,
    handlePositionDebug,
    handleResetPositions,
    getComponentNameWithOne,
  };
}
