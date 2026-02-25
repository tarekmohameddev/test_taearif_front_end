"use client";

import { useEffect, useMemo } from "react";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultFeaturesSectionData } from "@/context/editorStoreFunctions/featuresSectionFunctions";
import { FeaturesSection } from "@/stories/FeaturesSection/FeaturesSection";
import type { FeaturesSectionProps } from "@/stories/FeaturesSection/FeaturesSection.types";

interface FeaturesSection1Props extends Partial<FeaturesSectionProps> {
  variant?: string;
  useStore?: boolean;
  id?: string;
  overrideData?: Partial<FeaturesSectionProps>;
}

export default function FeaturesSection1(props: FeaturesSection1Props) {
  const variantId = props.variant || "featuresSection1";
  const uniqueId = props.id || variantId;

  const ensureComponentVariant = useEditorStore((s) => s.ensureComponentVariant);
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const featuresSectionStates = useEditorStore((s) => s.featuresSectionStates);

  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  useEffect(() => {
    if (tenantId) fetchTenantData(tenantId);
  }, [tenantId, fetchTenantData]);

  const getTenantComponentData = (): Partial<FeaturesSectionProps> => {
    if (!tenantData) return {};
    if (tenantData.components && Array.isArray(tenantData.components)) {
      for (const c of tenantData.components) {
        if (c.type === "featuresSection" && c.componentName === variantId)
          return (c as any).data || {};
      }
    }
    if (tenantData?.componentSettings) {
      for (const pageComponents of Object.values(tenantData.componentSettings)) {
        if (typeof pageComponents === "object" && !Array.isArray(pageComponents)) {
          for (const [cid, comp] of Object.entries(pageComponents as Record<string, any>)) {
            if (comp?.type === "featuresSection" && (comp?.componentName === variantId || cid === uniqueId))
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
        ? { ...getDefaultFeaturesSectionData(), ...tenantComponentData, ...props }
        : { ...getDefaultFeaturesSectionData(), ...props };
      store.ensureComponentVariant("featuresSection", uniqueId, initial);
    }
  }, [uniqueId, props.useStore]);

  const storeData = props.useStore ? getComponentData("featuresSection", uniqueId) || {} : {};
  const currentStoreData = featuresSectionStates[uniqueId] || {};
  const defaultData = useMemo(() => getDefaultFeaturesSectionData(), []);

  const mergedData = useMemo((): FeaturesSectionProps => ({
    ...defaultData,
    ...props,
    ...tenantComponentData,
    ...storeData,
    ...currentStoreData,
    ...(props.overrideData || {}),
  }), [defaultData, props, tenantComponentData, storeData, currentStoreData]);

  if (!mergedData.visible) return null;

  return (
    <FeaturesSection
      heading={mergedData.heading}
      features={mergedData.features}
      certifications={mergedData.certifications}
      dir={mergedData.dir}
      headingTextProps={mergedData.headingTextProps}
      featureTitleTextProps={mergedData.featureTitleTextProps}
      featureDescriptionTextProps={mergedData.featureDescriptionTextProps}
      certificationTextProps={mergedData.certificationTextProps}
    />
  );
}
