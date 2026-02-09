interface SpecItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  textColor: string;
}

export const SpecItem = ({ icon, label, value, textColor }: SpecItemProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-3" style={{ color: textColor }}>
        {icon}
      </div>
      <span className="font-bold text-lg" style={{ color: textColor }}>
        {label}: {value}
      </span>
    </div>
  );
};
