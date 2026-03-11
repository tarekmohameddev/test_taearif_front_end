"use client";
import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Download,
  Upload,
  Grid3X3,
  List,
  MapPin,
  Plus,
  Search,
  FilterX,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useAuthStore from "@/context/AuthContext";
import useStore from "@/context/Store";
import EmptyState from "@/components/empty-state";
import { ErrorDisplay } from "@/components/ui/error-display";
import { AdvancedFilterDialog } from "@/components/property/advanced-filter-dialog";
import { ActiveFiltersDisplay } from "@/components/property/active-filters-display";
import { PropertyStatisticsCards } from "@/components/property/property-statistics-cards";
import { PropertiesMapView } from "@/components/property/properties-map-view";
import axiosInstance from "@/lib/axiosInstance";
import { formatErrorMessage } from "@/utils/errorHandler";
import { normalizeStatus } from "./utils/helpers";
import { fetchProperties } from "./services/properties.api";
import { usePropertyActions } from "./hooks/usePropertyActions";
import { usePropertyFilters } from "./hooks/usePropertyFilters";
import { useImportExport } from "./hooks/useImportExport";
import {
  ShareDialog,
  Pagination,
  SkeletonPropertyCard,
  PropertyCard,
  PropertyListItem,
  ImportDialog,
  ExportDialog,
  ReorderDialog,
  FiltersSection,
} from "./components";
import type { PropertiesManagementPageProps, ReorderPopup } from "./types/properties.types";

