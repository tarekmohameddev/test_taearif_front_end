# Zustand Stores - جميع الاستدعاءات والعلاقات

## 1. editorStore

**الموقع**: `context-liveeditor\editorStore.ts`

### States الموجودة:

- showDialog
- openSaveDialogFn
- hasChangesMade
- currentPage
- tempData
- globalHeaderData
- globalFooterData
- globalHeaderVariant
- globalFooterVariant
- globalComponentsData
- WebsiteLayout
- themeBackup
- themeBackupKey
- themeChangeTimestamp
- structures
- componentStates
- componentGetters
- pageComponentsByPage
- heroStates
- headerStates
- footerStates
- halfTextHalfImageStates
- propertySliderStates
- ctaValuationStates
- stepsSectionStates
- testimonialsStates
- propertiesShowcaseStates
- card4States
- card5States
- logosTickerStates
- partnersStates
- whyChooseUsStates
- contactMapSectionStates
- gridStates
- filterButtonsStates
- propertyFilterStates
- mapSectionStates
- contactFormSectionStates
- contactCardsStates
- applicationFormStates
- inputsStates
- inputs2States
- imageTextStates
- contactUsHomePageStates
- blogsSectionsStates
- titleStates
- responsiveImageStates
- photosGridStates
- videoStates

### الاستدعاءات والاستخدامات:

#### 1. Import Statement

```typescript
import { useEditorStore } from "@/context-liveeditor/editorStore";
```

**المواقع**:

- `components\tenant\footer\footer2.tsx` (line 9)
- `components\tenant\hero\hero4.tsx` (line 6)
- `components\tenant\title\title1.tsx` (line 4)
- `components\tenant\photosGrid\photosGrid1.tsx` (line 4)
- `components\tenant\propertiesShowcase\propertiesShowcase1.tsx` (line 7)
- `components\tenant\live-editor\LiveEditorUI\index.tsx` (line 4)
- `components\tenant\live-editor\EditorSidebar\index.tsx` (line 88-112)
- `components\tenant\live-editor\LiveEditorEffects.tsx` (line 4)
- `app\live-editor\layout.tsx` (line 6)
- `context-liveeditor\EditorProvider.tsx` (line 7)
- `services-liveeditor\live-editor\themeChangeService.ts` (line 1)
- `services-liveeditor\live-editor\stateService.ts` (line 2)
- `components\tenant\inputs\inputs1.tsx` (line 276-280)
- `components\tenant\stepsSection\stepsSection1.tsx` (line 330-334)
- `components\tenant\global\GlobalLayout.tsx` (line 51-56)
- `components\tenant\halfTextHalfImage\halfTextHalfImage6.tsx` (line 5)
- `components\tenant\halfTextHalfImage\halfTextHalfImage7.tsx` (line 5)
- `components\tenant\header\StaticHeader1.tsx` (line 14)
- `components\tenant\header\header2.tsx` (line 11)

#### 2. استخدامات محددة للـ States:

##### showDialog

```typescript
const { showDialog, closeDialog, openSaveDialogFn } = useEditorStore();
```

**الموقع**: `context-liveeditor\EditorProvider.tsx` (line 12)

##### openSaveDialogFn

```typescript
const { showDialog, closeDialog, openSaveDialogFn } = useEditorStore();
openSaveDialogFn();
```

**الموقع**: `context-liveeditor\EditorProvider.tsx` (line 12, 19)

```typescript
useEditorStore.getState().setOpenSaveDialog(saveFn);
```

**الموقع**: `components\tenant\live-editor\LiveEditorEffects.tsx` (line 424)

##### hasChangesMade

```typescript
const hasChangesMade = useEditorStore((s) => s.hasChangesMade);
```

**الموقع**: `components\tenant\live-editor\LiveEditorUI\index.tsx` (line 498)

```typescript
const hasChangesMade = useEditorStore((s) => s.hasChangesMade);
```

**الموقع**: `app\live-editor\layout.tsx` (line 3501)

##### currentPage

```typescript
useEditorStore.getState().setCurrentPage(slug);
```

**الموقع**: `components\tenant\live-editor\LiveEditorEffects.tsx` (line 413)

##### tempData

```typescript
const { tempData, setTempData, updateTempField, updateByPath } =
  useEditorStore();
```

**الموقع**: `components\tenant\live-editor\EditorSidebar\index.tsx` (line 89-92)

##### globalHeaderData

```typescript
const globalHeaderData = useEditorStore((s) => s.globalHeaderData);
```

**الموقع**: `components\tenant\live-editor\LiveEditorUI\index.tsx` (line 487)

```typescript
const { globalHeaderData, setGlobalHeaderData, updateGlobalHeaderByPath } =
  useEditorStore();
```

**الموقع**: `components\tenant\live-editor\EditorSidebar\index.tsx` (line 94-95, 98-99, 102)

```typescript
const {
  globalHeaderData,
  globalFooterData,
  setGlobalHeaderData,
  setGlobalFooterData,
} = useEditorStore();
```

**الموقع**: `components\tenant\global\GlobalLayout.tsx` (line 51-56)

##### globalFooterData

```typescript
const globalFooterData = useEditorStore((s) => s.globalFooterData);
```

**الموقع**: `components\tenant\live-editor\LiveEditorUI\index.tsx` (line 488)

```typescript
const globalFooterData = useEditorStore((s) => s.globalFooterData);
```

**الموقع**: `components\tenant\footer\footer2.tsx` (line 158)

```typescript
const { globalFooterData, setGlobalFooterData, updateGlobalFooterByPath } =
  useEditorStore();
```

**الموقع**: `components\tenant\live-editor\EditorSidebar\index.tsx` (line 95-96, 99-100, 103)

##### globalHeaderVariant

```typescript
const globalHeaderVariantFromStore = useEditorStore(
  (s) => s.globalHeaderVariant,
);
```

