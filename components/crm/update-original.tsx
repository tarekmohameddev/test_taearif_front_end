// تحديث الملف الأصلي crm-page.tsx ليستخدم المكونات الجديدة

// استبدل المحتوى الحالي بـ:

"use client";

import React, { useState, useRef, useEffect } from "react";
import type { Customer, PipelineStage, Appointment } from "@/types/crm";
import useCrmStore from "@/context/store/crm";
import {
  CrmStatistics,
  CrmFilters,
  PipelineBoard,
  AppointmentsList,
  CrmHeader,
  DragDropHandler,
  KeyboardNavigation,
  EnhancedDragDrop,
  DataHandler,
  Utilities,
  CustomerDetailDialog,
  AddNoteDialog,
  AddReminderDialog,
  AddInteractionDialog,
  AddStageDialog,
  CrmSettingsDialog,
} from "./index";

export default function CrmPage() {
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // CRM data states
  const [crmData, setCrmData] = useState<any>(null);
  const [appointmentsData, setAppointmentsData] = useState<Appointment[]>([]);
  const [totalCustomers, setTotalCustomers] = useState(0);

  // Get data from store
  const {
    customers: customersData,
    pipelineStages,
    selectedStage,
    selectedCustomer,
    selectedAppointment,
    newStage,
    showCrmSettingsDialog,
    showAddStageDialog,
    showEditStageDialog,
    showAddNoteDialog,
    showAddReminderDialog,
    showAddInteractionDialog,
    showCustomerDialog,
    showAddAppointmentDialog,
    showAppointmentDetailDialog,
    setSelectedCustomer,
    setSelectedStage,
    setSelectedAppointment,
    setShowCustomerDialog,
    setShowAddNoteDialog,
    setShowAddReminderDialog,
    setShowAddInteractionDialog,
    setShowCrmSettingsDialog,
    setShowAddStageDialog,
    setShowEditStageDialog,
    setShowAddAppointmentDialog,
    setShowAppointmentDetailDialog,
    setNewStage,
    updateCustomerStage,
    updateCustomer,
  } = useCrmStore();

  const [activeTab, setActiveTab] = useState("crm");
  const [activeView, setActiveView] = useState("pipeline");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStage, setFilterStage] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterCity, setFilterCity] = useState("all");
  const [filterUrgency, setFilterUrgency] = useState("all");

  // Enhanced drag and drop states
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const [dragPreview, setDragPreview] = useState<Customer | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Keyboard navigation states
  const [focusedCustomer, setFocusedCustomer] = useState<Customer | null>(null);
  const [focusedStage, setFocusedStage] = useState<PipelineStage | null>(null);

  // Initialize handlers
  const dataHandler = DataHandler({
    onSetLoading: setLoading,
    onSetError: setError,
    onSetCrmData: setCrmData,
    onSetAppointmentsData: setAppointmentsData,
    onSetTotalCustomers: setTotalCustomers,
    onSetPipelineStages: (stages) =>
      useCrmStore.getState().setPipelineStages(stages),
    onSetCustomers: (customers) =>
      useCrmStore.getState().setCustomers(customers),
  });

  const utilities = Utilities({
    onAnnounceToScreenReader: (message) => {
      const announcement = document.createElement("div");
      announcement.setAttribute("aria-live", "polite");
      announcement.setAttribute("aria-atomic", "true");
      announcement.className = "sr-only";
      announcement.textContent = message;
      document.body.appendChild(announcement);
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    },
    onShowSuccessAnimation: (stageId) => {
      const stageElement = document.querySelector(
        `[data-stage-id="${stageId}"]`,
      );
      if (stageElement) {
        stageElement.classList.add("animate-pulse", "ring-2", "ring-green-500");
        setTimeout(() => {
          stageElement.classList.remove(
            "animate-pulse",
            "ring-2",
            "ring-green-500",
          );
        }, 1000);
      }
    },
  });

  const enhancedDragDrop = EnhancedDragDrop({
    isDragging,
    draggedCustomer: dragPreview,
    dragOverStage,
    dragPreview,
    dragOffset,
    onDragStart: (e, customer) => {
      setIsDragging(true);
      setDragPreview(customer);
      setDragOffset({
        x: e.clientX - e.currentTarget.getBoundingClientRect().left,
        y: e.clientY - e.currentTarget.getBoundingClientRect().top,
      });
    },
    onDragEnd: () => {
      setIsDragging(false);
      setDragPreview(null);
      setDragOverStage(null);
    },
    onDragOver: (e, stageId) => setDragOverStage(stageId),
    onDragLeave: (e, stageId) => setDragOverStage(null),
    onDrop: async (e, stageId) => {
      if (dragPreview && dragPreview.pipelineStage !== stageId) {
        const success = await dataHandler.updateCustomerStage(
          dragPreview.id,
          stageId,
        );
        if (success) {
          updateCustomerStage(dragPreview.id, stageId);
          utilities.announceToScreenReader(
            `تم نقل العميل ${dragPreview.name} بنجاح`,
          );
          utilities.showSuccessAnimation(stageId);
        }
      }
    },
    onMouseMove: (e) => {
      if (isDragging && dragPreview) {
        // Update drag preview position
      }
    },
    onGlobalDragEnd: () => {
      setIsDragging(false);
      setDragPreview(null);
      setDragOverStage(null);
    },
    onGlobalDragCancel: () => {
      setIsDragging(false);
      setDragPreview(null);
      setDragOverStage(null);
    },
    onAnnounceToScreenReader: utilities.announceToScreenReader,
    onShowSuccessAnimation: utilities.showSuccessAnimation,
  });

  const keyboardNavigation = KeyboardNavigation({
    focusedCustomer,
    focusedStage,
    pipelineStages,
    onKeyDown: (e, customer, stageId) => {
      // Handle keyboard navigation
    },
    onMoveCustomerToStage: async (customer, targetStageId) => {
      const success = await dataHandler.updateCustomerStage(
        customer.id,
        targetStageId,
      );
      if (success) {
        updateCustomerStage(customer.id, targetStageId);
      }
    },
    onSetFocusedCustomer: setFocusedCustomer,
    onSetFocusedStage: setFocusedStage,
    onAnnounceToScreenReader: utilities.announceToScreenReader,
  });

  // Fetch data on component mount
  useEffect(() => {
    dataHandler.fetchCrmData();
    dataHandler.fetchAppointmentsData();
  }, []);

  // Filter customers
  const filteredCustomers = customersData.filter((customer: Customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.district.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStage =
      filterStage === "all" || customer.pipelineStage === filterStage;
    const matchesType =
      filterType === "all" || customer.customerType === filterType;
    const matchesCity = filterCity === "all" || customer.city === filterCity;
    const matchesUrgency =
      filterUrgency === "all" ||
      (filterUrgency !== "all" && customer.urgency === filterUrgency);

    return (
      matchesSearch &&
      matchesStage &&
      matchesType &&
      matchesCity &&
      matchesUrgency
    );
  });

  // Calculate statistics
  const pipelineStats = pipelineStages.map((stage: PipelineStage) => ({
    ...stage,
    count: customersData.filter((c: Customer) => c.pipelineStage === stage.id)
      .length,
    value: customersData
      .filter((c: Customer) => c.pipelineStage === stage.id)
      .reduce((sum: number, c: Customer) => sum + (c.dealValue || 0), 0),
  }));

  // Appointment statistics
  const allAppointments = customersData.flatMap(
    (customer: Customer) =>
      customer.appointments?.map((appointment: Appointment) => ({
        ...appointment,
        customer,
      })) || [],
  );
  const totalAppointments = allAppointments.length;
  const scheduledAppointments = allAppointments.filter(
    (app: Appointment) => app.status === "مجدول",
  ).length;
  const completedAppointments = allAppointments.filter(
    (app: Appointment) => app.status === "مكتمل",
  ).length;

  // Event handlers
  const handleRefresh = () => {
    dataHandler.fetchCrmData();
    dataHandler.fetchAppointmentsData();
  };

  const handleSettings = () => {
    setShowCrmSettingsDialog(true);
  };

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDialog(true);
  };

  const handleAddNote = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowAddNoteDialog(true);
  };

  const handleAddReminder = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowAddReminderDialog(true);
  };

  const handleAddInteraction = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowAddInteractionDialog(true);
  };

  const handleViewAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentDetailDialog(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    // Handle edit appointment
  };

  const handleAddAppointment = () => {
    setShowAddAppointmentDialog(true);
  };

  // عرض loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">جاري تحميل بيانات العملاء...</p>
        </div>
      </div>
    );
  }

  // عرض error state
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">خطأ في تحميل البيانات</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            {/* Header */}
            <CrmHeader onRefresh={handleRefresh} onSettings={handleSettings} />

            {/* Statistics */}
            <CrmStatistics
              totalCustomers={totalCustomers}
              customersData={customersData}
              pipelineStages={pipelineStages}
              pipelineStats={pipelineStats}
              scheduledAppointments={scheduledAppointments}
              totalAppointments={totalAppointments}
            />

            {/* Filters */}
            <CrmFilters
              activeView={activeView}
              setActiveView={setActiveView}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterStage={filterStage}
              setFilterStage={setFilterStage}
              filterUrgency={filterUrgency}
              setFilterUrgency={setFilterUrgency}
              pipelineStages={pipelineStages}
            />

            {/* Main Content */}
            {activeView === "pipeline" && (
              <PipelineBoard
                pipelineStages={pipelineStages}
                customersData={customersData}
                filteredCustomers={filteredCustomers}
                isDragging={isDragging}
                draggedCustomer={dragPreview}
                dragOverStage={dragOverStage}
                focusedCustomer={focusedCustomer}
                onDragStart={enhancedDragDrop.handleDragStart}
                onDragEnd={enhancedDragDrop.handleDragEnd}
                onDragOver={enhancedDragDrop.handleDragOver}
                onDragLeave={enhancedDragDrop.handleDragLeave}
                onDrop={enhancedDragDrop.handleDrop}
                onKeyDown={keyboardNavigation.handleKeyDown}
                onViewDetails={handleViewDetails}
                onAddNote={handleAddNote}
                onAddReminder={handleAddReminder}
                onAddInteraction={handleAddInteraction}
              />
            )}

            {activeView === "appointments" && (
              <AppointmentsList
                appointmentsData={appointmentsData}
                onViewAppointment={handleViewAppointment}
                onEditAppointment={handleEditAppointment}
                onAddAppointment={handleAddAppointment}
              />
            )}

            {activeView === "analytics" && (
              <CrmStatistics
                totalCustomers={totalCustomers}
                customersData={customersData}
                pipelineStages={pipelineStages}
                pipelineStats={pipelineStats}
                scheduledAppointments={scheduledAppointments}
                totalAppointments={totalAppointments}
              />
            )}

            {/* Drag Preview */}
            <DragDropHandler
              isDragging={isDragging}
              draggedCustomer={dragPreview}
              dragPreview={dragPreview}
              dragOffset={dragOffset}
              onMouseMove={enhancedDragDrop.handleMouseMove}
              onGlobalDragEnd={enhancedDragDrop.handleGlobalDragEnd}
              onGlobalDragCancel={enhancedDragDrop.handleGlobalDragCancel}
            />

            {/* Dialogs */}
            <CustomerDetailDialog />
            <AddNoteDialog />
            <AddReminderDialog />
            <AddInteractionDialog />
            <AddStageDialog />
            <CrmSettingsDialog />
          </div>
        </main>
      </div>
  );
}
