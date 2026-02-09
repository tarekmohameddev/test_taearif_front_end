interface DescriptionSectionProps {
  description?: string;
  title?: string;
  textColor?: string;
  primaryColor: string;
  showDescription?: boolean;
}

export const DescriptionSection = ({
  description,
  title = "وصف المشروع",
  textColor,
  primaryColor,
  showDescription = true,
}: DescriptionSectionProps) => {
  if (showDescription === false) return null;

  return (
    <section className="bg-transparent rounded-lg" data-purpose="description-block">
      <h2
        className="text-3xl font-bold mb-6 text-right"
        style={{ color: textColor || primaryColor }}
      >
        {title}
      </h2>
      <p
        className="leading-relaxed text-right text-lg whitespace-pre-line"
        style={{ color: textColor }}
      >
        {description || "لا يوجد وصف متاح لهذا المشروع"}
      </p>
    </section>
  );
};