**الموقع**: `components\tenant\live-editor\LiveEditorUI\index.tsx` (line 489-491)

```typescript
const { globalHeaderVariant, setGlobalHeaderVariant } = useEditorStore();
```

**الموقع**: `components\tenant\live-editor\EditorSidebar\index.tsx` (line 96-97, 100-101)

```typescript
const headerVariant = state.globalHeaderVariant || "StaticHeader1";
```

**الموقع**: `context-liveeditor\EditorProvider.tsx` (line 33)

##### globalFooterVariant

```typescript
const globalFooterVariantFromStore = useEditorStore(
  (s) => s.globalFooterVariant,
);
```

**الموقع**: `components\tenant\live-editor\LiveEditorUI\index.tsx` (line 492-494)

```typescript
const { globalFooterVariant, setGlobalFooterVariant } = useEditorStore();
```

**الموقع**: `components\tenant\live-editor\EditorSidebar\index.tsx` (line 97-98, 101-102)

```typescript
const footerVariant = state.globalFooterVariant || "StaticFooter1";
```

**الموقع**: `context-liveeditor\EditorProvider.tsx` (line 34)

##### globalComponentsData

```typescript
const {
  globalComponentsData,
  setGlobalComponentsData,
  updateGlobalComponentByPath,
} = useEditorStore();
```

**الموقع**: `components\tenant\live-editor\EditorSidebar\index.tsx` (line 104-106)

```typescript
const headerData = state.globalComponentsData?.header || {};
const footerData = state.globalComponentsData?.footer || {};
```

**الموقع**: `context-liveeditor\EditorProvider.tsx` (line 31-32)

```typescript
globalComponentsData: {
  ...state.globalComponentsData,
  header: {
    ...headerData,
    variant: headerVariant,
  },
  footer: {
    ...footerData,
    variant: footerVariant,
  },
  globalHeaderVariant: headerVariant,
  globalFooterVariant: footerVariant,
},
```

**الموقع**: `context-liveeditor\EditorProvider.tsx` (line 39-51)

##### WebsiteLayout

```typescript
const { WebsiteLayout, setWebsiteLayout } = useEditorStore();
```

**الموقع**: `components\tenant\live-editor\EditorSidebar\index.tsx` (line 109, 111)

```typescript
const editorStoreWebsiteLayout = useEditorStore((state) => state.WebsiteLayout);
```

**الموقع**: `app\live-editor\layout.tsx` (line 1006-1008)

```typescript
const currentTheme = useEditorStore(
  (state) => state.WebsiteLayout?.currentTheme,
);
```

**الموقع**: `app\live-editor\layout.tsx` (line 1010)

```typescript
const currentTheme = useEditorStore(
  (state) => state.WebsiteLayout?.currentTheme,
);
```

**الموقع**: `components\tenant\live-editor\LiveEditorEffects.tsx` (line 321)

```typescript
WebsiteLayout: state.WebsiteLayout || {
  metaTags: {
    pages: [],
  },
},
```

**الموقع**: `context-liveeditor\EditorProvider.tsx` (line 52-56)

```typescript
const currentTheme = state.WebsiteLayout?.currentTheme;
```

**الموقع**: `context-liveeditor\EditorProvider.tsx` (line 62)

```typescript
if (state.WebsiteLayout) {
  Object.keys(state.WebsiteLayout).forEach((key) => {
    if (key.match(/^Theme\d+Backup$/)) {
      // ...
    }
  });
}
```

**الموقع**: `context-liveeditor\EditorProvider.tsx` (line 66-78)

##### themeChangeTimestamp

```typescript
const themeChangeTimestamp = useEditorStore((s) => s.themeChangeTimestamp);
```

**الموقع**: `components\tenant\live-editor\LiveEditorUI\index.tsx` (line 495)

```typescript
const themeChangeTimestamp = useEditorStore(
  (state) => state.themeChangeTimestamp,
);
```

**الموقع**: `components\tenant\live-editor\LiveEditorEffects.tsx` (line 322)

```typescript
const editorStore = useEditorStore.getState();
const themeChangeTimestamp = editorStore.themeChangeTimestamp;
```

**الموقع**: `app\live-editor\layout.tsx` (line 1773)

##### pageComponentsByPage

```typescript
Object.entries(state.pageComponentsByPage).forEach(([page, components]) => {
  // ...
});
```

**الموقع**: `context-liveeditor\EditorProvider.tsx` (line 25)

```typescript
pages: state.pageComponentsByPage,
```

**الموقع**: `context-liveeditor\EditorProvider.tsx` (line 38)

```typescript
const storePageComponents = useEditorStore(
  (state) => state.pageComponentsByPage[slug],
);
```

**الموقع**: `components\tenant\live-editor\LiveEditorEffects.tsx` (line 316-318)

```typescript
const storePageComponents = editorStore.pageComponentsByPage[pageSlug];
```

**الموقع**: `app\live-editor\layout.tsx` (line 1800, 1838)

```typescript
storePages: Object.keys(editorStore.pageComponentsByPage).length,
```

**الموقع**: `app\live-editor\layout.tsx` (line 1781)

##### Component States - heroStates

```typescript
const heroStates = useEditorStore((s) => s.heroStates);
```

**الموقع**: `components\tenant\hero\hero4.tsx` (line 35)

##### Component States - footerStates

```typescript
const footerStates = useEditorStore((s) => s.footerStates);
```

**الموقع**: `components\tenant\footer\footer2.tsx` (line 157)

##### Component States - halfTextHalfImageStates

```typescript
const halfTextHalfImageStates = useEditorStore(
  (s) => s.halfTextHalfImageStates,
);
```

**الموقع**: `components\tenant\live-editor\EditorSidebar\index.tsx` (line 110)

```typescript
const halfTextHalfImageStates = useEditorStore(
  (s) => s.halfTextHalfImageStates,
);
```

