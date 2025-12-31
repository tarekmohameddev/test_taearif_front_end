# Component Local States - جميع الاستدعاءات والعلاقات

## 1. DraggableComponent

**الموقع**: `services-liveeditor\live-editor\dragDrop\DraggableComponent.tsx`

### States الموجودة:

- localZones (useState)
- dragAxis (useState)
- hover (useState)
- isVisible (useState)
- dragFinished (useState)

### الاستدعاءات والاستخدامات:

#### States Implementation:

##### localZones

```typescript
const [localZones, setLocalZones] = useState<Record<string, boolean>>({});
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\DraggableComponent.tsx` (line 60)

```typescript
const registerLocalZone = useCallback(
  (zoneCompound: string, active: boolean) => {
    ctx?.registerLocalZone?.(zoneCompound, active);
    setLocalZones((obj) => ({
      ...obj,
      [zoneCompound]: active,
    }));
  },
  [setLocalZones, ctx],
);
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\DraggableComponent.tsx` (line 63-72)

##### dragAxis

```typescript
const [dragAxis, setDragAxis] = useState(userDragAxis || autoDragAxis);
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\DraggableComponent.tsx` (line 61)

##### hover

```typescript
const [hover, setHover] = useState(false);
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\DraggableComponent.tsx` (line 151)

##### isVisible

```typescript
const [isVisible, setIsVisible] = useState(false);
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\DraggableComponent.tsx` (line 152)

##### dragFinished

```typescript
const [dragFinished, setDragFinished] = useState(true);
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\DraggableComponent.tsx` (line 153)

#### Dependencies:

##### 1. dropZoneContext

```typescript
const ctx = useContext(dropZoneContext);
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\DraggableComponent.tsx` (line 57)

##### 2. ZoneStoreContext

```typescript
const zoneStore = useContext(ZoneStoreContext);
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\DraggableComponent.tsx` (line 58)

---

## 2. useSensors

**الموقع**: `services-liveeditor\live-editor\dragDrop\useSensors.ts`

### States الموجودة:

- sensors (useState)

### الاستدعاءات والاستخدامات:

#### States Implementation:

##### sensors

```typescript
const [sensors] = useState(() => {
  return [
    PointerSensor.configure({
      activationConstraints(event, source) {
        // ... configuration
      },
    }),
    // ... other sensors
  ];
});
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\useSensors.ts` (line 41)

#### Dependencies:

##### 1. PointerSensor من @dnd-kit/core

```typescript
import { PointerSensor } from "@dnd-kit/core";
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\useSensors.ts`

---

## 3. LiveEditorHooks

**الموقع**: `components\tenant\live-editor\LiveEditorHooks.tsx`

### States الموجودة:

- sidebarWidth (useState)
- initialized (useState)
- pageComponents (useState)
- registeredComponents (useState)
- activeId (useState)
- sidebarOpen (useState)
- sidebarView (useState)
- selectedComponentId (useState)
- deleteDialogOpen (useState)
- componentToDelete (useState)
- deletePageDialogOpen (useState)
- deletePageConfirmation (useState)
- dropIndicator (useState)

### الاستدعاءات والاستخدامات:

#### States Implementation:

##### sidebarWidth

```typescript
const [sidebarWidth, setSidebarWidth] = useState(600);
```

**الموقع**: `components\tenant\live-editor\LiveEditorHooks.tsx` (line 30)

##### initialized

```typescript
const [initialized, setInitialized] = useState(false);
```

**الموقع**: `components\tenant\live-editor\LiveEditorHooks.tsx` (line 31)

##### pageComponents

```typescript
const [pageComponents, setPageComponents] = useState<ComponentInstance[]>(() =>
  createInitialComponents(slug),
);
```

**الموقع**: `components\tenant\live-editor\LiveEditorHooks.tsx` (line 34-36)

##### registeredComponents

```typescript
const [registeredComponents, setRegisteredComponents] = useState<
  Record<string, any>
>({});
```

**الموقع**: `components\tenant\live-editor\LiveEditorHooks.tsx` (line 38-40)

##### activeId

```typescript
const [activeId, setActiveId] = useState<string | null>(null);
```

**الموقع**: `components\tenant\live-editor\LiveEditorHooks.tsx` (line 42)

