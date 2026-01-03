import { ComponentInstance } from "@/lib/types";

// تعريف معلومات مؤشر الإفلات
export interface DropIndicator {
  targetId: string;
  position: "top" | "bottom" | "left" | "right" | "between-rows";
  insertAtRow?: number; // رقم الصف الجديد الذي سيتم إدراج المكون به
}

// دالة مساعدة لتطبيق منطق التوسع التلقائي
export const applyAutoExpandLogic = (
  components: ComponentInstance[],
): ComponentInstance[] => {
  const componentsByRow = components.reduce<
    Record<number, ComponentInstance[]>
  >((acc, component) => {
    const row = component.layout?.row || 0;
    if (!acc[row]) acc[row] = [];
    acc[row].push(component);
    return acc;
  }, {});

  return components.map((component) => {
    const newComponent = { ...component };
    const row = component.layout?.row || 0;
    const componentsInRow = componentsByRow[row] || [];

    // إذا كان المكون في عمود واحد فقط
    if (newComponent.layout && newComponent.layout.span === 1) {
      // تحقق من وجود مكون آخر في نفس الصف
      const otherComponentsInRow = componentsInRow.filter(
        (c) => c.id !== component.id,
      );
      const hasComponentInOtherColumn = otherComponentsInRow.some(
        (c) => c.layout && c.layout.row === component.layout?.row,
      );

      // إذا لم يكن هناك مكون آخر في نفس الصف، اجعل هذا المكون يأخذ العمودين
      if (!hasComponentInOtherColumn) {
        newComponent.layout = {
          ...newComponent.layout,
          span: 2,
          col: 0,
        };
      }
    }

    return newComponent;
  });
};

// دالة معالجة نهاية السحب
export const handleDragEnd = (
  event: any,
  pageComponents: ComponentInstance[],
  dropIndicator: DropIndicator | null,
  setPageComponents: (
    updater: (components: ComponentInstance[]) => ComponentInstance[],
  ) => void,
) => {
  const { active, over } = event;

  if (!over || !dropIndicator || active.id === over.id) {
    return;
  }

  setPageComponents((components) => {
    const newComponents = [...components];
    const activeIndex = newComponents.findIndex((c) => c.id === active.id);

    if (activeIndex === -1) return components;

    const activeComponent = { ...newComponents[activeIndex] };
    const { position, insertAtRow } = dropIndicator;

    // إزالة المكون المسحوب مؤقتًا من المصفوفة
    newComponents.splice(activeIndex, 1);

    // إذا كان الإفلات بين الصفوف
    if (position === "between-rows" && insertAtRow !== undefined) {
      // إزاحة كل المكونات التي في الصف المحدد أو بعده لأسفل
      newComponents.forEach((c) => {
        if (c.layout && c.layout.row >= insertAtRow) {
          c.layout.row += 1;
        }
      });

      // وضع المكون في الصف الجديد
      activeComponent.layout = {
        row: insertAtRow,
        col: 0,
        span: 2, // يأخذ عرض كامل
      };

      newComponents.push(activeComponent);
    } else {
      // الإفلات العادي على مكون موجود
      const overIndex = newComponents.findIndex((c) => c.id === over.id);
      if (overIndex === -1) return components;

      const overComponent = { ...newComponents[overIndex] };

      if (position === "left" || position === "right") {
        // تحقق من أن المكون المستهدف يأخذ العرض الكامل قبل التقسيم
        if (overComponent.layout && overComponent.layout.span === 2) {
          // تقسيم المكون المستهدف إلى عمودين
          overComponent.layout.span = 1;
          overComponent.layout.col = position === "left" ? 1 : 0;

          activeComponent.layout = {
            row: overComponent.layout.row,
            col: position === "left" ? 0 : 1,
            span: 1,
          };

          // تحديث المكون المستهدف وإضافة المكون المسحوب
          const targetIndex = newComponents.findIndex((c) => c.id === over.id);
          newComponents.splice(targetIndex, 1, overComponent, activeComponent);
        } else if (overComponent.layout && overComponent.layout.span === 1) {
          // إذا كان المكون المستهدف يأخذ عموداً واحداً، استبدل موقعه
          activeComponent.layout = {
            row: overComponent.layout.row,
            col: overComponent.layout.col, // نفس العمود
            span: 1,
          };

          // ابحث عن المكون الآخر في نفس الصف إن وجد
          const otherComponentInRow = newComponents.find(
            (c) =>
              c.id !== over.id &&
              c.layout &&
              c.layout.row === overComponent.layout?.row,
          );

          if (otherComponentInRow && otherComponentInRow.layout) {
            // إذا كان هناك مكون آخر، ضع المكون المسحوب في العمود المقابل
            activeComponent.layout.col =
              otherComponentInRow.layout.col === 0 ? 1 : 0;
          }

          // إدراج المكون المسحوب في الموضع الصحيح بدلاً من إضافته في النهاية
          const targetIndex = newComponents.findIndex((c) => c.id === over.id);
          newComponents.splice(targetIndex, 0, activeComponent);
        }
      } else if (position === "top" || position === "bottom") {
        // إضافة المكون كصف جديد فوق أو تحت المكون المستهدف
        const newRowIndex =
          position === "top"
            ? overComponent.layout?.row || 0
            : (overComponent.layout?.row || 0) + 1;

        // إزاحة كل المكونات التالية لأسفل
        newComponents.forEach((c) => {
          if (c.layout && c.layout.row >= newRowIndex) {
            c.layout.row += 1;
          }
        });

        activeComponent.layout = {
          row: newRowIndex,
          col: 0,
          span: 2, // يأخذ عرض كامل عند وضعه في صف جديد
        };

        // إدراج المكون في الموضع الصحيح بدلاً من إضافته في النهاية
        const targetIndex = newComponents.findIndex((c) => c.id === over.id);
        const insertIndex = position === "top" ? targetIndex : targetIndex + 1;
        newComponents.splice(insertIndex, 0, activeComponent);
      }
    }

    // إعادة ترتيب الصفوف لتكون متسلسلة
    const sorted = newComponents.sort(
      (a, b) =>
        (a.layout?.row || 0) - (b.layout?.row || 0) ||
        (a.layout?.col || 0) - (b.layout?.col || 0),
    );
    const uniqueRows = [...new Set(sorted.map((c) => c.layout?.row || 0))].sort(
      (a, b) => a - b,
    );

    // تطبيق التوسع التلقائي بعد إعادة الترتيب
    const finalComponents = sorted.map((c, index) => ({
      ...c,
      position: index, // تحديث position أيضاً
      layout: c.layout
        ? {
            ...c.layout,
            row: uniqueRows.indexOf(c.layout.row),
          }
        : undefined,
    }));

    // تطبيق منطق التوسع التلقائي باستخدام الدالة المساعدة
    return applyAutoExpandLogic(finalComponents);
  });
};

