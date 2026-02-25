"use client";

import { useEffect, useMemo } from "react";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultProjectsHeaderData } from "@/context/editorStoreFunctions/projectsHeaderFunctions";
import { ProjectsHeader } from "@/stories/ProjectsHeader/ProjectsHeader";
import type { ProjectsHeaderProps } from "@/stories/ProjectsHeader/ProjectsHeader.types";

interface ProjectsHeader1Props extends Partial<ProjectsHeaderProps> {
  variant?: string;
  useStore?: boolean;
  id?: string;
  overrideData?: Partial<ProjectsHeaderProps>;
}

export default function ProjectsHeader1(props: ProjectsHeader1Props) {
  const variantId = props.variant || "projectsHeader1";
  const uniqueId = props.id || variantId;

  const ensureComponentVariant = useEditorStore((s) => s.ensureComponentVariant);
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const projectsHeaderStates = useEditorStore((s) => s.projectsHeaderStates);

  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  useEffect(() => {
    if (tenantId) fetchTenantData(tenantId);
  }, [tenantId, fetchTenantData]);

  const getTenantComponentData = (): Partial<ProjectsHeaderProps> => {
    if (!tenantData) return {};
    if (tenantData.components && Array.isArray(tenantData.components)) {
      for (const c of tenantData.components) {
        if (c.type === "projectsHeader" && c.componentName === variantId)
          return (c as any).data || {};
      }
    }
    if (tenantData?.componentSettings) {
      for (const pageComponents of Object.values(tenantData.componentSettings)) {
        if (typeof pageComponents === "object" && !Array.isArray(pageComponents)) {
          for (const [cid, comp] of Object.entries(pageComponents as Record<string, any>)) {
            if (comp?.type === "projectsHeader" && (comp?.componentName === variantId || cid === uniqueId))
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
        ? { ...getDefaultProjectsHeaderData(), ...tenantComponentData, ...props }
        : { ...getDefaultProjectsHeaderData(), ...props };
      store.ensureComponentVariant("projectsHeader", uniqueId, initial);
    }
  }, [uniqueId, props.useStore]);

  const storeData = props.useStore ? getComponentData("projectsHeader", uniqueId) || {} : {};
  const currentStoreData = projectsHeaderStates[uniqueId] || {};
  const defaultData = useMemo(() => getDefaultProjectsHeaderData(), []);

  const mergedData = useMemo((): ProjectsHeaderProps => {
    const base = {
      ...defaultData,
      ...props,
      ...tenantComponentData,
      ...storeData,
      ...currentStoreData,
      ...(props.overrideData || {}),
    };
    const desc = base.description;
    return { ...base, description: typeof desc === "string" ? desc.split("\n").filter(Boolean) : desc };
  }, [defaultData, props, tenantComponentData, storeData, currentStoreData]);

  if (!mergedData.visible) return null;

  return (
    <ProjectsHeader
      heading={mergedData.heading}
      description={mergedData.description}
      dir={mergedData.dir}
      headingTextProps={mergedData.headingTextProps}
      descriptionTextProps={mergedData.descriptionTextProps}
    />
  );
}
