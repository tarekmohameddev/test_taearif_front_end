# Theme3 Editor Support — Summary for Future Updates

This document summarizes the Live Editor support added for **Theme3** components (and HeroBanner) so you can understand the behavior and extend or fix it in the future. **Do not modify** `stories/Theme1/` or the shared `stories/Text/` component API.

---

## 1. What Was Implemented

### Scope

- **Theme3 components** (from `lib/themes/themesComponentsList.json` → `theme3`):  
  heroBanner1, commitmentSection1, creativityTriadSection1, essenceSection1, featuresSection1, journeySection1, landInvestmentFormSection1, philosophyCtaSection1, quoteSection1, projectsHeader1, projectsShowcase1, valuesSection1, contactForm1, **header3**, **footer3**.
- **In scope:** Default *TextProps in default data and structure; sidebar uses `getComponentData` + seed when store is empty; `getData` / `ensureVariant` / `updateByPath` merge with defaults; canvas recomputes when store changes. The shared **Text** component is used via *TextProps only (no new drag-and-drop “Text” component).
- **Out of scope:** No changes under `stories/Theme1/`. No changes to the shared `stories/Text/` component API.

---

## 2. HeroBanner-Specific (Video + Fallback Image + Text)

### 2.1 Video and fallback image behavior

- **Where:** `stories/HeroBanner/HeroBanner.tsx`
- **Logic:**
  - **Video** is shown only when `videoSrc` is non-empty (not null/undefined and not blank string). If the user clears the video URL in the sidebar, the component does **not** show a default video.
  - **Fallback image** is used when there is **no** video URL: the fallback image is shown as the full background. If both video URL is empty and `fallbackImage` is set, only the fallback image is shown.
- **Implementation:** `hasVideo = videoSrc != null && String(videoSrc).trim() !== ""`. If `hasVideo` → render `<video>`. Else if `fallbackImage` → render background div with `backgroundImage: url(fallbackImage)`. Else → no background.

### 2.2 Default data and merge (store)

- **Where:** `context/editorStoreFunctions/heroBannerFunctions.ts`
- **Default data:** `getDefaultHeroBannerData()` includes `videoSrc: DEFAULTS.videoSrc`, `fallbackImage: undefined`, and full `titleTextProps`, `subtitleTextProps`, `descriptionTextProps`.
- **mergeWithDefaults(stored):** Top-level: `defaultData` then `stored` (so stored wins for `videoSrc`, `fallbackImage`, etc.). For each *TextProps and for `primaryCta`/`secondaryCta`, nested merge: default object then stored object. So:
  - Changing or clearing `videoSrc` / `fallbackImage` in the sidebar is persisted and not overwritten by defaults.
  - Text props always have a full shape (default + any overrides from store).

### 2.3 Sidebar and seed

- **Where:** `components/tenant/live-editor/EditorSidebar/hooks/useEditorSidebarData.ts`
- For `heroBanner` (and all theme3 types): `tempData` is set from `store.getComponentData(type, uniqueVariantId)` so the sidebar always sees merged data (defaults + stored).
- If the **raw** store entry for that component is empty, the code calls `store.setComponentData(..., seedData)` so the first save persists full defaults (including text props and video/fallback fields).

### 2.4 Canvas updates when editing in sidebar

- **Where:** `components/tenant/live-editor/LiveEditorUI/hooks/useBackendDataState.ts` and `LiveEditorUI/index.tsx`
- The canvas uses `mergedData` that comes from `getComponentData`. So when you change video URL or fallback image in the sidebar, the canvas must recompute.
- **Fix:** `LiveEditorUI` subscribes to `heroBannerStates` (and all other theme3 component states) and passes them into `useBackendDataState`. The hook has refs and dependency checks so that when any of these states change, it recomputes `componentsWithMergedData`. That way the iframe/canvas receives new `mergedData` and the HeroBanner (and other theme3 components) re-render with the new video/fallback/text values.

---

## 3. Theme3-Wide Pattern (All Listed Components)

### 3.1 Shared text-style fields

