"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Edit, Key, Lock, Save, Loader2, CheckCircle, XCircle } from "lucide-react";
import type { PermissionsResponse } from "../../types";

interface EditRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  onNameChange: (value: string) => void;
  permissionsData: PermissionsResponse | null;
  permissionsLoading: boolean;
  selectedPermissions: Record<string, boolean>;
  onPermissionChange: (name: string, checked: boolean) => void;
  loading: boolean;
  error: string | null;
  success: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  translatePermission: (name: string) => string;
}

export function EditRoleDialog({
  open,
  onOpenChange,
  name,
  onNameChange,
  permissionsData,
  permissionsLoading,
  selectedPermissions,
  onPermissionChange,
  loading,
  error,
  success,
  onSubmit,
  onCancel,
  translatePermission,
}: EditRoleDialogProps) {
  const grouped = permissionsData?.grouped ?? {};
  const hasGrouped = Object.keys(grouped).length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white mx-4 sm:mx-0">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-black">
            <Edit className="h-5 w-5" />
            تعديل الدور
          </DialogTitle>
          <DialogDescription>تعديل بيانات الدور وصلاحياته</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="editRoleName" className="text-black font-medium">
              اسم الدور
            </Label>
            <Input
              id="editRoleName"
              placeholder="أدخل اسم الدور"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className="border-gray-300 focus:border-black focus:ring-black"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-gray-600" />
              <Label className="text-black font-medium">الصلاحيات</Label>
            </div>
            {permissionsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  <span className="text-gray-600 font-medium">
                    جاري تحميل الصلاحيات...
                  </span>
                </div>
              </div>
            ) : hasGrouped ? (
              <ScrollArea className="h-64 border border-gray-200 rounded-lg p-4">
                <div className="space-y-4">
                  {Object.entries(grouped).map(([groupName, groupPermissions]) => (
                    <div key={groupName} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-gray-100 rounded">
                          <Key className="h-4 w-4 text-gray-600" />
                        </div>
                        <h4 className="font-medium text-gray-900 capitalize">
                          {groupName}
                        </h4>
                      </div>
                      <div className="space-y-2 pr-4">
                        {Array.isArray(groupPermissions) &&
                          groupPermissions.map((permission, index) => (
                            <div
                              key={permission.id}
                              className="flex items-center space-x-2 space-x-reverse"
                            >
                              <Checkbox
                                id={`edit-role-permission-${groupName}-${index}`}
                                checked={
                                  selectedPermissions[permission.name] ?? false
                                }
                                onCheckedChange={(checked) =>
                                  onPermissionChange(
                                    permission.name,
                                    checked === true
                                  )
                                }
                                className="border-gray-300 data-[state=checked]:bg-black data-[state=checked]:border-black"
                              />
                              <Label
                                htmlFor={`edit-role-permission-${groupName}-${index}`}
                                className="text-gray-700 cursor-pointer flex-1"
                              >
                                {translatePermission(permission.name)}
                              </Label>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-8">
                <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">لا توجد صلاحيات متاحة</p>
              </div>
            )}
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-medium">
                  تم تحديث الدور بنجاح!
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="text-red-800 font-medium">{error}</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={onCancel}
            variant="outline"
            className="text-gray-600 hover:text-black hover:border-black"
          >
            إلغاء
          </Button>
          <Button
            onClick={onSubmit}
            disabled={loading || !name.trim()}
            className="bg-black hover:bg-gray-800 text-white disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                جاري التحديث...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 ml-2" />
                تحديث الدور
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
