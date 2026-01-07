// قائمة المكونات التي يجب توسيطها أفقياً
export const COMPONENTS_TO_CENTER = [
  "halfTextHalfImage1",
  "propertySlider1",
  "ctaValuation1",
  "whyChooseUs1",
  "grid1",
  "inputs1",
  "inputs2",
  "halfTextHalfImage3",
  "video1",
  "photosGrid1",
  "photosGrid2",
  "responsiveImage1",
  "title1",
];

// دالة للتحقق من ما إذا كان المكون يحتاج للتوسيط
export const shouldCenterComponent = (componentName) => {
  if (!componentName || typeof componentName !== "string") {
    return false;
  }

  return COMPONENTS_TO_CENTER.includes(componentName);
};

// دالة لإنشاء wrapper للمكونات التي تحتاج للتوسيط
export const getCenterWrapperClasses = (componentName) => {
  if (shouldCenterComponent(componentName)) {
    return "w-full center-component-wrapper";
  }
  return "";
};

// دالة للحصول على الستايل المناسب للمكونات المتوسطة
export const getCenterWrapperStyles = (componentName) => {
  if (shouldCenterComponent(componentName)) {
    return {
      width: "100%",
      boxSizing: "border-box",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
    };
  }
  return {};
};