##### sidebarOpen

```typescript
const [sidebarOpen, setSidebarOpen] = useState(false);
```

**الموقع**: `components\tenant\live-editor\LiveEditorHooks.tsx` (line 43)

##### sidebarView

```typescript
const [sidebarView, setSidebarView] = useState<
  "main" | "add-section" | "edit-component" | "branding-settings"
>("main");
```

**الموقع**: `components\tenant\live-editor\LiveEditorHooks.tsx` (line 44-46)

##### selectedComponentId

```typescript
const [selectedComponentId, setSelectedComponentId] = useState<string | null>(
  null,
);
```

**الموقع**: `components\tenant\live-editor\LiveEditorHooks.tsx` (line 48-50)

##### deleteDialogOpen

```typescript
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
```

**الموقع**: `components\tenant\live-editor\LiveEditorHooks.tsx` (line 52)

##### componentToDelete

```typescript
const [componentToDelete, setComponentToDelete] = useState<string | null>(null);
```

**الموقع**: `components\tenant\live-editor\LiveEditorHooks.tsx` (line 53-55)

##### deletePageDialogOpen

```typescript
const [deletePageDialogOpen, setDeletePageDialogOpen] = useState(false);
```

**الموقع**: `components\tenant\live-editor\LiveEditorHooks.tsx` (line 57)

##### deletePageConfirmation

```typescript
const [deletePageConfirmation, setDeletePageConfirmation] = useState("");
```

**الموقع**: `components\tenant\live-editor\LiveEditorHooks.tsx` (line 58)

##### dropIndicator

```typescript
const [dropIndicator, setDropIndicator] = useState<DropIndicator | null>(null);
```

**الموقع**: `components\tenant\live-editor\LiveEditorHooks.tsx` (line 61-63)

#### Dependencies:

##### 1. useTenantStore

```typescript
const tenantId = useTenantStore((s) => s.tenantId);
const {
  fetchTenantData,
  loading: tenantLoading,
  tenant,
  tenantData,
} = useTenantStore();
```

**الموقع**: `components\tenant\live-editor\LiveEditorHooks.tsx` (line 18, 22-27)

##### 2. useAuth

```typescript
const { user, loading: authLoading } = useAuth();
```

**الموقع**: `components\tenant\live-editor\LiveEditorHooks.tsx` (line 21)

##### 3. useParams

```typescript
const slug = useParams<{ slug?: string }>()?.slug || "homepage";
```

**الموقع**: `components\tenant\live-editor\LiveEditorHooks.tsx` (line 19)

##### 4. createInitialComponents

```typescript
import {
  createInitialComponents,
  PAGE_DEFINITIONS,
} from "@/services-liveeditor/live-editor";
```

**الموقع**: `components\tenant\live-editor\LiveEditorHooks.tsx` (line 8-11)

---

## 4. UnifiedSidebar

**الموقع**: `components\tenant\live-editor\EditorSidebar\UnifiedSidebar.tsx`

### States الموجودة:

- expanded (useState)

### الاستدعاءات والاستخدامات:

#### States Implementation:

##### expanded

```typescript
const [expanded, setExpanded] = useState<Record<string, boolean>>({});
```

**الموقع**: `components\tenant\live-editor\EditorSidebar\UnifiedSidebar.tsx` (line 41)

#### Dependencies:

##### 1. useSidebarStateManager

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

##### 2. useEditorT

```typescript
const t = useEditorT();
```

**الموقع**: `components\tenant\live-editor\EditorSidebar\UnifiedSidebar.tsx` (line 27)

---

## 5. LiveEditorUI

**الموقع**: `components\tenant\live-editor\LiveEditorUI.tsx`

### States الموجودة:

- loaded (useState)
- mountTarget (useState)
- stylesLoaded (useState)
- showChangesDialog (useState)
- previousHasChangesMade (useState)
- backendDataState (useState)
- sidebarWidth (useState)
- selectedDevice (useState)
- iframeReady (useState)
- isComponentsSidebarOpen (useState)
- screenWidth (useState)
- debugInfo (useState)
- showDebugPanel (useState)
- positionValidation (useState)
- showDebugControls (useState)

### الاستدعاءات والاستخدامات:

