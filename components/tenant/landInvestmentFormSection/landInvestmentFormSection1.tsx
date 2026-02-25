"use client";

import { useEffect, useMemo } from "react";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultLandInvestmentFormSectionData } from "@/context/editorStoreFunctions/landInvestmentFormSectionFunctions";
import { LandInvestmentFormSection } from "@/stories/LandInvestmentFormSection/LandInvestmentFormSection";
import type { LandInvestmentFormSectionProps } from "@/stories/LandInvestmentFormSection/LandInvestmentFormSection.types";

interface LandInvestmentFormSection1Props extends Partial<LandInvestmentFormSectionProps> {
  variant?: string;
  useStore?: boolean;
  id?: string;
  overrideData?: Partial<LandInvestmentFormSectionProps>;
}

export default function LandInvestmentFormSection1(props: LandInvestmentFormSection1Props) {
  const variantId = props.variant || "landInvestmentFormSection1";
  const uniqueId = props.id || variantId;

  const ensureComponentVariant = useEditorStore((s) => s.ensureComponentVariant);
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const landInvestmentFormSectionStates = useEditorStore((s) => s.landInvestmentFormSectionStates);

  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  useEffect(() => {
    if (tenantId) fetchTenantData(tenantId);
  }, [tenantId, fetchTenantData]);

  const getTenantComponentData = (): Partial<LandInvestmentFormSectionProps> => {
    if (!tenantData) return {};
    if (tenantData.components && Array.isArray(tenantData.components)) {
      for (const c of tenantData.components) {
        if (c.type === "landInvestmentFormSection" && c.componentName === variantId)
          return (c as any).data || {};
      }
    }
    if (tenantData?.componentSettings) {
      for (const pageComponents of Object.values(tenantData.componentSettings)) {
        if (typeof pageComponents === "object" && !Array.isArray(pageComponents)) {
          for (const [cid, comp] of Object.entries(pageComponents as Record<string, any>)) {
            if (comp?.type === "landInvestmentFormSection" && (comp?.componentName === variantId || cid === uniqueId))
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
        ? { ...getDefaultLandInvestmentFormSectionData(), ...tenantComponentData, ...props }
        : { ...getDefaultLandInvestmentFormSectionData(), ...props };
      store.ensureComponentVariant("landInvestmentFormSection", uniqueId, initial);
    }
  }, [uniqueId, props.useStore]);

  const storeData = props.useStore ? getComponentData("landInvestmentFormSection", uniqueId) || {} : {};
  const currentStoreData = landInvestmentFormSectionStates[uniqueId] || {};
  const defaultData = useMemo(() => getDefaultLandInvestmentFormSectionData(), []);

  const mergedData = useMemo((): LandInvestmentFormSectionProps => ({
    ...defaultData,
    ...props,
    ...tenantComponentData,
    ...storeData,
    ...currentStoreData,
    ...(props.overrideData || {}),
  }), [defaultData, props, tenantComponentData, storeData, currentStoreData]);

  if (!mergedData.visible) return null;

  return (
    <LandInvestmentFormSection
      id={mergedData.id}
      heading={mergedData.heading}
      description={mergedData.description}
      bottomImageSrc={mergedData.bottomImageSrc}
      bottomImageAlt={mergedData.bottomImageAlt}
      dir={mergedData.dir}
      headingTextProps={mergedData.headingTextProps}
      descriptionTextProps={mergedData.descriptionTextProps}
    />
  );
}
