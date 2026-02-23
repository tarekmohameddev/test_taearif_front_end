"use client";

import { useEffect, useMemo } from "react";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultHeader3Data } from "@/context/editorStoreFunctions/headerFunctions";
import { Header } from "@/stories/Header/Header";
import type { HeaderProps } from "@/stories/Header/Header.types";

interface Header3Props extends Partial<HeaderProps> {
  variant?: string;
  useStore?: boolean;
  id?: string;
  overrideData?: Partial<HeaderProps>;
}

export default function Header3(props: Header3Props) {
  const variantId = props.variant || "header3";
  const uniqueId = props.id || variantId;

  const ensureComponentVariant = useEditorStore((s) => s.ensureComponentVariant);
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const headerStates = useEditorStore((s) => s.headerStates);

  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);

  const getTenantComponentData = (): Partial<HeaderProps> => {
    if (!tenantData) return {};

    if (tenantData.components && Array.isArray(tenantData.components)) {
      for (const component of tenantData.components) {
        if (
          component.type === "header" &&
          component.componentName === variantId
        ) {
          return (component as any).data || {};
        }
      }
    }

    if (tenantData?.componentSettings) {
      for (const pageComponents of Object.values(tenantData.componentSettings)) {
        if (typeof pageComponents === "object" && !Array.isArray(pageComponents)) {
          for (const [componentId, component] of Object.entries(
            pageComponents as Record<string, any>,
          )) {
            if (
              component?.type === "header" &&
              component?.componentName === variantId &&
              componentId === uniqueId
            ) {
              return component?.data || {};
            }
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
      const initial =
        Object.keys(tenantComponentData).length > 0
          ? { ...getDefaultHeader3Data(), ...tenantComponentData, ...props }
          : { ...getDefaultHeader3Data(), ...props };
      store.ensureComponentVariant("header", uniqueId, initial);
    }
  }, [uniqueId, props.useStore]);

  const storeData = props.useStore
    ? getComponentData("header", uniqueId) || {}
    : {};
  const currentStoreData = headerStates[uniqueId] || {};

  const defaultData = useMemo(() => getDefaultHeader3Data(), []);

  const mergedData = useMemo((): HeaderProps => {
    const base = {
      ...defaultData,
      ...props,
      ...tenantComponentData,
      ...storeData,
      ...currentStoreData,
      ...(props.overrideData || {}),
    };
    return {
      ...base,
      logo: base.logo
        ? {
            ...defaultData.logo,
            ...props.logo,
            ...tenantComponentData.logo,
            ...storeData.logo,
            ...currentStoreData.logo,
            ...props.overrideData?.logo,
          }
        : undefined,
      navLinks:
        base.navLinks?.length !== undefined && base.navLinks.length > 0
          ? base.navLinks
          : defaultData.navLinks,
      languageToggle: base.languageToggle
        ? {
            ...defaultData.languageToggle,
            ...props.languageToggle,
            ...tenantComponentData.languageToggle,
            ...storeData.languageToggle,
            ...currentStoreData.languageToggle,
            ...props.overrideData?.languageToggle,
          }
        : undefined,
      cta: base.cta
        ? {
            ...defaultData.cta,
            ...props.cta,
            ...tenantComponentData.cta,
            ...storeData.cta,
            ...currentStoreData.cta,
            ...props.overrideData?.cta,
          }
        : undefined,
    };
  }, [
    defaultData,
    props,
    tenantComponentData,
    storeData,
    currentStoreData,
  ]);

  if (!mergedData.visible) {
    return null;
  }

  return (
    <Header
      logo={mergedData.logo}
      navLinks={mergedData.navLinks}
      languageToggle={mergedData.languageToggle}
      cta={mergedData.cta}
      dir={mergedData.dir}
      navLinkTextProps={mergedData.navLinkTextProps}
      languageToggleTextProps={mergedData.languageToggleTextProps}
      ctaTextProps={mergedData.ctaTextProps}
    />
  );
}