export function PropertiesManagementPage({
  isIncompletePage = false,
}: PropertiesManagementPageProps) {
  const hasLoadedRef = useRef(false);
  const fetchCalledRef = useRef(false);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [reorderPopup, setReorderPopup] = useState<ReorderPopup>({
    open: false,
    type: "normal",
  });

  const { clickedONSubButton, userData, IsLoading: authLoading } = useAuthStore();
  const router = useRouter();
  const propertiesManagement = useStore((state) => state.propertiesManagement);
  const setPropertiesManagement = useStore((state) => state.setPropertiesManagement);
  const {
    viewMode,
    favorites,
    properties = [],
    loading,
    error,
    pagination,
    propertiesAllData,
    incompleteCount = 0,
  } = propertiesManagement ?? {};

  // Use custom hooks
  const filterHooks = usePropertyFilters();
  const {
    newFilters,
    cities,
    districts,
    loadingCities,
    loadingDistricts,
    filterCityId,
    setFilterCityId,
    filterDistrictId,
    setFilterDistrictId,
    filterType,
    setFilterType,
    filterPurpose,
    setFilterPurpose,
    filterBeds,
    setFilterBeds,
    filterPriceFrom,
    setFilterPriceFrom,
    filterPriceTo,
    setFilterPriceTo,
    tempPriceFrom,
    setTempPriceFrom,
    tempPriceTo,
    setTempPriceTo,
    isPricePopoverOpen,
    setIsPricePopoverOpen,
    localSearchValue,
    setLocalSearchValue,
    handleApplyFilters,
    handleSearchOnly,
    handleClearFilters,
    handleRemoveFilter,
  } = filterHooks;

  const fetchPropertiesWrapper = useCallback(
    async (page: number, filters: Record<string, any>) => {
      await fetchProperties(page, filters, setPropertiesManagement);
    },
    [setPropertiesManagement]
  );

  const {
    handleDeleteProperty,
    handleDuplicateProperty,
    handleToggleStatus,
  } = usePropertyActions(currentPage, fetchPropertiesWrapper, newFilters);

  const importExportHooks = useImportExport(
    currentPage,
    newFilters,
    fetchPropertiesWrapper
  );

  const normalizedProperties = useMemo(() => {
    return properties.map((property: any) => ({
      ...property,
      status: normalizeStatus(property.status),
    }));
  }, [properties]);

  const setViewMode = (mode: "grid" | "list" | "map") => {
    setPropertiesManagement({ viewMode: mode });
  };

  const toggleFavorite = (id: string | number) => {
    const idString = id.toString();
    const newFavorites = favorites.includes(idString)
      ? favorites.filter((item: any) => item !== idString)
      : [...favorites, idString];
    setPropertiesManagement({ favorites: newFavorites });
  };

  const handleShare = (property: any) => {
    setSelectedProperty(property);
    setShareDialogOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchPropertiesWrapper(page, newFilters);
  };

  const clickedONButton = async () => {
    clickedONSubButton();
    router.push("/dashboard/settings");
  };

  const handleClearAllFilters = () => {
    handleClearFilters();
  };

  // إرسال API request تلقائياً عند تغيير newFilters
  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
      return;
    }

    const { userData } = useAuthStore.getState();
    if (!userData?.token) {
      return;
    }

    setCurrentPage(1);
    fetchPropertiesWrapper(1, newFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newFilters]);

  // Initial load
  useEffect(() => {
    if (authLoading || !userData?.token) {
      return;
    }

    const currentPageType = isIncompletePage ? "incomplete" : "normal";
    if (hasLoadedRef.current && fetchCalledRef.current) {
      const lastPageType = (fetchCalledRef as any).lastPageType;
      if (lastPageType !== currentPageType) {
        fetchCalledRef.current = false;
        hasLoadedRef.current = false;
      }
    }
    (fetchCalledRef as any).lastPageType = currentPageType;

    if (!fetchCalledRef.current) {
      fetchCalledRef.current = true;
      hasLoadedRef.current = true;

      const loadProperties = async () => {
        setPropertiesManagement({
          isInitialized: false,
          loading: true,
          properties: [],
          pagination: null,
          error: null,
        });

        try {
          const endpoint = isIncompletePage
            ? "/properties/drafts?page=1"
            : "/properties?page=1";
          console.log("Making API request to", endpoint);
          const response = await axiosInstance.get(endpoint);
          console.log("API response received:", response);

          let propertiesList: any[] = [];
          let pagination = null;
          let propertiesAllData = null;
          let incompleteCount = 0;

          if (isIncompletePage) {
            propertiesList = Array.isArray(response.data?.data)
              ? response.data.data
              : response.data?.data?.drafts || [];
            pagination =
              response.data?.pagination ||
              response.data?.data?.pagination ||
              null;
          } else {
            propertiesList = response.data?.data?.properties || [];
            pagination = response.data?.data?.pagination || null;
            propertiesAllData = response.data?.data || null;
            incompleteCount = response.data?.data?.incomplete_count || 0;
          }

          const mappedProperties = propertiesList.map((property: any) => {
            let listingType = "للإيجار";
            if (
              property.purpose === "sold" ||
              property.purpose === "sale" ||
              String(property.transaction_type) === "1" ||
              property.transaction_type === "sale"
            ) {
              listingType = "للبيع";
            }

            return {
              ...property,
              thumbnail: property.featured_image,
              listingType,
              status: isIncompletePage
                ? "مسودة"
                : property.status === 1
                ? "منشور"
                : "مسودة",
              lastUpdated: new Date(
                property.updated_at || property.created_at
              ).toLocaleDateString("ar-AE"),
              features: Array.isArray(property.features)
                ? property.features
                : [],
              missing_fields: isIncompletePage
                ? property.missing_fields || []
                : undefined,
              validation_errors: isIncompletePage
                ? property.validation_errors || []
                : undefined,
            };
          });

          setPropertiesManagement({
            properties: mappedProperties,
            pagination,
            propertiesAllData,
            incompleteCount,
            loading: false,
            isInitialized: true,
          });
        } catch (error) {
          console.error("Error fetching properties:", error);
          setPropertiesManagement({
            error: formatErrorMessage(
              error as Error,
              "حدث خطأ أثناء جلب بيانات الوحدات"
            ),
            loading: false,
            isInitialized: true,
          });
          fetchCalledRef.current = false;
        }
      };

      loadProperties();
    }
  }, [userData?.token, authLoading, isIncompletePage, setPropertiesManagement]);

  const renderSkeletons = () => (
    <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 6 }).map((_, idx) => (
        <SkeletonPropertyCard key={idx} />
      ))}
    </div>
  );

  const reorderList =
    reorderPopup.type === "featured"
      ? normalizedProperties.filter((p: any) => p.featured)
      : normalizedProperties;

  if (!userData?.token) {
    return (
      <div className="flex min-h-screen flex-col" dir="rtl">
        <main className="flex-1 p-4 md:p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-lg text-gray-500">
                يرجى تسجيل الدخول لعرض المحتوى
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <main className="flex-1 p-4 md:p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {isIncompletePage ? "الوحدات الغير مكتملة" : "إدارة الوحدات"}
              </h1>
              <p className="text-muted-foreground">
                {isIncompletePage
                  ? "إكمال الوحدات الغير مكتملة وإضافة البيانات المطلوبة"
                  : "أضف وأدرج قوائم الوحدات لموقعك على الويب"}
              </p>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              {!isIncompletePage && incompleteCount > 0 && (
                <Button
                  variant="outline"
                  className="gap-1 w-full md:w-auto relative"
                  onClick={() => router.push("/dashboard/properties/incomplete")}
                >
                  <AlertCircle className="h-4 w-4" />
                  الوحدات الغير مكتملة
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {incompleteCount}
                  </span>
                </Button>
              )}
              <Button
                variant="outline"
                className="gap-1 w-full md:w-auto"
                onClick={() => importExportHooks.setImportDialogOpen(true)}
              >
                <Upload className="h-4 w-4" />
                استيراد وحدات
              </Button>
              <Button
                variant="outline"
                className="gap-1 w-full md:w-auto"
                onClick={() => importExportHooks.setExportDialogOpen(true)}
                disabled={importExportHooks.isExporting || loading}
              >
                <Download className="h-4 w-4" />
                {importExportHooks.isExporting ? "جاري التصدير..." : "تصدير وحدات"}
              </Button>
              <div className="flex gap-2 w-full md:w-auto">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className={`flex-1 md:flex-none ${
                    viewMode === "grid" ? "bg-muted" : ""
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                  <span className="sr-only">Grid view</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className={`flex-1 md:flex-none ${
                    viewMode === "list" ? "bg-muted" : ""
                  }`}
                >
                  <List className="h-4 w-4" />
                  <span className="sr-only">List view</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode("map")}
                  className={`flex-1 md:flex-none ${
                    viewMode === "map" ? "bg-muted" : ""
                  }`}
                >
                  <MapPin className="h-4 w-4" />
                  <span className="sr-only">Map view</span>
                </Button>
              </div>
              <Button
                className="gap-1 w-full md:w-auto"
                onClick={() => {
                  const propertiesLength = pagination?.total || 0;
                  const limit =
                    useAuthStore.getState().userData?.package
                      ?.real_estate_limit_number;
                  if (propertiesLength >= limit) {
                    setIsLimitReached(true);
                  } else {
                    router.push("properties/add");
                  }
                }}
              >
                <Plus className="h-4 w-4" />
                إضافة وحدة
              </Button>
            </div>
          </div>

          {/* Limit Reached Dialog */}
          <Dialog open={isLimitReached} onOpenChange={setIsLimitReached}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-center text-red-500">
                  لقد وصلت للحد الأقصى للإضافة
                </DialogTitle>
                <DialogDescription className="text-center">
                  برجاء ترقية الباقة لإضافة المزيد من الوحدات.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsLimitReached(false)}
                >
                  إلغاء
                </Button>
                <Button onClick={clickedONButton}>اشتراك</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Import Dialog */}
          <ImportDialog
            isOpen={importExportHooks.importDialogOpen}
            onClose={() => {
              importExportHooks.setImportDialogOpen(false);
              importExportHooks.setImportFile(null);
              importExportHooks.setImportResult(null);
            }}
            importFile={importExportHooks.importFile}
            setImportFile={importExportHooks.setImportFile}
            isImporting={importExportHooks.isImporting}
            isDownloadingTemplate={importExportHooks.isDownloadingTemplate}
            importResult={importExportHooks.importResult}
            setImportResult={importExportHooks.setImportResult}
            onFileChange={importExportHooks.handleFileChange}
            onDownloadTemplate={importExportHooks.handleDownloadTemplate}
            onImport={importExportHooks.handleImport}
          />

          {/* Export Dialog */}
          <ExportDialog
            isOpen={importExportHooks.exportDialogOpen}
            onClose={() => {
              importExportHooks.setExportDialogOpen(false);
              importExportHooks.setExportDateRange(undefined);
            }}
            exportDateRange={importExportHooks.exportDateRange}
            setExportDateRange={importExportHooks.setExportDateRange}
            isExporting={importExportHooks.isExporting}
            onExport={importExportHooks.handleExport}
          />

          {/* Statistics */}
          <PropertyStatisticsCards />

          {/* Filters Section */}
          <FiltersSection
            filterCityId={filterCityId}
            setFilterCityId={setFilterCityId}
            filterDistrictId={filterDistrictId}
            setFilterDistrictId={setFilterDistrictId}
            filterType={filterType}
            setFilterType={setFilterType}
            filterPurpose={filterPurpose}
            setFilterPurpose={setFilterPurpose}
            filterBeds={filterBeds}
            setFilterBeds={setFilterBeds}
            filterPriceFrom={filterPriceFrom}
            setFilterPriceFrom={setFilterPriceFrom}
            filterPriceTo={filterPriceTo}
            setFilterPriceTo={setFilterPriceTo}
            tempPriceFrom={tempPriceFrom}
            setTempPriceFrom={setTempPriceFrom}
            tempPriceTo={tempPriceTo}
            setTempPriceTo={setTempPriceTo}
            isPricePopoverOpen={isPricePopoverOpen}
            setIsPricePopoverOpen={setIsPricePopoverOpen}
            localSearchValue={localSearchValue}
            setLocalSearchValue={setLocalSearchValue}
            cities={cities}
            districts={districts}
            loadingCities={loadingCities}
            loadingDistricts={loadingDistricts}
            newFilters={newFilters}
            handleSearchOnly={handleSearchOnly}
            handleClearFilters={handleClearFilters}
            handleRemoveFilter={handleRemoveFilter}
            handleClearAllFilters={handleClearAllFilters}
          />

          {/* Properties List */}
          {loading ? (
            renderSkeletons()
          ) : error ? (
            <ErrorDisplay
              error={error}
              onRetry={() => fetchPropertiesWrapper(currentPage, newFilters)}
              title="خطأ في تحميل الوحدات"
            />
          ) : viewMode === "map" ? (
            <PropertiesMapView
              properties={normalizedProperties}
              onToggleFavorite={toggleFavorite}
              onShare={handleShare}
              favorites={favorites}
            />
          ) : (
            <Tabs defaultValue="all">
              <TabsContent value="all" className="mt-4">
                {normalizedProperties.length === 0 ? (
                  <EmptyState type="وحدات" />
                ) : (
                  <>
                    {viewMode === "grid" ? (
                      <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-4">
                        {normalizedProperties.map(
                          (property: any, index: number) => (
                            <PropertyCard
                              key={property.id}
                              property={property}
                              allProperties={normalizedProperties}
                              currentIndex={index}
                              isFavorite={favorites.includes(
                                property.id.toString()
                              )}
                              onToggleFavorite={toggleFavorite}
                              onDelete={handleDeleteProperty}
                              onDuplicate={handleDuplicateProperty}
                              onToggleStatus={handleToggleStatus}
                              onShare={handleShare}
                              setReorderPopup={setReorderPopup}
                              showIncompleteOnly={isIncompletePage}
                            />
                          )
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {normalizedProperties.map((property: any) => (
                          <PropertyListItem
                            key={property.id}
                            property={property}
                            isFavorite={favorites.includes(
                              property.id.toString()
                            )}
                            onToggleFavorite={toggleFavorite}
                            onDelete={handleDeleteProperty}
                            onDuplicate={handleDuplicateProperty}
                            onToggleStatus={handleToggleStatus}
                            onShare={handleShare}
                            setReorderPopup={setReorderPopup}
                            showIncompleteOnly={isIncompletePage}
                          />
                        ))}
                      </div>
                    )}

                    {pagination && pagination.last_page > 1 && (
                      <Pagination
                        currentPage={pagination.current_page}
                        totalPages={pagination.last_page}
                        onPageChange={handlePageChange}
                        totalItems={pagination.total}
                        itemsPerPage={pagination.per_page}
                        from={pagination.from}
                        to={pagination.to}
                      />
                    )}
                  </>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>

        {/* Share Dialog */}
        <ShareDialog
          isOpen={shareDialogOpen}
          onClose={() => setShareDialogOpen(false)}
          property={selectedProperty}
        />

        {/* Advanced Filter Dialog */}
        <AdvancedFilterDialog
          isOpen={filterDialogOpen}
          onClose={() => setFilterDialogOpen(false)}
          filterData={propertiesAllData}
          onApplyFilters={handleApplyFilters}
          appliedFilters={newFilters}
        />

        {/* Reorder Dialog */}
        <ReorderDialog
          isOpen={reorderPopup.open}
          onClose={() => setReorderPopup({ ...reorderPopup, open: false })}
          reorderList={reorderList}
          reorderType={reorderPopup.type}
          propertiesAllData={propertiesAllData}
          pagination={pagination}
        />
      </main>
    </div>
  );
}
