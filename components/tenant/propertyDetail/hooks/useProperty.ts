import { useState, useEffect } from "react";
import { useTenantId } from "@/hooks/useTenantId";
import { Property } from "../types/types";
import { fetchPropertyData, fetchSimilarPropertiesData } from "../services/property.api";

export const useProperty = (propertySlug: string) => {
  const { tenantId, isLoading: tenantLoading } = useTenantId();
  const [property, setProperty] = useState<Property | null>(null);
  const [loadingProperty, setLoadingProperty] = useState(true);
  const [propertyError, setPropertyError] = useState<string | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(true);

  const isLiveEditor =
    typeof window !== "undefined" &&
    window.location.pathname.includes("/live-editor");

  useEffect(() => {
    if (isLiveEditor) {
      fetchPropertyData(tenantId, propertySlug, true).then(({ property, error }) => {
        setProperty(property);
        setPropertyError(error);
        setLoadingProperty(false);
      });
      fetchSimilarPropertiesData(tenantId, true).then((properties) => {
        setSimilarProperties(properties);
        setLoadingSimilar(false);
      });
      return;
    }

    if (tenantId) {
      fetchPropertyData(tenantId, propertySlug, false).then(({ property, error }) => {
        setProperty(property);
        setPropertyError(error);
        setLoadingProperty(false);
      });
      fetchSimilarPropertiesData(tenantId, false).then((properties) => {
        setSimilarProperties(properties);
        setLoadingSimilar(false);
      });
    }
  }, [tenantId, propertySlug, isLiveEditor]);

  return {
    property,
    loadingProperty,
    propertyError,
    similarProperties,
    loadingSimilar,
    tenantId,
    tenantLoading,
    isLiveEditor,
  };
};