#### States Implementation:

##### loaded (في AutoFrame)

```typescript
const [loaded, setLoaded] = useState(false);
```

**الموقع**: `components\tenant\live-editor\LiveEditorUI.tsx` (line 256)

##### mountTarget (في AutoFrame)

```typescript
const [mountTarget, setMountTarget] = useState<HTMLElement | null>(null);
```

**الموقع**: `components\tenant\live-editor\LiveEditorUI.tsx` (line 257)

##### stylesLoaded (في AutoFrame)

```typescript
const [stylesLoaded, setStylesLoaded] = useState(false);
```

**الموقع**: `components\tenant\live-editor\LiveEditorUI.tsx` (line 258)

##### showChangesDialog

```typescript
const [showChangesDialog, setShowChangesDialog] = useState(false);
```

**الموقع**: `components\tenant\live-editor\LiveEditorUI.tsx` (line 499)

##### previousHasChangesMade

```typescript
const [previousHasChangesMade, setPreviousHasChangesMade] = useState(false);
```

**الموقع**: `components\tenant\live-editor\LiveEditorUI.tsx` (line 500)

##### backendDataState

```typescript
const [backendDataState, setBackendDataState] = useState<{
  componentsWithMergedData: Array<{
    [key: string]: any;
    mergedData: any;
  }>;
  globalHeaderData: any;
  globalFooterData: any;
}>({
  componentsWithMergedData: [],
  globalHeaderData: null,
  globalFooterData: null,
});
```

**الموقع**: `components\tenant\live-editor\LiveEditorUI.tsx` (line 503-514)

##### sidebarWidth

```typescript
const [sidebarWidth, setSidebarWidth] = useState(state.sidebarWidth);
```

**الموقع**: `components\tenant\live-editor\LiveEditorUI.tsx` (line 709)

##### selectedDevice

```typescript
const [selectedDevice, setSelectedDevice] = useState<DeviceType>("laptop");
```

**الموقع**: `components\tenant\live-editor\LiveEditorUI.tsx` (line 710)

##### iframeReady

```typescript
const [iframeReady, setIframeReady] = useState(false);
```

**الموقع**: `components\tenant\live-editor\LiveEditorUI.tsx` (line 711)

##### isComponentsSidebarOpen

```typescript
const [isComponentsSidebarOpen, setIsComponentsSidebarOpen] = useState(false);
```

**الموقع**: `components\tenant\live-editor\LiveEditorUI.tsx` (line 712)

##### screenWidth

```typescript
const [screenWidth, setScreenWidth] = useState(0);
```

**الموقع**: `components\tenant\live-editor\LiveEditorUI.tsx` (line 717)

##### debugInfo

```typescript
const [debugInfo, setDebugInfo] = useState<PositionDebugInfo | null>(null);
```

**الموقع**: `components\tenant\live-editor\LiveEditorUI.tsx` (line 721)

##### showDebugPanel

```typescript
const [showDebugPanel, setShowDebugPanel] = useState(false);
```

**الموقع**: `components\tenant\live-editor\LiveEditorUI.tsx` (line 722)

##### positionValidation

```typescript
const [positionValidation, setPositionValidation] = useState<ReturnType<
  typeof validatePosition
> | null>(null);
```

**الموقع**: `components\tenant\live-editor\LiveEditorUI.tsx` (line 723-725)

##### showDebugControls

```typescript
const [showDebugControls, setShowDebugControls] = useState(false);
```

**الموقع**: `components\tenant\live-editor\LiveEditorUI.tsx` (line 726)

#### Dependencies:

##### 1. useEditorStore

```typescript
const globalHeaderData = useEditorStore((s) => s.globalHeaderData);
const globalFooterData = useEditorStore((s) => s.globalFooterData);
const globalHeaderVariantFromStore = useEditorStore(
  (s) => s.globalHeaderVariant,
);
const globalFooterVariantFromStore = useEditorStore(
  (s) => s.globalFooterVariant,
);
const themeChangeTimestamp = useEditorStore((s) => s.themeChangeTimestamp);
const setGlobalHeaderData = useEditorStore((s) => s.setGlobalHeaderData);
const setGlobalFooterData = useEditorStore((s) => s.setGlobalFooterData);
const hasChangesMade = useEditorStore((s) => s.hasChangesMade);
```

