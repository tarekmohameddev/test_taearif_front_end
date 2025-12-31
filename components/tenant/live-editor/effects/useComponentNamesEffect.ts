import { useEffect } from "react";
import { ComponentInstance } from "@/lib-liveeditor/types";
import { AVAILABLE_SECTIONS } from "../EditorSidebar/constants";
import { defaultComponents } from "@/lib-liveeditor/defaultComponents";

interface UseComponentNamesEffectProps {
  registeredComponents: Record<string, any>;
  slug: string;
  pageComponents: ComponentInstance[];
  setPageComponents: (
    components:
      | ComponentInstance[]
      | ((prev: ComponentInstance[]) => ComponentInstance[]),
  ) => void;
}

export const useComponentNamesEffect = ({
  registeredComponents,
  slug,
  pageComponents,
  setPageComponents,
}: UseComponentNamesEffectProps) => {
  // Component Names Update Effect
  useEffect(() => {
    if (Object.keys(registeredComponents).length > 0) {
      setPageComponents((current: any[]) =>
        current.map((component: any) => {
          const definition = AVAILABLE_SECTIONS.find(
            (s) => s.type === component.type,
          );
          if (definition) {
            // Only update componentName if it's not already set from database
            // This prevents overriding cards3 with cards2 from defaultComponents
            if (
              !component.componentName ||
              component.componentName === "undefined"
            ) {
              const componentName =
                registeredComponents[slug]?.[definition.component] ||
                (defaultComponents as any)[slug]?.[definition.component] ||
                `${definition.component}1`;

              return { ...component, componentName };
            }
          }
          return component;
        }),
      );
    }
  }, [registeredComponents, slug, setPageComponents]);
};