- **File:** `componentsStructure/sharedTextStyleFields.ts`
- **Content:** One shared array of field definitions (fontFamily, fontSize, fontWeight, color, textAlign, margin, padding, etc.) used for any *TextProps in the editor (e.g. headingTextProps, descriptionTextProps).
- **Usage:** `componentsStructure/heroBanner.ts` and every theme3 component structure import `sharedTextStyleFields` and use it for object fields like `{ key: "headingTextProps", label: "Heading Style", type: "object", fields: sharedTextStyleFields }`.

### 3.2 EditorStoreFunctions (*Functions.ts)

For each theme3 component (e.g. commitmentSection, essenceSection, … contactForm, and for **header** → header3, **footer** → footer3):

- **getDefault*Data():** Includes default values for every *TextProps from the component’s types (from `stories/.../types`). Can be `{}` if no story default is defined.
- **mergeWithDefaults(stored):** Returns `{ ...defaultData, ...stored }` with **nested merge** for each *TextProps (and any nested objects like primaryCta). So a single-field edit in the sidebar does not drop other keys.
- **ensureVariant:** If stored data exists, merge it with full default data and **write back** (do not return early with no update). New instances use `initial || tempData || defaultData`.
- **getData:** Returns `mergeWithDefaults(state.*States?.[variantId] || {})` so the sidebar and canvas always see a full shape.
- **updateByPath:** Build full source with `mergeWithDefaults(stored)`, then `updateDataByPath(fullSource, path, value)` and set the result in the component state. Ensures videoSrc, fallbackImage, or any single field edit does not drop other fields.

### 3.3 Component structure (componentsStructure/*.ts)

- For each *TextProps in the component’s types, the variant’s `fields` array has an object field: `key: "headingTextProps"`, `label: "Heading Style"`, `type: "object"`, `fields: sharedTextStyleFields`.
- Optionally, `simpleFields` includes a few dot paths (e.g. `headingTextProps.fontSize`, `headingTextProps.color`) for quick access in the sidebar.

### 3.4 Sidebar: getComponentData + seed

- **File:** `useEditorSidebarData.ts`
- **THEME3_COMPONENT_TYPES:** A set of all theme3 component types (heroBanner, commitmentSection, … contactForm, header, footer).
- **THEME3_TYPE_TO_STATE_KEY:** Map from component type to store state key (e.g. `"commitmentSection"` → `"commitmentSectionStates"`).
- For `selectedComponent.type` in that set:
  - Set `tempData` from `store.getComponentData(selectedComponent.type, uniqueVariantId)`.
  - If the raw store entry (e.g. `store.commitmentSectionStates[uniqueVariantId]`) is empty, call `store.setComponentData(..., seedData)` so the first save persists full defaults.

### 3.5 Canvas: recompute when store changes

- **useBackendDataState.ts:** For each theme3 component state (heroBannerStates, commitmentSectionStates, … headerStates, footerStates), the hook keeps a ref of the previous JSON.stringify value and includes it in the “if nothing changed” check. When any of these states change, the effect runs and recomputes `componentsWithMergedData` (which uses `getComponentData`), so the canvas shows updated values.
- **LiveEditorUI/index.tsx:** Subscribes to all of the above store states and passes them into `useBackendDataState` so the hook receives new references when the user edits any theme3 component in the sidebar.

---

## 4. Theme3 Components List (Stories)

