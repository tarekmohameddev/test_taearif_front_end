"use client";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEditorT } from "@/context/editorI18nStore";
import {
  getAvailableSectionsTranslated,
  getSectionIconTranslated,
} from "@/components/tenant/live-editor/EditorSidebar/constants";
import { DraggableDrawerItem } from "@/services/live-editor/dragDrop";
import { getComponents } from "@/lib/ComponentsList";
import themesComponentsList from "@/lib/themes/themesComponentsList.json";

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

// دالة لاستخراج baseName من componentName
const getBaseComponentName = (componentName: string): string => {
  // إزالة الأرقام من النهاية
  return componentName.replace(/\d+$/, "");
};

export const ComponentsSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isBasicComponentsDropdownOpen, setIsBasicComponentsDropdownOpen] =
    useState(true);
  const [activeTab, setActiveTab] = useState<ThemeTab>("theme1");
  const t = useEditorT();

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
    <motion.div
      key="components-sidebar"
      variants={slideInFromLeft}
      initial="hidden"
      animate="show"
      exit="exit"
      className="fixed left-0 top-15 h-full w-64 bg-white border-r border-gray-200 flex flex-col z-30 pb-20"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">
            {t("live_editor.components")}
          </h2>
          <motion.button
            onClick={() => setIsExpanded((v) => !v)}
            className="p-1 rounded-md hover:bg-gray-100"
            whileTap={{ scale: 0.95 }}
            aria-expanded={isExpanded}
            aria-label="Toggle sidebar"
          >
            <motion.svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ rotate: isExpanded ? 180 : 0 }}
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
        </div>

        {/* Search */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              key="search"
              variants={collapseVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="relative"
              layout
            >
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Theme Tabs */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              key="tabs"
              variants={collapseVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="mt-3"
              layout
            >
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("theme1")}
                  className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                    activeTab === "theme1"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  الثيم 1
                </button>
                <button
                  onClick={() => setActiveTab("theme2")}
                  className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                    activeTab === "theme2"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  الثيم 2
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Components List - Coming Soon Overlay */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="list"
            variants={collapseVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="flex-1 overflow-y-auto p-4 relative"
            layout
          >
            <div className="relative space-y-3">
              {/* المكونات الاساسية Dropdown */}
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <motion.button
                  onClick={() => setIsBasicComponentsDropdownOpen((v) => !v)}
                  className="w-full px-3 py-2 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      المكونات الاساسية
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
                                basicComponentsInfo.responsiveImage
                                  .displayName || "Responsive Image",
                              description:
                                basicComponentsInfo.responsiveImage
                                  .description || "",
                              icon:
                                basicComponentsInfo.responsiveImage.icon ||
                                "🖼️",
                            }}
                          >
                            <div className="p-2 border border-gray-200 rounded-md hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-grab active:cursor-grabbing">
                              <div className="flex flex-col items-center justify-center text-center space-y-1">
                                <div className="text-xl">
                                  {basicComponentsInfo.responsiveImage.icon ||
                                    "🖼️"}
                                </div>
                                <h3 className="font-medium text-gray-900 text-xs leading-tight">
                                  {basicComponentsInfo.responsiveImage
                                    .displayName || "Responsive Image"}
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
                                basicComponentsInfo.title.displayName ||
                                "Title",
                              description:
                                basicComponentsInfo.title.description || "",
                              icon: basicComponentsInfo.title.icon || "🔠",
                            }}
                          >
                            <div className="p-2 border border-gray-200 rounded-md hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-grab active:cursor-grabbing">
                              <div className="flex flex-col items-center justify-center text-center space-y-1">
                                <div className="text-xl">
                                  {basicComponentsInfo.title.icon || "🔠"}
                                </div>
                                <h3 className="font-medium text-gray-900 text-xs leading-tight">
                                  {basicComponentsInfo.title.displayName ||
                                    "Title"}
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
                              label:
                                basicComponentsInfo.video.displayName ||
                                "Video",
                              description:
                                basicComponentsInfo.video.description || "",
                              icon: basicComponentsInfo.video.icon || "🎥",
                            }}
                          >
                            <div className="p-2 border border-gray-200 rounded-md hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-grab active:cursor-grabbing">
                              <div className="flex flex-col items-center justify-center text-center space-y-1">
                                <div className="text-xl">
                                  {basicComponentsInfo.video.icon || "🎥"}
                                </div>
                                <h3 className="font-medium text-gray-900 text-xs leading-tight">
                                  {basicComponentsInfo.video.displayName ||
                                    "Video"}
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
                                basicComponentsInfo.photosGrid.description ||
                                "",
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
                                basicComponentsInfo.photosGrid.description ||
                                "",
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

              {/* Other Components Grid */}
              <motion.div
                variants={listContainer}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 gap-1.5"
              >
                {displaySections.length > 0 ? (
                  displaySections.map((section) => {
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
                  })
                ) : (
                  <motion.div
                    variants={listItem}
                    className="col-span-2 text-center py-8 text-gray-500"
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