**الموقع**: `components\tenant\live-editor\LiveEditorUI.tsx` (line 487-498)

##### 2. useTenantStore

```typescript
const tenantData = useTenantStore((s) => s.tenantData);
```

**الموقع**: `components\tenant\live-editor\LiveEditorUI.tsx` (line 517)

##### 3. useEditorT

```typescript
const t = useEditorT();
```

**الموقع**: `components\tenant\live-editor\LiveEditorUI.tsx` (line 467)

##### 4. EnhancedLiveEditorDragDropContext

```typescript
import { EnhancedLiveEditorDragDropContext } from "@/services-liveeditor/live-editor/dragDrop/EnhancedLiveEditorDragDropContext";
```

**الموقع**: `components\tenant\live-editor\LiveEditorUI.tsx` (line 27)

---

## 6. ComponentsSidebar

**الموقع**: `components\tenant\live-editor\ComponentsSidebar.tsx`

### States الموجودة:

- isExpanded (useState)
- searchTerm (useState)
- isBasicComponentsDropdownOpen (useState)

### الاستدعاءات والاستخدامات:

#### States Implementation:

##### isExpanded

```typescript
const [isExpanded, setIsExpanded] = useState(true);
```

**الموقع**: `components\tenant\live-editor\ComponentsSidebar.tsx` (line 57)

##### searchTerm

```typescript
const [searchTerm, setSearchTerm] = useState("");
```

**الموقع**: `components\tenant\live-editor\ComponentsSidebar.tsx` (line 58)

##### isBasicComponentsDropdownOpen

```typescript
const [isBasicComponentsDropdownOpen, setIsBasicComponentsDropdownOpen] =
  useState(true);
```

**الموقع**: `components\tenant\live-editor\ComponentsSidebar.tsx` (line 59)

#### Dependencies:

##### 1. useEditorT

```typescript
const t = useEditorT();
```

**الموقع**: `components\tenant\live-editor\ComponentsSidebar.tsx` (line 60)

##### 2. getAvailableSectionsTranslated

```typescript
const availableSections = useMemo(() => {
  return getAvailableSectionsTranslated(t);
}, [t]);
```

**الموقع**: `components\tenant\live-editor\ComponentsSidebar.tsx` (line 63-65)

---

## 7. ThemeChangeDialog

**الموقع**: `components\tenant\live-editor\ThemeChangeDialog.tsx`

### States الموجودة:

- selectedTheme (useState)
- showWarning (useState)
- isApplying (useState)

### الاستدعاءات والاستخدامات:

#### States Implementation:

##### selectedTheme

```typescript
const [selectedTheme, setSelectedTheme] = useState<ThemeNumber | null>(null);
```

**الموقع**: `components\tenant\live-editor\ThemeChangeDialog.tsx` (line 60)

##### showWarning

```typescript
const [showWarning, setShowWarning] = useState(false);
```

**الموقع**: `components\tenant\live-editor\ThemeChangeDialog.tsx` (line 61)

##### isApplying

```typescript
const [isApplying, setIsApplying] = useState(false);
```

**الموقع**: `components\tenant\live-editor\ThemeChangeDialog.tsx` (line 62)

#### Dependencies:

##### 1. useEditorT و useEditorLocale

```typescript
import {
  useEditorT,
  useEditorLocale,
} from "@/context-liveeditor/editorI18nStore";
const t = useEditorT();
const { locale } = useEditorLocale();
```

**الموقع**: `components\tenant\live-editor\ThemeChangeDialog.tsx` (line 13, 58-59)

---

## 8. ThemeSelector

**الموقع**: `components\tenant\live-editor\ThemeSelector.tsx`

### States الموجودة:

- isOpen (useState)
- selectedTheme (useState)
- themeOptions (useState)

### الاستدعاءات والاستخدامات:

#### States Implementation:

##### isOpen

```typescript
const [isOpen, setIsOpen] = useState(false);
```

**الموقع**: `components\tenant\live-editor\ThemeSelector.tsx` (line 40)

##### selectedTheme

```typescript
const [selectedTheme, setSelectedTheme] = useState(currentTheme);
```

