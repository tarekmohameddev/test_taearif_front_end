import PropertyCard3 from "@/components/tenant/cards/card3";
import type { Project } from "../types";

interface RelatedPropertiesSectionProps {
  project: Project | null;
  textColor?: string;
  primaryColor: string;
}

export const RelatedPropertiesSection = ({
  project,
  textColor,
  primaryColor,
}: RelatedPropertiesSectionProps) => {
  if (!project?.properties || project.properties.length === 0) return null;

  // Format price: remove .00 but keep other decimals
  const formatPrice = (price: string | undefined): string => {
    if (!price) return "0";
    return price.replace(/\.00$/, "");
  };

  return (
    <section className="mt-16" data-purpose="related-properties">
      <h2
        className="text-3xl font-bold mb-8 text-right"
        style={{
          color: textColor || primaryColor,
        }}
      >
        العقارات المرتبطة بهذا المشروع
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {project.properties.map((property) => {
          const cardProperty = {
            id: String(property.id),
            slug: property.slug,
            title: property.title,
            district: property.address || "",
            price: property.price
              ? `${formatPrice(property.price)} ريال`
              : "0 ريال",
            views: 0,
            bedrooms: property.beds || 0,
            bathrooms: property.bath || 0,
            area: property.area || property.size || "",
            type: property.type || "",
            transactionType:
              property.purpose === "sale"
                ? "للبيع"
                : property.purpose === "rent"
                  ? "للإيجار"
                  : "",
            image: property.featured_image || "",
            status:
              property.property_status === "available" || property.status === true
                ? "متاح"
                : property.property_status || "غير متاح",
            createdAt: property.created_at,
            description: property.description,
            features: property.features || [],
            location: property.location
              ? {
                  lat: parseFloat(property.location.latitude),
                  lng: parseFloat(property.location.longitude),
                  address: property.address || "",
                }
              : undefined,
          };

          return (
            <PropertyCard3
              key={property.id}
              property={cardProperty}
              showImage={true}
              showPrice={true}
              showDetails={false}
              showViews={false}
              showStatus={false}
            />
          );
        })}
      </div>
    </section>
  );
};
