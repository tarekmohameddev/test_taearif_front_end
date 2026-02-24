"use client";

import { useEffect, useMemo } from "react";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultQuoteSectionData } from "@/context/editorStoreFunctions/quoteSectionFunctions";
import { QuoteSection } from "@/stories/QuoteSection/QuoteSection";
import type { QuoteSectionProps } from "@/stories/QuoteSection/QuoteSection.types";

interface QuoteSection1Props extends Partial<QuoteSectionProps> {
  variant?: string;
  useStore?: boolean;
  id?: string;
  overrideData?: Partial<QuoteSectionProps>;
}

export default function QuoteSection1(props: QuoteSection1Props) {
  const variantId = props.variant || "quoteSection1";
  const uniqueId = props.id || variantId;

  const ensureComponentVariant = useEditorStore((s) => s.ensureComponentVariant);
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const quoteSectionStates = useEditorStore((s) => s.quoteSectionStates);

  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  useEffect(() => {
    if (tenantId) fetchTenantData(tenantId);
  }, [tenantId, fetchTenantData]);

  const getTenantComponentData = (): Partial<QuoteSectionProps> => {
    if (!tenantData) return {};
    if (tenantData.components && Array.isArray(tenantData.components)) {
      for (const c of tenantData.components) {
        if (c.type === "quoteSection" && c.componentName === variantId)
          return (c as any).data || {};
      }
    }
    if (tenantData?.componentSettings) {
      for (const pageComponents of Object.values(tenantData.componentSettings)) {
        if (typeof pageComponents === "object" && !Array.isArray(pageComponents)) {
          for (const [cid, comp] of Object.entries(pageComponents as Record<string, any>)) {
            if (comp?.type === "quoteSection" && (comp?.componentName === variantId || cid === uniqueId))
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
        ? { ...getDefaultQuoteSectionData(), ...tenantComponentData, ...props }
        : { ...getDefaultQuoteSectionData(), ...props };
      store.ensureComponentVariant("quoteSection", uniqueId, initial);
    }
  }, [uniqueId, props.useStore]);

  const storeData = props.useStore ? getComponentData("quoteSection", uniqueId) || {} : {};
  const currentStoreData = quoteSectionStates[uniqueId] || {};
  const defaultData = useMemo(() => getDefaultQuoteSectionData(), []);

  const mergedData = useMemo((): QuoteSectionProps => ({
    ...defaultData,
    ...props,
    ...tenantComponentData,
    ...storeData,
    ...currentStoreData,
    ...(props.overrideData || {}),
  }), [defaultData, props, tenantComponentData, storeData, currentStoreData]);

  if (!mergedData.visible) return null;

  return (
    <QuoteSection
      quote={mergedData.quote}
      imageSrc={mergedData.imageSrc}
      imageAlt={mergedData.imageAlt}
      name={mergedData.name}
      role={mergedData.role}
      dir={mergedData.dir}
      quoteTextProps={mergedData.quoteTextProps}
      nameTextProps={mergedData.nameTextProps}
      roleTextProps={mergedData.roleTextProps}
    />
  );
}
