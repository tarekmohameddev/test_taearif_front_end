"use client";

import { useEffect, useMemo } from "react";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultJourneySectionData } from "@/context/editorStoreFunctions/journeySectionFunctions";
import { JourneySection } from "@/stories/JourneySection/JourneySection";
import type { JourneySectionProps } from "@/stories/JourneySection/JourneySection.types";

interface JourneySection1Props extends Partial<JourneySectionProps> {
  variant?: string;
  useStore?: boolean;
  id?: string;
  overrideData?: Partial<JourneySectionProps>;
}

export default function JourneySection1(props: JourneySection1Props) {
  const variantId = props.variant || "journeySection1";
  const uniqueId = props.id || variantId;

  const ensureComponentVariant = useEditorStore((s) => s.ensureComponentVariant);
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const journeySectionStates = useEditorStore((s) => s.journeySectionStates);

  const tenantData = useTenantStore((s) => s.tenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  const getTenantComponentData = (): Partial<JourneySectionProps> => {
    if (!tenantData) return {};
    if (tenantData.components && Array.isArray(tenantData.components)) {
      for (const c of tenantData.components) {
        if (c.type === "journeySection" && c.componentName === variantId)
          return (c as any).data || {};
      }
    }
    if (tenantData?.componentSettings) {
      for (const pageComponents of Object.values(tenantData.componentSettings)) {
        if (typeof pageComponents === "object" && !Array.isArray(pageComponents)) {
          for (const [cid, comp] of Object.entries(pageComponents as Record<string, any>)) {
            if (comp?.type === "journeySection" && (comp?.componentName === variantId || cid === uniqueId))
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
        ? { ...getDefaultJourneySectionData(), ...tenantComponentData, ...props }
        : { ...getDefaultJourneySectionData(), ...props };
      store.ensureComponentVariant("journeySection", uniqueId, initial);
    }
  }, [uniqueId, props.useStore]);

  const storeData = props.useStore ? getComponentData("journeySection", uniqueId) || {} : {};
  const currentStoreData = journeySectionStates[uniqueId] || {};
  const defaultData = useMemo(() => getDefaultJourneySectionData(), []);

  const mergedData = useMemo((): JourneySectionProps => ({
    ...defaultData,
    ...props,
    ...tenantComponentData,
    ...storeData,
    ...currentStoreData,
    ...(props.overrideData || {}),
  }), [defaultData, props, tenantComponentData, storeData, currentStoreData]);

  if (!mergedData.visible) return null;

  return (
    <JourneySection
      heading={mergedData.heading}
      steps={mergedData.steps}
      flagImageSrc={mergedData.flagImageSrc}
      flagImageAlt={mergedData.flagImageAlt}
      dir={mergedData.dir}
      headingTextProps={mergedData.headingTextProps}
      stepTitleTextProps={mergedData.stepTitleTextProps}
      stepDurationTextProps={mergedData.stepDurationTextProps}
      stepDescriptionTextProps={mergedData.stepDescriptionTextProps}
    />
  );
}