**الموقع**: `components\tenant\halfTextHalfImage\halfTextHalfImage6.tsx` (line 69-71)

```typescript
const halfTextHalfImageStates = useEditorStore(
  (s) => s.halfTextHalfImageStates,
);
```

**الموقع**: `components\tenant\halfTextHalfImage\halfTextHalfImage7.tsx` (line 102-104)

##### Component States - headerStates

```typescript
const headerStates = useEditorStore((s) => s.headerStates);
```

**الموقع**: `components\tenant\header\header2.tsx` (line 157)

##### Component States - globalComponentsData (في StaticHeader1)

```typescript
const globalComponentsData = useEditorStore(
  (state) => state.globalComponentsData,
);
```

**الموقع**: `components\tenant\header\StaticHeader1.tsx` (line 179-181)

```typescript
const globalHeaderData = useEditorStore((state) => state.globalHeaderData);
```

**الموقع**: `components\tenant\header\StaticHeader1.tsx` (line 182)

```typescript
const globalHeaderData = useEditorStore((s) => s.globalHeaderData);
```

**الموقع**: `components\tenant\header\header2.tsx` (line 160)

##### Component States - inputsStates

```typescript
const inputsStates = useEditorStore((s) => s.inputsStates);
```

**الموقع**: `components\tenant\inputs\inputs1.tsx` (line 280)

```typescript
Object.keys(editorStore.inputs2States || {}).length > 0;
```

**الموقع**: `components\tenant\live-editor\LiveEditorEffects.tsx` (line 224)

##### Component States - inputs2States

```typescript
Object.keys(editorStore.inputs2States || {}).length > 0;
```

**الموقع**: `components\tenant\live-editor\LiveEditorEffects.tsx` (line 224)

##### Component States - stepsSectionStates

```typescript
const stepsSectionStates = useEditorStore((s) => s.stepsSectionStates);
```

**الموقع**: `components\tenant\stepsSection\stepsSection1.tsx` (line 334)

##### Component States - titleStates

```typescript
const titleStates = useEditorStore((s) => s.titleStates);
```

**الموقع**: `components\tenant\title\title1.tsx` (line 57)

##### Component States - photosGridStates

```typescript
const photosGridStates = useEditorStore((s) => s.photosGridStates);
```

**الموقع**: `components\tenant\photosGrid\photosGrid1.tsx` (line 65)

##### Component States - propertiesShowcaseStates

```typescript
const propertiesShowcaseStates = useEditorStore(
  (s) => s.propertiesShowcaseStates,
);
```

**الموقع**: `components\tenant\propertiesShowcase\propertiesShowcase1.tsx` (line 546)

#### 3. Functions الاستدعاءات:

##### ensureComponentVariant

```typescript
const ensureComponentVariant = useEditorStore((s) => s.ensureComponentVariant);
```

**الموقع**: `components\tenant\footer\footer2.tsx` (line 153-155)

```typescript
const ensureComponentVariant = useEditorStore((s) => s.ensureComponentVariant);
```

**الموقع**: `components\tenant\hero\hero4.tsx` (line 31-33)

```typescript
const ensureComponentVariant = useEditorStore((s) => s.ensureComponentVariant);
```

**الموقع**: `components\tenant\title\title1.tsx` (line 55)

```typescript
const ensureComponentVariant = useEditorStore((s) => s.ensureComponentVariant);
```

**الموقع**: `components\tenant\photosGrid\photosGrid1.tsx` (line 63)

```typescript
const ensureComponentVariant = useEditorStore((s) => s.ensureComponentVariant);
```

**الموقع**: `components\tenant\propertiesShowcase\propertiesShowcase1.tsx` (line 542-544)

```typescript
const ensureComponentVariant = useEditorStore((s) => s.ensureComponentVariant);
```

**الموقع**: `components\tenant\inputs\inputs1.tsx` (line 276-278)

```typescript
const ensureComponentVariant = useEditorStore((s) => s.ensureComponentVariant);
```

**الموقع**: `components\tenant\stepsSection\stepsSection1.tsx` (line 330-332)

```typescript
editorStore
  .ensureComponentVariant
  // ...
  ();
```

**الموقع**: `components\tenant\live-editor\LiveEditorEffects.tsx` (line 235)

##### getComponentData

```typescript
const getComponentData = useEditorStore((s) => s.getComponentData);
```

**الموقع**: `components\tenant\footer\footer2.tsx` (line 156)

```typescript
const getComponentData = useEditorStore((s) => s.getComponentData);
```

**الموقع**: `components\tenant\hero\hero4.tsx` (line 34)

```typescript
const getComponentData = useEditorStore((s) => s.getComponentData);
```

**الموقع**: `components\tenant\title\title1.tsx` (line 56)

```typescript
const getComponentData = useEditorStore((s) => s.getComponentData);
```

**الموقع**: `components\tenant\photosGrid\photosGrid1.tsx` (line 64)

```typescript
const getComponentData = useEditorStore((s) => s.getComponentData);
```

**الموقع**: `components\tenant\propertiesShowcase\propertiesShowcase1.tsx` (line 545)

```typescript
const getComponentData = useEditorStore((s) => s.getComponentData);
```

**الموقع**: `components\tenant\inputs\inputs1.tsx` (line 279)

```typescript
const getComponentData = useEditorStore((s) => s.getComponentData);
```

**الموقع**: `components\tenant\stepsSection\stepsSection1.tsx` (line 333)

```typescript
const storeData = props.useStore
  ? getComponentData("inputs", variantId) || {}
  : {};
```

**الموقع**: `components\tenant\inputs\inputs1.tsx` (line 300-302)

```typescript
const storeData = props.useStore
  ? getComponentData("stepsSection", uniqueId) || {}
  : {};
```

**الموقع**: `components\tenant\stepsSection\stepsSection1.tsx` (line 358-360)

##### updateComponentByPath

```typescript
const { updateComponentByPath } = useEditorStore();
```

