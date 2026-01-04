"use client";

import React, { useState, useEffect } from "react";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogClose,
} from "@/components/customComponents/CustomDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Settings,
  Plus,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  Target,
  ListCheck,
  Flag,
  Tag,
  Loader2,
} from "lucide-react";
import useCrmStore from "@/context/store/crm";
import axiosInstance from "@/lib/axiosInstance";
import CrmFormDialog from "./crm-form-dialog";

interface CrmSettingsDialogProps {
  onStageDeleted?: (stageId: string) => void;
}

export default function CrmSettingsDialog({
  onStageDeleted,
}: CrmSettingsDialogProps) {
  const {
    showCrmSettingsDialog,
    pipelineStages,
    procedures,
    priorities,
    types,
    setShowCrmSettingsDialog,
    setPipelineStages,
    setProcedures,
    setPriorities,
    setTypes,
  } = useCrmStore();

  const [activeTab, setActiveTab] = useState("stages");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isMoving, setIsMoving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form dialog states
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [formType, setFormType] = useState<
    "stages" | "procedures" | "priorities" | "types"
  >("stages");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Load all data once when dialog opens
  useEffect(() => {
    if (showCrmSettingsDialog) {
      const loadAllData = async () => {
        setIsLoading(true);
        setError(null);

        try {
          // Load all data in parallel
          const [
            stagesResponse,
            proceduresResponse,
            prioritiesResponse,
            typesResponse,
          ] = await Promise.all([
            axiosInstance.get("/crm/stages"),
            axiosInstance.get("/crm/procedures"),
            axiosInstance.get("/crm/priorities"),
            axiosInstance.get("/crm/types"),
          ]);

          // Update store with all data
          if (stagesResponse.data.status === "success") {
            setPipelineStages(stagesResponse.data.data);
          }

          if (proceduresResponse.data.status === "success") {
            setProcedures(proceduresResponse.data.data);
          }

          if (prioritiesResponse.data.status === "success") {
            setPriorities(prioritiesResponse.data.data);
          }

          if (typesResponse.data.status === "success") {
            setTypes(typesResponse.data.data);
          }
        } catch (err: any) {
          console.error("Error loading CRM data:", err);
          setError("فشل في تحميل البيانات");
        } finally {
          setIsLoading(false);
        }
      };

      loadAllData();
    }
  }, [showCrmSettingsDialog]);

  const handleClose = () => {
    setShowCrmSettingsDialog(false);
    setError(null);
  };

  // Form dialog handlers
  const handleOpenAddForm = (
    type: "stages" | "procedures" | "priorities" | "types",
  ) => {
    setFormType(type);
    setFormMode("add");
    setSelectedItem(null);
    setShowFormDialog(true);
  };

  const handleOpenEditForm = (
    type: "stages" | "procedures" | "priorities" | "types",
    item: any,
  ) => {
    setFormType(type);
    setFormMode("edit");
    setSelectedItem(item);
    setShowFormDialog(true);
  };

  const handleCloseForm = () => {
    setShowFormDialog(false);
    setSelectedItem(null);
    setFormError(null);
    setFieldErrors({});
  };

  // Add new item functions
  const handleAddStage = async (data: any) => {
    try {
      setIsLoading(true);
      setFormError(null);
      setFieldErrors({});

      const response = await axiosInstance.post("/crm/stages", data);
      if (response.data.status === "success") {
        const newStages = [...pipelineStages, response.data.data];
        setPipelineStages(newStages);
        handleCloseForm();
      }
    } catch (err: any) {
      console.error("Error adding stage:", err);

      if (err.response?.data?.status === "error") {
        if (err.response.data.errors) {
          setFieldErrors(err.response.data.errors);
        } else {
          setFormError(err.response.data.message || "فشل في إضافة المرحلة");
        }
      } else {
        setFormError("فشل في إضافة المرحلة");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddStageForm = () => {
    handleOpenAddForm("stages");
  };

  const handleAddProcedure = async (data: any) => {
    try {
      setIsLoading(true);
      setFormError(null);
      setFieldErrors({});

      const response = await axiosInstance.post("/crm/procedures", data);
      if (response.data.status === "success") {
        const newProcedures = [...procedures, response.data.data];
        setProcedures(newProcedures);
        handleCloseForm();
      }
    } catch (err: any) {
      console.error("Error adding procedure:", err);

      if (err.response?.data?.status === "error") {
        if (err.response.data.errors) {
          setFieldErrors(err.response.data.errors);
        } else {
          setFormError(err.response.data.message || "فشل في إضافة الإجراء");
        }
      } else {
        setFormError("فشل في إضافة الإجراء");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPriority = async (data: any) => {
    try {
      setIsLoading(true);
      setFormError(null);
      setFieldErrors({});

      const response = await axiosInstance.post("/crm/priorities", data);
      if (response.data.status === "success") {
        const newPriorities = [...priorities, response.data.data];
        setPriorities(newPriorities);
        handleCloseForm();
      }
    } catch (err: any) {
      console.error("Error adding priority:", err);

      if (err.response?.data?.status === "error") {
        if (err.response.data.errors) {
          setFieldErrors(err.response.data.errors);
        } else {
          setFormError(err.response.data.message || "فشل في إضافة الأولوية");
        }
      } else {
        setFormError("فشل في إضافة الأولوية");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddType = async (data: any) => {
    try {
      setIsLoading(true);
      setFormError(null);
      setFieldErrors({});

      const response = await axiosInstance.post("/crm/types", data);
      if (response.data.status === "success") {
        const newTypes = [...types, response.data.data];
        setTypes(newTypes);
        handleCloseForm();
      }
    } catch (err: any) {
      console.error("Error adding type:", err);

      if (err.response?.data?.status === "error") {
        if (err.response.data.errors) {
          setFieldErrors(err.response.data.errors);
        } else {
          setFormError(err.response.data.message || "فشل في إضافة النوع");
        }
      } else {
        setFormError("فشل في إضافة النوع");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Edit item functions
  const handleEditStage = async (id: number, data: any) => {
    try {
      setIsLoading(true);
      setFormError(null);
      setFieldErrors({});

      const response = await axiosInstance.put(`/crm/stages/${id}`, data);
      if (response.data.status === "success") {
        const updatedStages = pipelineStages.map((stage) =>
          stage.id.toString() === id.toString()
            ? { ...stage, ...response.data.data }
            : stage,
        );
        setPipelineStages(updatedStages);
        handleCloseForm();
      }
    } catch (err: any) {
      console.error("Error updating stage:", err);

      if (err.response?.data?.status === "error") {
        if (err.response.data.errors) {
          setFieldErrors(err.response.data.errors);
        } else {
          setFormError(err.response.data.message || "فشل في تحديث المرحلة");
        }
      } else {
        setFormError("فشل في تحديث المرحلة");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEditStageForm = (stage: any) => {
    handleOpenEditForm("stages", stage);
  };

  const handleEditProcedure = async (id: number, data: any) => {
    try {
      setIsLoading(true);
      setFormError(null);
      setFieldErrors({});

      const response = await axiosInstance.put(`/crm/procedures/${id}`, data);
      if (response.data.status === "success") {
        const updatedProcedures = procedures.map((proc) =>
          proc.id === id ? { ...proc, ...response.data.data } : proc,
        );
        setProcedures(updatedProcedures);
        handleCloseForm();
      }
    } catch (err: any) {
      console.error("Error updating procedure:", err);

      if (err.response?.data?.status === "error") {
        if (err.response.data.errors) {
          setFieldErrors(err.response.data.errors);
        } else {
          setFormError(err.response.data.message || "فشل في تحديث الإجراء");
        }
      } else {
        setFormError("فشل في تحديث الإجراء");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPriority = async (id: number, data: any) => {
    try {
      setIsLoading(true);
      setFormError(null);
      setFieldErrors({});

      const response = await axiosInstance.put(`/crm/priorities/${id}`, data);
      if (response.data.status === "success") {
        const updatedPriorities = priorities.map((priority) =>
          priority.id === id
            ? { ...priority, ...response.data.data }
            : priority,
        );
        setPriorities(updatedPriorities);
        handleCloseForm();
      }
    } catch (err: any) {
      console.error("Error updating priority:", err);

      if (err.response?.data?.status === "error") {
        if (err.response.data.errors) {
          setFieldErrors(err.response.data.errors);
        } else {
          setFormError(err.response.data.message || "فشل في تحديث الأولوية");
        }
      } else {
        setFormError("فشل في تحديث الأولوية");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditType = async (id: number, data: any) => {
    try {
      setIsLoading(true);
      setFormError(null);
      setFieldErrors({});

      const response = await axiosInstance.put(`/crm/types/${id}`, data);
      if (response.data.status === "success") {
        const updatedTypes = types.map((type) =>
          type.id === id ? { ...type, ...response.data.data } : type,
        );
        setTypes(updatedTypes);
        handleCloseForm();
      }
    } catch (err: any) {
      console.error("Error updating type:", err);

      if (err.response?.data?.status === "error") {
        if (err.response.data.errors) {
          setFieldErrors(err.response.data.errors);
        } else {
          setFormError(err.response.data.message || "فشل في تحديث النوع");
        }
      } else {
        setFormError("فشل في تحديث النوع");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // General form submit handler
  const handleFormSubmit = async (data: any) => {
    if (formMode === "add") {
      switch (formType) {
        case "stages":
          await handleAddStage(data);
          break;
        case "procedures":
          await handleAddProcedure(data);
          break;
        case "priorities":
          await handleAddPriority(data);
          break;
        case "types":
          await handleAddType(data);
          break;
      }
    } else {
      // Edit mode
      switch (formType) {
        case "stages":
          await handleEditStage(selectedItem.id, data);
          break;
        case "procedures":
          await handleEditProcedure(selectedItem.id, data);
          break;
        case "priorities":
          await handleEditPriority(selectedItem.id, data);
          break;
        case "types":
          await handleEditType(selectedItem.id, data);
          break;
      }
    }
  };

  const handleDeleteItem = async (
    endpoint: string,
    itemId: string,
    itemType: string,
  ) => {
    if (!confirm(`هل أنت متأكد من حذف هذا ${itemType}؟`)) {
      return;
    }

    setIsDeleting(itemId);
    setError(null);

    try {
      const response = await axiosInstance.delete(`${endpoint}/${itemId}`);

      if (response.data.status === "success") {
        // Update local data based on the endpoint
        switch (endpoint) {
          case "/crm/stages":
            const updatedStages = pipelineStages.filter(
              (stage) => stage.id.toString() !== itemId,
            );
            setPipelineStages(updatedStages);
            if (onStageDeleted) onStageDeleted(itemId);
            break;
          case "/crm/procedures":
            const updatedProcedures = procedures.filter(
              (proc) => proc.id.toString() !== itemId,
            );
            setProcedures(updatedProcedures);
            break;
          case "/crm/priorities":
            const updatedPriorities = priorities.filter(
              (priority) => priority.id.toString() !== itemId,
            );
            setPriorities(updatedPriorities);
            break;
          case "/crm/types":
            const updatedTypes = types.filter(
              (type) => type.id.toString() !== itemId,
            );
            setTypes(updatedTypes);
            break;
        }
      } else {
        setError(`فشل في حذف ${itemType}`);
      }
    } catch (err: any) {
      console.error(`Error deleting ${itemType}:`, err);
      setError(err.response?.data?.message || `فشل في حذف ${itemType}`);
    } finally {
      setIsDeleting(null);
    }
  };

  // Translate error messages to Arabic
  const translateErrorMessage = (message: string): string => {
    const errorTranslations: Record<string, string> = {
      "Cannot move further up": "لا يمكن النقل لأعلى أكثر",
      "Cannot move further down": "لا يمكن النقل لأسفل أكثر",
      "Cannot move further": "لا يمكن النقل أكثر",
    };

    // Check for exact match
    if (errorTranslations[message]) {
      return errorTranslations[message];
    }

    // Check for partial matches (case insensitive)
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes("cannot move further up")) {
      return "لا يمكن النقل لأعلى أكثر";
    }
    if (lowerMessage.includes("cannot move further down")) {
      return "لا يمكن النقل لأسفل أكثر";
    }
    if (lowerMessage.includes("cannot move further")) {
      return "لا يمكن النقل أكثر";
    }

    // Return original message if no translation found
    return message;
  };

  const handleMoveItem = async (
    itemId: string,
    direction: "up" | "down",
    endpoint: string,
  ) => {
    // Only handle stages for now (as per API requirement)
    if (endpoint !== "/crm/stages") {
      return;
    }

    // Find the item and its index
    const currentIndex = pipelineStages.findIndex(
      (stage) => stage.id.toString() === itemId.toString(),
    );

    if (currentIndex === -1) return;

    // Check if move is valid
    if (direction === "up" && currentIndex === 0) return;
    if (direction === "down" && currentIndex === pipelineStages.length - 1)
      return;

    // Save original order for rollback
    const originalStages = [...pipelineStages];

    // Calculate new index
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    // Create a copy of the array
    const updatedStages = [...pipelineStages];

    // Swap items
    [updatedStages[currentIndex], updatedStages[newIndex]] = [
      updatedStages[newIndex],
      updatedStages[currentIndex],
    ];

    // Optimistic update: Update state immediately
    setPipelineStages(updatedStages);
    setIsMoving(itemId.toString());
    setError(null);

    try {
      // Send API request
      const response = await axiosInstance.post(`/crm/stages/${itemId}/move`, {
        direction,
      });

      if (response.data.status === "success") {
        // If server returns updated data, use it
        if (response.data.data) {
          setPipelineStages(response.data.data);
        }
      } else {
        // Revert to original order on failure
        setPipelineStages(originalStages);
        // Handle specific error messages
        const errorMessage = response.data.message || "فشل في تحديث الترتيب";
        setError(translateErrorMessage(errorMessage));
      }
    } catch (err: any) {
      console.error("Error moving stage:", err);
      // Revert to original order on error
      setPipelineStages(originalStages);

      // Handle specific error messages from API
      const errorMessage =
        err.response?.data?.message || "فشل في تحديث ترتيب المرحلة";
      setError(translateErrorMessage(errorMessage));
    } finally {
      setIsMoving(null);
    }
  };

  // Render item component for reusability
  const renderItemList = (items: any[], type: string, endpoint: string) => {
    console.log("items", items);
    if (!items || items.length === 0) {
      return (
        <p className="text-center text-muted-foreground py-12 text-right">
          لا توجد عناصر مُعرّفة بعد. قم بإضافة العنصر الأول.
        </p>
      );
    }

    return (
      <>
        {/* Grid Layout للهاتف فقط */}
        <div className="grid grid-cols-1 gap-3 sm:hidden">
          {items.map((item: any, index: number) => (
            <div
              key={item.id}
              className="flex flex-col p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              {/* Header: Color, Title, Badges */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-right">
                      {item.stage_name || item.procedure_name || item.name}
                    </h4>
                    {item.description && (
                      <p className="text-sm text-muted-foreground text-right mt-1">
                        {item.description}
                      </p>
                    )}
                    {item.value && item.value !== item.name && (
                      <p className="text-xs text-muted-foreground text-right mt-1">
                        القيمة: {item.value}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1 items-end flex-shrink-0 mr-2">
                  <Badge variant="secondary" className="text-xs">
                    ترتيب {item.order}
                  </Badge>
                  {item.is_active === 1 && (
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800 text-xs"
                    >
                      نشط
                    </Badge>
                  )}
                </div>
              </div>

              {/* Actions: Buttons في الأسفل */}
              <div className="flex items-center justify-end gap-1 pt-2 border-t">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleMoveItem(item.id, "up", endpoint)}
                  disabled={index === 0 || isMoving === item.id.toString()}
                  className="text-muted-foreground hover:text-foreground h-8 w-8"
                >
                  {isMoving === item.id.toString() ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <ArrowUp className="h-3 w-3" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleMoveItem(item.id, "down", endpoint)}
                  disabled={
                    index === items.length - 1 ||
                    isMoving === item.id.toString()
                  }
                  className="text-muted-foreground hover:text-foreground h-8 w-8"
                >
                  {isMoving === item.id.toString() ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    switch (endpoint) {
                      case "/crm/stages":
                        handleOpenEditStageForm(item);
                        break;
                      case "/crm/procedures":
                        handleOpenEditForm("procedures", item);
                        break;
                      case "/crm/priorities":
                        handleOpenEditForm("priorities", item);
                        break;
                      case "/crm/types":
                        handleOpenEditForm("types", item);
                        break;
                    }
                  }}
                  className="text-blue-600 hover:text-blue-700 h-8 w-8"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteItem(endpoint, item.id, type)}
                  disabled={isDeleting === item.id.toString()}
                  className="text-red-600 hover:text-red-700 h-8 w-8"
                >
                  {isDeleting === item.id.toString() ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Trash2 className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* List Layout للشاشات الأكبر (sm وأكبر) */}
        <div className="hidden sm:block space-y-3">
          {items.map((item: any, index: number) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <div>
                  <h4 className="font-medium">
                    {item.stage_name || item.procedure_name || item.name}
                  </h4>
                  {item.description && (
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                  {item.value && item.value !== item.name && (
                    <p className="text-xs text-muted-foreground">
                      القيمة: {item.value}
                    </p>
                  )}
                </div>
                <Badge variant="secondary" className="mr-auto">
                  ترتيب {item.order}
                </Badge>
                {item.is_active === 1 && (
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-800 mr-2"
                  >
                    نشط
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleMoveItem(item.id, "up", endpoint)}
                  disabled={index === 0 || isMoving === item.id.toString()}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {isMoving === item.id.toString() ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowUp className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleMoveItem(item.id, "down", endpoint)}
                  disabled={
                    index === items.length - 1 ||
                    isMoving === item.id.toString()
                  }
                  className="text-muted-foreground hover:text-foreground"
                >
                  {isMoving === item.id.toString() ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowDown className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    switch (endpoint) {
                      case "/crm/stages":
                        handleOpenEditStageForm(item);
                        break;
                      case "/crm/procedures":
                        handleOpenEditForm("procedures", item);
                        break;
                      case "/crm/priorities":
                        handleOpenEditForm("priorities", item);
                        break;
                      case "/crm/types":
                        handleOpenEditForm("types", item);
                        break;
                    }
                  }}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteItem(endpoint, item.id, type)}
                  disabled={isDeleting === item.id.toString()}
                  className="text-red-600 hover:text-red-700"
                >
                  {isDeleting === item.id.toString() ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <CustomDialog
      open={showCrmSettingsDialog}
      onOpenChange={handleClose}
      maxWidth="max-w-5xl"
    >
      <CustomDialogContent className="max-h-[85vh] overflow-hidden">
        <div dir="rtl">
          <CustomDialogClose onClose={handleClose} />
          <CustomDialogHeader className="pb-4">
            <CustomDialogTitle className="flex items-center gap-2 text-xl">
              <Settings className="h-6 w-6" />
              إعدادات نظام إدارة العملاء
            </CustomDialogTitle>
          </CustomDialogHeader>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground text-right">
                جاري تحميل إعدادات CRM...
              </p>
            </div>
          </div>
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full "
          >
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/30">
              <TabsTrigger
                value="stages"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Target className="h-4 w-4 ml-2" />
                مراحل البيع
              </TabsTrigger>
              <TabsTrigger
                value="procedures"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <ListCheck className="h-4 w-4 ml-2" />
                الإجراءات
              </TabsTrigger>
              <TabsTrigger
                value="types"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Tag className="h-4 w-4 ml-2" />
                الأنواع
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto">
              <TabsContent value="stages" className="mt-0" dir="rtl">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 ml-2" />
                        إدارة مراحل البيع
                      </CardTitle>
                      <Button
                        onClick={handleOpenAddStageForm}
                        size="sm"
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4 ml-2" />
                        إضافة مرحلة
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="max-h-[400px] overflow-y-auto pr-2">
                    {renderItemList(pipelineStages, "stages", "/crm/stages")}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="procedures" className="mt-0" dir="rtl">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <ListCheck className="h-5 w-5 ml-2" />
                        إدارة الإجراءات
                      </CardTitle>
                      <Button
                        size="sm"
                        className="gap-2"
                        onClick={() => handleOpenAddForm("procedures")}
                      >
                        <Plus className="h-4 w-4 ml-2" />
                        إضافة إجراء
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {renderItemList(procedures, "إجراء", "/crm/procedures")}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="types" className="mt-0" dir="rtl">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Tag className="h-5 w-5 ml-2" />
                        إدارة الأنواع
                      </CardTitle>
                      <Button
                        size="sm"
                        className="gap-2"
                        onClick={() => handleOpenAddForm("types")}
                      >
                        <Plus className="h-4 w-4 ml-2" />
                        إضافة نوع
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {renderItemList(types, "نوع", "/crm/types")}
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        )}

        <div className="flex justify-end p-4 border-t">
          <Button onClick={handleClose} variant="outline" className="gap-2">
            إغلاق
          </Button>
        </div>
        </div>
      </CustomDialogContent>

      {/* Form Dialog */}
      <CrmFormDialog
        isOpen={showFormDialog}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        type={formType}
        mode={formMode}
        initialData={selectedItem}
        isLoading={isLoading}
        error={formError}
        fieldErrors={fieldErrors}
      />
    </CustomDialog>
  );
}
