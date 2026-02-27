"use client";

import { useEffect, useMemo } from "react";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultFooter3Data } from "@/context/editorStoreFunctions/footerFunctions";
import { Footer } from "@/stories/Footer/Footer";
import type { FooterProps, SocialLink } from "@/stories/Footer/Footer.types";
import { InstagramIcon } from "@/stories/assets/InstagramIcon";
import { LinkedInIcon } from "@/stories/assets/LinkedInIcon";
import { TikTokIcon } from "@/stories/assets/TikTokIcon";
import { XIcon } from "@/stories/assets/XIcon";

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  instagram: <InstagramIcon />,
  linkedin: <LinkedInIcon />,
  tiktok: <TikTokIcon />,
  x: <XIcon />,
};

function resolveSocialLinks(
  storeLinks: Array<{ platform?: string; href?: string }> = [],
): SocialLink[] {
  return storeLinks.map((item) => ({
    platform: item.platform || "unknown",
    href: item.href || "#",
    icon: PLATFORM_ICONS[item.platform?.toLowerCase() || ""] ?? null,
  }));
}

interface Footer3Props extends Partial<FooterProps> {
  variant?: string;
  useStore?: boolean;
  id?: string;
  overrideData?: Partial<FooterProps>;
}

export default function Footer3(props: Footer3Props) {
  const variantId = props.variant || "footer3";
  const uniqueId = props.id || variantId;

  const ensureComponentVariant = useEditorStore((s) => s.ensureComponentVariant);
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const footerStates = useEditorStore((s) => s.footerStates);

  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  useEffect(() => {
    if (tenantId) fetchTenantData(tenantId);
  }, [tenantId, fetchTenantData]);

  const getTenantComponentData = (): Partial<FooterProps> => {
    if (!tenantData) return {};
    if (tenantData.components && Array.isArray(tenantData.components)) {
      for (const c of tenantData.components) {
        if (c.type === "footer" && c.componentName === variantId)
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
              comp?.type === "footer" &&
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
              ...getDefaultFooter3Data(),
              ...tenantComponentData,
              ...props,
            }
          : { ...getDefaultFooter3Data(), ...props };
      store.ensureComponentVariant("footer", uniqueId, initial);
    }
  }, [uniqueId, props.useStore]);

  const storeData = props.useStore
    ? getComponentData("footer", uniqueId) || {}
    : {};
  const currentStoreData = footerStates[uniqueId] || {};
  const defaultData = useMemo(() => getDefaultFooter3Data(), []);

  const mergedData = useMemo((): FooterProps => {
    const base = {
      ...defaultData,
      ...props,
      ...tenantComponentData,
      ...storeData,
      ...currentStoreData,
      ...(props.overrideData || {}),
    };

    const socialLinks = resolveSocialLinks(base.socialLinks as any);
    return { ...base, socialLinks };
  }, [defaultData, props, tenantComponentData, storeData, currentStoreData]);

  if (mergedData.visible === false) return null;

  return (
    <Footer
      logo={mergedData.logo}
      address={mergedData.address}
      email={mergedData.email}
      links={mergedData.links}
      linksHeading={mergedData.linksHeading}
      socialLinks={mergedData.socialLinks}
      socialHeading={mergedData.socialHeading}
      copyright={mergedData.copyright}
      dir={mergedData.dir}
      addressLabelTextProps={mergedData.addressLabelTextProps}
      addressValueTextProps={mergedData.addressValueTextProps}
      emailTextProps={mergedData.emailTextProps}
      linksHeadingTextProps={mergedData.linksHeadingTextProps}
      socialHeadingTextProps={mergedData.socialHeadingTextProps}
      copyrightTextProps={mergedData.copyrightTextProps}
    />
  );
}
