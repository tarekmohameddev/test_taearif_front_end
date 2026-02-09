import { toast } from "react-hot-toast";
import {
  applyThemeToAllPages,
  applyDefaultThemeData,
  ThemeNumber,
} from "@/services/live-editor/themeChangeService";
import { useEditorLocale } from "@/context/editorI18nStore";

export function useThemeHandlers() {
  const { locale } = useEditorLocale();

  const handleThemeApply = async (themeNumber: ThemeNumber) => {
    try {
      await applyThemeToAllPages(themeNumber);
      toast.success(
        locale === "ar"
          ? `تم تطبيق الثيم ${themeNumber} بنجاح`
          : `Theme ${themeNumber} applied successfully`,
      );
      // Changes will be reflected automatically via useEffect in LiveEditorEffects
    } catch (error) {
      console.error("Error applying theme:", error);
      toast.error(
        locale === "ar" ? "حدث خطأ أثناء تطبيق الثيم" : "Error applying theme",
      );
      throw error;
    }
  };

  const handleThemeReset = async (themeNumber: ThemeNumber) => {
    try {
      await applyDefaultThemeData(themeNumber);
      toast.success(
        locale === "ar"
          ? `تم إعادة تعيين الثيم ${themeNumber} للبيانات الافتراضية بنجاح`
          : `Theme ${themeNumber} reset to default data successfully`,
      );
      // Changes will be reflected automatically via useEffect in LiveEditorEffects
    } catch (error) {
      console.error("Error resetting theme:", error);
      toast.error(
        locale === "ar"
          ? "حدث خطأ أثناء إعادة تعيين الثيم"
          : "Error resetting theme",
      );
      throw error;
    }
  };

  return { handleThemeApply, handleThemeReset };
}