**الموقع**: `components\tenant\live-editor\ThemeSelector.tsx` (line 41)

```typescript
useEffect(() => {
  setSelectedTheme(currentTheme);
}, [currentTheme]);
```

**الموقع**: `components\tenant\live-editor\ThemeSelector.tsx` (line 44-46)

##### themeOptions

```typescript
const [themeOptions, setThemeOptions] = useState<Record<string, ThemeOption[]>>(
  {},
);
```

**الموقع**: `components\tenant\live-editor\ThemeSelector.tsx` (line 48-50)

#### Dependencies:

##### 1. useEditorT

```typescript
const t = useEditorT();
```

**الموقع**: `components\tenant\live-editor\ThemeSelector.tsx` (line 39)

---

## 9. LanguageDropdown

**الموقع**: `components\tenant\live-editor\LanguageDropdown.tsx`

### States الموجودة:

- isChanging (useState)
- selectedLang (useState)
- isOpen (useState)

### الاستدعاءات والاستخدامات:

#### States Implementation:

##### isChanging

```typescript
const [isChanging, setIsChanging] = useState(false);
```

**الموقع**: `components\tenant\live-editor\LanguageDropdown.tsx` (line 26)

##### selectedLang

```typescript
const [selectedLang, setSelectedLang] = useState<string>("");
```

**الموقع**: `components\tenant\live-editor\LanguageDropdown.tsx` (line 27)

##### isOpen

```typescript
const [isOpen, setIsOpen] = useState(false);
```

**الموقع**: `components\tenant\live-editor\LanguageDropdown.tsx` (line 28)

#### Dependencies:

##### 1. useEditorLocale

```typescript
import { useEditorLocale } from "@/context-liveeditor/editorI18nStore";
const { setLocale } = useEditorLocale();
```

**الموقع**: `components\tenant\live-editor\LanguageDropdown.tsx` (line 11, 25)

##### 2. useRouter

```typescript
const router = useRouter();
```

**الموقع**: `components\tenant\live-editor\LanguageDropdown.tsx` (line 24)

---

## 10. LiveEditorLayout (AddPageDialog)

**الموقع**: `app\live-editor\layout.tsx`

### States الموجودة:

- internalOpen (useState)
- isLoading (useState)
- formData (useState)
- errors (useState)
- showAdvanced (useState)

### الاستدعاءات والاستخدامات:

#### States Implementation:

##### internalOpen

```typescript
const [internalOpen, setInternalOpen] = useState(false);
```

**الموقع**: `app\live-editor\layout.tsx` (line 53)

##### isLoading

```typescript
const [isLoading, setIsLoading] = useState(false);
```

**الموقع**: `app\live-editor\layout.tsx` (line 56)

##### formData

```typescript
const [formData, setFormData] = useState({
  slug: "",
  // Basic Meta Tags
  TitleAr: "",
  TitleEn: "",
  DescriptionAr: "",
  DescriptionEn: "",
  KeywordsAr: "",
  KeywordsEn: "",
  // Advanced Meta Tags
  Author: "",
  AuthorEn: "",
  Robots: "",
  RobotsEn: "",
  // Open Graph
  "og:title": "",
  "og:description": "",
  "og:keywords": "",
  "og:author": "",
  "og:robots": "",
  "og:url": "",
  "og:image": "",
  "og:type": "",
  "og:locale": "",
  "og:locale:alternate": "",
  "og:site_name": "",
  "og:image:width": "",
  "og:image:height": "",
  "og:image:type": "",
  "og:image:alt": "",
});
```

**الموقع**: `app\live-editor\layout.tsx` (line 57-87)

##### errors

```typescript
const [errors, setErrors] = useState<Record<string, string>>({});
```

**الموقع**: `app\live-editor\layout.tsx` (line 88)

##### showAdvanced

```typescript
const [showAdvanced, setShowAdvanced] = useState(false);
```

**الموقع**: `app\live-editor\layout.tsx` (line 89)

#### Dependencies:

##### 1. useEditorT و useEditorLocale

```typescript
const t = useEditorT();
const { locale } = useEditorLocale();
```

**الموقع**: `app\live-editor\layout.tsx` (line 90, 95)

##### 2. useTenantStore