**الموقع**: `components\tenant\live-editor\EditorSidebar\index.tsx` (line 93)

##### updateByPath

```typescript
const { updateByPath } = useEditorStore();
```

**الموقع**: `components\tenant\live-editor\EditorSidebar\index.tsx` (line 92)

##### setCurrentPage

```typescript
const { setCurrentPage } = useEditorStore();
```

**الموقع**: `components\tenant\live-editor\EditorSidebar\index.tsx` (line 107)

```typescript
useEditorStore.getState().setCurrentPage(slug);
```

**الموقع**: `components\tenant\live-editor\LiveEditorEffects.tsx` (line 413)

##### setHasChangesMade

```typescript
const { setHasChangesMade } = useEditorStore();
```

**الموقع**: `components\tenant\live-editor\EditorSidebar\index.tsx` (line 108)

##### createPage

```typescript
const { createPage } = useEditorStore.getState();
```

**الموقع**: `app\live-editor\layout.tsx` (line 1591)

##### addPageToWebsiteLayout

```typescript
const { addPageToWebsiteLayout } = useEditorStore.getState();
```

**الموقع**: `app\live-editor\layout.tsx` (line 1661, 1867)

##### requestSave

```typescript
const requestSave = useEditorStore((state) => state.requestSave);
```

**الموقع**: `app\live-editor\layout.tsx` (line 897)

##### loadFromDatabase

```typescript
editorStore.loadFromDatabase(tenantData);
```

**الموقع**: `components\tenant\live-editor\LiveEditorEffects.tsx` (line 73)

```typescript
useEditorStore.getState().loadFromDatabase(tenantData);
```

**الموقع**: `services-liveeditor\live-editor\stateService.ts` (line 21)

##### forceUpdatePageComponents

```typescript
useEditorStore.getState().forceUpdatePageComponents(slug, pageComponents);
```

**الموقع**: `components\tenant\live-editor\LiveEditorEffects.tsx` (line 420)

##### setPageComponentsForPage (في stateService)

```typescript
useEditorStore.getState().setPageComponentsForPage(slug, pageComponents);
```

**الموقع**: `services-liveeditor\live-editor\stateService.ts` (line 11)

##### deletePage (في stateService)

```typescript
const store = useEditorStore.getState();
store.deletePage(slug);
```

**الموقع**: `services-liveeditor\live-editor\stateService.ts` (line 64-65)

##### setTempData (في stateService)

```typescript
store.setTempData({});
```

**الموقع**: `services-liveeditor\live-editor\stateService.ts` (line 58)

##### setHeroData, setHeaderData, sethalfTextHalfImageData, setPropertySliderData, setCtaValuationData (في stateService)

```typescript
const store = useEditorStore.getState();
switch (resetComponent.type) {
  case "hero":
    store.setHeroData(resetComponent.componentName, defaultData);
    break;
  case "header":
    store.setHeaderData(resetComponent.componentName, defaultData);
    break;
  case "halfTextHalfImage":
    store.sethalfTextHalfImageData(resetComponent.componentName, defaultData);
    break;
  case "propertySlider":
    store.setPropertySliderData(resetComponent.componentName, defaultData);
    break;
  case "ctaValuation":
    store.setCtaValuationData(resetComponent.componentName, defaultData);
    break;
}
```

**الموقع**: `services-liveeditor\live-editor\stateService.ts` (line 31-54)

##### setPageComponentsForPage (في stateService)

```typescript
useEditorStore.getState().setPageComponentsForPage(slug, pageComponents);
```

**الموقع**: `services-liveeditor\live-editor\stateService.ts` (line 11)

##### deletePage (في stateService)

```typescript
const store = useEditorStore.getState();
store.deletePage(slug);
```

**الموقع**: `services-liveeditor\live-editor\stateService.ts` (line 64-65)

##### setTempData (في stateService)

```typescript
store.setTempData({});
```

**الموقع**: `services-liveeditor\live-editor\stateService.ts` (line 58)

##### setHeroData, setHeaderData, sethalfTextHalfImageData, setPropertySliderData, setCtaValuationData (في stateService)

```typescript
const store = useEditorStore.getState();
switch (resetComponent.type) {
  case "hero":
    store.setHeroData(resetComponent.componentName, defaultData);
    break;
  case "header":
    store.setHeaderData(resetComponent.componentName, defaultData);
    break;
  case "halfTextHalfImage":
    store.sethalfTextHalfImageData(resetComponent.componentName, defaultData);
    break;
  case "propertySlider":
    store.setPropertySliderData(resetComponent.componentName, defaultData);
    break;
  case "ctaValuation":
    store.setCtaValuationData(resetComponent.componentName, defaultData);
    break;
}
```

**الموقع**: `services-liveeditor\live-editor\stateService.ts` (line 31-54)

##### getState() - استخدامات متعددة

```typescript
const state = useEditorStore.getState();
```

**الموقع**: `context-liveeditor\EditorProvider.tsx` (line 22)

```typescript
const store = useEditorStore.getState();
```

**الموقع**: `components\tenant\live-editor\LiveEditorUI\index.tsx` (line 877, 970, 1025, 1066, 1104)

```typescript
const store = useEditorStore.getState();
```

**الموقع**: `services-liveeditor\live-editor\themeChangeService.ts` (line 47, 133, 240, 416, 587)

```typescript
const store = useEditorStore.getState();
```

**الموقع**: `services-liveeditor\live-editor\stateService.ts` (line 31, 64)

```typescript
const editorStore = useEditorStore.getState();
```

**الموقع**: `app\live-editor\layout.tsx` (line 1767)

```typescript
const editorStore = useEditorStore.getState();
```

**الموقع**: `components\tenant\live-editor\LiveEditorEffects.tsx` (line 57, 346, 413, 420, 424)

##### setPageComponentsForPage

```typescript
useEditorStore.getState().setPageComponentsForPage(slug, pageComponents);
```

