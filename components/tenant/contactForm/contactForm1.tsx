"use client";

import { useEffect, useMemo } from "react";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultContactFormData } from "@/context/editorStoreFunctions/contactFormFunctions";
import { ContactForm } from "@/stories/ContactForm/ContactForm";
import type { ContactFormProps } from "@/stories/ContactForm/ContactForm.types";

interface ContactForm1Props extends Partial<ContactFormProps> {
  variant?: string;
  useStore?: boolean;
  id?: string;
  overrideData?: Partial<ContactFormProps>;
}

export default function ContactForm1(props: ContactForm1Props) {
  const variantId = props.variant || "contactForm1";
  const uniqueId = props.id || variantId;

  const ensureComponentVariant = useEditorStore((s) => s.ensureComponentVariant);
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const contactFormStates = useEditorStore((s) => s.contactFormStates);

  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  useEffect(() => {
    if (tenantId) fetchTenantData(tenantId);
  }, [tenantId, fetchTenantData]);

  const getTenantComponentData = (): Partial<ContactFormProps> => {
    if (!tenantData) return {};
    if (tenantData.components && Array.isArray(tenantData.components)) {
      for (const c of tenantData.components) {
        if (c.type === "contactForm" && c.componentName === variantId)
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
              comp?.type === "contactForm" &&
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
              ...getDefaultContactFormData(),
              ...tenantComponentData,
              ...props,
            }
          : { ...getDefaultContactFormData(), ...props };
      store.ensureComponentVariant("contactForm", uniqueId, initial);
    }
  }, [uniqueId, props.useStore]);

  const storeData = props.useStore
    ? getComponentData("contactForm", uniqueId) || {}
    : {};
  const currentStoreData = contactFormStates[uniqueId] || {};
  const defaultData = useMemo(() => getDefaultContactFormData(), []);

  const mergedData = useMemo(
    (): ContactFormProps => ({
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
    <ContactForm
      heading={mergedData.heading}
      description={mergedData.description}
      fields={mergedData.fields}
      links={mergedData.links}
      submitText={mergedData.submitText}
      imageSrc={mergedData.imageSrc}
      imageAlt={mergedData.imageAlt}
      shapeSrc={mergedData.shapeSrc}
      dir={mergedData.dir}
      headingTextProps={mergedData.headingTextProps}
      descriptionTextProps={mergedData.descriptionTextProps}
      onSubmit={mergedData.onSubmit}
    />
  );
}