```typescript
const { tenantData } = useTenantStore();
```

**الموقع**: `app\live-editor\layout.tsx` (line 92)

##### 3. useAuthStore

```typescript
const { userData } = useAuthStore();
```

**الموقع**: `app\live-editor\layout.tsx` (line 93)

---

## 11. LiveEditorLayout (Main Component)

**الموقع**: `app\live-editor\layout.tsx`

### States الموجودة:

- recentlyAddedPages (useState)
- isDropdownOpen (useState)
- isPagesDropdownOpen (useState)
- isAddPageDialogOpen (useState)
- isThemeDialogOpen (useState)
- isLoading (useState)
- showAdvanced (useState)
- formData (useState)
- errors (useState)
- showArrowTooltip (useState)
- previousHasChangesMade (useState)

### الاستدعاءات والاستخدامات:

#### States Implementation:

##### recentlyAddedPages

```typescript
const [recentlyAddedPages, setRecentlyAddedPages] = useState<string[]>([]);
```

**الموقع**: `app\live-editor\layout.tsx` (line 905)

##### isDropdownOpen

```typescript
const [isDropdownOpen, setIsDropdownOpen] = useState(false);
```

**الموقع**: `app\live-editor\layout.tsx` (line 906)

##### isPagesDropdownOpen

```typescript
const [isPagesDropdownOpen, setIsPagesDropdownOpen] = useState(false);
```

**الموقع**: `app\live-editor\layout.tsx` (line 907)

##### isAddPageDialogOpen

```typescript
const [isAddPageDialogOpen, setIsAddPageDialogOpen] = useState(false);
```

**الموقع**: `app\live-editor\layout.tsx` (line 908)

##### isThemeDialogOpen

```typescript
const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);
```

**الموقع**: `app\live-editor\layout.tsx` (line 909)

##### isLoading

```typescript
const [isLoading, setIsLoading] = useState(false);
```

**الموقع**: `app\live-editor\layout.tsx` (line 910)

##### showAdvanced

```typescript
const [showAdvanced, setShowAdvanced] = useState(false);
```

**الموقع**: `app\live-editor\layout.tsx` (line 911)

##### formData

```typescript
const [formData, setFormData] = useState({
  slug: "",
  // ... same structure as AddPageDialog
});
```

**الموقع**: `app\live-editor\layout.tsx` (line 930-961)

##### errors

```typescript
const [errors, setErrors] = useState<Record<string, string>>({});
```

**الموقع**: `app\live-editor\layout.tsx` (line 961)

##### showArrowTooltip

```typescript
const [showArrowTooltip, setShowArrowTooltip] = useState(false);
```

**الموقع**: `app\live-editor\layout.tsx` (line 3302)

##### previousHasChangesMade

```typescript
const [previousHasChangesMade, setPreviousHasChangesMade] = useState(false);
```

**الموقع**: `app\live-editor\layout.tsx` (line 3303)

#### Dependencies:

##### 1. useEditorStore

```typescript
const requestSave = useEditorStore((state) => state.requestSave);
const editorStoreWebsiteLayout = useEditorStore((state) => state.WebsiteLayout);
const currentTheme = useEditorStore(
  (state) => state.WebsiteLayout?.currentTheme,
);
const hasChangesMade = useEditorStore((s) => s.hasChangesMade);
```

**الموقع**: `app\live-editor\layout.tsx` (line 897, 1006-1008, 1010, 3304)

##### 2. useEditorLocale و useEditorT

```typescript
const { locale } = useEditorLocale();
const t = useEditorT();
const { setLocale } = useEditorLocale();
```

**الموقع**: `app\live-editor\layout.tsx` (line 904, 962, 3297-3298)

---

## 12. ModernColorPicker

**الموقع**: `components\tenant\live-editor\EditorSidebar\components\ModernColorPicker.tsx`

### States الموجودة:

- isOpen (useState)
- hue (useState)
- saturation (useState)
- lightness (useState)
- alpha (useState)
- hexInput (useState)

### الاستدعاءات والاستخدامات:

#### States Implementation:

##### isOpen

```typescript
const [isOpen, setIsOpen] = useState(false);
```

**الموقع**: `components\tenant\live-editor\EditorSidebar\components\ModernColorPicker.tsx` (line 15)

