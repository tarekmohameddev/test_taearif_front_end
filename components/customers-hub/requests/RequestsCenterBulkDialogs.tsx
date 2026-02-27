"use client";

import { CheckCircle2, Trash2, Clock, UserPlus, AlertTriangle } from "lucide-react";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { priorityOptions } from "./constants";
import type { Priority } from "@/types/unified-customer";

export interface RequestsCenterBulkDialogsProps {
  selectedActionIds: Set<string>;
  completeDialogOpen: boolean;
  setCompleteDialogOpen: (v: boolean) => void;
  dismissDialogOpen: boolean;
  setDismissDialogOpen: (v: boolean) => void;
  snoozeDialogOpen: boolean;
  setSnoozeDialogOpen: (v: boolean) => void;
  snoozeUntil: string;
  setSnoozeUntil: (v: string) => void;
  assignDialogOpen: boolean;
  setAssignDialogOpen: (v: boolean) => void;
  assignEmployee: { id: string; name: string } | null;
  setAssignEmployee: (v: { id: string; name: string } | null) => void;
  priorityDialogOpen: boolean;
  setPriorityDialogOpen: (v: boolean) => void;
  selectedPriority: Priority | null;
  setSelectedPriority: (v: Priority | null) => void;
  onBulkComplete: () => Promise<void>;
  onBulkDismiss: () => Promise<void>;
  onBulkSnooze: (until: string) => Promise<void>;
  onBulkAssign: (employeeId: string, employeeName: string) => Promise<void>;
  onBulkChangePriority: (priority: Priority) => Promise<void>;
}

export function RequestsCenterBulkDialogs({
  selectedActionIds,
  completeDialogOpen,
  setCompleteDialogOpen,
  dismissDialogOpen,
  setDismissDialogOpen,
  snoozeDialogOpen,
  setSnoozeDialogOpen,
  snoozeUntil,
  setSnoozeUntil,
  assignDialogOpen,
  setAssignDialogOpen,
  assignEmployee,
  setAssignEmployee,
  priorityDialogOpen,
  setPriorityDialogOpen,
  selectedPriority,
  setSelectedPriority,
  onBulkComplete,
  onBulkDismiss,
  onBulkSnooze,
  onBulkAssign,
  onBulkChangePriority,
}: RequestsCenterBulkDialogsProps) {
  return (
    <>
      <ConfirmationDialog
        open={completeDialogOpen}
        onOpenChange={setCompleteDialogOpen}
        title="تأكيد إكمال الإجراءات"
        description={`هل أنت متأكد من إكمال ${selectedActionIds.size} إجراء؟ سيتم تحديث حالتها إلى "مكتمل".`}
        confirmText="تأكيد الإكمال"
        onConfirm={onBulkComplete}
        icon={<CheckCircle2 className="h-5 w-5" />}
      />
      <ConfirmationDialog
        open={dismissDialogOpen}
        onOpenChange={setDismissDialogOpen}
        title="تأكيد رفض الإجراءات"
        description={`هل أنت متأكد من رفض ${selectedActionIds.size} إجراء؟ هذا الإجراء لا يمكن التراجع عنه.`}
        confirmText="تأكيد الرفض"
        onConfirm={onBulkDismiss}
        variant="danger"
        icon={<Trash2 className="h-5 w-5" />}
      />
      {snoozeUntil && (
        <ConfirmationDialog
          open={snoozeDialogOpen}
          onOpenChange={setSnoozeDialogOpen}
          title="تأكيد تأجيل الإجراءات"
          description={`هل أنت متأكد من تأجيل ${selectedActionIds.size} إجراء حتى ${new Date(snoozeUntil).toLocaleDateString("ar-SA", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}؟`}
          confirmText="تأكيد التأجيل"
          onConfirm={() => {
            onBulkSnooze(snoozeUntil);
            setSnoozeUntil("");
          }}
          icon={<Clock className="h-5 w-5" />}
        />
      )}
      {assignEmployee && (
        <ConfirmationDialog
          open={assignDialogOpen}
          onOpenChange={setAssignDialogOpen}
          title="تأكيد تعيين الإجراءات"
          description={`هل أنت متأكد من تعيين ${selectedActionIds.size} إجراء إلى ${assignEmployee.name}؟`}
          confirmText="تأكيد التعيين"
          onConfirm={() => {
            onBulkAssign(assignEmployee.id, assignEmployee.name);
            setAssignEmployee(null);
          }}
          icon={<UserPlus className="h-5 w-5" />}
        />
      )}
      {selectedPriority && (
        <ConfirmationDialog
          open={priorityDialogOpen}
          onOpenChange={setPriorityDialogOpen}
          title="تأكيد تغيير الأولوية"
          description={`هل أنت متأكد من تغيير أولوية ${selectedActionIds.size} إجراء إلى "${priorityOptions.find((p) => p.value === selectedPriority)?.label}"؟`}
          confirmText="تأكيد التغيير"
          onConfirm={() => {
            onBulkChangePriority(selectedPriority);
            setSelectedPriority(null);
          }}
          icon={<AlertTriangle className="h-5 w-5" />}
        />
      )}
    </>
  );
}
