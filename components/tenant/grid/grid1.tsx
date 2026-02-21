"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { PropertyCard } from "@/components/tenant/cards/card1";
import PropertyCard2 from "@/components/tenant/cards/card2";
import PropertyCard3 from "@/components/tenant/cards/card3";
import Card4 from "@/components/tenant/cards/card4";
import Card5 from "@/components/tenant/cards/card5";
import BlogCard1 from "@/components/tenant/blogCard/blogCard1";
import { usePropertiesStore } from "@/context/propertiesStore";
import { useTenantId } from "@/hooks/useTenantId";
import Pagination from "@/components/ui/pagination";
import useTenantStore from "@/context/tenantStore";
import { useEditorStore } from "@/context/editorStore";
import axiosInstance from "@/lib/axiosInstance";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { getDefaultGridData } from "@/context/editorStoreFunctions/gridFunctions";

interface PropertyGridProps {
  emptyMessage?: string;
  className?: string;
  cardSettings?: {
    theme?: string;
    showImage?: boolean;
    showPrice?: boolean;
    showDetails?: boolean;
    showViews?: boolean;
    showStatus?: boolean;
  };
  dataSource?: {
    apiUrl?: string;
    enabled?: boolean;
  };
  useStore?: boolean;
  variant?: string;
  id?: string;
}

