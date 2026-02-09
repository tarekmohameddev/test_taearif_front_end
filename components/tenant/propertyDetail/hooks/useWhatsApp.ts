import { propertyDetailProps } from "../types/types";

export const useWhatsApp = (
  tenantData: any,
  whatsApp?: propertyDetailProps["whatsApp"],
  displaySettings?: propertyDetailProps["displaySettings"],
  content?: propertyDetailProps["content"],
) => {
  const getWhatsAppData = () => {
    if (tenantData?.StaticPages?.property?.components) {
      const components = Array.isArray(tenantData.StaticPages.property.components)
        ? tenantData.StaticPages.property.components
        : tenantData.StaticPages.property.components;

      if (Array.isArray(components)) {
        const propertyDetailComponent = components.find(
          (comp: any) =>
            comp.componentName === "propertyDetail1" ||
            comp.type === "propertyDetail",
        );
        if (propertyDetailComponent?.data?.whatsApp) {
          return {
            showButton:
              propertyDetailComponent.data.whatsApp.showButton || false,
            buttonText:
              propertyDetailComponent.data.whatsApp.buttonText ||
              "استفسار عن طريق الواتساب",
            phoneNumber:
              propertyDetailComponent.data.whatsApp.phoneNumber || "",
          };
        }
      }
    }

    if (whatsApp) {
      return {
        showButton: whatsApp.showButton || false,
        buttonText: whatsApp.buttonText || "استفسار عن طريق الواتساب",
        phoneNumber: whatsApp.phoneNumber || "",
      };
    }

    return {
      showButton: displaySettings?.showWhatsAppButton || false,
      buttonText: content?.whatsAppButtonText || "استفسار عن طريق الواتساب",
      phoneNumber: content?.whatsAppPhoneNumber || "",
    };
  };

  return getWhatsAppData();
};
