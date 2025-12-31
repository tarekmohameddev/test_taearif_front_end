import { useEffect } from "react";
import { defaultComponents } from "@/lib-liveeditor/defaultComponents";

interface UseRegisteredComponentsEffectProps {
  tenantData: any;
  setRegisteredComponents: (components: Record<string, any>) => void;
}

export const useRegisteredComponentsEffect = ({
  tenantData,
  setRegisteredComponents,
}: UseRegisteredComponentsEffectProps) => {
  // Registered Components Effect
  useEffect(() => {
    const componentsMap: Record<string, any> = {};

    Object.entries(defaultComponents).forEach(([section, components]) => {
      componentsMap[section] = components;
    });

    if (tenantData?.componentSettings) {
      Object.entries(tenantData.componentSettings).forEach(
        ([section, components]) => {
          if (typeof components === "object" && components !== null) {
            componentsMap[section] = {
              ...(componentsMap[section] || {}),
              ...components,
            };
          }
        },
      );
    }

    setRegisteredComponents(componentsMap);
  }, [tenantData, setRegisteredComponents]);
};