**الموقع**: `services-liveeditor\live-editor\stateService.ts` (line 11)

##### deletePage

```typescript
const store = useEditorStore.getState();
store.deletePage(slug);
```

**الموقع**: `services-liveeditor\live-editor\stateService.ts` (line 64-65)

##### setHeroData, setHeaderData, sethalfTextHalfImageData, setPropertySliderData, setCtaValuationData

```typescript
const store = useEditorStore.getState();
switch (resetComponent.type) {
  case "hero":
    store.setHeroData(resetComponent.componentName, defaultData);
    break;
  case "header":
    store.setHeaderData(resetComponent.componentName, defaultData);
    break;
  case "halfTextHalfImage":
    store.sethalfTextHalfImageData(resetComponent.componentName, defaultData);
    break;
  case "propertySlider":
    store.setPropertySliderData(resetComponent.componentName, defaultData);
    break;
  case "ctaValuation":
    store.setCtaValuationData(resetComponent.componentName, defaultData);
    break;
}
```

**الموقع**: `services-liveeditor\live-editor\stateService.ts` (line 31-54)

---

## 2. tenantStore

**الموقع**: `context-liveeditor\tenantStore.jsx`

### States الموجودة:

- tenantData
- loadingTenantData
- error
- tenant
- tenantId
- lastFetchedWebsite

### الاستدعاءات والاستخدامات:

#### 1. Import Statement

```typescript
import useTenantStore from "@/context-liveeditor/tenantStore";
```

**المواقع**:

- `components\tenant\footer\footer2.tsx` (line 10)
- `components\tenant\hero\hero4.tsx` (line 7)
- `components\tenant\title\title1.tsx` (line 5)
- `components\tenant\photosGrid\photosGrid1.tsx` (line 5)
- `components\tenant\propertiesShowcase\propertiesShowcase1.tsx` (line 6)
- `components\tenant\live-editor\LiveEditorUI\index.tsx` (line 60)
- `app\live-editor\layout.tsx` (line 9)
- `app\live-editor\LiveEditorWrapper.tsx` (line 4)
- `components\tenant\inputs\inputs1.tsx` (line 289-291)
- `components\tenant\stepsSection\stepsSection1.tsx` (line 347-349)
- `components\tenant\global\GlobalLayout.tsx` (line 44-48)
- `components\tenant\halfTextHalfImage\halfTextHalfImage6.tsx` (line 6)
- `components\tenant\halfTextHalfImage\halfTextHalfImage7.tsx` (line 6)
- `components\tenant\header\StaticHeader1.tsx` (line 13)
- `components\tenant\header\header2.tsx` (line 12)
- `services-liveeditor\live-editor\stateService.ts` (line 3)

#### 2. استخدامات محددة للـ States:

##### tenantData

```typescript
const tenantData = useTenantStore((s) => s.tenantData);
```

**الموقع**: `components\tenant\footer\footer2.tsx` (line 161)

```typescript
const tenantData = useTenantStore((s) => s.tenantData);
```

**الموقع**: `components\tenant\hero\hero4.tsx` (line 37)

```typescript
const tenantData = useTenantStore((s) => s.tenantData);
```

**الموقع**: `components\tenant\title\title1.tsx` (line 59)

```typescript
const tenantData = useTenantStore((s) => s.tenantData);
```

**الموقع**: `components\tenant\photosGrid\photosGrid1.tsx` (line 67)

```typescript
const tenantData = useTenantStore((s) => s.tenantData);
```

**الموقع**: `components\tenant\propertiesShowcase\propertiesShowcase1.tsx` (line 550)

```typescript
const tenantData = useTenantStore((s) => s.tenantData);
```

**الموقع**: `components\tenant\live-editor\LiveEditorUI\index.tsx` (line 517)

```typescript
const tenantData = useTenantStore((s) => s.tenantData);
```

**الموقع**: `components\tenant\inputs\inputs1.tsx` (line 289)

```typescript
const tenantData = useTenantStore((s) => s.tenantData);
```

**الموقع**: `components\tenant\stepsSection\stepsSection1.tsx` (line 347)

```typescript
const tenantData = useTenantStore((s) => s.tenantData);
```

**الموقع**: `components\tenant\global\GlobalLayout.tsx` (line 46)

```typescript
const tenantData = useTenantStore((s) => s.tenantData);
```

**الموقع**: `components\tenant\halfTextHalfImage\halfTextHalfImage6.tsx` (line 73)

```typescript
const tenantData = useTenantStore((s) => s.tenantData);
```

**الموقع**: `components\tenant\halfTextHalfImage\halfTextHalfImage7.tsx` (line 106)

```typescript
const tenantData = useTenantStore((s) => s.tenantData);
```

**الموقع**: `components\tenant\header\StaticHeader1.tsx` (line 186)

```typescript
const tenantData = useTenantStore((s) => s.tenantData);
```

**الموقع**: `components\tenant\header\header2.tsx` (line 163)

```typescript
const { tenantData } = useTenantStore();
```

**الموقع**: `app\live-editor\layout.tsx` (line 92)

```typescript
const tenantStore = useTenantStore.getState();
const originalComponentSettings =
  tenantStore.tenantData?.componentSettings || {};
```

**الموقع**: `services-liveeditor\live-editor\themeChangeService.ts` (line 63-64)

```typescript
const tenantStore = useTenantStore.getState();
const currentTenantData = tenantStore.tenantData;
```

**الموقع**: `services-liveeditor\live-editor\themeChangeService.ts` (line 329-330)

```typescript
const tenantStore = useTenantStore.getState();
const currentTenantData = tenantStore.tenantData;
```

**الموقع**: `services-liveeditor\live-editor\themeChangeService.ts` (line 605-606)

```typescript
const { tenantData } = useTenantStore.getState();
```

**الموقع**: `services-liveeditor\live-editor\stateService.ts` (line 68)

