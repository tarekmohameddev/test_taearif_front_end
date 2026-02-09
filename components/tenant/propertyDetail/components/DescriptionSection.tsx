import type { Property } from "../types/types";

interface DescriptionSectionProps {
  property: Property;
  title?: string;
  textColor: string;
  showDescription?: boolean;
}

export const DescriptionSection = ({
  property,
  title = "وصف العقار",
  textColor,
  showDescription = true,
}: DescriptionSectionProps) => {
  if (!showDescription) {
    return null;
  }

  return (
    <section className="bg-transparent rounded-lg" data-purpose="description-block">
      <h2 className="text-3xl font-bold mb-6 text-right" style={{ color: textColor }}>
        {title}
      </h2>
      <p
        className="leading-relaxed text-right text-lg whitespace-pre-line"
        style={{ color: textColor }}
      >
        {property.description || "لا يوجد وصف متاح لهذا العقار"}
      </p>
    </section>
  );
};
