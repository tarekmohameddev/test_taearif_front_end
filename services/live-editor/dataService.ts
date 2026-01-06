import { ComponentInstance, ComponentData } from "@/lib/types";
import { getComponentDisplayName } from "./componentService";
import { createDefaultData } from "@/components/tenant/live-editor/EditorSidebar/utils";
import { v4 as uuidv4 } from "uuid";
import { normalizeComponentSettings } from "./componentSettingsHelper";

// دالة تحميل بيانات المكونات من قاعدة البيانات
export const loadComponentsFromDatabase = (
  tenantData: any,
  slug: string,
): ComponentInstance[] => {
  if (tenantData?.componentSettings?.[slug]) {
    const pageSettings = tenantData.componentSettings[slug];
    const normalizedSettings = normalizeComponentSettings(pageSettings);
    
    if (Object.keys(normalizedSettings).length > 0) {
      const dbComponents = Object.entries(normalizedSettings).map(
        ([id, comp]: [string, any]) => {
        // استعادة النوع الصحيح من componentName أو id إذا كان type غير صحيح
        let correctType = comp.type;
        if (comp.type === "unknown" || !comp.type) {
          // محاولة استخراج النوع من componentName أولاً
          if (comp.componentName && comp.componentName !== "undefined") {
            const componentName = comp.componentName.replace(/^\d+$/, ""); // إزالة الأرقام من البداية
            if (componentName.startsWith("header")) correctType = "header";
            else if (componentName.startsWith("hero")) correctType = "hero";
            else if (componentName.startsWith("halfTextHalfImage"))
              correctType = "halfTextHalfImage";
            else if (componentName.startsWith("propertySlider"))
              correctType = "propertySlider";
            else if (componentName.startsWith("ctaValuation"))
              correctType = "ctaValuation";
          }

          // إذا لم نتمكن من استخراج النوع من componentName، جرب من id
          if (!correctType || correctType === "unknown") {
            const idParts = comp.id.split("-");
            if (idParts.length > 0) {
              const idType = idParts[0];
              if (idType === "header") correctType = "header";
              else if (idType === "hero") correctType = "hero";
              else if (idType === "half") correctType = "halfTextHalfImage";
              else if (idType === "property") correctType = "propertySlider";
              else if (idType === "cta") correctType = "ctaValuation";
              else if (idType === "22821795") {
                // هذا يبدو أنه UUID، نحتاج إلى تحديد النوع بناءً على position والصفحة
                const position = comp.position || 0;

                // تحديد النوع بناءً على الصفحة والموقع للصفحة الرئيسية فقط
                if (position === 0) correctType = "header";
                else if (position === 1) correctType = "hero";
                else if (position === 2) correctType = "halfTextHalfImage";
                else if (position === 3) correctType = "propertySlider";
                else if (position === 4) correctType = "ctaValuation";
                else correctType = "header";
              }
            }
          }
        }

        return {
          id: id,
          type: correctType,
          name:
            comp.name || getComponentDisplayName(correctType) || "Component",
          componentName: (() => {
            // إذا كان componentName موجود وصحيح، استخدمه
            if (
              comp.componentName &&
              comp.componentName !== "undefined" &&
              comp.componentName !== "null"
            ) {
              return comp.componentName;
            }

            // إذا كان componentName undefined أو "undefined"، أنشئ واحد جديد
            if (correctType && correctType !== "unknown") {
              // استخدم النوع الصحيح مع رقم 1، مع مراعاة الصفحة
              if (slug === "about" && correctType === "hero") {
                return "about-hero1";
              } else if (slug === "about" && correctType === "team") {
                return "team-grid1";
              } else {
                return `${correctType}1`;
              }
            } else {
              // إذا لم نتمكن من تحديد النوع، استخدم "unknown1"
              return "unknown1";
            }
          })(),
          data: (() => {
            // If we have data from database, use it
            if (comp.data && Object.keys(comp.data).length > 0) {
              return comp.data;
            }
            // If no data, create default data
            if (correctType && correctType !== "unknown") {
              return createDefaultData(correctType);
            }
            return {
              texts: {
                title: "Component Title",
                subtitle: "This is a component description.",
              },
              colors: {
                background: "#FFFFFF",
                textColor: "#1F2937",
              },
            };
          })(),
          position: comp.position || 0,
          layout: comp.layout || { row: comp.position || 0, col: 0, span: 2 },
        };
      },
      );

      // التحقق من وجود تخطيطات متضاربة وإعادة بنائها إذا لزم الأمر
      const hasLayoutInfo = dbComponents.every((c) => c.layout && c.layout.span);
      if (!hasLayoutInfo) {
        // إذا كانت البيانات قديمة ولا تحتوي على تخطيط، قم ببناء تخطيط افتراضي
        dbComponents.sort((a, b) => a.position - b.position);
        dbComponents.forEach((comp, index) => {
          comp.layout = { row: index, col: 0, span: 2 };
        });
      }
      return dbComponents as ComponentInstance[];
    }
  }

  return [];
};

