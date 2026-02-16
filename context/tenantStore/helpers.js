// Helper function to find the first header in componentSettings
export const findFirstHeader = (componentSettings) => {
  if (!componentSettings) return null;

  for (const pageName in componentSettings) {
    const page = componentSettings[pageName];
    for (const componentId in page) {
      const component = page[componentId];
      if (
        component.type === "header" &&
        component.componentName === "header1"
      ) {
        return { id: componentId, data: component.data };
      }
    }
  }
  return null;
};

// Helper function to find the first footer in componentSettings
export const findFirstFooter = (componentSettings) => {
  if (!componentSettings) return null;

  for (const pageName in componentSettings) {
    const page = componentSettings[pageName];
    for (const componentId in page) {
      const component = page[componentId];
      if (
        component.type === "footer" &&
        component.componentName === "footer1"
      ) {
        return { id: componentId, data: component.data };
      }
    }
  }
  return null;
};