##### hue

```typescript
const [hue, setHue] = useState(0);
```

**الموقع**: `components\tenant\live-editor\EditorSidebar\components\ModernColorPicker.tsx` (line 16)

##### saturation

```typescript
const [saturation, setSaturation] = useState(100);
```

**الموقع**: `components\tenant\live-editor\EditorSidebar\components\ModernColorPicker.tsx` (line 17)

##### lightness

```typescript
const [lightness, setLightness] = useState(50);
```

**الموقع**: `components\tenant\live-editor\EditorSidebar\components\ModernColorPicker.tsx` (line 18)

##### alpha

```typescript
const [alpha, setAlpha] = useState(1);
```

**الموقع**: `components\tenant\live-editor\EditorSidebar\components\ModernColorPicker.tsx` (line 19)

##### hexInput

```typescript
const [hexInput, setHexInput] = useState(value || "#000000");
```

**الموقع**: `components\tenant\live-editor\EditorSidebar\components\ModernColorPicker.tsx` (line 20)

---

## 13. ArrayFieldRenderer

**الموقع**: `components\tenant\live-editor\EditorSidebar\components\FieldRenderers\ArrayFieldRenderer.tsx`

### States الموجودة:

- expanded (useState)
- allCollapsed (useState)
- nestedExpanded (useState)
- fieldTypes (useState)

### الاستدعاءات والاستخدامات:

#### States Implementation:

##### expanded

```typescript
const [expanded, setExpanded] = useState<Record<string, boolean>>({});
```

**الموقع**: `components\tenant\live-editor\EditorSidebar\components\FieldRenderers\ArrayFieldRenderer.tsx` (line 22)

##### allCollapsed

```typescript
const [allCollapsed, setAllCollapsed] = useState(false);
```

**الموقع**: `components\tenant\live-editor\EditorSidebar\components\FieldRenderers\ArrayFieldRenderer.tsx` (line 23)

##### nestedExpanded

```typescript
const [nestedExpanded, setNestedExpanded] = useState<Record<string, boolean>>(
  {},
);
```

**الموقع**: `components\tenant\live-editor\EditorSidebar\components\FieldRenderers\ArrayFieldRenderer.tsx` (line 24-26)

##### fieldTypes

```typescript
const [fieldTypes, setFieldTypes] = useState<Record<string, string>>({});
```

**الموقع**: `components\tenant\live-editor\EditorSidebar\components\FieldRenderers\ArrayFieldRenderer.tsx` (line 27)

---

## 14. FieldRenderers

**الموقع**: `components\tenant\live-editor\EditorSidebar\components\FieldRenderers.tsx`

### States الموجودة:

- localValue (useState)
- isUploading (useState)

### الاستدعاءات والاستخدامات:

#### States Implementation:

##### localValue

```typescript
const [localValue, setLocalValue] = useState(stringValue);
```

**الموقع**: `components\tenant\live-editor\EditorSidebar\components\FieldRenderers.tsx` (line 27)

```typescript
React.useEffect(() => {
  setLocalValue(stringValue);
}, [stringValue]);
```

**الموقع**: `components\tenant\live-editor\EditorSidebar\components\FieldRenderers.tsx` (line 30-32)

##### isUploading

```typescript
const [isUploading, setIsUploading] = useState(false);
```

**الموقع**: `components\tenant\live-editor\EditorSidebar\components\FieldRenderers.tsx` (line 134)

---

## 15. BrandingSettings

**الموقع**: `components\tenant\live-editor\EditorSidebar\components\BrandingSettings.tsx`

### States الموجودة:

- brandingData (useState)

### الاستدعاءات والاستخدامات:

#### States Implementation:

##### brandingData

```typescript
const [brandingData, setBrandingData] = useState({
  colors: {
    primary: "",
    secondary: "",
    accent: "",
  },
  mainBgColor: "",
});
```

**الموقع**: `components\tenant\live-editor\EditorSidebar\components\BrandingSettings.tsx` (line 18-25)

#### Dependencies:

##### 1. useEditorStore

```typescript
const { WebsiteLayout, setWebsiteLayout } = useEditorStore();
```

