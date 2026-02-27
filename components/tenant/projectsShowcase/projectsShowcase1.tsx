"use client";

import { useEffect, useMemo } from "react";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultProjectsShowcaseData } from "@/context/editorStoreFunctions/projectsShowcaseFunctions";
import { ProjectsShowcase } from "@/stories/ProjectsShowcase/ProjectsShowcase";
import type { ProjectsShowcaseProps } from "@/stories/ProjectsShowcase/ProjectsShowcase.types";

interface ProjectsShowcase1Props extends Partial<ProjectsShowcaseProps> {
  variant?: string;
  useStore?: boolean;
  id?: string;
  overrideData?: Partial<ProjectsShowcaseProps>;
}

export default function ProjectsShowcase1(props: ProjectsShowcase1Props) {
  const variantId = props.variant || "projectsShowcase1";
  const uniqueId = props.id || variantId;

  const ensureComponentVariant = useEditorStore((s) => s.ensureComponentVariant);
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const projectsShowcaseStates = useEditorStore(
    (s) => s.projectsShowcaseStates,
  );

  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  useEffect(() => {
    if (tenantId) fetchTenantData(tenantId);
  }, [tenantId, fetchTenantData]);

  const getTenantComponentData = (): Partial<ProjectsShowcaseProps> => {
    if (!tenantData) return {};
    if (tenantData.components && Array.isArray(tenantData.components)) {
      for (const c of tenantData.components) {
        if (c.type === "projectsShowcase" && c.componentName === variantId)
          return (c as any).data || {};
      }
    }
    if (tenantData?.componentSettings) {
      for (const pageComponents of Object.values(tenantData.componentSettings)) {
        if (
          typeof pageComponents === "object" &&
          !Array.isArray(pageComponents)
        ) {
          for (const [cid, comp] of Object.entries(
            pageComponents as Record<string, any>,
          )) {
            if (
              comp?.type === "projectsShowcase" &&
              (comp?.componentName === variantId || cid === uniqueId)
            )
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
      const initial =
        Object.keys(tenantComponentData).length > 0
          ? {
              ...getDefaultProjectsShowcaseData(),
              ...tenantComponentData,
              ...props,
            }
          : { ...getDefaultProjectsShowcaseData(), ...props };
      store.ensureComponentVariant("projectsShowcase", uniqueId, initial);
    }
  }, [uniqueId, props.useStore]);

  const storeData = props.useStore
    ? getComponentData("projectsShowcase", uniqueId) || {}
    : {};
  const currentStoreData = projectsShowcaseStates[uniqueId] || {};
  const defaultData = useMemo(() => getDefaultProjectsShowcaseData(), []);

  const mergedData = useMemo(
    (): ProjectsShowcaseProps => ({
      ...defaultData,
      ...props,
      ...tenantComponentData,
      ...storeData,
      ...currentStoreData,
      ...(props.overrideData || {}),
    }),
    [defaultData, props, tenantComponentData, storeData, currentStoreData],
  );

  if (mergedData.visible === false) return null;

  return (
    <ProjectsShowcase
      filters={mergedData.filters}
      projects={mergedData.projects}
      dir={mergedData.dir}
      filterButtonTextProps={mergedData.filterButtonTextProps}
      statusBadgeTextProps={mergedData.statusBadgeTextProps}
      projectTitleTextProps={mergedData.projectTitleTextProps}
      projectLocationTextProps={mergedData.projectLocationTextProps}
      projectDescriptionTextProps={mergedData.projectDescriptionTextProps}
      unitTypeTextProps={mergedData.unitTypeTextProps}
      ctaTextProps={mergedData.ctaTextProps}
    />
  );
}
