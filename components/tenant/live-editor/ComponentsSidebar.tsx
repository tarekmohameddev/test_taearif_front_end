"use client";
import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEditorT, useEditorLocale } from "@/context/editorI18nStore";
import {
  getAvailableSectionsTranslated,
  getSectionIconTranslated,
} from "@/components/tenant/live-editor/EditorSidebar/constants";
import { DraggableDrawerItem } from "@/services/live-editor/dragDrop";
import { getComponents, getAllComponentsTranslated, getComponentsByCategoryTranslated, ComponentType } from "@/lib/ComponentsList";
import themesComponentsList from "@/lib/themes/themesComponentsList.json";
import { BrandingSettings } from "@/components/tenant/live-editor/EditorSidebar/components/BrandingSettings";
import { ModernColorPicker } from "@/components/tenant/live-editor/EditorSidebar/components/ModernColorPicker";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LayoutGrid, Palette, Settings } from "lucide-react";
import { useEditorStore } from "@/context/editorStore";

// Animation variants
const collapseVariants = {
  hidden: { height: 0, opacity: 0 },
  show: {
    height: "auto",
    opacity: 1,
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
  },
};

const slideInFromLeft = {
  hidden: { x: "-100%", opacity: 0 },
  show: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.25, ease: "easeInOut" },
  },
  exit: {
    x: "-100%",
    opacity: 0,
    transition: { duration: 0.2, ease: "easeInOut" },
  },
};

const listContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.04,
      when: "beforeChildren",
    },
  },
};

const listItem = {
  hidden: { y: 6, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.18 } },
};

type ThemeTab = "theme1" | "theme2";
type MainTab = "components" | "branding";

// دالة لاستخراج baseName من componentName
const getBaseComponentName = (componentName: string): string => {
  // إزالة الأرقام من النهاية
  return componentName.replace(/\d+$/, "");
};