| Component type           | Variant ID                  | *TextProps (examples)                                                                 |
|--------------------------|-----------------------------|---------------------------------------------------------------------------------------|
| heroBanner               | heroBanner1                 | titleTextProps, subtitleTextProps, descriptionTextProps                               |
| commitmentSection        | commitmentSection1          | roleLabelTextProps, nameTextProps, headingTextProps, quoteTextProps                   |
| creativityTriadSection   | creativityTriadSection1     | headingTextProps, introTextProps, cardTitleTextProps, cardDescriptionTextProps       |
| essenceSection           | essenceSection1             | headingTextProps, leadTextProps, bodyTextProps                                        |
| featuresSection          | featuresSection1            | headingTextProps, featureTitleTextProps, featureDescriptionTextProps, certificationTextProps |
| journeySection           | journeySection1             | headingTextProps, journeyLabelTextProps, stepTitleTextProps, stepDurationTextProps, stepDescriptionTextProps |
| landInvestmentFormSection| landInvestmentFormSection1  | headingTextProps, descriptionTextProps                                               |
| philosophyCtaSection     | philosophyCtaSection1       | headingTextProps, descriptionTextProps, ctaTextProps                                  |
| quoteSection             | quoteSection1               | quoteTextProps, nameTextProps, roleTextProps                                          |
| projectsHeader           | projectsHeader1             | headingTextProps, descriptionTextProps                                               |
| projectsShowcase         | projectsShowcase1           | filterButtonTextProps, statusBadgeTextProps, projectTitleTextProps, … ctaTextProps   |
| valuesSection            | valuesSection1              | headingTextProps, descriptionTextProps, cardTitleTextProps, cardDescriptionTextProps  |
| contactForm              | contactForm1                | headingTextProps, descriptionTextProps                                               |
| header                   | header3                     | navLinkTextProps, languageToggleTextProps, ctaTextProps                                |
| footer                   | footer3                     | addressLabelTextProps, addressValueTextProps, emailTextProps, linksHeadingTextProps, socialHeadingTextProps, copyrightTextProps |

All of these use the shared **Text** component from `stories/Text/`; they only pass *TextProps from props. Tenant wrappers (e.g. `essenceSection1.tsx`) pass `mergedData.*TextProps`; no change to the shared Text API.

---

## 5. Files Touched (Quick Reference)

| Area              | Files |
|-------------------|-------|
| Shared structure  | `componentsStructure/sharedTextStyleFields.ts`; `heroBanner.ts` (import shared fields). |
| Functions         | `context/editorStoreFunctions/heroBannerFunctions.ts` (video/fallback + merge); same pattern in *Functions.ts for commitmentSection, creativityTriadSection, essenceSection, featuresSection, journeySection, landInvestmentFormSection, philosophyCtaSection, quoteSection, projectsHeader, projectsShowcase, valuesSection, contactForm, header, footer. |
| Structure         | `componentsStructure/*.ts` for the same list (add *TextProps object fields + optional simpleFields). |
| Sidebar           | `components/tenant/live-editor/EditorSidebar/hooks/useEditorSidebarData.ts` (THEME3_COMPONENT_TYPES, THEME3_TYPE_TO_STATE_KEY, getComponentData + seed). |
| Canvas            | `components/tenant/live-editor/LiveEditorUI/hooks/useBackendDataState.ts` (deps on all theme3 states); `LiveEditorUI/index.tsx` (subscribe and pass those states). |
| Story (video/fallback) | `stories/HeroBanner/HeroBanner.tsx` (video only when videoSrc non-empty; else fallback image as background). |
| Update logs       | `docs/updates/tenantWebsite/heroBanner.txt`; `docs/updates/tenantWebsite/theme3-editor-defaults.txt`. |

---

## 6. For Future Updates

- **Adding a new Theme3 component:**  
  Add default *TextProps to `getDefault*Data()`, implement `mergeWithDefaults`, use it in `getData` and `updateByPath`, and in `ensureVariant` merge when stored exists. Add *TextProps object fields to the component structure with `sharedTextStyleFields`. Add the component type to `THEME3_COMPONENT_TYPES` and `THEME3_TYPE_TO_STATE_KEY` in `useEditorSidebarData.ts`. Add the component’s state to `useBackendDataState` (ref + dependency) and subscribe in `LiveEditorUI/index.tsx`.

- **Video or fallback not updating on canvas:**  
  Ensure the component type is in the theme3 set and its store state is subscribed in `LiveEditorUI` and passed to `useBackendDataState`, and that `getComponentData` is used for `mergedData` (so store updates flow to the iframe).

- **Default video showing when URL is cleared:**  
  In the **story** component (e.g. `HeroBanner.tsx`), do not use a default video when `videoSrc` is empty. Use `hasVideo = videoSrc != null && String(videoSrc).trim() !== ""` and render video only when `hasVideo`; otherwise show fallback image if provided.

- **Text styles or defaults not visible in sidebar:**  
  Ensure `getData` returns `mergeWithDefaults(stored)` and the sidebar uses `getComponentData` for that type; seed when raw store is empty so first save persists defaults.