// دالة إنشاء مكون جديد
export const createNewComponent = (
  type: string,
  registeredComponents: Record<string, any>,
  slug: string,
  pageComponents: ComponentInstance[],
): ComponentInstance => {
  const definition = AVAILABLE_SECTIONS.find((s) => s.type === type);
  if (!definition) {
    throw new Error(`Unknown component type: ${type}`);
  }

  // للصفحات الجديدة، استخدم المكونات الافتراضية من homepage
  const defaultComponentName = definition.component.match(/\d+$/)
    ? definition.component
    : `${definition.component}1`;

  const componentName =
    registeredComponents?.[slug]?.[definition.component] ||
    (defaultComponents as any)[slug]?.[definition.component] ||
    (defaultComponents as any)?.homepage?.[definition.component] ||
    defaultComponentName;

  return {
    id: uuidv4(),
    type: definition.type,
    name: definition.name,
    componentName,
    data: createDefaultData(type),
    layout: {
      // تحديد الصف الجديد في الأسفل
      row:
        pageComponents.length > 0
          ? Math.max(...pageComponents.map((c) => c.layout?.row || 0)) + 1
          : 0,
      col: 0,
      span: 2, // يأخذ عرض العمودين بشكل افتراضي
    },
  };
};

// دالة تحديث بيانات المكون
export const updateComponentData = (
  components: ComponentInstance[],
  componentId: string,
  newData: ComponentData,
): ComponentInstance[] => {
  return components.map((c) =>
    c.id === componentId ? { ...c, data: newData } : c,
  );
};

// دالة تحديث ثيم المكون
export const updateComponentTheme = (
  components: ComponentInstance[],
  componentId: string,
  newTheme: string,
): ComponentInstance[] => {
  return components.map((c) =>
    c.id === componentId ? { ...c, componentName: newTheme } : c,
  );
};

// دالة إعادة تعيين المكون
export const resetComponent = (
  components: ComponentInstance[],
  componentId: string,
): ComponentInstance[] => {
  return components.map((c) => {
    if (c.id === componentId) {
      // Get default data for this component type
      const defaultData = createDefaultData(c.type);
      return {
        ...c,
        data: defaultData,
        // Reset to default theme for this component type
        componentName: getDefaultThemeForType(c.type),
      };
    }
    return c;
  });
};

// دالة حذف المكون
export const deleteComponent = (
  components: ComponentInstance[],
  componentId: string,
): ComponentInstance[] => {
  return components.filter((c) => c.id !== componentId);
};

// دالة تحديث ثيم الصفحة
export const updatePageTheme = (
  components: ComponentInstance[],
  themeComponents: Record<string, string>,
): ComponentInstance[] => {
  return components.map((component) => {
    const newComponentName =
      themeComponents[component.type as keyof typeof themeComponents];
    if (newComponentName) {
      return { ...component, componentName: newComponentName };
    }
    return component;
  });
};

// دالة تحديث أسماء المكونات بناءً على البيانات المتاحة
export const updateComponentNames = (
  components: ComponentInstance[],
  registeredComponents: Record<string, any>,
  slug: string,
): ComponentInstance[] => {
  if (Object.keys(registeredComponents).length > 0) {
    return components.map((component) => {
      const definition = AVAILABLE_SECTIONS.find(
        (s) => s.type === component.type,
      );
      if (definition) {
        const componentName =
          registeredComponents[slug]?.[definition.component] ||
          (defaultComponents as any)[slug]?.[definition.component] ||
          `${definition.component}1`;
        return { ...component, componentName };
      }
      return component;
    });
  }
  return components;
};

// استيراد المكتبات المطلوبة
import { defaultComponents } from "@/lib/defaultComponents";
import { AVAILABLE_SECTIONS } from "@/components/tenant/live-editor/EditorSidebar";
import { getDefaultThemeForType } from "./componentService";