// Components List View Component
const ComponentsListView = ({
  searchTerm,
  setSearchTerm,
  activeTab,
  setActiveTab,
  isBasicComponentsDropdownOpen,
  setIsBasicComponentsDropdownOpen,
  t,
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeTab: ThemeTab;
  setActiveTab: (tab: ThemeTab) => void;
  isBasicComponentsDropdownOpen: boolean;
  setIsBasicComponentsDropdownOpen: (open: boolean) => void;
  t: any;
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );

  // الحصول على الأقسام المترجمة
  const availableSections = useMemo(() => {
    return getAvailableSectionsTranslated(t);
  }, [t]);

  // تصفية المكونات للبحث (يشمل header و footer)
  const filteredSections = useMemo(
    () =>
      availableSections.filter(
        (section) =>
          section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          section.description.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [availableSections, searchTerm],
  );

  // تصفية المكونات حسب theme المختار
  const displaySections = useMemo(() => {
    // الحصول على قائمة componentNames من theme المختار
    const themeComponentNames =
      (themesComponentsList[activeTab] as string[]) || [];
    const themeBaseNames = new Set(
      themeComponentNames.map(getBaseComponentName),
    );

    return filteredSections.filter((section) => {
      // التصفية الحالية (إزالة header و footer و inputs2 والمكونات الاساسية)
      const passesCurrentFilter =
        section.type !== "header" &&
        section.type !== "footer" &&
        section.type !== "inputs2" &&
        section.type !== "responsiveImage" &&
        section.type !== "title" &&
        section.type !== "video" &&
        section.type !== "photosGrid" &&
        section.section !== "header" &&
        section.section !== "footer" &&
        section.section !== "inputs2" &&
        !section.component?.toLowerCase().includes("header") &&
        !section.component?.toLowerCase().includes("footer") &&
        !section.component?.toLowerCase().includes("inputs2") &&
        !section.component?.toLowerCase().includes("responsiveimage") &&
        !section.component?.toLowerCase().includes("title") &&
        !section.component?.toLowerCase().includes("video") &&
        !section.component?.toLowerCase().includes("photosgrid");

      // التصفية حسب theme
      const isInTheme = themeBaseNames.has(section.component);

      return passesCurrentFilter && isInTheme;
    });
  }, [activeTab, filteredSections]);

  // الحصول على جميع الفئات الفريدة من المكونات المصفاة حسب الثيم
  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    displaySections.forEach((section) => {
      // الحصول على category من المكون
      const allComponents = getAllComponentsTranslated(t);
      const component = allComponents.find((comp) => comp.name === section.component);
      if (component?.category) {
        categories.add(component.category);
      }
    });
    const categoriesArray = Array.from(categories);
    
    // ترتيب مخصص للتصنيفات
    const categoryOrder = [
      "marketing",    // الأول - التسويق
      "banner",      // الثاني - البانرات
      "ecommerce",   // الثالث - التجارة الإلكترونية
      "content",     // الرابع - المحتوى
    ];
    
    // ترتيب التصنيفات: أولاً حسب الترتيب المخصص، ثم الباقي أبجدياً
    const sorted = categoriesArray.sort((a, b) => {
      const indexA = categoryOrder.indexOf(a);
      const indexB = categoryOrder.indexOf(b);
      
      // إذا كان كلا التصنيفين في القائمة المخصصة
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      // إذا كان فقط A في القائمة المخصصة
      if (indexA !== -1) {
        return -1;
      }
      // إذا كان فقط B في القائمة المخصصة
      if (indexB !== -1) {
        return 1;
      }
      // إذا لم يكن أي منهما في القائمة المخصصة، ترتيب أبجدي
      return a.localeCompare(b);
    });
    
    return sorted;
  }, [displaySections, t]);

  // تهيئة جميع التصنيفات كمفتوحة افتراضياً
  useEffect(() => {
    if (allCategories.length > 0 && expandedCategories.size === 0) {
      setExpandedCategories(new Set(allCategories));
    }
  }, [allCategories, expandedCategories.size]);

  // الحصول على المكونات المصفاة مقسمة حسب الفئات
  const componentsByCategory = useMemo(() => {
    const grouped: Record<string, typeof displaySections> = {};
    const allComponents = getAllComponentsTranslated(t);
    
    allCategories.forEach((category) => {
      const categoryComponents = displaySections.filter((section) => {
        const component = allComponents.find((comp) => comp.name === section.component);
        return component?.category === category;
      });
      if (categoryComponents.length > 0) {
        grouped[category] = categoryComponents;
      }
    });
    return grouped;
  }, [allCategories, displaySections, t]);

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  // الحصول على معلومات المكونات الاساسية
  const basicComponentsInfo = useMemo(() => {
    const components = getComponents(t);
    return {
      responsiveImage: components.responsiveImage,
      title: components.title,
      video: components.video,
      photosGrid: components.photosGrid,
    };
  }, [t]);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder={t("live_editor.search_components")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <svg
          className="absolute right-3 top-2.5 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Theme Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("theme1")}
          className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === "theme1"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {t("live_editor.theme_1")}
        </button>
        <button
          onClick={() => setActiveTab("theme2")}
          className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === "theme2"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {t("live_editor.theme_2")}
        </button>
      </div>

      {/* Components List */}
      <div className="overflow-y-auto max-h-[calc(100vh-300px)] space-y-3">
        {/* المكونات الاساسية Dropdown */}
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <motion.button
            onClick={() => setIsBasicComponentsDropdownOpen(!isBasicComponentsDropdownOpen)}
            className="w-full px-3 py-2 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">
                {t("live_editor.basic_components")}
              </span>
            </div>
            <motion.svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{
                rotate: isBasicComponentsDropdownOpen ? 180 : 0,
              }}
              transition={{ type: "tween", duration: 0.2 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </motion.svg>
          </motion.button>
          <AnimatePresence initial={false}>
            {isBasicComponentsDropdownOpen && (
              <motion.div
                variants={collapseVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="p-2 bg-white"
              >
                <div className="grid grid-cols-2 gap-1.5">
                  {/* ResponsiveImage */}
                  {basicComponentsInfo.responsiveImage && (
                    <DraggableDrawerItem
                      componentType="responsiveImage"
                      section="homepage"
                      data={{
                        label:
                          basicComponentsInfo.responsiveImage.displayName ||
                          "Responsive Image",
                        description:
                          basicComponentsInfo.responsiveImage.description || "",
                        icon:
                          basicComponentsInfo.responsiveImage.icon || "🖼️",
                      }}
                    >
                      <div className="p-2 border border-gray-200 rounded-md hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-grab active:cursor-grabbing">
                        <div className="flex flex-col items-center justify-center text-center space-y-1">
                          <div className="text-xl">
                            {basicComponentsInfo.responsiveImage.icon || "🖼️"}
                          </div>
                          <h3 className="font-medium text-gray-900 text-xs leading-tight">
                            {basicComponentsInfo.responsiveImage.displayName ||
                              "Responsive Image"}
                          </h3>
                        </div>
                      </div>
                    </DraggableDrawerItem>
                  )}

                  {/* Title */}
                  {basicComponentsInfo.title && (
                    <DraggableDrawerItem
                      componentType="title"
                      section="homepage"
                      data={{
                        label:
                          basicComponentsInfo.title.displayName || "Title",
                        description: basicComponentsInfo.title.description || "",
                        icon: basicComponentsInfo.title.icon || "🔠",
                      }}
                    >
                      <div className="p-2 border border-gray-200 rounded-md hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-grab active:cursor-grabbing">
                        <div className="flex flex-col items-center justify-center text-center space-y-1">
                          <div className="text-xl">
                            {basicComponentsInfo.title.icon || "🔠"}
                          </div>
                          <h3 className="font-medium text-gray-900 text-xs leading-tight">
                            {basicComponentsInfo.title.displayName || "Title"}
                          </h3>
                        </div>
                      </div>
                    </DraggableDrawerItem>
                  )}

                  {/* Video */}
                  {basicComponentsInfo.video && (
                    <DraggableDrawerItem
                      componentType="video"
                      section="homepage"
                      data={{
                        label: basicComponentsInfo.video.displayName || "Video",
                        description: basicComponentsInfo.video.description || "",
                        icon: basicComponentsInfo.video.icon || "🎥",
                      }}
                    >
                      <div className="p-2 border border-gray-200 rounded-md hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-grab active:cursor-grabbing">
                        <div className="flex flex-col items-center justify-center text-center space-y-1">
                          <div className="text-xl">
                            {basicComponentsInfo.video.icon || "🎥"}
                          </div>
                          <h3 className="font-medium text-gray-900 text-xs leading-tight">
                            {basicComponentsInfo.video.displayName || "Video"}
                          </h3>
                        </div>
                      </div>
                    </DraggableDrawerItem>
                  )}

                  {/* PhotosGrid */}
                  {basicComponentsInfo.photosGrid && (
                    <DraggableDrawerItem
                      componentType="photosGrid"
                      section="homepage"
                      data={{
                        label:
                          basicComponentsInfo.photosGrid.displayName ||
                          "Photos Grid",
                        description:
                          basicComponentsInfo.photosGrid.description || "",
                        icon: basicComponentsInfo.photosGrid.icon || "📷",
                        variant: "photosGrid1",
                      }}
                    >
                      <div className="p-2 border border-gray-200 rounded-md hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-grab active:cursor-grabbing">
                        <div className="flex flex-col items-center justify-center text-center space-y-1">
                          <div className="text-xl">
                            {basicComponentsInfo.photosGrid.icon || "📷"}
                          </div>
                          <h3 className="font-medium text-gray-900 text-xs leading-tight">
                            {basicComponentsInfo.photosGrid.displayName ||
                              "Photos Grid"}
                          </h3>
                        </div>
                      </div>
                    </DraggableDrawerItem>
                  )}

                  {/* PhotosGrid2 */}
                  {basicComponentsInfo.photosGrid && (
                    <DraggableDrawerItem
                      componentType="photosGrid"
                      section="homepage"
                      data={{
                        label:
                          t("components.photosGrid.photos_grid_2") ||
                          "Photos Grid 2",
                        description:
                          basicComponentsInfo.photosGrid.description || "",
                        icon: basicComponentsInfo.photosGrid.icon || "🖼️",
                        variant: "photosGrid2",
                      }}
                    >
                      <div className="p-2 border border-gray-200 rounded-md hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-grab active:cursor-grabbing">
                        <div className="flex flex-col items-center justify-center text-center space-y-1">
                          <div className="text-xl">
                            {basicComponentsInfo.photosGrid.icon || "🖼️"}
                          </div>
                          <h3 className="font-medium text-gray-900 text-xs leading-tight">
                            {t("components.photosGrid.photos_grid_2") ||
                              "Photos Grid 2"}
                          </h3>
                        </div>
                      </div>
                    </DraggableDrawerItem>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Components by Categories */}
        <motion.div
          variants={listContainer}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {Object.keys(componentsByCategory).length > 0 ? (
            Object.entries(componentsByCategory).map(([category, sections]) => {
              const isCategoryExpanded = expandedCategories.has(category);
              
              // Filter sections by search term (already filtered in displaySections, but double-check)
              const filteredSections = sections.filter(
                (section) =>
                  section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  section.description.toLowerCase().includes(searchTerm.toLowerCase()),
              );

              if (filteredSections.length === 0) return null;

              return (
                <motion.div
                  key={category}
                  variants={listItem}
                  className="space-y-2"
                >
                  {/* Category Header - Clickable */}
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full pb-2 pt-1 flex items-center justify-between hover:bg-gray-50 rounded-md px-1 transition-colors duration-150"
                  >
                    <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      {t(`categories.${category}.display_name`) || category}
                    </h3>
                    <motion.svg
                      className="w-4 h-4 text-gray-500 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      animate={{ rotate: isCategoryExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </motion.svg>
                  </button>
                  <div className="mt-1 h-px bg-gray-200"></div>

                  {/* Components Grid - Collapsible */}
                  <AnimatePresence initial={false}>
                    {isCategoryExpanded && (
                      <motion.div
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                          open: {
                            height: "auto",
                            opacity: 1,
                            transition: {
                              height: {
                                duration: 0.3,
                                ease: "easeInOut",
                              },
                              opacity: {
                                duration: 0.2,
                                delay: 0.1,
                              },
                            },
                          },
                          collapsed: {
                            height: 0,
                            opacity: 0,
                            transition: {
                              height: {
                                duration: 0.3,
                                ease: "easeInOut",
                              },
                              opacity: {
                                duration: 0.2,
                              },
                            },
                          },
                        }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          {filteredSections.map((section) => {
                            const themeComponentNames =
                              (themesComponentsList[activeTab] as string[]) || [];
                            const variantsForSection = themeComponentNames.filter(
                              (name) => getBaseComponentName(name) === section.component,
                            );

                            if (variantsForSection.length <= 1) {
                              const variantName =
                                variantsForSection.length === 1
                                  ? variantsForSection[0]
                                  : undefined;

                              const variantSuffix =
                                variantName &&
                                variantName.startsWith(section.component)
                                  ? variantName.slice(section.component.length)
                                  : "";
                              const displayLabel =
                                variantSuffix && variantSuffix.length > 0
                                  ? `${section.name} ${variantSuffix}`
                                  : section.name;

                              return (
                                <motion.div
                                  key={`${section.type}-${variantName || "default"}`}
                                  variants={listItem}
                                  className="group relative"
                                >
                                  <DraggableDrawerItem
                                    componentType={section.component}
                                    section={section.section}
                                    data={{
                                      label: displayLabel,
                                      description: section.description,
                                      icon: section.type,
                                      ...(variantName
                                        ? { variant: variantName }
                                        : {}),
                                    }}
                                  >
                                    <div className="p-2 border border-gray-200 rounded-md hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-grab active:cursor-grabbing">
                                      <div className="flex flex-col items-center justify-center text-center space-y-1">
                                        <div className="text-xl">
                                          {getSectionIconTranslated(section.type, t)}
                                        </div>
                                        <h3 className="font-medium text-gray-900 text-[11px] leading-tight">
                                          {displayLabel}
                                        </h3>
                                      </div>
                                    </div>
                                  </DraggableDrawerItem>
                                </motion.div>
                              );
                            }

                            return variantsForSection.map((variantName) => {
                              const variantSuffix = variantName.startsWith(
                                section.component,
                              )
                                ? variantName.slice(section.component.length)
                                : "";
                              const displayLabel =
                                variantSuffix && variantSuffix.length > 0
                                  ? `${section.name} ${variantSuffix}`
                                  : section.name;

                              return (
                                <motion.div
                                  key={`${section.type}-${variantName}`}
                                  variants={listItem}
                                  className="group relative"
                                >
                                  <DraggableDrawerItem
                                    componentType={section.component}
                                    section={section.section}
                                    data={{
                                      label: displayLabel,
                                      description: section.description,
                                      icon: section.type,
                                      variant: variantName,
                                    }}
                                  >
                                    <div className="p-2 border border-gray-200 rounded-md hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-grab active:cursor-grabbing">
                                      <div className="flex flex-col items-center justify-center text-center space-y-1">
                                        <div className="text-xl">
                                          {getSectionIconTranslated(section.type, t)}
                                        </div>
                                        <h3 className="font-medium text-gray-900 text-[11px] leading-tight">
                                          {displayLabel}
                                        </h3>
                                      </div>
                                    </div>
                                  </DraggableDrawerItem>
                                </motion.div>
                              );
                            });
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              variants={listItem}
              className="text-center py-8 text-gray-500"
            >
              <svg
                className="w-12 h-12 mx-auto mb-3 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p>{t("live_editor.no_components_found")}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Compact Branding Settings Component
const CompactBrandingSettings = () => {
  const t = useEditorT();
  const {
    WebsiteLayout,
    setWebsiteLayout,
    tempData,
    setTempData,
    updateByPath,
  } = useEditorStore();

  // Initialize branding data
  const [brandingData, setBrandingData] = useState({
    colors: {
      primary: "",
      secondary: "",
      accent: "",
    },
    mainBgColor: "",
  });

  const isInitializing = useRef(true);

  // Load branding data from WebsiteLayout
  useEffect(() => {
    isInitializing.current = true;
    if (WebsiteLayout?.branding) {
      const newBrandingData = {
        colors: {
          primary: WebsiteLayout.branding.colors?.primary || "",
          secondary: WebsiteLayout.branding.colors?.secondary || "",
          accent: WebsiteLayout.branding.colors?.accent || "",
        },
        mainBgColor: WebsiteLayout.branding.mainBgColor || "",
      };
      setBrandingData(newBrandingData);
      setTempData(newBrandingData);
      setTimeout(() => {
        setTempData(newBrandingData);
      }, 100);
    } else {
      const emptyBranding = {
        colors: {
          primary: "",
          secondary: "",
          accent: "",
        },
        mainBgColor: "",
      };
      setBrandingData(emptyBranding);
      setTempData(emptyBranding);
      setTimeout(() => {
        setTempData(emptyBranding);
      }, 100);
    }
    setTimeout(() => {
      isInitializing.current = false;
    }, 150);
  }, [WebsiteLayout, setTempData]);

  // Update tempData when brandingData changes
  useEffect(() => {
    if (!isInitializing.current) {
      setTempData(brandingData);
    }
  }, [brandingData, setTempData]);

  const handleColorChange = useCallback(
    (colorType: "primary" | "secondary" | "accent", value: string) => {
      setBrandingData((prev) => ({
        ...prev,
        colors: {
          ...prev.colors,
          [colorType]: value,
        },
      }));
    },
    [],
  );

  const handleMainBgColorChange = useCallback((value: string) => {
    setBrandingData((prev) => ({
      ...prev,
      mainBgColor: value,
    }));
  }, []);

  return (
    <div className="space-y-4">
      {/* Colors Section */}
      <div className="space-y-3  pt-5">
        <div className="p-3 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-lg border border-blue-200/50 ">
          <h4 className="text-xs font-semibold text-slate-800 mb-3">
            {t("editor_sidebar.brand_colors")}
          </h4>

          <div className="space-y-3">
            {/* Primary Color */}
            <ModernColorPicker
              label={t("editor_sidebar.primary_color")}
              value={brandingData.colors.primary}
              onChange={(color) => handleColorChange("primary", color)}
            />

            {/* Secondary Color */}
            <ModernColorPicker
              label={t("editor_sidebar.secondary_color")}
              value={brandingData.colors.secondary}
              onChange={(color) => handleColorChange("secondary", color)}
            />

            {/* Accent Color */}
            <ModernColorPicker
              label={t("editor_sidebar.accent_color")}
              value={brandingData.colors.accent}
              onChange={(color) => handleColorChange("accent", color)}
            />
          </div>
        </div>

        {/* Main Background Color */}
        <div className="p-3 bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg border border-slate-200/50">
          <h4 className="text-xs font-semibold text-slate-800 mb-3">
            {t("editor_sidebar.main_background_color")}
          </h4>

          <ModernColorPicker
            label={t("editor_sidebar.background_color")}
            value={brandingData.mainBgColor}
            onChange={handleMainBgColorChange}
          />
        </div>
      </div>
    </div>
  );
};

// Settings View Component
const SettingsView = ({ t }: { t: any }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center">
          <Settings className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">
          {t("editor_sidebar.settings") || "الإعدادات العامة"}
        </h3>
      </div>

      <div className="space-y-4">
        <div className="p-6 bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl border border-slate-200/50 shadow-lg">
          <h4 className="text-base font-semibold text-slate-800 mb-4">
            {t("editor_sidebar.general_settings") || "الإعدادات العامة"}
          </h4>
          <p className="text-sm text-slate-600">
            {t("editor_sidebar.general_settings_description") ||
              "إعدادات عامة للموقع والمكونات"}
          </p>
        </div>
      </div>
    </div>
  );
};

// Tabs Column Component (15%)
type TabsColumnProps = {
  activeMainTab: MainTab;
  setActiveMainTab: (tab: MainTab) => void;
  onTabClick: (tab: MainTab) => void;
  t: any;
};

const TabsColumn = ({ activeMainTab, setActiveMainTab, onTabClick, t }: TabsColumnProps) => {
  const handleTabClick = (tab: MainTab) => {
    setActiveMainTab(tab);
    onTabClick(tab);
  };

  return (
    <div className="w-[60px] border-r border-slate-200/60 bg-slate-50 flex flex-col py-2 gap-2 px-1 relative z-10 flex-shrink-0">
      <button
        onClick={() => handleTabClick("components")}
        className={`w-12 h-12 flex flex-col items-center justify-center gap-1 rounded-lg transition-all border  ${
          activeMainTab === "components"
            ? "bg-blue-200 text-blue-700 border-blue-200"
            : "text-slate-600 hover:bg-slate-50 border-transparent"
        }`}
      >
        <LayoutGrid className="w-4 h-4" />
        <span className={`text-xs leading-tight${activeMainTab === "components" ? " font-semibold" : ""}`}>
          {t("live_editor.components_tab")}
        </span>
      </button>
      <button
        onClick={() => handleTabClick("branding")}
        className={`w-12 h-12 flex flex-col items-center justify-center gap-1 rounded-lg transition-all border ${
          activeMainTab === "branding"
            ? "bg-blue-200 text-blue-700 border-blue-200"
            : "text-slate-600 hover:bg-slate-50 border-transparent"
        }`}
      >
        <Palette className="w-4 h-4" />
        <span className={`text-xs leading-tight${activeMainTab === "branding" ? " font-semibold" : ""}`}>
          {t("live_editor.colors_tab")}
        </span>
      </button>
    </div>
  );
};

// Tabs Content Area Component (85%)
type TabsContentAreaProps = {
  activeMainTab: MainTab;
  setActiveMainTab: (tab: MainTab) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeThemeTab: ThemeTab;
  setActiveThemeTab: (tab: ThemeTab) => void;
  isBasicComponentsDropdownOpen: boolean;
  setIsBasicComponentsDropdownOpen: (open: boolean) => void;
  t: any;
  direction: "rtl" | "ltr";
  isOpen: boolean;
};

const TabsContentArea = ({
  activeMainTab,
  setActiveMainTab,
  searchTerm,
  setSearchTerm,
  activeThemeTab,
  setActiveThemeTab,
  isBasicComponentsDropdownOpen,
  setIsBasicComponentsDropdownOpen,
  t,
  direction,
  isOpen,
}: TabsContentAreaProps) => {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="tabs-content"
          variants={collapseVariants}
          initial="hidden"
          animate="show"
          exit="exit"
          className="absolute left-[60px] top-0 right-0 bottom-0 overflow-hidden z-0"
        >
          <Tabs
            value={activeMainTab}
            onValueChange={(value) => setActiveMainTab(value as MainTab)}
            className="h-full flex flex-col"
          >
            <TabsContent
              value="components"
              className="flex-1 overflow-hidden mt-0 p-4 z-0"
            >
              <div dir={direction}>
                <ComponentsListView
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  activeTab={activeThemeTab}
                  setActiveTab={setActiveThemeTab}
                  isBasicComponentsDropdownOpen={isBasicComponentsDropdownOpen}
                  setIsBasicComponentsDropdownOpen={setIsBasicComponentsDropdownOpen}
                  t={t}
                />
              </div>
            </TabsContent>

            <TabsContent
              value="branding"
              className="flex-1 overflow-y-auto mt-0 p-2"
            >
              <div dir={direction}>
                <CompactBrandingSettings />
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

type ComponentsSidebarProps = {
  // Props removed - using Zustand store instead
};

export const ComponentsSidebar = ({}: ComponentsSidebarProps = {}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  // Get state from Zustand store
  const isTabsContentOpen = useEditorStore((s) => s.isTabsContentOpen);
  const setIsTabsContentOpen = useEditorStore((s) => s.setIsTabsContentOpen);
  const [searchTerm, setSearchTerm] = useState("");
  const [isBasicComponentsDropdownOpen, setIsBasicComponentsDropdownOpen] =
    useState(true);
  const [activeThemeTab, setActiveThemeTab] = useState<ThemeTab>("theme1");
  const [activeMainTab, setActiveMainTab] = useState<MainTab>("components");
  const t = useEditorT();
  const { locale } = useEditorLocale();
  const direction = locale === "ar" ? "rtl" : "ltr";

  const handleTabClick = (tab: MainTab) => {
    // إذا كان نفس الـ tab وكان مفتوح، أغلق الـ TabsContentArea
    if (tab === activeMainTab && isTabsContentOpen) {
      setIsTabsContentOpen(false);
    } else {
      // غير الـ tab وافتح الـ TabsContentArea
      setActiveMainTab(tab);
      setIsTabsContentOpen(true);
    }
  };

  return (
    <motion.div
      key="components-sidebar"
      variants={slideInFromLeft}
      initial="hidden"
      animate={{
        x: 0,
        opacity: 1,
        width: isTabsContentOpen ? 350 : 60,
      }}
      exit="exit"
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-15 h-full bg-gradient-to-br from-slate-50 via-white to-slate-50 border-r border-slate-200/60 flex flex-col z-30 pb-20 overflow-hidden"
    >
      {/* Main Content Area - Split into 2 columns */}
      <AnimatePresence initial={false} mode="wait">
        {isExpanded && (
          <motion.div
            key="content"
            variants={collapseVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="flex-1 overflow-hidden relative"
            layout
          >
            {/* Tabs Column - 15% */}
            <TabsColumn
              activeMainTab={activeMainTab}
              setActiveMainTab={setActiveMainTab}
              onTabClick={handleTabClick}
              t={t}
            />

            {/* Content Column - 85% */}
            <TabsContentArea
              activeMainTab={activeMainTab}
              setActiveMainTab={setActiveMainTab}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              activeThemeTab={activeThemeTab}
              setActiveThemeTab={setActiveThemeTab}
              isBasicComponentsDropdownOpen={isBasicComponentsDropdownOpen}
              setIsBasicComponentsDropdownOpen={setIsBasicComponentsDropdownOpen}
              t={t}
              direction={direction}
              isOpen={isTabsContentOpen}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
