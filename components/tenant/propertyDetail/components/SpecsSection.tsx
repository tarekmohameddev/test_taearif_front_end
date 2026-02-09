import type { Property } from "../types/types";
import {
  BasicSpecs,
  RoomSpecs,
  BuildingSpecs,
  LocationSpecs,
  PaymentSpecs,
} from "./specs";

interface SpecsSectionProps {
  property: Property;
  textColor: string;
  specsTitle?: string;
  showSpecs?: boolean;
}

export const SpecsSection = ({
  property,
  textColor,
  specsTitle = "مواصفات العقار",
  showSpecs = true,
}: SpecsSectionProps) => {
  if (!showSpecs) {
    return null;
  }

  return (
    <section className="bg-transparent" data-purpose="property-specs">
      <h2 className="text-3xl font-bold mb-8 text-right" style={{ color: textColor }}>
        {specsTitle}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-6 text-center">
        <BasicSpecs property={property} textColor={textColor} />
        <RoomSpecs property={property} textColor={textColor} />
        <BuildingSpecs property={property} textColor={textColor} />
        <LocationSpecs property={property} textColor={textColor} />
        <PaymentSpecs property={property} textColor={textColor} />
      </div>
    </section>
  );
};
