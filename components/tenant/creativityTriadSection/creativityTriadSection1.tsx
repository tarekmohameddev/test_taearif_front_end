"use client";

import { useEffect, useMemo } from "react";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultCreativityTriadSectionData } from "@/context/editorStoreFunctions/creativityTriadSectionFunctions";
import { CreativityTriadSection } from "@/stories/CreativityTriadSection/CreativityTriadSection";
import type { CreativityTriadSectionProps } from "@/stories/CreativityTriadSection/CreativityTriadSection.types";

interface CreativityTriadSection1Props extends Partial<CreativityTriadSectionProps> {
  variant?: string;
  useStore?: boolean;
  id?: string;
  overrideData?: Partial<CreativityTriadSectionProps>;
}

export default function CreativityTriadSection1(props: CreativityTriadSection1Props) {
  const variantId = props.variant || "creativityTriadSection1";
  const uniqueId = props.id || variantId;

  const ensureComponentVariant = useEditorStore((s) => s.ensureComponentVariant);
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const creativityTriadSectionStates = useEditorStore((s) => s.creativityTriadSectionStates);

  const tenantData = useTenantStore((s) => s.tenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  const getTenantComponentData = (): Partial<CreativityTriadSectionProps> => {
    if (!tenantData) return {};
    if (tenantData.components && Array.isArray(tenantData.components)) {
      for (const c of tenantData.components) {
        if (c.type === "creativityTriadSection" && c.componentName === variantId)
          return (c as any).data || {};
      }
    }
    if (tenantData?.componentSettings) {
      for (const pageComponents of Object.values(tenantData.componentSettings)) {
        if (typeof pageComponents === "object" && !Array.isArray(pageComponents)) {
          for (const [cid, comp] of Object.entries(pageComponents as Record<string, any>)) {
            if (comp?.type === "creativityTriadSection" && (comp?.componentName === variantId || cid === uniqueId))
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
        ? { ...getDefaultCreativityTriadSectionData(), ...tenantComponentData, ...props }
        : { ...getDefaultCreativityTriadSectionData(), ...props };
      store.ensureComponentVariant("creativityTriadSection", uniqueId, initial);
    }
  }, [uniqueId, props.useStore]);

  const storeData = props.useStore ? getComponentData("creativityTriadSection", uniqueId) || {} : {};
  const currentStoreData = creativityTriadSectionStates[uniqueId] || {};
  const defaultData = useMemo(() => getDefaultCreativityTriadSectionData(), []);

  const mergedData = useMemo((): CreativityTriadSectionProps => ({
    ...defaultData,
    ...props,
    ...tenantComponentData,
    ...storeData,
    ...currentStoreData,
    ...(props.overrideData || {}),
  }), [defaultData, props, tenantComponentData, storeData, currentStoreData]);

  if (!mergedData.visible) return null;

  return (
    <CreativityTriadSection
      heading={mergedData.heading}
      intro={mergedData.intro}
      cards={mergedData.cards}
      dir={mergedData.dir}
      headingTextProps={mergedData.headingTextProps}
      introTextProps={mergedData.introTextProps}
      cardTitleTextProps={mergedData.cardTitleTextProps}
      cardDescriptionTextProps={mergedData.cardDescriptionTextProps}
    />
  );
}