**الموقع**: `components\tenant\live-editor\EditorSidebar\components\BrandingSettings.tsx` (line 14-16)

---

## ملخص العلاقات:

### Component States تستخدم:

#### Zustand Stores:

- **useEditorStore**: LiveEditorUI, BrandingSettings, LiveEditorLayout
- **useTenantStore**: LiveEditorHooks, LiveEditorLayout
- **useEditorI18nStore**: UnifiedSidebar, ComponentsSidebar, ThemeChangeDialog, ThemeSelector, LanguageDropdown, LiveEditorLayout

#### React Contexts:

- **dropZoneContext**: DraggableComponent
- **ZoneStoreContext**: DraggableComponent
- **useSidebarStateManager**: UnifiedSidebar

#### Hooks:

- **useAuth**: LiveEditorHooks
- **useParams**: LiveEditorHooks
- **useRouter**: LanguageDropdown
- **useEditorT**: UnifiedSidebar, ComponentsSidebar, ThemeChangeDialog, ThemeSelector
- **useEditorLocale**: ThemeChangeDialog, LanguageDropdown, LiveEditorLayout

#### Services/Functions:

- **createInitialComponents**: LiveEditorHooks
- **getAvailableSectionsTranslated**: ComponentsSidebar

### Component Hierarchy:

```
LiveEditorLayout (app/live-editor/layout.tsx)
│
├─ LiveEditorHooks (components/tenant/live-editor/LiveEditorHooks.tsx)
│  └─ Returns states to LiveEditor component
│
└─ LiveEditorUI (components/tenant/live-editor/LiveEditorUI.tsx)
   │
   ├─ ComponentsSidebar
   ├─ UnifiedSidebar
   │  └─ EditorSidebar components:
   │     ├─ ModernColorPicker
   │     ├─ ArrayFieldRenderer
   │     ├─ FieldRenderers
   │     └─ BrandingSettings
   │
   ├─ ThemeChangeDialog
   ├─ ThemeSelector
   └─ LanguageDropdown
```

### ملاحظات مهمة:

1. **LiveEditorHooks**: يوفر جميع الـ states الأساسية للـ Live Editor عبر custom hook
2. **LiveEditorUI**: المكون الرئيسي الذي يجمع جميع الـ components والـ states
3. **EditorSidebar Components**: ModernColorPicker, ArrayFieldRenderer, FieldRenderers, BrandingSettings - جميعها تستخدم useState محلي
4. **Dialog Components**: ThemeChangeDialog, ThemeSelector, LanguageDropdown - كلها تستخدم useState لإدارة UI state
5. **LiveEditorLayout**: يحتوي على states متعددة لإدارة الصفحات والـ dialogs

---

## ملخص شامل:

### إحصائيات Component Local States:

#### حسب النوع:

- **Drag & Drop Components**: 2 (DraggableComponent, useSensors)
- **Live Editor Core**: 2 (LiveEditorHooks, LiveEditorUI)
- **Sidebar Components**: 1 (UnifiedSidebar)
- **UI Components**: 3 (ComponentsSidebar, ThemeChangeDialog, ThemeSelector, LanguageDropdown)
- **Layout Components**: 1 (LiveEditorLayout - مع 2 sub-components)
- **EditorSidebar Components**: 4 (ModernColorPicker, ArrayFieldRenderer, FieldRenderers, BrandingSettings)

#### إجمالي:

- **إجمالي Components**: 15 components
- **إجمالي useState Hooks**: 60+ useState hook
- **إجمالي States**: 60+ state
- **إجمالي الاستدعاءات**: 100+ استدعاء

#### أكثر Components استخداماً للـ States:

1. **LiveEditorUI**: 15 states
2. **LiveEditorHooks**: 13 states
3. **LiveEditorLayout (Main)**: 11 states
4. **ModernColorPicker**: 6 states
5. **ArrayFieldRenderer**: 4 states

#### العلاقات:

- **LiveEditorHooks** → يوفر states لـ LiveEditor component
- **LiveEditorUI** → يستخدم states من LiveEditorHooks + states محلية
- **EditorSidebar Components** → تستخدم useState محلي فقط
- **Dialog Components** → تستخدم useState لإدارة UI state
- **Layout Components** → تستخدم useState لإدارة forms و dialogs
