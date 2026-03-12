"use client";

import { useEffect, useMemo } from "react";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultEssenceSectionData } from "@/context/editorStoreFunctions/essenceSectionFunctions";
import { EssenceSection } from "@/stories/EssenceSection/EssenceSection";
import type { EssenceSectionProps } from "@/stories/EssenceSection/EssenceSection.types";

interface EssenceSection1Props extends Partial<EssenceSectionProps> {
  variant?: string;
  useStore?: boolean;
  id?: string;
  overrideData?: Partial<EssenceSectionProps>;
}

export default function EssenceSection1(props: EssenceSection1Props) {
  const variantId = props.variant || "essenceSection1";
  const uniqueId = props.id || variantId;

  const ensureComponentVariant = useEditorStore((s) => s.ensureComponentVariant);
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const essenceSectionStates = useEditorStore((s) => s.essenceSectionStates);

  const tenantData = useTenantStore((s) => s.tenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  const getTenantComponentData = (): Partial<EssenceSectionProps> => {
    if (!tenantData) return {};
    if (tenantData.components && Array.isArray(tenantData.components)) {
      for (const c of tenantData.components) {
        if (c.type === "essenceSection" && c.componentName === variantId)
          return (c as any).data || {};
      }
    }
    if (tenantData?.componentSettings) {
      for (const pageComponents of Object.values(tenantData.componentSettings)) {
        if (typeof pageComponents === "object" && !Array.isArray(pageComponents)) {
          for (const [cid, comp] of Object.entries(pageComponents as Record<string, any>)) {
            if (comp?.type === "essenceSection" && (comp?.componentName === variantId || cid === uniqueId))
              return comp?.data || {};
          }
        }
      }
    }
    return {};
  };

  const tenantComponentData = getTenantComponentData();

  useEffect(() => {
    if (props.useStore) {
      const store = useEditorStore.getState();
      const initial = Object.keys(tenantComponentData).length > 0
        ? { ...getDefaultEssenceSectionData(), ...tenantComponentData, ...props }
        : { ...getDefaultEssenceSectionData(), ...props };
      store.ensureComponentVariant("essenceSection", uniqueId, initial);
    }
  }, [uniqueId, props.useStore]);

  const storeData = props.useStore ? getComponentData("essenceSection", uniqueId) || {} : {};
  const currentStoreData = essenceSectionStates[uniqueId] || {};
  const defaultData = useMemo(() => getDefaultEssenceSectionData(), []);

  const mergedData = useMemo((): EssenceSectionProps => ({
    ...defaultData,
    ...props,
    ...tenantComponentData,
    ...storeData,
    ...currentStoreData,
    ...(props.overrideData || {}),
  }), [defaultData, props, tenantComponentData, storeData, currentStoreData]);

  if (!mergedData.visible) return null;

  return (
    <EssenceSection
      heading={mergedData.heading}
      lead={mergedData.lead}
      body1={mergedData.body1}
      body2={mergedData.body2}
      dir={mergedData.dir}
      headingTextProps={mergedData.headingTextProps}
      leadTextProps={mergedData.leadTextProps}
      bodyTextProps={mergedData.bodyTextProps}
    />
  );
}