export default function PropertyGrid(props: PropertyGridProps = {}) {
  // Initialize variant id early so hooks can depend on it
  const variantId = props.variant || "grid1";
  // Use props.id as unique identifier (most reliable)
  const uniqueId = props.id || variantId;

  // Get current pathname, search params, and router
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Check if we're on real-estate page
  const isRealEstatePage = pathname?.includes("/real-estate");

  // Debug: Log component mount and URL
  useEffect(() => {
    console.log("🏗️  Grid1 mounted! URL:", {
      pathname,
      isRealEstatePage,
      windowSearch:
        typeof window !== "undefined" ? window.location.search : "N/A",
      fullURL: typeof window !== "undefined" ? window.location.href : "N/A",
    });
  }, [pathname, isRealEstatePage]);

  // Tenant ID hook
  const { tenantId: currentTenantId, isLoading: tenantLoading } = useTenantId();

  // URL filters hook - automatically applies URL params when they change
  useUrlFilters();

  // State for API data
  const [apiProperties, setApiProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // State for pagination from API response (for real-estate page)
  const [apiPagination, setApiPagination] = useState({
    total: 0,
    per_page: 20,
    current_page: 1,
    last_page: 1,
    from: 1,
    to: 0,
  });

  // Subscribe to properties store for transactionType changes
  const transactionType = usePropertiesStore((state) => state.transactionType);
  const setTransactionType = usePropertiesStore(
    (state) => state.setTransactionType,
  );
  const setTenantId = usePropertiesStore((state) => state.setTenantId);
  const filteredProperties = usePropertiesStore(
    (state) => state.filteredProperties,
  );
  const storeLoading = usePropertiesStore((state) => state.loading);
  const pagination = usePropertiesStore((state) => state.pagination);
  const setCurrentPage = usePropertiesStore((state) => state.setCurrentPage);
  const goToNextPage = usePropertiesStore((state) => state.goToNextPage);
  const goToPreviousPage = usePropertiesStore(
    (state) => state.goToPreviousPage,
  );

  // Filter state from store
  const search = usePropertiesStore((state) => state.search);
  const propertyType = usePropertiesStore((state) => state.propertyType);
  const price = usePropertiesStore((state) => state.price);

  // Subscribe to editor store updates for this component variant
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);

  // Get tenant data
  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  // Get primary color from WebsiteLayout branding (fallback to emerald-600)
  // emerald-600 in Tailwind = #059669
  const primaryColor =
    tenantData?.WebsiteLayout?.branding?.colors?.primary &&
    tenantData.WebsiteLayout.branding.colors.primary.trim() !== ""
      ? tenantData.WebsiteLayout.branding.colors.primary
      : "#059669"; // emerald-600 default (fallback)

  // Helper function to create lighter color (for badges and backgrounds)
  const getLighterColor = (hex: string, opacity: number = 0.2): string => {
    if (!hex || !hex.startsWith("#")) return `${primaryColor}33`; // 20% opacity default
    // Return hex color with opacity using rgba
    const cleanHex = hex.replace("#", "");
    if (cleanHex.length !== 6) return `${primaryColor}33`;

    const r = parseInt(cleanHex.substr(0, 2), 16);
    const g = parseInt(cleanHex.substr(2, 2), 16);
    const b = parseInt(cleanHex.substr(4, 2), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // Helper function to create darker color for text on light backgrounds
  const getDarkerColor = (hex: string, amount: number = 40): string => {
    // emerald-700 in Tailwind = #047857 (fallback)
    if (!hex || !hex.startsWith("#")) return "#047857";
    const cleanHex = hex.replace("#", "");
    if (cleanHex.length !== 6) return "#047857";

    const r = Math.max(
      0,
      Math.min(255, parseInt(cleanHex.substr(0, 2), 16) - amount),
    );
    const g = Math.max(
      0,
      Math.min(255, parseInt(cleanHex.substr(2, 2), 16) - amount),
    );
    const b = Math.max(
      0,
      Math.min(255, parseInt(cleanHex.substr(4, 2), 16) - amount),
    );

    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  };

  const primaryColorLight = getLighterColor(primaryColor, 0.15); // 15% opacity for badge backgrounds
  const primaryColorDark = getDarkerColor(primaryColor, 40); // Darker for text on light backgrounds

  // Get tenant data for this specific component variant
  const getTenantComponentData = () => {
    if (!tenantData?.componentSettings) {
      return {};
    }
    // Search through all pages for this component variant
    for (const [pageSlug, pageComponents] of Object.entries(
      tenantData.componentSettings,
    )) {
      // Check if pageComponents is an object (not array)
      if (
        typeof pageComponents === "object" &&
        !Array.isArray(pageComponents)
      ) {
        // Search through all components in this page
        for (const [componentId, component] of Object.entries(
          pageComponents as any,
        )) {
          // Check if this is the exact component we're looking for by ID
          // Use componentId === props.id (most reliable identifier)
          if (
            (component as any).type === "grid" &&
            (componentId === props.id ||
              (component as any).id === props.id ||
              (component as any).id === uniqueId)
          ) {
            return (component as any).data;
          }
        }
      }
      // Also handle array format
      if (Array.isArray(pageComponents)) {
        for (const component of pageComponents) {
          // Search by id (most reliable identifier)
          if (
            (component as any).type === "grid" &&
            ((component as any).id === props.id ||
              (component as any).id === uniqueId)
          ) {
            return (component as any).data;
          }
        }
      }
    }
    return {};
  };

  // Get tenant component data (must be called before useEffect that uses it)
  const tenantComponentData = getTenantComponentData();

  // Get data from store or tenantData with fallback logic
  const currentStoreData = props.useStore
    ? getComponentData("grid", uniqueId) || {}
    : {};

  useEffect(() => {
    if (props.useStore) {
      // ✅ Use database data if available
      const initialData =
        tenantComponentData && Object.keys(tenantComponentData).length > 0
          ? {
              ...getDefaultGridData(),
              ...tenantComponentData, // Database data takes priority
              ...props,
            }
          : {
              ...getDefaultGridData(),
              ...props,
            };

      // Initialize in store
      ensureComponentVariant("grid", uniqueId, initialData);
    }
  }, [uniqueId, props.useStore, ensureComponentVariant, tenantComponentData]);

  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);

  // Note: URL parameters are automatically applied by useUrlFilters hook
  // The hook uses useEffect internally to watch searchParams changes

  // Get default data
  const defaultData = getDefaultGridData();

  // Check if tenantComponentData exists
  const hasTenantData =
    tenantComponentData &&
    Object.keys(tenantComponentData).length > 0;

  // Check if currentStoreData is just default data (by comparing content.title)
  const isStoreDataDefault =
    currentStoreData?.content?.title === defaultData?.content?.title;

  // Merge data with correct priority
  const mergedData = {
    ...defaultData, // 1. Defaults (lowest priority)
    ...props, // 2. Props from parent component
    // If tenantComponentData exists, use it (it's from Database)
    ...(hasTenantData ? tenantComponentData : {}), // 3. Backend data (tenant data)
    // Use currentStoreData only if it's not just default data
    // (meaning it has been updated by user) or if tenantComponentData doesn't exist
    ...(hasTenantData && isStoreDataDefault
      ? {}
      : currentStoreData), // 4. Current store data (highest priority if not default)
  };

  // ⭐ DEBUG: Log data sources (optional - remove in production)

  // Set tenantId in properties store when it changes
  // BUT: Don't set it if grid1 has configured apiUrl (grid1 fetches data directly)
  useEffect(() => {
    if (currentTenantId) {
      const hasConfiguredApiUrl = !!mergedData.dataSource?.apiUrl && mergedData.dataSource.apiUrl.trim();
      if (!hasConfiguredApiUrl) {
        // Only set tenantId in store if grid1 doesn't have configured apiUrl
        // This prevents store from fetching data when grid1 handles it directly
        console.log("🔧 [Grid1] setTenantId في store (grid1 لا يحتوي على apiUrl محدد)");
        setTenantId(currentTenantId);
      } else {
        console.log("⏭️ [Grid1] تخطي setTenantId في store (grid1 لديه apiUrl محدد ويجلب البيانات مباشرة)");
      }
    }
  }, [currentTenantId, setTenantId, mergedData.dataSource?.apiUrl]);

  // Configure API URL based on pathname first, then dataSource
  const configuredApiUrl = (() => {
    const rawUrl = mergedData.dataSource?.apiUrl;
    
    // ⭐ الأولوية الأولى: فرض API URL بناءً على pathname لصفحات for-sale و for-rent
    if (pathname?.includes("/for-sale")) {
      const url = "/v1/tenant-website/{{tenantID}}/properties?purpose=sale&latest=1";
      return url;
    }
    if (pathname?.includes("/for-rent")) {
      const url = "/v1/tenant-website/{{tenantID}}/properties?purpose=rent";
      return url;
    }
    
    // ⭐ الأولوية الثانية: استخدام apiUrl من البيانات (إذا كان موجوداً)
    if (rawUrl && rawUrl.trim()) {
      // شرط خاص: إذا كانت الصفحة تحتوي على "real-estate" و apiUrl هو "/v1/tenant-website/{{tenantID}}/properties"
      if (pathname?.includes("/real-estate") && rawUrl.trim() === "/v1/tenant-website/{{tenantID}}/properties") {
        const modifiedUrl = "/v1/tenant-website/{{tenantID}}?title=";
        return modifiedUrl;
      }
      return rawUrl;
    }
    
    // ⭐ القيمة الافتراضية: إذا لم يكن pathname خاص ولم يكن apiUrl موجوداً
    const defaultUrl = "/v1/tenant-website/{{tenantID}}/properties";
    return defaultUrl;
  })();

  // Function to add searchParams to URL and replace tenantID
  const addSearchParamsToUrl = (url: string, tenantId: string): string => {
    
    // استبدال {{tenantID}}
    let finalUrl = url.replace("{{tenantID}}", tenantId);
    
    // استخراج params الموجودة في url
    const urlParams = new URLSearchParams();
    const urlParts = finalUrl.split("?");
    const baseUrl = urlParts[0];
    
    if (urlParts[1]) {
      // إضافة params الموجودة في url
      const existingParams = new URLSearchParams(urlParts[1]);
      existingParams.forEach((value, key) => {
        urlParams.set(key, value);
      });
      console.log("📋 [Grid1] Params الموجودة في URL:", Object.fromEntries(existingParams));
    }
    
    // حالة خاصة: إذا كان URL يحتوي على "?title=" (من real-estate page)
    // يجب إضافة قيمة search من store إلى param title
    if (url.includes("?title=") || urlParams.has("title")) {
      if (search && search.trim()) {
        urlParams.set("title", search.trim());
        console.log("🔍 [Grid1] إضافة search من store إلى param title:", search.trim());
      } else {
        console.log("⚠️ [Grid1] search من store غير موجود أو فارغ - title param سيبقى فارغاً");
      }
    }
    
    // إضافة/تحديث params من searchParams أولاً
    if (searchParams) {
      const searchParamsObj: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        // تخطي param "title" إذا كان موجوداً في URL (لأننا أضفناه من store)
        if (!(url.includes("?title=") || urlParams.has("title")) || key !== "title") {
          urlParams.set(key, value);
          searchParamsObj[key] = value;
        }
      });
      console.log("➕ [Grid1] Params من searchParams:", searchParamsObj);
    } else {
      console.log("⚠️ [Grid1] searchParams غير موجود");
    }
    
    // إضافة/تحديث params من pathname (الأولوية النهائية لـ pathname)
    if (pathname?.includes("/for-sale")) {
      urlParams.set("purpose", "sale");
      if (!urlParams.has("latest")) {
        urlParams.set("latest", "1");
      }
      console.log("🟢 [Grid1] إضافة/تحديث params من pathname (/for-sale) - الأولوية النهائية: purpose=sale, latest=1");
    } else if (pathname?.includes("/for-rent")) {
      urlParams.set("purpose", "rent");
      // ⭐ إزالة page=1 من /for-rent حسب متطلبات المستخدم
      console.log("🟡 [Grid1] إضافة/تحديث params من pathname (/for-rent) - الأولوية النهائية: purpose=rent");
    }
    
    // بناء URL النهائي
    const queryString = urlParams.toString();
    const finalUrlWithParams = queryString ? `${baseUrl}?${queryString}` : baseUrl;
    console.log("✅ [Grid1] URL النهائي بعد إضافة params:", finalUrlWithParams);
    return finalUrlWithParams;
  };

  // Function to fetch properties from API
  const fetchPropertiesFromApi = async (apiUrl: string) => {
    console.log("🚀 [Grid1] fetchPropertiesFromApi - بدء الجلب:", { apiUrl, currentTenantId });
    try {
      setLoading(true);

      if (!currentTenantId) {
        console.log("❌ [Grid1] fetchPropertiesFromApi - currentTenantId غير موجود، إيقاف الجلب");
        setLoading(false);
        return;
      }

      // Add searchParams to URL and replace tenantID
      const url = addSearchParamsToUrl(apiUrl, currentTenantId);
      console.log("🌐 [Grid1] fetchPropertiesFromApi - جلب البيانات من:", url);

      const response = await axiosInstance.get(url);
      console.log("📦 [Grid1] fetchPropertiesFromApi - تم استلام الاستجابة:", {
        hasData: !!response.data,
        dataType: Array.isArray(response.data) ? "array" : typeof response.data,
        dataKeys: response.data ? Object.keys(response.data) : [],
      });

      // Handle different API response formats
      if (response.data) {
        let dataToSet = [];
        let paginationData = null;

        // Handle response format where items are under `data`
        if (response.data.data && Array.isArray(response.data.data)) {
          console.log("📊 [Grid1] الحالة: response.data.data (مصفوفة مختلطة)");
          // Process mixed data (properties and projects)
          const mixedData = response.data.data;
          console.log("🔀 [Grid1] عدد العناصر المختلطة:", mixedData.length);
          
          dataToSet = mixedData.map((item: any) => {
            const originalType = item.type; // Save original type before conversion
            // If it's a project, convert to property format
            if (item.type === "project") {
              console.log("🏗️ [Grid1] تحويل project إلى property format");
              const converted = convertProjectToProperty(item);
              // Preserve original type for badge display
              return { ...converted, _itemType: originalType };
            }
            // If it's a property, use it directly but preserve type
            return { ...item, _itemType: originalType };
          });
          
          // Extract pagination from response
          if (response.data.pagination) {
            paginationData = response.data.pagination;
            console.log("📄 [Grid1] Pagination data:", paginationData);
            setApiPagination({
              total: paginationData.total || 0,
              per_page: paginationData.per_page || 20,
              current_page: paginationData.current_page || 1,
              last_page: paginationData.last_page || 1,
              from: paginationData.from || 1,
              to: paginationData.to || 0,
            });
          }
        }
        // Check if it's blogs API response
        else if (url.includes("/posts") || url.includes("/api/posts")) {
          console.log("📝 [Grid1] الحالة: blogs API response");
          let blogsData = [];

          if (response.data.data && Array.isArray(response.data.data)) {
            blogsData = response.data.data;
            console.log("📚 [Grid1] blogs من response.data.data:", blogsData.length);
          } else if (Array.isArray(response.data)) {
            blogsData = response.data;
            console.log("📚 [Grid1] blogs من response.data مباشرة:", blogsData.length);
          }

          // Convert blogs to property format
          if (blogsData.length > 0) {
            dataToSet = blogsData.map((blog: any) => {
              return convertBlogToProperty(blog);
            });
            console.log("✅ [Grid1] تم تحويل", blogsData.length, "blog إلى property format");
          } else {
            dataToSet = [];
            console.log("⚠️ [Grid1] لا توجد blogs للتحويل");
          }
        }
        // Check if it's projects API response
        else if (url.includes("/projects")) {
          console.log("🏗️ [Grid1] الحالة: projects API response");
          let projectsData = [];

          if (response.data.projects) {
            projectsData = response.data.projects;
            console.log("🏢 [Grid1] projects من response.data.projects:", projectsData.length);
          } else if (Array.isArray(response.data)) {
            projectsData = response.data;
            console.log("🏢 [Grid1] projects من response.data مباشرة:", projectsData.length);
          } else if (response.data.data && Array.isArray(response.data.data)) {
            projectsData = response.data.data;
            console.log("🏢 [Grid1] projects من response.data.data:", projectsData.length);
          }

          // Convert projects to property format
          if (projectsData.length > 0) {
            dataToSet = projectsData.map((project: any) => {
              return convertProjectToProperty(project);
            });
            console.log("✅ [Grid1] تم تحويل", projectsData.length, "project إلى property format");
          } else {
            dataToSet = [];
            console.log("⚠️ [Grid1] لا توجد projects للتحويل");
          }
        }
        // Check if it's properties API response
        else if (response.data.properties) {
          console.log("🏠 [Grid1] الحالة: properties API response");
          dataToSet = response.data.properties;
          console.log("✅ [Grid1] عدد properties:", dataToSet.length);
        }
        // Handle direct array response
        else if (Array.isArray(response.data)) {
          console.log("📋 [Grid1] الحالة: direct array response");
          dataToSet = response.data;
          console.log("✅ [Grid1] عدد العناصر في المصفوفة المباشرة:", dataToSet.length);
        }
        // Handle pagination wrapper
        else if (response.data.data && Array.isArray(response.data.data)) {
          console.log("📦 [Grid1] الحالة: pagination wrapper");
          dataToSet = response.data.data;
          console.log("✅ [Grid1] عدد العناصر من pagination wrapper:", dataToSet.length);
        }

        console.log("💾 [Grid1] حفظ", dataToSet.length, "عنصر في apiProperties");
        setApiProperties(dataToSet);
      } else {
        console.log("⚠️ [Grid1] response.data غير موجود - حفظ مصفوفة فارغة");
        setApiProperties([]);
      }
    } catch (error) {
      // Set empty array on error
      console.error("❌ [Grid1] خطأ في fetchPropertiesFromApi:", error);
      setApiProperties([]);
    } finally {
      console.log("🏁 [Grid1] fetchPropertiesFromApi - انتهى (setLoading(false))");
      setLoading(false);
    }
  };

  // Helper function to convert project data to property format
  const convertProjectToProperty = (project: any): any => {
    // Format price display
    const formatPrice = (minPrice: string, maxPrice: string) => {
      if (!minPrice && !maxPrice) return "غير محدد";
      if (minPrice === maxPrice) return minPrice;
      if (minPrice && maxPrice) return `${minPrice} - ${maxPrice}`;
      return minPrice || maxPrice;
    };

    // Format completion date
    const formatCompletionDate = (date: string) => {
      if (!date) return new Date().toISOString();
      try {
        return new Date(date).toISOString();
      } catch {
        return new Date().toISOString();
      }
    };

    // Helper function to convert completeStatus from number to readable text
    const getCompleteStatusText = (status: number | string | undefined | null): string => {
      if (status === undefined || status === null) return "قيد الإنشاء";
      const statusNum = typeof status === "string" ? parseInt(status, 10) : status;
      switch (statusNum) {
        case 0:
          return "قيد الإنشاء";
        case 1:
          return "منتهي";
        case 2:
          return "لم ينشأ بعد";
        default:
          return "قيد الإنشاء";
      }
    };

    return {
      id: project.id,
      slug: project.slug,
      title: project.title,
      district: project.address || project.location?.address || "غير محدد",
      price: formatPrice(project.minPrice, project.maxPrice),
      views: 0, // Projects don't have views
      bedrooms: 0, // Projects don't have bedrooms
      bathrooms: 0, // Projects don't have bathrooms
      area: project.units ? `${project.units} وحدة` : "غير محدد",
      type: "مشروع", // Project type
      transactionType: "project", // Project transaction type
      image: project.image || project.images?.[0] || "",
      status: getCompleteStatusText(project.completeStatus),
      createdAt: formatCompletionDate(project.completionDate),
      description: project.description || "",
      features: project.amenities || [],
      location: {
        lat: project.location?.lat || 0,
        lng: project.location?.lng || 0,
        address: project.location?.address || project.address || "غير محدد",
      },
      images: project.images || [project.image].filter(Boolean),
    };
  };

  // Helper function to convert blog data to property format
  const convertBlogToProperty = (blog: any): any => {
    // Format published date
    const formatPublishedDate = (date: string | null) => {
      if (!date) return new Date().toISOString();
      try {
        return new Date(date).toISOString();
      } catch {
        return new Date().toISOString();
      }
    };

    return {
      id: blog.id,
      slug: blog.slug,
      title: blog.title,
      district: blog.categories?.[0]?.name || "مقال",
      price: "", // Blogs don't have prices
      views: blog.views || 0,
      bedrooms: 0, // Blogs don't have bedrooms
      bathrooms: 0, // Blogs don't have bathrooms
      area: "", // Blogs don't have area
      type: "مقال", // Blog type
      transactionType: "blog", // Blog transaction type
      image: blog.thumbnail?.url || "",
      status: blog.status === "published" ? "منشور" : "مسودة",
      createdAt: formatPublishedDate(blog.published_at || blog.created_at),
      description: blog.excerpt || "",
      features: blog.categories?.map((cat: any) => cat.name) || [],
      location: {
        lat: 0,
        lng: 0,
        address: blog.categories?.[0]?.name || "مقال",
      },
      images: blog.thumbnail?.url ? [blog.thumbnail.url] : [],
    };
  };

  // Helper function to convert property format back to blog format for blogCard1
  const convertPropertyToBlog = (property: any): any => {
    // Format date to Arabic locale
    const formatDate = (dateString: string | null | undefined): string => {
      if (!dateString) {
        return new Date().toLocaleDateString("ar-SA", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString("ar-SA", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      } catch {
        return new Date().toLocaleDateString("ar-SA", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
    };

    return {
      id: property.id?.toString() || property._id?.toString() || "",
      image: property.image || property.images?.[0] || "",
      title: property.title || "",
      description: property.description || property.excerpt || "",
      readMoreUrl: property.slug
        ? `/blog/${property.slug}`
        : property.readMoreUrl || "#",
      date: formatDate(property.createdAt || property.published_at || property.date),
    };
  };

  // Fetch properties on component mount and when API URL, pathname, or searchParams change
  useEffect(() => {
    console.log("🔄 [Grid1] useEffect - فحص الشروط:", {
      configuredApiUrl,
      useApiData: mergedData.dataSource?.enabled !== false,
      currentTenantId,
      pathname,
      hasSearchParams: !!searchParams,
    });

    const apiUrl = configuredApiUrl;
    const useApiData = mergedData.dataSource?.enabled !== false;

    if (useApiData && currentTenantId && apiUrl) {
      console.log("✅ [Grid1] useEffect - جميع الشروط متوفرة، بدء الجلب");
      // Clear existing data before fetching new data
      setApiProperties([]);
      fetchPropertiesFromApi(apiUrl);
    } else {
      console.log("⏸️ [Grid1] useEffect - الشروط غير متوفرة:", {
        useApiData,
        hasCurrentTenantId: !!currentTenantId,
        hasApiUrl: !!apiUrl,
      });
    }
  }, [
    mergedData.dataSource?.apiUrl,
    mergedData.dataSource?.enabled,
    currentTenantId,
    pathname,
    searchParams,
  ]);

  // Use API data if enabled, otherwise use static data
  const useApiData = mergedData.dataSource?.enabled !== false;

  const isPropertiesApiUrl = !!configuredApiUrl &&
    configuredApiUrl.includes("/properties");

  const shouldPaginateViaUrl =
    !isPropertiesApiUrl && isRealEstatePage && !!searchParams?.get("search");

  const handlePageChange = useCallback(
    (page: number) => {
      // For real-estate page when NOT using `/properties`, use URL pagination.
      if (shouldPaginateViaUrl && searchParams) {
        const currentParams = new URLSearchParams(searchParams.toString());
        currentParams.set("page", page.toString());
        router.push(`${pathname}?${currentParams.toString()}`);
        // The useEffect will handle the refetch when searchParams changes
      } else {
        // For other pages, use existing store logic
        if (page !== pagination.current_page) {
          setCurrentPage(page);
        }
      }
    },
    [shouldPaginateViaUrl, searchParams, router, pathname, pagination.current_page, setCurrentPage],
  );

  const handleNextPage = useCallback(() => {
    if (shouldPaginateViaUrl && searchParams) {
      const currentPage = parseInt(searchParams.get("page") || "1", 10);
      const nextPage = currentPage + 1;
      if (nextPage <= apiPagination.last_page) {
        handlePageChange(nextPage);
      }
    } else {
      goToNextPage();
    }
  }, [shouldPaginateViaUrl, searchParams, apiPagination.last_page, handlePageChange, goToNextPage]);

  const handlePreviousPage = useCallback(() => {
    if (shouldPaginateViaUrl && searchParams) {
      const currentPage = parseInt(searchParams.get("page") || "1", 10);
      const previousPage = currentPage - 1;
      if (previousPage >= 1) {
        handlePageChange(previousPage);
      }
    } else {
      goToPreviousPage();
    }
  }, [shouldPaginateViaUrl, searchParams, handlePageChange, goToPreviousPage]);

  // Determine which pagination to use
  const activePagination = shouldPaginateViaUrl ? apiPagination : pagination;

  const shouldRenderPagination =
    useApiData &&
    currentTenantId &&
    activePagination.last_page > 1 &&
    (filteredProperties.length > 0 || apiProperties.length > 0 || activePagination.total > activePagination.per_page);

  // Determine if we're on projects page or blogs page
  const isProjectsPage = pathname?.includes("/projects");
  const isProjectsApi = configuredApiUrl?.includes("/projects");
  const isBlogsPage = pathname?.includes("/blog");
  const isBlogsApi = configuredApiUrl?.includes("/posts");

  // Use apiProperties when grid1 fetches data directly from API
  // When grid1 has apiUrl configured, it fetches data directly and should use apiProperties
  // Otherwise use filteredProperties from store or static data
  const hasSearchParam = searchParams?.has("search");
  const hasConfiguredApiUrl = !!mergedData.dataSource?.apiUrl && mergedData.dataSource.apiUrl.trim();
  
  let properties;
  if (useApiData && currentTenantId) {
    if (hasConfiguredApiUrl || isProjectsPage || isProjectsApi || isBlogsPage || isBlogsApi || shouldPaginateViaUrl) {
      properties = apiProperties; // Use apiProperties when grid1 has configured apiUrl or for projects/blogs
      console.log("📊 [Grid1] استخدام apiProperties:", {
        count: apiProperties.length,
        hasConfiguredApiUrl,
        isProjectsPage,
        isProjectsApi,
        isBlogsPage,
        isBlogsApi,
        shouldPaginateViaUrl,
      });
    } else {
      properties = filteredProperties; // Use store data when grid1 doesn't have configured apiUrl
      console.log("📊 [Grid1] استخدام filteredProperties من store:", {
        count: filteredProperties.length,
        hasConfiguredApiUrl,
      });
    }
  } else if (useApiData) {
    properties = apiProperties;
    console.log("📊 [Grid1] استخدام apiProperties (useApiData فقط):", { count: apiProperties.length });
  } else {
    properties = mergedData.items || mergedData.properties || [];
    console.log("📊 [Grid1] استخدام static data:", { count: properties.length });
  }

  // Helper function to convert property from grid format to card4/card5 format
  const convertPropertyForCard4And5 = (property: any) => {
    // Parse price - handle both string and number formats
    const parsePrice = (priceStr: string | number) => {
      if (typeof priceStr === "number") {
        return { min: priceStr, max: priceStr };
      }
      if (!priceStr || typeof priceStr !== "string") {
        return { min: 0, max: 0 };
      }
      // Remove non-numeric characters except dashes and spaces
      const cleaned = priceStr.replace(/[^\d\s-]/g, "").trim();
      // Try to extract range (e.g., "100000 - 200000" or "100000-200000")
      const rangeMatch = cleaned.match(/(\d+)\s*-\s*(\d+)/);
      if (rangeMatch) {
        return {
          min: parseInt(rangeMatch[1].replace(/\s/g, ""), 10) || 0,
          max: parseInt(rangeMatch[2].replace(/\s/g, ""), 10) || 0,
        };
      }
      // Single price
      const singlePrice = parseInt(cleaned.replace(/\s/g, ""), 10) || 0;
      return { min: singlePrice, max: singlePrice };
    };

    // Parse area - handle both string and number formats
    const parseArea = (areaStr: string | number) => {
      if (typeof areaStr === "number") {
        return { min: areaStr, max: areaStr };
      }
      if (!areaStr || typeof areaStr !== "string") {
        return { min: 0, max: 0 };
      }
      // Remove non-numeric characters except dashes, spaces, and م²
      const cleaned = areaStr.replace(/[^\d\s-م²]/g, "").trim();
      const rangeMatch = cleaned.match(/(\d+)\s*-\s*(\d+)/);
      if (rangeMatch) {
        return {
          min: parseInt(rangeMatch[1].replace(/\s/g, ""), 10) || 0,
          max: parseInt(rangeMatch[2].replace(/\s/g, ""), 10) || 0,
        };
      }
      const singleArea = parseInt(cleaned.replace(/\s/g, ""), 10) || 0;
      return { min: singleArea, max: singleArea };
    };

    // Parse bedrooms/rooms
    const parseRooms = (rooms: number | string | undefined) => {
      if (typeof rooms === "number") {
        return { min: rooms, max: rooms };
      }
      if (typeof rooms === "string") {
        const num = parseInt(rooms, 10) || 0;
        return { min: num, max: num };
      }
      return { min: 0, max: 0 };
    };

    // Parse bathrooms
    const parseBathrooms = (bathrooms: number | string | undefined) => {
      if (typeof bathrooms === "number") {
        return { min: bathrooms, max: bathrooms };
      }
      if (typeof bathrooms === "string") {
        const num = parseInt(bathrooms, 10) || 0;
        return { min: num, max: num };
      }
      return { min: 0, max: 0 };
    };

    // Parse floors
    const parseFloors = (floors: number | string | undefined) => {
      if (typeof floors === "number") {
        return { min: floors, max: floors };
      }
      if (typeof floors === "string") {
        const num = parseInt(floors, 10) || 0;
        return { min: num, max: num };
      }
      return { min: 0, max: 0 };
    };

    return {
      id: property.id || property._id || "",
      image: property.image || property.images?.[0] || "",
      title: property.title || "",
      city:
        property.city ||
        property.location?.city ||
        property.district?.split(",")[0] ||
        "",
      district: property.district || property.location?.address || "",
      status: property.status || "",
      area: parseArea(property.area),
      rooms: parseRooms(property.bedrooms || property.rooms),
      floors: parseFloors(property.floors),
      price: parsePrice(property.price),
      bathrooms: parseBathrooms(property.bathrooms),
      featured: property.featured || false,
      // Determine if this is a project, blog, or property and build correct URL
      url: (() => {
        if (!property.slug) return property.url || "";
        
        const isBlog = 
          property.transactionType === "blog" || 
          property.type === "مقال" ||
          pathname?.includes("/blog") ||
          configuredApiUrl?.includes("/posts");
        
        const isProject = 
          property.transactionType === "project" || 
          property.type === "مشروع" ||
          pathname?.includes("/projects") ||
          configuredApiUrl?.includes("/projects");
        
        if (isBlog) {
          return `/blog/${property.slug}`;
        } else if (isProject) {
          return `/project/${property.slug}`;
        } else {
          return `/property/${property.slug}`;
        }
      })(),
      units: property.units || 0, // For card4
      // Preserve _itemType for badge display
      _itemType: property._itemType,
    };
  };

  // Check if component should be visible
  if (!mergedData.visible) {
    return null;
  }

  // Show loading state while tenant is loading
  if (tenantLoading) {
    return (
      <section className="w-full bg-background py-8">
        <div className="mx-auto max-w-[1600px] px-4">
          <div className="text-center py-12">
            <div
              className="inline-block animate-spin rounded-full h-8 w-8 border-b-2"
              style={{ borderBottomColor: primaryColor }}
            ></div>
            <p className="text-lg text-gray-600 mt-4">
              جاري تحميل بيانات الموقع...
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Show error if no tenant ID
  if (!currentTenantId) {
    return (
      <section className="w-full bg-background py-8">
        <div className="mx-auto max-w-[1600px] px-4">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <p className="text-lg text-yellow-600 font-medium">
              لم يتم العثور على معرف الموقع
            </p>
            <p className="text-sm text-gray-500 mt-2">
              تأكد من أنك تصل إلى الموقع من الرابط الصحيح
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`w-full bg-background py-8 ${mergedData.className || ""}`}
      style={{
        backgroundColor:
          mergedData.background?.color ||
          mergedData.styling?.bgColor ||
          "transparent",
        paddingTop: mergedData.layout?.padding?.top || "2rem",
        paddingBottom: mergedData.layout?.padding?.bottom || "2rem",
      }}
    >
      <div
        className="mx-auto px-20 "

      >
        {/* Section Title */}
        {mergedData.content?.title && (
          <div className="mb-6 text-center">
            <h2
              className="text-2xl font-bold mb-2"
              style={{
                color:
                  mergedData.styling?.titleColor ||
                  mergedData.typography?.title?.color ||
                  "#1f2937",
              }}
            >
              {mergedData.content.title}
            </h2>
            {mergedData.content.subtitle && (
              <p
                className="text-gray-600"
                style={{
                  color:
                    mergedData.styling?.subtitleColor ||
                    mergedData.typography?.subtitle?.color ||
                    "#6b7280",
                }}
              >
                {mergedData.content.subtitle}
              </p>
            )}
          </div>
        )}

        {loading || storeLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div
                className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
                style={{ borderBottomColor: primaryColor }}
              ></div>
              <p className="text-gray-600">
                {isBlogsApi 
                  ? "جاري تحميل المنشورات..." 
                  : isProjectsApi
                  ? "جاري تحميل المشاريع..."
                  : "جاري تحميل العقارات..."}
              </p>
            </div>
          </div>
        ) : properties.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                {isBlogsApi 
                  ? `تم العثور على ${properties.length} منشور${properties.length !== 1 ? "ات" : ""}`
                  : isProjectsApi
                  ? `تم العثور على ${properties.length} مشروع${properties.length !== 1 ? "" : ""}`
                  : `تم العثور على ${properties.length} عقار${properties.length !== 1 ? "ات" : ""}`
                }
                {filteredProperties.length > 0 && (
                  <span className="text-xs text-gray-500 block mt-1">
                    {search && `البحث: "${search}"`}
                    {propertyType && ` • النوع: "${propertyType}"`}
                    {price && ` • السعر: حتى ${price}`}
                  </span>
                )}
              </p>
            </div>
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${(mergedData.cardSettings?.theme || "card1") === "card4" ? "items-stretch" : ""}`}
              style={{
                gap: mergedData.styling?.gridGap || "24px",
              
              }}
            >
              {properties.map((property: any) => {
                // Check if this is blogs API - force blogCard1 usage
                const isBlogsApi = configuredApiUrl?.includes("/posts");

                if (isBlogsApi) {
                  // Convert to blog format and render BlogCard1
                  const blogData = convertPropertyToBlog(property);
                  return (
                    <BlogCard1
                      key={property.id || property._id}
                      blog={blogData}
                      useStore={false}
                    />
                  );
                }

                // Existing card rendering logic for properties/projects
                const cardSettings = mergedData.cardSettings || {};
                const theme = cardSettings.theme || "card1";

                // Handle card4 and card5 which need different prop structure
                if (theme === "card4") {
                  const convertedProperty =
                    convertPropertyForCard4And5(property);
                  
                  // Get item type from property (for real-estate page badge)
                  // Check _itemType first (preserved from API), then check transactionType or type
                  const itemType = (property as any)._itemType || 
                    ((property as any).transactionType === "project" ? "project" : "property") ||
                    ((property as any).type === "project" || (property as any).type === "مشروع" ? "project" : "property");
                  
                  return (
                    <div key={property.id || property._id} className="h-full">
                      <Card4
                        property={convertedProperty}
                        itemType={itemType}
                        useStore={false}
                      />
                    </div>
                  );
                } else if (theme === "card5") {
                  const convertedProperty =
                    convertPropertyForCard4And5(property);
                  return (
                    <Card5
                      key={property.id || property._id}
                      property={convertedProperty}
                      useStore={false}
                    />
                  );
                }

                // Handle card1, card2, card3 which use the standard property prop
                let CardComponent = PropertyCard;
                if (theme === "card2") {
                  CardComponent = PropertyCard2;
                } else if (theme === "card3") {
                  CardComponent = PropertyCard3;
                }

                return (
                  <CardComponent
                    key={property.id || property._id}
                    property={property}
                    showImage={cardSettings.showImage !== false}
                    showPrice={cardSettings.showPrice !== false}
                    showDetails={cardSettings.showDetails !== false}
                    showViews={cardSettings.showViews !== false}
                    showStatus={cardSettings.showStatus !== false}
                  />
                );
              })}
            </div>
            {shouldRenderPagination && (
              <div className="mt-8">
                <Pagination
                  currentPage={activePagination.current_page || 1}
                  totalPages={activePagination.last_page || 1}
                  onPageChange={handlePageChange}
                  onNextPage={handleNextPage}
                  onPreviousPage={handlePreviousPage}
                  totalItems={activePagination.total || properties.length}
                  itemsPerPage={
                    activePagination.per_page || Math.max(properties.length, 1)
                  }
                  showingFrom={activePagination.from || 0}
                  showingTo={activePagination.to || properties.length}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <p className="text-lg text-gray-600 font-medium">
              {mergedData.content?.emptyMessage ||
                mergedData.emptyMessage ||
                "لا توجد عقارات بهذه الفلاتر"}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              جرب تغيير الفلاتر أو البحث عن شيء آخر
            </p>
            {/* عرض الفلاتر النشطة */}
            {(search || propertyType || price) && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">الفلاتر النشطة:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {search && (
                    <span
                      className="px-2 py-1 rounded-full text-xs"
                      style={{
                        backgroundColor: primaryColorLight,
                        color: primaryColorDark,
                      }}
                    >
                      البحث: "{search}"
                    </span>
                  )}
                  {propertyType && (
                    <span
                      className="px-2 py-1 rounded-full text-xs"
                      style={{
                        backgroundColor: primaryColorLight,
                        color: primaryColorDark,
                      }}
                    >
                      النوع: "{propertyType}"
                    </span>
                  )}
                  {price && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                      السعر: حتى {price}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
