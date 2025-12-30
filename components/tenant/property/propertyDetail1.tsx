"use client";

import PropertyDetail from "@/components/tenant/propertyDetail/propertyDetail1";

interface propertyDetail1Props {
  propertySlug: string;
}

export default function propertyDetail1({ propertySlug }: propertyDetail1Props) {
  return <PropertyDetail propertySlug={propertySlug} />;
}

