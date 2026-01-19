export const IncompleteRequestsPageHeader = () => {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          الطلبات الغير مكتملة
        </h1>
        <p className="text-muted-foreground">
          عرض وإدارة الطلبات التي تحتاج إلى معلومات إضافية لإكمال المطابقة
        </p>
      </div>
    </div>
  );
};
