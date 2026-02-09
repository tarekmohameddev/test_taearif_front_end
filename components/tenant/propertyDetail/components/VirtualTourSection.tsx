import type { Property } from "../types/types";

interface VirtualTourSectionProps {
  property: Property;
}

export const VirtualTourSection = ({ property }: VirtualTourSectionProps) => {
  if (!property.virtual_tour) {
    return null;
  }

  return (
    <section className="rounded-lg overflow-hidden shadow-md bg-black relative h-96">
      <div className="w-full h-full rounded-lg overflow-hidden">
        <iframe
          src={property.virtual_tour}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title="جولة افتراضية للعقار"
        />
      </div>
    </section>
  );
};