```typescript
const { tenantData } = useTenantStore.getState();
```

**الموقع**: `app\live-editor\layout.tsx` (line 1602)

##### setTenantId

```typescript
const setTenantId = useTenantStore((s) => s.setTenantId);
```

**الموقع**: `app\live-editor\LiveEditorWrapper.tsx` (line 14)

```typescript
useEffect(() => {
  if (tenantId) {
    setTenantId(tenantId);
  }
}, [tenantId, setTenantId]);
```

**الموقع**: `app\live-editor\LiveEditorWrapper.tsx` (line 17-21)

##### loadingTenantData

```typescript
const loadingTenantData = useTenantStore((s) => s.loadingTenantData);
```

**الموقع**: `components\tenant\global\GlobalLayout.tsx` (line 47)

##### tenantId

```typescript
const tenantId = useTenantStore((s) => s.tenantId);
```

**الموقع**: `components\tenant\footer\footer2.tsx` (line 163)

```typescript
const tenantId = useTenantStore((s) => s.tenantId);
```

**الموقع**: `components\tenant\hero\hero4.tsx` (line 39)

```typescript
const tenantId = useTenantStore((s) => s.tenantId);
```

**الموقع**: `components\tenant\title\title1.tsx` (line 61)

```typescript
const tenantId = useTenantStore((s) => s.tenantId);
```

**الموقع**: `components\tenant\photosGrid\photosGrid1.tsx` (line 69)

```typescript
const tenantId = useTenantStore((s) => s.tenantId);
```

**الموقع**: `components\tenant\propertiesShowcase\propertiesShowcase1.tsx` (line 552)

```typescript
const tenantId = useTenantStore((s) => s.tenantId);
```

**الموقع**: `components\tenant\inputs\inputs1.tsx` (line 291)

```typescript
const tenantId = useTenantStore((s) => s.tenantId);
```

**الموقع**: `components\tenant\stepsSection\stepsSection1.tsx` (line 349)

```typescript
const tenantId = useTenantStore((s) => s.tenantId);
```

**الموقع**: `components\tenant\global\GlobalLayout.tsx` (line 44)

```typescript
const tenantId = useTenantStore((s) => s.tenantId);
```

**الموقع**: `components\tenant\halfTextHalfImage\halfTextHalfImage6.tsx` (line 75)

```typescript
const tenantId = useTenantStore((s) => s.tenantId);
```

**الموقع**: `components\tenant\halfTextHalfImage\halfTextHalfImage7.tsx` (line 108)

```typescript
const tenantId = useTenantStore((s) => s.tenantId);
```

**الموقع**: `components\tenant\header\header2.tsx` (line 165)

##### fetchTenantData

```typescript
const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
```

**الموقع**: `components\tenant\footer\footer2.tsx` (line 162)

```typescript
const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
```

**الموقع**: `components\tenant\hero\hero4.tsx` (line 38)

```typescript
const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
```

**الموقع**: `components\tenant\title\title1.tsx` (line 60)

```typescript
const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
```

**الموقع**: `components\tenant\photosGrid\photosGrid1.tsx` (line 68)

```typescript
const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
```

**الموقع**: `components\tenant\propertiesShowcase\propertiesShowcase1.tsx` (line 551)

```typescript
const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
```

**الموقع**: `components\tenant\inputs\inputs1.tsx` (line 290)

```typescript
const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
```

**الموقع**: `components\tenant\stepsSection\stepsSection1.tsx` (line 348)

```typescript
const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
```

**الموقع**: `components\tenant\global\GlobalLayout.tsx` (line 48)

```typescript
const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
```

**الموقع**: `components\tenant\halfTextHalfImage\halfTextHalfImage6.tsx` (line 74)

```typescript
const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
```

**الموقع**: `components\tenant\halfTextHalfImage\halfTextHalfImage7.tsx` (line 107)

```typescript
const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
```

**الموقع**: `components\tenant\header\StaticHeader1.tsx` (line 188)

```typescript
const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
```

**الموقع**: `components\tenant\header\header2.tsx` (line 164)

```typescript
useEffect(() => {
  if (tenantId) {
    fetchTenantData(tenantId);
  }
}, [tenantId, fetchTenantData]);
```

**الموقع**: `components\tenant\inputs\inputs1.tsx` (line 293-297)

```typescript
useEffect(() => {
  if (tenantId) {
    fetchTenantData(tenantId);
  }
}, [tenantId, fetchTenantData]);
```

**الموقع**: `components\tenant\stepsSection\stepsSection1.tsx` (line 351-355)

##### getState() - استخدامات متعددة

```typescript
const tenantStore = useTenantStore.getState();
```

**الموقع**: `services-liveeditor\live-editor\themeChangeService.ts` (line 63, 329, 605)

```typescript
const tenantStore = useTenantStore.getState();
```

**الموقع**: `services-liveeditor\live-editor\stateService.ts` (line 68)

```typescript
useTenantStore.setState({
  // ...
});
```

**الموقع**: `services-liveeditor\live-editor\themeChangeService.ts` (line 395, 668)

```typescript
useTenantStore.setState({
  tenantData: updatedTenantData,
});
```

**الموقع**: `app\live-editor\layout.tsx` (line 1658)

```typescript
useTenantStore.setState({
  tenantData: {
    ...tenantData,
    componentSettings: updatedComponentSettings,
  },
});
```

**الموقع**: `services-liveeditor\live-editor\stateService.ts` (line 73-78)

##### setTenantId

```typescript
const setTenantId = useTenantStore((s) => s.setTenantId);
```

**الموقع**: `app\live-editor\LiveEditorWrapper.tsx` (line 14)

```typescript
useEffect(() => {
  if (tenantId) {
    setTenantId(tenantId);
  }
}, [tenantId, setTenantId]);
```

**الموقع**: `app\live-editor\LiveEditorWrapper.tsx` (line 17-21)

##### loadingTenantData

