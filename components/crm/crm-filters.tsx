"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Move,
  Calendar,
  BarChart3,
  Bell,
  User,
  Loader2,
  Plus,
} from "lucide-react";
import { PipelineStage } from "@/types/crm";
import axiosInstance from "@/lib/axiosInstance";
import useCrmStore from "@/context/store/crm";
import useAuthStore from "@/context/AuthContext";

// Helper function to get priority label
const getPriorityLabel = (priority: number) => {
  switch (priority) {
    case 3:
      return "عالية";
    case 2:
      return "متوسطة";
    case 1:
      return "منخفضة";
    default:
      return "متوسطة";
  }
};

interface CrmFiltersProps {
  activeView: string;
  setActiveView: (view: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStage: string;
  setFilterStage: (stage: string) => void;
  filterUrgency: string;
  setFilterUrgency: (urgency: string) => void;
  pipelineStages: PipelineStage[];
  onSearchResults?: (results: any[]) => void;
}

export default function CrmFilters({
  activeView,
  setActiveView,
  searchTerm,
  setSearchTerm,
  filterStage,
  setFilterStage,
  filterUrgency,
  setFilterUrgency,
  pipelineStages,
  onSearchResults,
}: CrmFiltersProps) {
  const { userData } = useAuthStore();
  const { setShowAddDealDialog } = useCrmStore();
  const [isSearching, setIsSearching] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );
  const { setCustomers, setPipelineStages } = useCrmStore();

