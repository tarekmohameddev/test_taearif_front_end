"use client";
/**
 * CollapsibleGroupRenderer — عرض مجموعة حقول قابلة للطي (مثل "إخراج من الشبكة" في imageText).
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * تنبيه مهم: قاعدة مسار الحقول الداخلية (groupFields) — لا تعدّلها
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * الحقول داخل المجموعة (groupFields) تُخزَّن في الـ store بشكل FLAT تحت نفس
 * العنصر الأب، وليس تحت كائن باسم المجموعة. مثال:
 *
 *   • خطأ (لا تفعل): تخزين تحت مفتاح المجموعة
 *     data.texts[0].breakOutGroup = { breakOut: true, breakOutAlign: "center" }
 *
 *   • صحيح: تخزين flat تحت نفس العنصر
 *     data.texts[0].breakOut = true
 *     data.texts[0].breakOutAlign = "center"
 *
 * لذلك عند استدعاء renderField للحقول الداخلية يجب تمرير مسار الأب (parentPath)
 * وليس field.key فقط. لو مرّرنا basePath = field.key (مثل "breakOut"):
 *
 *   • المسار النهائي يصبح "breakOut" في جذر بيانات المكوّن.
 *   • القراءة/الكتابة تحدث عند data.breakOut بدل data.texts[0].breakOut.
 *   • المكوّن (مثل imageText1) يقرأ من texts[i].breakOut فقط → القيمة لا تظهر أبداً.
 *   ⚠️ في هذه الحالة مكوّن imageText1 سيبوظ: "إخراج من الشبكة" و "منتصف الصف" لن يعملا.
 *
 * عند استخدام parentPath (مثل "texts.0"):
 *   • المسار النهائي يصبح "texts.0.breakOut" و "texts.0.breakOutAlign".
 *   • الشرط condition (مثل ظهور "موقع الخروج" عندما breakOut === true) يعمل بشكل صحيح.
 *
 * إذا كانت المجموعة في الجذر (normalizedPath بدون نقطة)، parentPath يكون ""
 * ونمرّر undefined كـ basePath فيبقى المسار = field.key وهو المطلوب.
 */
import React, { useState } from "react";
import { FieldDefinition } from "@/componentsStructure/types";
import { useEditorLocale, useEditorT } from "@/context/editorI18nStore";

interface CollapsibleGroupRendererProps {
  def: FieldDefinition;
  normalizedPath: string;
  value: any;
  updateValue: (path: string, value: any) => void;
  getValueByPath: (path: string) => any;
  renderField: (def: FieldDefinition, basePath?: string) => React.ReactNode;
}

export const CollapsibleGroupRenderer: React.FC<CollapsibleGroupRendererProps> = ({
  def,
  normalizedPath,
  value,
  updateValue,
  getValueByPath,
  renderField,
}) => {
  const { locale } = useEditorLocale();
  const t = useEditorT();
  const isRTL = locale === "ar";
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const key = normalizedPath;
  const isOpen = expanded[key] ?? false;
  const toggle = () => setExpanded((s) => ({ ...s, [key]: !isOpen }));

  // الحقول المعروضة داخل المجموعة (مثلاً breakOut و breakOutAlign).
  // تخزينها في الـ store يكون flat تحت مسار الأب — انظر التعليقات عند groupFields.map أدناه.
  const groupFields = (def as any).groupFields || [];

  return (
    <div
      className="group bg-white rounded-2xl border-2 border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <button
        type="button"
        onClick={toggle}
        className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
      >
        <div className="flex items-center space-x-3">
          <span className="font-bold text-slate-800">{def.label}</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-xs font-semibold text-slate-500 bg-slate-200 px-2 py-1 rounded-full">
            {groupFields.length} {t("editor_sidebar.fields")}
          </span>
          <div
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          >
            <svg
              className="w-5 h-5 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </button>
      {isOpen && (
        <div className="p-6 bg-gradient-to-b from-white to-slate-50 space-y-6 border-t border-slate-200">
          {groupFields.map((field: FieldDefinition) => {
            // ─────────────────────────────────────────────────────────────────
            // قاعدة مسار الحقول الداخلية — ضرورية لعدم تكرار مشكلة "إخراج من الشبكة"
            // ─────────────────────────────────────────────────────────────────
            // normalizedPath هنا = مسار المجموعة نفسها، مثلاً: "texts.0.breakOutGroup".
            // لا نمرّر أبداً basePath = field.key فقط (مثل "breakOut") لأن ذلك يسبب:
            //   - كتابة القيمة في جذر البيانات (data.breakOut) بدل (data.texts[0].breakOut).
            //   - المكوّنات التي تقرأ من texts[i].breakOut لن ترى القيمة → الميزة "لا تخرج".
            //   ⚠️ في هذه الحالة مكوّن imageText1 سيبوظ (إخراج من الشبكة / منتصف الصف لن يعملا).
            // نستخرج مسار الأب بإزالة آخر جزء من normalizedPath:
            //   "texts.0.breakOutGroup" → parentPath = "texts.0"
            // ثم نمرّر parentPath كـ basePath لـ renderField فيبني المسارات الصحيحة:
            //   "texts.0.breakOut" و "texts.0.breakOutAlign".
            // إذا كانت المجموعة في الجذر (مثلاً normalizedPath = "breakOutGroup") فإن
            // parentPath = "" ونمرّر undefined فيبقى مسار الحقل = field.key (صحيح للجذر).
            // ─────────────────────────────────────────────────────────────────
            const parentPath =
              normalizedPath && normalizedPath.includes(".")
                ? normalizedPath.split(".").slice(0, -1).join(".")
                : "";
            const basePath = parentPath || undefined;

            return (
              <div key={field.key} className="space-y-2">
                {renderField(field, basePath)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
