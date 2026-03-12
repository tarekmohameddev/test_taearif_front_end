"use client";

import { useEffect, useMemo } from "react";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultCommitmentSectionData } from "@/context/editorStoreFunctions/commitmentSectionFunctions";
import { CommitmentSection } from "@/stories/CommitmentSection/CommitmentSection";
import type { CommitmentSectionProps } from "@/stories/CommitmentSection/CommitmentSection.types";

interface CommitmentSection1Props extends Partial<CommitmentSectionProps> {
  variant?: string;
  useStore?: boolean;
  id?: string;
  overrideData?: Partial<CommitmentSectionProps>;
}

export default function CommitmentSection1(props: CommitmentSection1Props) {
  const variantId = props.variant || "commitmentSection1";
  const uniqueId = props.id || variantId;

  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const commitmentSectionStates = useEditorStore(
    (s) => s.commitmentSectionStates
  );

  const tenantData = useTenantStore((s) => s.tenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  const getTenantComponentData = (): Partial<CommitmentSectionProps> => {
    if (!tenantData) return {};

    if (tenantData.components && Array.isArray(tenantData.components)) {
      for (const component of tenantData.components) {
        if (
          component.type === "commitmentSection" &&
          component.componentName === variantId
        ) {
          return (component as any).data || {};
        }
      }
    }

    if (tenantData?.componentSettings) {
      for (const pageComponents of Object.values(
        tenantData.componentSettings
      )) {
        if (
          typeof pageComponents === "object" &&
          !Array.isArray(pageComponents)
        ) {
          for (const [componentId, component] of Object.entries(
            pageComponents as Record<string, any>
          )) {
            if (
              component?.type === "commitmentSection" &&
              (component?.componentName === variantId ||
                componentId === uniqueId)
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
          ? {
              ...getDefaultCommitmentSectionData(),
              ...tenantComponentData,
              ...props,
            }
          : { ...getDefaultCommitmentSectionData(), ...props };
      store.ensureComponentVariant("commitmentSection", uniqueId, initial);
    }
  }, [uniqueId, props.useStore]);

  const storeData = props.useStore
    ? getComponentData("commitmentSection", uniqueId) || {}
    : {};
  const currentStoreData = commitmentSectionStates[uniqueId] || {};

  const defaultData = useMemo(() => getDefaultCommitmentSectionData(), []);

  const mergedData = useMemo((): CommitmentSectionProps => {
    return {
      ...defaultData,
      ...props,
      ...tenantComponentData,
      ...storeData,
      ...currentStoreData,
      ...(props.overrideData || {}),
    };
  }, [defaultData, props, tenantComponentData, storeData, currentStoreData]);

  if (!mergedData.visible) {
    return null;
  }

  return (
    <CommitmentSection
      imageSrc={mergedData.imageSrc}
      imageAlt={mergedData.imageAlt}
      backgroundImageSrc={mergedData.backgroundImageSrc}
      roleLabel={mergedData.roleLabel}
      name={mergedData.name}
      heading={mergedData.heading}
      quote={mergedData.quote}
      dir={mergedData.dir}
      roleLabelTextProps={mergedData.roleLabelTextProps}
      nameTextProps={mergedData.nameTextProps}
      headingTextProps={mergedData.headingTextProps}
      quoteTextProps={mergedData.quoteTextProps}
    />
  );
}
