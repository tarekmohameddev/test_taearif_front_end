/**
 * Extracts the correct component type from componentName or id
 * @param comp - Component data from database
 * @returns Correct component type
 */
export function extractComponentType(comp: any): string {
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

          // تحديد النوع بناءً على الصفحة والموقع
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

  return correctType;
}

/**
 * Creates a component instance from database component data
 * @param id - Component ID
 * @param comp - Component data from database
 * @param correctType - Corrected component type
 * @param getComponentDisplayName - Function to get component display name
 * @param createDefaultData - Function to create default data
 * @returns Formatted component instance
 */
export function createComponentFromDbData(
  id: string,
  comp: any,
  correctType: string,
  getComponentDisplayName: (type: string) => string | null,
  createDefaultData: (type: string) => any,
): any {
  return {
    id: id,
    type: correctType,
    name: comp.name || getComponentDisplayName(correctType) || "Component",
    // Debug log for cards components
    ...(correctType === "cards" && {
      debug: {
        originalType: comp.type,
        componentName: comp.componentName,
        correctType,
        hasData: !!comp.data,
      },
    }),
    componentName: (() => {
      // إذا كان componentName undefined أو "undefined"، أنشئ واحد جديد
      if (!comp.componentName || comp.componentName === "undefined") {
        if (correctType && correctType !== "unknown") {
          return `${correctType}1`;
        } else {
          // إذا لم نتمكن من تحديد النوع، استخدم "unknown1"
          return "unknown1";
        }
      }
      return comp.componentName;
    })(),
    data:
      comp.data && Object.keys(comp.data).length > 0
        ? comp.data
        : correctType && correctType !== "unknown"
          ? createDefaultData(correctType)
          : {
              texts: {
                title: "Component Title",
                subtitle: "This is a component description.",
              },
              colors: {
                background: "#FFFFFF",
                textColor: "#1F2937",
              },
            },
    position: 0, // سيتم تحديثه لاحقاً بناءً على ترتيب المصفوفة
    layout: comp.layout || {
      row: 0, // سيتم تحديثه لاحقاً بناءً على ترتيب المصفوفة
      col: 0,
      span: 2,
    },
  };
}
