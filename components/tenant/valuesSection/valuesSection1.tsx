"use client";

import { useEffect, useMemo } from "react";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultValuesSectionData } from "@/context/editorStoreFunctions/valuesSectionFunctions";
import { ValuesSection } from "@/stories/ValuesSection/ValuesSection";
import type { ValuesSectionProps, ValueCard } from "@/stories/ValuesSection/ValuesSection.types";
import { CommunityIcon } from "@/stories/assets/CommunityIcon";
import { HeritageIcon } from "@/stories/assets/HeritageIcon";
import { QualityIcon } from "@/stories/assets/QualityIcon";

const ICON_MAP: Record<string, React.ReactNode> = {
  community: <CommunityIcon />,
  heritage: <HeritageIcon />,
  quality: <QualityIcon />,
};

interface ValuesSection1Props extends Partial<ValuesSectionProps> {
  variant?: string;
  useStore?: boolean;
  id?: string;
  overrideData?: Partial<ValuesSectionProps>;
}

export default function ValuesSection1(props: ValuesSection1Props) {
  const variantId = props.variant || "valuesSection1";
  const uniqueId = props.id || variantId;

  const ensureComponentVariant = useEditorStore((s) => s.ensureComponentVariant);
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const valuesSectionStates = useEditorStore((s) => s.valuesSectionStates);

  const tenantData = useTenantStore((s) => s.tenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  const getTenantComponentData = (): Partial<ValuesSectionProps> => {
    if (!tenantData) return {};
    if (tenantData.components && Array.isArray(tenantData.components)) {
      for (const c of tenantData.components) {
        if (c.type === "valuesSection" && c.componentName === variantId)
          return (c as any).data || {};
      }
    }
    if (tenantData?.componentSettings) {
      for (const pageComponents of Object.values(tenantData.componentSettings)) {
        if (typeof pageComponents === "object" && !Array.isArray(pageComponents)) {
          for (const [cid, comp] of Object.entries(pageComponents as Record<string, any>)) {
            if (comp?.type === "valuesSection" && (comp?.componentName === variantId || cid === uniqueId))
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
        ? { ...getDefaultValuesSectionData(), ...tenantComponentData, ...props }
        : { ...getDefaultValuesSectionData(), ...props };
      store.ensureComponentVariant("valuesSection", uniqueId, initial);
    }
  }, [uniqueId, props.useStore]);

  const storeData = props.useStore ? getComponentData("valuesSection", uniqueId) || {} : {};
  const currentStoreData = valuesSectionStates[uniqueId] || {};
  const defaultData = useMemo(() => getDefaultValuesSectionData(), []);

  const mergedData = useMemo((): ValuesSectionProps => ({
    ...defaultData,
    ...props,
    ...tenantComponentData,
    ...storeData,
    ...currentStoreData,
    ...(props.overrideData || {}),
  }), [defaultData, props, tenantComponentData, storeData, currentStoreData]);

  const cardsWithIcons: ValueCard[] = useMemo(() => {
    const cards = mergedData.cards ?? [];
    return cards.map((card: any) => ({
      title: card.title ?? "",
      description: card.description ?? "",
      icon: ICON_MAP[card.iconKey] ?? ICON_MAP.community,
      bgVariant: card.bgVariant ?? "muted-foreground",
    }));
  }, [mergedData.cards]);

  if (!mergedData.visible) return null;

  return (
    <ValuesSection
      heading={mergedData.heading}
      description={mergedData.description}
      cards={cardsWithIcons}
      dir={mergedData.dir}
      headingTextProps={mergedData.headingTextProps}
      descriptionTextProps={mergedData.descriptionTextProps}
      cardTitleTextProps={mergedData.cardTitleTextProps}
      cardDescriptionTextProps={mergedData.cardDescriptionTextProps}
    />
  );
}
