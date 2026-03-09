"use client";

export function ConversationDetailLoadingState() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
        <p className="text-muted-foreground">جاري التحميل...</p>
      </div>
    </div>
  );
}

export function ConversationDetailNotFoundState() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center space-y-4">
        <p className="text-muted-foreground">لم يتم العثور على المحادثة</p>
      </div>
    </div>
  );
}