// دالة معالجة السحب فوق منطقة
export const handleDragOver = (
  event: any,
  pageComponents: ComponentInstance[],
  setDropIndicator: (indicator: DropIndicator | null) => void,
) => {
  const { active, over } = event;

  if (!over) {
    setDropIndicator(null);
    return;
  }

  // إذا كان الهدف هو منطقة بين الصفوف
  if (over.id.toString().startsWith("row-gap-")) {
    const rowIndex = parseInt(over.id.toString().replace("row-gap-", ""));
    setDropIndicator({
      targetId: over.id as string,
      position: "between-rows",
      insertAtRow: rowIndex,
    });
    return;
  }

  if (active.id === over.id) {
    setDropIndicator(null);
    return;
  }

  const overNode = over.rect;
  const dragNode = active.rect.current.translated;

  if (!dragNode) {
    setDropIndicator(null);
    return;
  }

  const dropY = dragNode.top + dragNode.height / 2;
  const overY = overNode.top + overNode.height / 2;

  const dropX = dragNode.left + dragNode.width / 2;
  const overX = overNode.left + overNode.width / 2;

  const overComponent = pageComponents.find((c) => c.id === over.id);
  if (!overComponent) {
    setDropIndicator(null);
    return;
  }

  // تحديد نوع الإفلات بناءً على حجم المكون المستهدف
  if (overComponent.layout?.span === 2) {
    // إذا كان المكون يأخذ العرض الكامل، يمكن تقسيمه يساراً أو يميناً
    const isLeftHalf = dropX < overNode.left + overNode.width / 2;
    if (isLeftHalf) {
      setDropIndicator({ targetId: over.id as string, position: "left" });
    } else {
      setDropIndicator({ targetId: over.id as string, position: "right" });
    }
  } else if (overComponent.layout?.span === 1) {
    // إذا كان المكون يأخذ نصف العرض، يمكن:
    // 1. استبدال موقعه (left/right)
    // 2. وضعه فوقه أو تحته (top/bottom)

    const horizontalThreshold = overNode.width * 0.3; // 30% من العرض
    const verticalThreshold = overNode.height * 0.3; // 30% من الارتفاع

    const distanceFromLeft = dropX - overNode.left;
    const distanceFromRight = overNode.right - dropX;
    const distanceFromTop = dropY - overNode.top;
    const distanceFromBottom = overNode.bottom - dropY;

    // إذا كان قريباً من اليسار أو اليمين
    if (distanceFromLeft < horizontalThreshold) {
      setDropIndicator({ targetId: over.id as string, position: "left" });
    } else if (distanceFromRight < horizontalThreshold) {
      setDropIndicator({ targetId: over.id as string, position: "right" });
    } else if (distanceFromTop < verticalThreshold) {
      setDropIndicator({ targetId: over.id as string, position: "top" });
    } else if (distanceFromBottom < verticalThreshold) {
      setDropIndicator({ targetId: over.id as string, position: "bottom" });
    } else {
      // في الوسط، استخدم الاتجاه الأقرب
      const isLeftHalf = dropX < overNode.left + overNode.width / 2;
      setDropIndicator({
        targetId: over.id as string,
        position: isLeftHalf ? "left" : "right",
      });
    }
  }
};

// دالة تجميع المكونات حسب الصفوف
export const groupComponentsByRow = (pageComponents: ComponentInstance[]) => {
  return pageComponents.reduce<Record<number, ComponentInstance[]>>(
    (acc, component) => {
      const row = component.layout?.row || 0;
      if (!acc[row]) acc[row] = [];
      acc[row].push(component);
      return acc;
    },
    {},
  );
};

// دالة فرز الصفوف والمكونات مع تطبيق منطق التوسع التلقائي
export const sortRowsWithAutoExpand = (
  componentsByRow: Record<number, ComponentInstance[]>,
) => {
  const rows = Object.values(componentsByRow)
    .sort((a, b) => (a[0].layout?.row || 0) - (b[0].layout?.row || 0))
    .map((componentsInRow) => {
      const sortedComponents = componentsInRow.sort(
        (a, b) => (a.layout?.col || 0) - (b.layout?.col || 0),
      );

      // تطبيق منطق التوسع التلقائي باستخدام الدالة المساعدة
      const expandedComponents = applyAutoExpandLogic(sortedComponents);

      return {
        rowKey: componentsInRow[0].layout?.row || 0,
        components: expandedComponents,
      };
    });

  return rows;
};
