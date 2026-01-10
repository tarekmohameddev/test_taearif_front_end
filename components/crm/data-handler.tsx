"use client";

import React from "react";
import axiosInstance from "@/lib/axiosInstance";
import type { Customer, PipelineStage, Appointment } from "@/types/crm";
import {
  CheckCircle,
  Users,
  Handshake,
  Target,
  Activity,
  BarChart3,
} from "lucide-react";

interface DataHandlerProps {
  onSetLoading: (loading: boolean) => void;
  onSetError: (error: string | null) => void;
  onSetCrmData: (data: any) => void;
  onSetAppointmentsData: (data: Appointment[]) => void;
  onSetTotalCustomers: (total: number) => void;
  onSetPipelineStages: (stages: PipelineStage[]) => void;
  onSetCustomers: (customers: Customer[]) => void;
}

export default function DataHandler({
  onSetLoading,
  onSetError,
  onSetCrmData,
  onSetAppointmentsData,
  onSetTotalCustomers,
  onSetPipelineStages,
  onSetCustomers,
}: DataHandlerProps) {
  const getStageIcon = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      "fa fa-check-circle": CheckCircle,
      "fa fa-user-shield": Users,
      "fa fa-hourglass-start": Activity,
      "fa fa-user": Users,
      "fa fa-handshake": Handshake,
      "fa fa-target": Target,
      "fa fa-activity": Activity,
      "fa fa-bar-chart": BarChart3,
    };
    return iconMap[iconName] || Target;
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 0:
        return "منخفض";
      case 1:
        return "متوسط";
      case 2:
        return "عالية";
      default:
        return "متوسط";
    }
  };

  const fetchCrmData = async () => {
    try {
      onSetLoading(true);
      onSetError(null);

      // Fetch CRM pipeline data
      const crmResponse = await axiosInstance.get("/v1/crm/requests");
      const crmData = crmResponse.data;

      if (crmData.status === "success") {
        const { stages, statistics } = crmData.data || {};

        // Transform stages data from new API format
        const transformedStages = (stages || []).map((stage: any) => ({
          id: String(stage.id),
          name: stage.stage_name,
          color: stage.color || "#6366f1",
          icon: stage.icon || "Target",
          count: stage.requests?.length || 0,
          value: 0,
        }));

        // Transform requests to customers format for compatibility
        const allCustomers = (stages || []).flatMap((stage: any) =>
          (stage.requests || []).map((request: any) => {
            const customer = request.customer || {};
            const propertyBasic = request.property_basic || {};
            const propertySpecs = request.property_specifications || {};
            const basicInfo = propertySpecs.basic_information || {};

            return {
              // Request data
              id: request.id,
              request_id: request.id,
              customer_id: customer.id || request.customer_id,
              user_id: request.user_id || 0,
              stage_id: request.stage_id || stage.id,
              property_id: request.property_id,
              has_property: request.has_property || false,
              property_source: request.property_source || null,
              created_at: request.created_at || "",
              updated_at: request.updated_at || "",

              // Customer data
              name: customer.name || "",
              nameEn: customer.name || "",
              phone: customer.phone_number || "",
              phone_number: customer.phone_number || "",
              email: "",
              whatsapp: "",
              customerType: null,
              responsible_employee: customer.responsible_employee || null,
              city: propertyBasic.address
                ? propertyBasic.address.split(",")[1]?.trim() || ""
                : "",
              district: "",
              assignedAgent: "",
              lastContact: "",
              urgency: customer.priority_id
                ? getPriorityLabel(customer.priority_id)
                : "",
              pipelineStage: String(request.stage_id || stage.id),
              dealValue: propertyBasic.price
                ? parseFloat(propertyBasic.price)
                : basicInfo.price || 0,
              probability: 0,
              avatar: propertyBasic.featured_image || "",
              reminders: [],
              interactions: [],
              appointments: [],
              notes: "",
              joinDate: request.created_at || "",
              nationality: "",
              familySize: 0,
              leadSource: "",
              satisfaction: 0,
              communicationPreference: "",
              expectedCloseDate: "",
              property_basic: propertyBasic,
              property_specifications: propertySpecs,
            };
          }),
        );

        // Update store
        onSetPipelineStages(transformedStages);
        onSetCustomers(allCustomers);
        onSetCrmData(crmData);
        onSetTotalCustomers(statistics?.total_requests || allCustomers.length);
      }
    } catch (err) {
      console.error("Error fetching CRM data:", err);
      onSetError("فشل في تحميل بيانات الـ CRM");
    } finally {
      onSetLoading(false);
    }
  };

  const fetchAppointmentsData = async () => {
    try {
      const remindersResponse = await axiosInstance.get(
        "/crm/reminders",
      );
      const remindersData = remindersResponse.data;

      if (remindersData.status === "success") {
        // API returns { status: "success", data: { reminders: [...], pagination: {...} } }
        const reminders = remindersData.data?.reminders || remindersData.data || [];
        onSetAppointmentsData(reminders);
      }
    } catch (err) {
      console.error("Error fetching reminders data:", err);
    }
  };

  const updateCustomerStage = async (
    customerId: string,
    targetStage: string,
  ) => {
    try {
      // customerId is actually request_id in new API format
      // API call to change request stage
      const response = await axiosInstance.post(
        `/v1/crm/requests/${customerId}/change-stage`,
        {
          stage_id: parseInt(targetStage),
        },
      );

      const responseData = response.data;

      if (responseData.status === "success" || responseData.status === true) {
        return true;
      } else {
        console.error("Failed to update customer stage:", responseData.message);
        return false;
      }
    } catch (error) {
      console.error("Error updating customer stage:", error);
      return false;
    }
  };

  return {
    fetchCrmData,
    fetchAppointmentsData,
    updateCustomerStage,
    getStageIcon,
    getPriorityLabel,
  };
}
