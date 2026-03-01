# Text Control Structure — Prompt for Components

Our project is a **Website Builder and CRM**. Tenant components live in `components/tenant` and are defined in `componentsStructure`. Every component has at least one text (title, subtitle, description, etc.). Each of these texts must follow a **fixed control structure** so the Live Editor can control them consistently.

When **creating a new component** or **editing an existing one**, apply the following for every text element (title, subtitle, description, label, badge, or any user-facing text).

---

## إجباري: ربط الـ Structure بالمكوّن

**مع كل تعديل على الـ structure يجب التأكد أن الربط مع المكوّن كامل.**

- أي تغيير في الـ structure (إضافة حقل، حذف، تغيير مسار، تغيير نوع أو قيمة افتراضية) **يُلزم** التحقق من أن المكوّن المقابل في `components/tenant` يقرأ ويطبّق هذه القيم فعلياً (من الـ store أو الـ props).
- تأكد من: مسارات القراءة في المكوّن تطابق مسارات الحقول في الـ structure، وأن الحقول الخاصة بالألوان (مع `useDefaultColor` / `globalColorType`) تُحلّ في المكوّن عبر دالة موحّدة (مثل `getColor`) وليس بقراءة القيمة الخام فقط، وأن البيانات الافتراضية في المكوّن وفي الـ store (مثل `getDefaultXData`) متوافقة مع الـ structure.

---

## Important: Do not change the place of the field

**لا تغيّر مكان الحقل في الـ structure.**

- The text field (e.g. `content.title`, `content.description`) **must stay in its original place** in the structure. For example: keep `content` as an object and inside it keep `title` and `description` (and any other content fields) exactly where they are. **Do not remove them from `content` or move them elsewhere.**
- **In addition**, add the same field (by path) inside an **extra field group** so the editor shows all title/subtitle settings in one place. Use `displayAsGroup: true` and in `groupFields` include the same path (e.g. `content.title`) so the user can edit it from the group too.

So: **place in structure does not change** — `content.title` stays under `content`; we only **add** a reference to `content.title` inside the Title group’s `groupFields` for the UI. Example: in propertySlider, `content` has `title`, `description`, `viewAllText`, `viewAllUrl`; the Title/Subtitle groups then repeat `content.title` and `content.description` in their `groupFields` without moving them out of `content`.

---

## 1) Content

- The text field itself: `type: "text"` or `"textarea"` as appropriate.
- Use clear paths, e.g. `content.title`, `content.subtitle`, `content.description`, or `content.badge`.
- If the text is optional, add a visibility field such as `showTitle` / `showSubtitle` (`boolean`), preferably with `displayAsGroup` and `groupFields` (as in hero).

---

## 2) Color

- Every visible text must have a color control.
- In the structure, add a field under a suitable group (e.g. `styling`, `font`, or `typography`) with `type: "color"`.
- Prefer branding colors via:
  - `useDefaultColor: true`
  - `globalColorType: "primary" | "secondary" | "accent"`
- Example: hero title color at `content.font.title.color` with `useDefaultColor: true` and `globalColorType: "secondary"`.

---

## 3) Font Size

- There must be a way to control font size; responsive size is preferred.
- Use an object with three fields: `desktop`, `tablet`, `mobile`. Each field must be **`type: "number"`** with **`unit: "px"`** (ثابت على px). The user enters a number and the unit is always pixels.
- Example: `typography.title.fontSize` with `fields: [ { key: "desktop", type: "number", unit: "px", defaultValue: 24 }, { key: "tablet", type: "number", unit: "px", defaultValue: 20 }, { key: "mobile", type: "number", unit: "px", defaultValue: 18 } ]`.
- Path should be consistent, e.g. `content.font.title.size` or under `typography.title.fontSize` with desktop/tablet/mobile keys.

---

## 4) Font Weight (Bold)

- Control font weight (normal, bold, etc.) with a single field such as `fontWeight` or `weight` (`type: "text"`, e.g. `"400"`, `"700"`).
- Place it in the same typography group as that text (e.g. with title or subtitle).

---

## 5) Margin Around the Text

- Control spacing around the text (top, bottom, left, right as needed).
- Either one object like `spacing.margin` with `top`, `bottom`, `left`, `right`, or separate fields like `marginTop`, `marginBottom` (as in whyChooseUs, stepsSection, halfTextHalfImage).
- Values can be `type: "text"` (e.g. `"mb-10"`, `"24px"`) or `type: "number"` with `unit: "px"`.

---

## 6) Blur and Badge

- **Blur:** If the text (or its container) should have a blur/backdrop effect, add a `boolean` field such as `blur` or `blurBackdrop` (as in header) and wire it in the component to the right CSS (e.g. backdrop-filter).
- **Badge:** If the text is shown as a "badge" (blur badge or regular badge):
  - Either a separate content field like `content.badge` plus a `showBadge` (boolean), and badge colors in `styling` (e.g. `badgeColor`, `badgeBackgroundColor`, `badgeTextColor` as in projectDetails and partners).
  - Or a shape option for the text, e.g. `shapeType: "plain" | "badge"` (as in imageText) to choose normal text vs box/badge.
- In the structure, make it clear which texts can be shown in blur or badge via these fields.

---

## 7) Extra Styling (optional)

- **Typography:** Add `letterSpacing` under that text's typography group when needed (as in `title.ts`).
- **Alignment:** `textAlign` (select: left | center | right) or `alignment` when relevant.

---

## 8) Consistency with the Component (إجباري)

- Paths in the structure (e.g. `content.title`, `content.font.title.color`) must match **exactly** the data consumed by the component in `components/tenant` (from props or store).
- Every visible text must have a corresponding definition in the structure (content plus at least color; prefer size, weight, margin, and blur/badge where applicable).
- **مع كل تعديل على الـ structure:** تحقق أن المكوّن مربوط بشكل كامل — أي أن كل حقل جديد أو معدّل يُقرأ ويُطبَّق في المكوّن (والبيانات الافتراضية محدَّثة إن لزم).

---

## References in the Project

- **Full text structure (color, size, weight, spacing):** `componentsStructure/title.ts`
- **Text with grouped font (title/subtitle) and branding colors:** `componentsStructure/hero.ts` (e.g. `content.font.title`, `content.font.subtitle`)
- **Text with badge and colors:** `componentsStructure/partners.ts` (content.badge, showBadge, badgeColor), `componentsStructure/projectDetails.ts` (badgeText, badgeBackgroundColor, badgeTextColor)
- **Blur:** `componentsStructure/header.ts` (blur for backdrop)
- **Margin around text:** `componentsStructure/halfTextHalfImage.ts`, `componentsStructure/whyChooseUs.ts`, `componentsStructure/stepsSection.ts`
