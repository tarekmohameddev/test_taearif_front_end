// ============================================================================
// Hook for managing device selection and dimensions
// ============================================================================

import { useState, useEffect } from "react";
import type { DeviceType } from "../types";
import { getDeviceDimensions } from "../constants";
import { useEditorT } from "@/context/editorI18nStore";
import { useEditorStore } from "@/context/editorStore";

interface UseDeviceManagementProps {
  pageComponents: any[];
  state: any;
}

export function useDeviceManagement({
  pageComponents,
  state,
}: UseDeviceManagementProps) {
  const t = useEditorT();
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>("laptop");
  const [screenWidth, setScreenWidth] = useState(0);
  const deviceDimensions = getDeviceDimensions(t);

  // تتبع عرض الشاشة
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // تعيين العرض الأولي
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // دالة تغيير الجهاز مع إعادة تصيير المكونات المحددة
  const handleDeviceChange = (device: DeviceType) => {
    setSelectedDevice(device);

    // إعادة تصيير المكونات المحددة عند تغيير الجهاز
    setTimeout(() => {
      const {
        componentsToRefresh,
      } = require("@/lib/refreshComponents.js");

      // إعادة تصيير المكونات المحددة
      componentsToRefresh.forEach((componentName: string) => {
        // البحث عن المكونات في pageComponents وإعادة تصييرها
        const componentsToUpdate = pageComponents.filter(
          (comp: any) => comp.componentName === componentName,
        );

        if (componentsToUpdate.length > 0) {
          // إضافة forceUpdate للمكونات المحددة
          const updatedComponents = pageComponents.map((comp: any) => {
            if (componentsToRefresh.includes(comp.componentName)) {
              return {
                ...comp,
                forceUpdate: Date.now(), // إضافة timestamp لإجبار إعادة التصيير
                deviceType: device, // تحديث نوع الجهاز
              };
            }
            return comp;
          });

          // تحديث الحالة
          state.setPageComponents(updatedComponents);

          // تحديث pageComponentsByPage في الـ store
          setTimeout(() => {
            const store = useEditorStore.getState();
            const currentPage = store.currentPage;
            store.forceUpdatePageComponents(currentPage, updatedComponents);
          }, 0);
        }
      });
    }, 100); // تأخير قصير لضمان تحديث الحالة
  };

  return {
    selectedDevice,
    setSelectedDevice,
    handleDeviceChange,
    deviceDimensions,
    screenWidth,
  };
}