  // Debounced search function
  const performSearch = useCallback(
    async (query: string, stageId: string, priority: string) => {
      // التحقق من وجود التوكن قبل إجراء الطلب
      if (!userData?.token) {
        return;
      }

      setIsSearching(true);
      try {
        // Build query params for /v1/crm/requests
        const params = new URLSearchParams();

        if (query.trim()) {
          params.append("query", query.trim());
        }

        if (stageId !== "all") {
          params.append("stage_id", stageId);
        }

        if (priority !== "all") {
          // Convert priority text to number
          const priorityMap: { [key: string]: string } = {
            عالية: "3",
            متوسطة: "2",
            منخفضة: "1",
          };
          params.append("priority", priorityMap[priority] || priority);
        }

        // If no filters, get all requests
        const url = params.toString()
          ? `/v1/crm/requests?${params.toString()}`
          : "/v1/crm/requests";

        const response = await axiosInstance.get(url);
        const crmData = response.data;

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
          const allCustomersRaw = (stages || []).flatMap((stage: any) =>
            (stage.requests || []).map((request: any) => {
              const customer = request.customer || {};
              const propertyBasic = request.property_basic || {};
              const propertySpecs = request.property_specifications || {};

              // Extract property data
              const basicInfo = propertySpecs.basic_information || {};

              return {
                // Request data
                id: request.id,
                request_id: request.id,
                user_id: request.user_id || 0,
                stage_id: request.stage_id || stage.id,
                property_id: request.property_id,
                has_property: request.has_property || false,
                property_source: request.property_source || null,
                position: request.position || 0,
                created_at: request.created_at || "",
                updated_at: request.updated_at || "",

                // Customer data
                customer_id: customer.id || request.customer_id,
                name: customer.name || "",
                phone_number: customer.phone_number || "",
                phone: customer.phone_number || "",
                email: null,
                note: null,
                customer_type: null,
                priority: customer.priority_id || 1,
                priority_id: customer.priority_id || null,
                type_id: customer.type_id || null,
                procedure_id: null,
                city_id: null,
                district_id: null,
                responsible_employee: customer.responsible_employee || null,

                // Backward compatibility fields
                nameEn: customer.name || "",
                whatsapp: "",
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

                // Property data (for compatibility)
                property_basic: propertyBasic,
                property_specifications: propertySpecs,
              };
            }),
          );

          // Filter out duplicates
          const allCustomers = allCustomersRaw.reduce(
            (acc: any[], customer: any) => {
              const existingCustomer = acc.find(
                (c) =>
                  c.id === customer.id || c.request_id === customer.request_id,
              );

              if (!existingCustomer) {
                acc.push(customer);
              }

              return acc;
            },
            [],
          );

          // Update store
          setPipelineStages(transformedStages);
          setCustomers(allCustomers);
          if (onSearchResults) {
            onSearchResults(allCustomers);
          }
        }
      } catch (error) {
        console.error("خطأ في البحث:", error);
      } finally {
        setIsSearching(false);
      }
    },
    [setCustomers, setPipelineStages, onSearchResults, userData?.token],
  );

  // Handle search input changes with debouncing
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);

    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout for debounced search
    const timeout = setTimeout(() => {
      performSearch(value, filterStage, filterUrgency);
    }, 500); // 500ms delay

    setSearchTimeout(timeout);
  };

  // Handle filter changes
  const handleStageChange = (stageId: string) => {
    setFilterStage(stageId);
    performSearch(searchTerm, stageId, filterUrgency);
  };

  const handleUrgencyChange = (priority: string) => {
    setFilterUrgency(priority);
    performSearch(searchTerm, filterStage, priority);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // Load all customers on component mount
  useEffect(() => {
    performSearch("", "all", "all");
  }, []);
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {/* <Button
          variant={activeView === "pipeline" ? "default" : "outline"}
          onClick={() => setActiveView("pipeline")}
          className="flex items-center gap-2"
        >
          <Move className="h-4 w-4" />
          <span className="hidden sm:inline">مراحل العملاء</span>
          <span className="sm:hidden">المراحل</span>
        </Button> */}
        <Button
          variant="default"
          className="flex items-center gap-2"
          onClick={() => setShowAddDealDialog(true)}
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">انشاء صفقة جديدة</span>
          <span className="sm:hidden">انشاء صفقة</span>
        </Button>
        {/* <Button
          variant={activeView === "appointments" ? "default" : "outline"}
          onClick={() => setActiveView("appointments")}
          className="flex items-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">المواعيد</span>
          <span className="sm:hidden">المواعيد</span>
        </Button>
        <Button
          variant={activeView === "reminders" ? "default" : "outline"}
          onClick={() => setActiveView("reminders")}
          className="flex items-center gap-2"
        >
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline">التذكيرات</span>
          <span className="sm:hidden">التذكيرات</span>
        </Button>
        <Button
          variant={activeView === "inquiry" ? "default" : "outline"}
          onClick={() => setActiveView("inquiry")}
          className="flex items-center gap-2"
        >
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">طلبات العملاء</span>
          <span className="sm:hidden">طلبات العملاء</span>
        </Button> */}
        {/* <Button
          variant={activeView === "analytics" ? "default" : "outline"}
          onClick={() => setActiveView("analytics")}
          className="flex items-center gap-2"
        >
          <BarChart3 className="h-4 w-4" />
          <span className="hidden sm:inline">التحليلات</span>
          <span className="sm:hidden">التحليلات</span>
        </Button> */}
      </div>

      {/* Responsive Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
        <div className="relative">
          {isSearching ? (
            <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground animate-spin" />
          ) : (
            <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          )}
          <Input
            type="search"
            placeholder="العملاء..."
            className="pr-8 w-full sm:w-[250px] lg:w-[300px]"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterStage} onValueChange={handleStageChange}>
            <SelectTrigger className="w-full sm:w-[120px] lg:w-[150px]">
              <SelectValue placeholder="المراحل" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع المراحل</SelectItem>
              {pipelineStages.map((stage) => (
                <SelectItem key={stage.id} value={stage.id}>
                  {stage.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterUrgency} onValueChange={handleUrgencyChange}>
            <SelectTrigger className="w-full sm:w-[100px] lg:w-[120px]">
              <SelectValue placeholder="الأولوية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأولويات</SelectItem>
              <SelectItem value="عالية">عالية</SelectItem>
              <SelectItem value="متوسطة">متوسطة</SelectItem>
              <SelectItem value="منخفضة">منخفضة</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