```typescript
const loadingTenantData = useTenantStore((s) => s.loadingTenantData);
```

**الموقع**: `components\tenant\header\StaticHeader1.tsx` (line 187)

##### getState() - استخدامات إضافية

```typescript
const { tenantData } = useTenantStore.getState();
```

**الموقع**: `services-liveeditor\live-editor\stateService.ts` (line 68)

```typescript
const { tenantData } = useTenantStore.getState();
```

**الموقع**: `app\live-editor\layout.tsx` (line 1602)

---

## 3. editorI18nStore

**الموقع**: `context-liveeditor\editorI18nStore.ts`

### States الموجودة:

- locale
- translations

### الاستدعاءات والاستخدامات:

#### 1. Import Statements

```typescript
import {
  useEditorT,
  useEditorLocale,
} from "@/context-liveeditor/editorI18nStore";
import { useEditorT } from "@/context-liveeditor/editorI18nStore";
```

**المواقع**:

- `components\tenant\live-editor\ThemeChangeDialog.tsx` (line 13)
- `components\tenant\live-editor\LiveEditorUI\index.tsx` (line 5)
- `app\live-editor\layout.tsx` (line 15-16)
- `components\tenant\live-editor\ComponentsSidebar.tsx` (line 4)
- `components\tenant\halfTextHalfImage\halfTextHalfImage7.tsx` (line 7)
- `lib-liveeditor\ComponentsList.tsx` (line 8-9, 25)

#### 2. استخدامات محددة:

##### useEditorT()

```typescript
const t = useEditorT();
```

**الموقع**: `components\tenant\live-editor\ThemeChangeDialog.tsx` (line 58)

```typescript
const t = useEditorT();
```

**الموقع**: `components\tenant\live-editor\LiveEditorUI\index.tsx` (line 467)

```typescript
const t = useEditorT();
```

**الموقع**: `app\live-editor\layout.tsx` (line 90, 962, 3495)

```typescript
const t = useEditorT();
```

**الموقع**: `components\tenant\live-editor\ComponentsSidebar.tsx` (line 60)

```typescript
const t = useEditorT();
```

**الموقع**: `components\tenant\halfTextHalfImage\halfTextHalfImage7.tsx` (line 93)

```typescript
const t = useEditorT();
```

**الموقع**: `lib-liveeditor\ComponentsList.tsx` (line 9, 25)

##### useEditorLocale()

```typescript
const { locale } = useEditorLocale();
```

**الموقع**: `components\tenant\live-editor\ThemeChangeDialog.tsx` (line 59)

```typescript
const { locale } = useEditorLocale();
```

**الموقع**: `app\live-editor\layout.tsx` (line 95, 904)

```typescript
const { setLocale } = useEditorLocale();
```

**الموقع**: `app\live-editor\layout.tsx` (line 3494)

---

## 4. clientI18nStore

**الموقع**: `context-liveeditor\clientI18nStore.ts`

### States الموجودة:

- locale
- translations

### الاستدعاءات والاستخدامات:

#### 1. Import Statements

```typescript
import { useClientT } from "@/context-liveeditor/clientI18nStore";
import { useClientLocale } from "@/context-liveeditor/clientI18nStore";
```

**المواقع**:

- `components\tenant\imageText\imageText1.tsx` (line 8)
- `components\tenant\LanguageSwitcher.tsx` (line 11)
- `components\tenant\hero\hero1-i18n.tsx` (line 4-5)
- `components\tenant\header\header1-i18n.tsx` (line 4-5)
- `components\tenant\footer\footer1-i18n.tsx` (line 4-5)

#### 2. استخدامات محددة:

##### useClientT()

```typescript
const t = useClientT();
```

**الموقع**: `components\tenant\imageText\imageText1.tsx` (line 53)

```typescript
const t = useClientT();
```

**الموقع**: `components\tenant\hero\hero1-i18n.tsx` (line 52)

```typescript
const t = useClientT();
```

**الموقع**: `components\tenant\header\header1-i18n.tsx` (line 43)

```typescript
const t = useClientT();
```

**الموقع**: `components\tenant\footer\footer1-i18n.tsx` (line 72)

##### useClientLocale()

```typescript
const { locale, setLocale } = useClientLocale();
```

**الموقع**: `components\tenant\LanguageSwitcher.tsx` (line 21)

```typescript
const { locale } = useClientLocale();
```

**الموقع**: `components\tenant\hero\hero1-i18n.tsx` (line 53)

```typescript
const { locale } = useClientLocale();
```

**الموقع**: `components\tenant\header\header1-i18n.tsx` (line 44)

```typescript
const { locale } = useClientLocale();
```

**الموقع**: `components\tenant\footer\footer1-i18n.tsx` (line 73)

---

## 5. SidebarStateManager

**الموقع**: `context-liveeditor\SidebarStateManager.ts`

### States الموجودة:

- selectedComponent
- currentPage

### الاستدعاءات والاستخدامات:

#### 1. Import Statement

```typescript
import { useSidebarStateManager } from "@/context-liveeditor/SidebarStateManager";
```

**المواقع**:

- `components\tenant\live-editor\EditorSidebar\UnifiedSidebar.tsx` (line 5)

#### 2. استخدامات محددة:

```typescript
const {
  selectedComponent: sidebarSelectedComponent,
  setSelectedComponent,
  updateComponentData,
  getComponentData,
  updateGlobalHeader,
  updateGlobalFooter,
  getGlobalHeaderData,
  getGlobalFooterData,
  currentPage,
  setCurrentPage,
} = useSidebarStateManager();
```

**الموقع**: `components\tenant\live-editor\EditorSidebar\UnifiedSidebar.tsx` (line 28-39)

---

## 6. zoneStore

**الموقع**: `services-liveeditor\live-editor\dragDrop\zoneStore.ts`

### States الموجودة:

- zoneDepthIndex
- nextZoneDepthIndex
- areaDepthIndex
- nextAreaDepthIndex
- draggedItem
- previewIndex
- enabledIndex
- hoveringComponent

### الاستدعاءات والاستخدامات:

#### 1. Import Statement

```typescript
import { createZoneStore, ZoneStoreType, Preview } from "./zoneStore";
```

**المواقع**:

- `services-liveeditor\live-editor\dragDrop\EnhancedLiveEditorDragDropContext.tsx` (line 15)

#### 2. استخدامات محددة:

```typescript
const zoneStore = useMemo(() => createZoneStore(), []);
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\EnhancedLiveEditorDragDropContext.tsx` (line 84)

```typescript
<ZoneStoreProvider store={zoneStore}>
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\EnhancedLiveEditorDragDropContext.tsx` (line 621)

---

## 7. collisionStore

**الموقع**: `services-liveeditor\live-editor\dragDrop\collision\dynamic\store.ts`

### States الموجودة:

- fallbackEnabled
- debugMode
- sensitivity
- lastCollisionId
- collisionHistory

### الاستدعاءات والاستخدامات:

#### 1. Import Statement

```typescript
// import { collisionStore } from "./collision/dynamic/store"; // مؤقتاً
```

**المواقع**:

- `services-liveeditor\live-editor\dragDrop\LiveEditorDragDropContext.tsx` (line 26) - معلق

#### 2. Functions المتاحة:

##### recordCollision

```typescript
export const recordCollision = (id: string, type: string) => {
  const state = collisionStore.getState();
  // ...
  collisionStore.setState({
    lastCollisionId: id,
    collisionHistory: updatedHistory,
  });
};
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\collision\dynamic\store.ts` (line 29-44)

##### cleanupCollisionHistory

```typescript
export const cleanupCollisionHistory = (maxAge: number = 5000) => {
  const state = collisionStore.getState();
  // ...
  collisionStore.setState({
    collisionHistory: filteredHistory,
  });
};
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\collision\dynamic\store.ts` (line 49-60)

#### 3. استخدامات معلقة/مؤقتة:

```typescript
// import { collisionStore } from "./collision/dynamic/store"; // مؤقتاً
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\LiveEditorDragDropContext.tsx` (line 26)

```typescript
const fallbackEnabled = true; // collisionStore.getState().fallbackEnabled;
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\collision\dynamic\index.ts` (line 45)

---

## ملخص العلاقات بين الـ Stores:

### editorStore يستخدم:

- tenantStore (غير مباشر عبر components)

### tenantStore يستخدم:

- editorStore (في themeChangeService)

### EditorProvider يستخدم:

- editorStore (للحفظ)
- useAuthStore (للحصول على userData)

### Components تستخدم:

- editorStore (لإدارة component states)
- tenantStore (للحصول على tenant data)
- editorI18nStore (للترجمة في editor)
- clientI18nStore (للترجمة في client components)

### SidebarStateManager يستخدم:

- editorStore (للوصول إلى pageComponentsByPage و global components)

### zoneStore يستخدم في:

- EnhancedLiveEditorDragDropContext (لإدارة drag & drop zones)

### collisionStore:

- حالياً معلق/غير مستخدم بشكل كامل

---

## ملخص شامل لجميع الاستدعاءات:

### editorStore - إجمالي الاستدعاءات:

- **Import Statements**: 15+ ملف
- **States المستخدمة**: 50+ state
- **Functions المستخدمة**: 30+ function
- **getState() Calls**: 20+ استدعاء
- **Components المستخدمة**: footer2, hero4, title1, photosGrid1, propertiesShowcase1, inputs1, stepsSection1, halfTextHalfImage6, halfTextHalfImage7, header2, StaticHeader1, LiveEditorUI, EditorSidebar, LiveEditorEffects, LiveEditorLayout, GlobalLayout, EditorProvider, themeChangeService, stateService

### tenantStore - إجمالي الاستدعاءات:

- **Import Statements**: 15+ ملف
- **States المستخدمة**: 6 states
- **Functions المستخدمة**: fetchTenantData, setTenantId
- **getState() Calls**: 8+ استدعاء
- **setState() Calls**: 4+ استدعاء
- **Components المستخدمة**: جميع tenant components (footer, hero, title, photosGrid, propertiesShowcase, inputs, stepsSection, halfTextHalfImage, header, StaticHeader, LiveEditorUI, LiveEditorLayout, GlobalLayout, themeChangeService, stateService, LiveEditorWrapper)

### editorI18nStore - إجمالي الاستدعاءات:

- **Import Statements**: 7+ ملف
- **Hooks المستخدمة**: useEditorT, useEditorLocale
- **Components المستخدمة**: ThemeChangeDialog, LiveEditorUI, LiveEditorLayout, ComponentsSidebar, halfTextHalfImage7

### clientI18nStore - إجمالي الاستدعاءات:

- **Import Statements**: 5+ ملف
- **Hooks المستخدمة**: useClientT, useClientLocale
- **Components المستخدمة**: imageText1, LanguageSwitcher, hero1-i18n, header1-i18n, footer1-i18n

### SidebarStateManager - إجمالي الاستدعاءات:

- **Import Statements**: 1 ملف
- **Components المستخدمة**: UnifiedSidebar

### zoneStore - إجمالي الاستدعاءات:

- **Import Statements**: 2 ملف
- **Components المستخدمة**: EnhancedLiveEditorDragDropContext, LiveEditorDragDropContext

### collisionStore - إجمالي الاستدعاءات:

- **Import Statements**: 0 (معلق)
- **Status**: غير مستخدم حالياً

---

## إحصائيات نهائية:

- **إجمالي Zustand Stores**: 7 stores
- **إجمالي States**: 100+ state
- **إجمالي الاستدعاءات**: 200+ استدعاء
- **إجمالي الملفات المستخدمة**: 50+ ملف
- **إجمالي Components المستخدمة**: 30+ component
