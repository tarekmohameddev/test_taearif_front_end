# Drag & Drop Contexts - جميع الاستدعاءات والعلاقات

## 1. EnhancedLiveEditorDragDropContext

**الموقع**: `services-liveeditor\live-editor\dragDrop\EnhancedLiveEditorDragDropContext.tsx`

### States الموجودة:

- dragListeners (useState)
- zoneStore (useMemo)

### الاستدعاءات والاستخدامات:

#### 1. Import Statement

```typescript
import { EnhancedLiveEditorDragDropContext } from "@/services-liveeditor/live-editor/dragDrop/EnhancedLiveEditorDragDropContext";
```

**المواقع**:

- `components\tenant\live-editor\LiveEditorUI\index.tsx` (line 6)

#### 2. استخدام EnhancedLiveEditorDragDropContext:

```typescript
<EnhancedLiveEditorDragDropContext
  onComponentAdd={handleAddComponent}
  onComponentMove={handleMoveComponent}
  components={pageComponents}
  onPositionDebug={handlePositionDebug}
  disableAutoScroll={false}
  iframeRef={iframeRef}
>
  {/* children */}
</EnhancedLiveEditorDragDropContext>
```

**الموقع**: `components\tenant\live-editor\LiveEditorUI\index.tsx` (line 287-294)

### Implementation Details:

#### Component Props:

```typescript
interface EnhancedLiveEditorDragDropContextProps {
  children: React.ReactNode;
  components: any[];
  onComponentMove?: (
    sourceIndex: number,
    sourceZone: string,
    finalIndex: number,
    destinationZone: string,
    updatedComponents?: any[],
    debugInfo?: PositionDebugInfo,
  ) => void;
  onComponentAdd?: (data: {
    type: string;
    index: number;
    zone: string;
    variant?: string;
    sourceData?: any;
  }) => void;
  onPositionDebug?: (debugInfo: PositionDebugInfo) => void;
  id?: string;
  iframeRef?: React.RefObject<HTMLIFrameElement>;
}
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\EnhancedLiveEditorDragDropContext.tsx` (line 46-67)

#### States داخل Component:

##### dragListeners

```typescript
const [dragListeners, setDragListeners] = useState<{
  [id: string]: (event: DragDropEvents["dragstart"]) => void;
}>({});
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\EnhancedLiveEditorDragDropContext.tsx` (line 78-80)

```typescript
<dragListenerContext.Provider
  value={{
    dragListeners,
    setDragListeners,
  }}
>
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\EnhancedLiveEditorDragDropContext.tsx` (line 150-155)

##### zoneStore

```typescript
const zoneStore = useMemo(() => createZoneStore(), []);
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\EnhancedLiveEditorDragDropContext.tsx` (line 84)

```typescript
<ZoneStoreProvider store={zoneStore}>
  <DropZoneProvider value={nextContextValue}>
    {children}
  </DropZoneProvider>
</ZoneStoreProvider>
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\EnhancedLiveEditorDragDropContext.tsx` (line 621-625)

#### Dependencies:

##### 1. createZoneStore

```typescript
import { createZoneStore, ZoneStoreType, Preview } from "./zoneStore";
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\EnhancedLiveEditorDragDropContext.tsx` (line 15)

##### 2. ZoneStoreProvider و DropZoneProvider

```typescript
import {
  DropZoneContext,
  ZoneStoreProvider,
  DropZoneProvider,
} from "./zoneContext";
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\EnhancedLiveEditorDragDropContext.tsx` (line 16-20)

##### 3. useLiveEditorSensors

```typescript
import { useLiveEditorSensors } from "./useSensors";
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\EnhancedLiveEditorDragDropContext.tsx` (line 21)

```typescript
const sensors = useLiveEditorSensors();
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\EnhancedLiveEditorDragDropContext.tsx` (line 82)

##### 4. positionTracker و trackComponentMove

```typescript
import {
  positionTracker,
  trackComponentMove,
  PositionDebugInfo,
} from "./enhanced-position-tracker";
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\EnhancedLiveEditorDragDropContext.tsx` (line 22-26)

```typescript
const result = trackComponentMove(
  components,
  sourceIndex,
  sourceZone,
  destinationIndex,
  destinationZone,
);
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\EnhancedLiveEditorDragDropContext.tsx` (line 111-117)

##### 5. DragDropProvider من @dnd-kit/react

```typescript
import { DragDropProvider } from "@dnd-kit/react";
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\EnhancedLiveEditorDragDropContext.tsx` (line 10)

##### 6. AutoScroller و defaultPreset من @dnd-kit/dom

```typescript
import { AutoScroller, defaultPreset, DragDropManager } from "@dnd-kit/dom";
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\EnhancedLiveEditorDragDropContext.tsx` (line 11)

---

## 2. dragListenerContext (في EnhancedLiveEditorDragDropContext)

**الموقع**: `services-liveeditor\live-editor\dragDrop\EnhancedLiveEditorDragDropContext.tsx`

### Context Definition:

```typescript
const dragListenerContext = createContext<{
  dragListeners: { [id: string]: (event: DragDropEvents["dragstart"]) => void };
  setDragListeners: React.Dispatch<
    React.SetStateAction<{
      [id: string]: (event: DragDropEvents["dragstart"]) => void;
    }>
  >;
}>({
  dragListeners: {},
  setDragListeners: () => {},
});
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\EnhancedLiveEditorDragDropContext.tsx` (line 31-41)

### Hook للاستخدام:

```typescript
export const useDragListener = () => useContext(dragListenerContext);
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\EnhancedLiveEditorDragDropContext.tsx` (line 43)

### Context Provider:

```typescript
<dragListenerContext.Provider
  value={{
    dragListeners,
    setDragListeners,
  }}
>
  {/* children */}
</dragListenerContext.Provider>
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\EnhancedLiveEditorDragDropContext.tsx` (line 150-155)

### الاستخدام في onDragStart:

```typescript
onDragStart={(event, manager) => {
  const { source } = event.operation;

  const listener = dragListeners[source?.id?.toString() || ""];
  if (listener) {
    listener(event);
  }

  const isNewComponent =
    source?.id?.toString().startsWith("new-component") ||
    source?.id?.toString().startsWith("drawer-item-");
}}
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\EnhancedLiveEditorDragDropContext.tsx` (line 608-619)

---

## 3. ZoneStoreContext

**الموقع**: `services-liveeditor\live-editor\dragDrop\zoneContext.tsx`

### Context Definition:

```typescript
export const ZoneStoreContext = createContext<ZoneStoreType | null>(null);
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\zoneContext.tsx` (line 15)

### Type:

```typescript
import { ZoneStoreType } from "./zoneStore";
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\zoneContext.tsx` (line 2)

### Provider Component:

```typescript
export const ZoneStoreProvider = ({
  children,
  store,
}: {
  children: ReactNode;
  store: ZoneStoreType;
}) => (
  <ZoneStoreContext.Provider value={store}>
    {children}
  </ZoneStoreContext.Provider>
);
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\zoneContext.tsx` (line 19-29)

### الاستدعاءات:

#### Import Statement

```typescript
import { ZoneStoreProvider, DropZoneProvider } from "./zoneContext";
```

**المواقع**:

- `services-liveeditor\live-editor\dragDrop\EnhancedLiveEditorDragDropContext.tsx` (line 18-20)
- `services-liveeditor\live-editor\dragDrop\LiveEditorDragDropContext.tsx` (line 21-23)
- `services-liveeditor\live-editor\dragDrop\index.ts` (line 8-9)

#### استخدام ZoneStoreProvider:

```typescript
<ZoneStoreProvider store={zoneStore}>
  <DropZoneProvider value={nextContextValue}>
    {children}
  </DropZoneProvider>
</ZoneStoreProvider>
```

**المواقع**:

- `services-liveeditor\live-editor\dragDrop\EnhancedLiveEditorDragDropContext.tsx` (line 621-625)
- `services-liveeditor\live-editor\dragDrop\LiveEditorDragDropContext.tsx` (line 362-366)

---

## 4. dropZoneContext

**الموقع**: `services-liveeditor\live-editor\dragDrop\zoneContext.tsx`

### Context Definition:

```typescript
export const dropZoneContext = createContext<DropZoneContext | null>(null);
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\zoneContext.tsx` (line 17)

### Interface:

```typescript
export interface DropZoneContext {
  mode: "edit" | "render";
  areaId: string;
  depth: number;
  zoneCompound?: string;
  index?: number;
  registerLocalZone?: (zoneCompound: string, active: boolean) => void;
  unregisterLocalZone?: (zoneCompound: string) => void;
  registerZone?: (zoneCompound: string) => void;
}
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\zoneContext.tsx` (line 4-13)

### Provider Component:

```typescript
export const DropZoneProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: DropZoneContext;
}) => (
  <dropZoneContext.Provider value={value}>{children}</dropZoneContext.Provider>
);
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\zoneContext.tsx` (line 31-39)

### الاستدعاءات:

#### استخدام DropZoneProvider:

```typescript
const nextContextValue = useMemo<DropZoneContext>(
  () => ({
    mode: "edit",
    areaId: "root",
    depth: 0,
  }),
  [],
);

<DropZoneProvider value={nextContextValue}>
  {children}
</DropZoneProvider>
```

**المواقع**:

- `services-liveeditor\live-editor\dragDrop\EnhancedLiveEditorDragDropContext.tsx` (line 139-146, 622-624)
- `services-liveeditor\live-editor\dragDrop\LiveEditorDragDropContext.tsx` (line 185-192, 363-365)

---

## 5. LiveEditorDragDropContext

**الموقع**: `services-liveeditor\live-editor\dragDrop\LiveEditorDragDropContext.tsx`

### States الموجودة:

- zoneStore (useState)
- plugins (useState)
- dragListeners (useState)

### الاستدعاءات والاستخدامات:

#### 1. Import Statement

```typescript
import { LiveEditorDragDropContext } from "@/services-liveeditor/live-editor/dragDrop/LiveEditorDragDropContext";
```

**المواقع**:

- `components\tenant\live-editor\LiveEditorUI\index.tsx` (line 6)

**ملاحظة**: LiveEditorDragDropContext موجود في الكود لكن يبدو أنه غير مستخدم حالياً. الـ EnhancedLiveEditorDragDropContext هو المستخدم.

### Implementation Details:

#### Component Props:

```typescript
type LiveEditorDragDropContextProps = {
  children: ReactNode;
  disableAutoScroll?: boolean;
  onComponentAdd?: (componentData: any) => void;
  onComponentMove?: (
    sourceIndex: number,
    sourceZone: string,
    destinationIndex: number,
    destinationZone: string,
  ) => void;
};
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\LiveEditorDragDropContext.tsx` (line 66-76)

#### States داخل Component:

##### zoneStore

```typescript
const [zoneStore] = useState(() => createZoneStore());
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\LiveEditorDragDropContext.tsx` (line 92)

```typescript
zoneStore.setState({
  zoneDepthIndex: params.zone ? { [params.zone]: true } : {},
  areaDepthIndex: params.area ? { [params.area]: true } : {},
});
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\LiveEditorDragDropContext.tsx` (line 128-131)

```typescript
zoneStore.setState({
  draggedItem: null,
  previewIndex: {},
});
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\LiveEditorDragDropContext.tsx` (line 216-219)

##### plugins

```typescript
const [plugins] = useState(() => {
  const basePlugins = [];

  try {
    if (defaultPreset?.plugins) {
      const filteredPlugins = disableAutoScroll
        ? defaultPreset.plugins.filter(
            (plugin) => plugin && plugin !== AutoScroller,
          )
        : defaultPreset.plugins.filter((plugin) => plugin);

      basePlugins.push(...filteredPlugins);
    }
  } catch (error) {
    console.warn("Error loading default plugins:", error);
  }

  return basePlugins;
});
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\LiveEditorDragDropContext.tsx` (line 153-175)

##### dragListeners

```typescript
const [dragListeners, setDragListeners] = useState<DragCbs>({});
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\LiveEditorDragDropContext.tsx` (line 179)

---

## 6. dragListenerContext (في LiveEditorDragDropContext)

**الموقع**: `services-liveeditor\live-editor\dragDrop\LiveEditorDragDropContext.tsx`

### Context Definition:

```typescript
const dragListenerContext = createContext<{
  dragListeners: DragCbs;
  setDragListeners?: Dispatch<SetStateAction<DragCbs>>;
}>({
  dragListeners: {},
});
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\LiveEditorDragDropContext.tsx` (line 33-38)

### Types:

```typescript
type Events = DragDropEvents<Draggable, Droppable, DragDropManager>;
type DragCbs = Partial<{ [eventName in keyof Events]: Events[eventName][] }>;
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\LiveEditorDragDropContext.tsx` (line 30-31)

### Hook للاستخدام:

```typescript
export function useDragListener(
  type: EventKeys,
  fn: Events[EventKeys],
  deps: any[] = [],
) {
  const { setDragListeners } = useContext(dragListenerContext);

  useEffect(() => {
    if (setDragListeners) {
      setDragListeners((old) => ({
        ...old,
        [type]: [...(old[type] || []), fn],
      }));
    }
  }, deps);
}
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\LiveEditorDragDropContext.tsx` (line 42-57)

### Context Provider:

```typescript
<dragListenerContext.Provider
  value={{
    dragListeners,
    setDragListeners,
  }}
>
  {/* children */}
</dragListenerContext.Provider>
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\LiveEditorDragDropContext.tsx` (line 196-200)

---

## 7. ZoneStoreProvider

**الموقع**: `services-liveeditor\live-editor\dragDrop\zoneContext.tsx`

### الوصف:

Provider component يوفر zoneStore (Zustand store) عبر React Context.

### Implementation:

```typescript
export const ZoneStoreProvider = ({
  children,
  store,
}: {
  children: ReactNode;
  store: ZoneStoreType;
}) => (
  <ZoneStoreContext.Provider value={store}>
    {children}
  </ZoneStoreContext.Provider>
);
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\zoneContext.tsx` (line 19-29)

### الاستخدام:

```typescript
const zoneStore = useMemo(() => createZoneStore(), []);

<ZoneStoreProvider store={zoneStore}>
  <DropZoneProvider value={nextContextValue}>
    {children}
  </DropZoneProvider>
</ZoneStoreProvider>
```

**المواقع**:

- `services-liveeditor\live-editor\dragDrop\EnhancedLiveEditorDragDropContext.tsx` (line 84, 621-625)
- `services-liveeditor\live-editor\dragDrop\LiveEditorDragDropContext.tsx` (line 92, 362-366)

### العلاقات:

- **يستخدم**: ZoneStoreContext (React Context)
- **يستقبل**: zoneStore (Zustand store من createZoneStore)
- **يوفر**: zoneStore للأطفال عبر Context

---

## 8. DropZoneProvider

**الموقع**: `services-liveeditor\live-editor\dragDrop\zoneContext.tsx`

### الوصف:

Provider component يوفر DropZoneContext (configuration للـ drop zones) عبر React Context.

### Implementation:

```typescript
export const DropZoneProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: DropZoneContext;
}) => (
  <dropZoneContext.Provider value={value}>{children}</dropZoneContext.Provider>
);
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\zoneContext.tsx` (line 31-39)

### الاستخدام:

```typescript
const nextContextValue = useMemo<DropZoneContext>(
  () => ({
    mode: "edit",
    areaId: "root",
    depth: 0,
  }),
  [],
);

<DropZoneProvider value={nextContextValue}>
  {children}
</DropZoneProvider>
```

**المواقع**:

- `services-liveeditor\live-editor\dragDrop\EnhancedLiveEditorDragDropContext.tsx` (line 139-146, 622-624)
- `services-liveeditor\live-editor\dragDrop\LiveEditorDragDropContext.tsx` (line 185-192, 363-365)

### العلاقات:

- **يستخدم**: dropZoneContext (React Context)
- **يستقبل**: DropZoneContext value (configuration object)
- **يوفر**: DropZoneContext للأطفال عبر Context

---

## Provider Hierarchy:

```
EnhancedLiveEditorDragDropContext
│
├─ dragListenerContext.Provider
│  │  Provides: dragListeners, setDragListeners
│  │
│  └─ DragDropProvider (@dnd-kit/react)
│     │  Provides: Drag & Drop functionality
│     │
│     └─ ZoneStoreProvider
│        │  Provides: zoneStore (Zustand store)
│        │
│        └─ DropZoneProvider
│           │  Provides: DropZoneContext (configuration)
│           │
│           └─ [Children Components]
```

**الموقع**: `services-liveeditor\live-editor\dragDrop\EnhancedLiveEditorDragDropContext.tsx` (line 148-627)

---

## ملخص العلاقات:

### EnhancedLiveEditorDragDropContext:

- ✅ **مستخدم بشكل نشط** في `components/tenant/live-editor/LiveEditorUI/index.tsx`
- ✅ يستخدم dragListenerContext (React Context)
- ✅ يستخدم zoneStore (Zustand store عبر ZoneStoreProvider)
- ✅ يستخدم DropZoneProvider (React Context)
- ✅ يستخدم DragDropProvider من @dnd-kit/react
- ✅ يستخدم useLiveEditorSensors
- ✅ يستخدم positionTracker و trackComponentMove

### dragListenerContext (EnhancedLiveEditorDragDropContext):

- ✅ يوفر dragListeners و setDragListeners
- ✅ يستخدم في onDragStart للاستماع إلى drag events
- ✅ Hook: useDragListener()

### ZoneStoreContext:

- ✅ يوفر zoneStore (Zustand store) عبر Context
- ✅ Provider: ZoneStoreProvider
- ✅ يستخدم في EnhancedLiveEditorDragDropContext و LiveEditorDragDropContext

### dropZoneContext:

- ✅ يوفر DropZoneContext (configuration)
- ✅ Provider: DropZoneProvider
- ✅ يحتوي على: mode, areaId, depth, zoneCompound, index, functions

### LiveEditorDragDropContext:

- ⚠️ **موجود لكن غير مستخدم حالياً**
- ✅ يحتوي على نفس البنية مثل EnhancedLiveEditorDragDropContext
- ✅ يستخدم dragListenerContext (نسخة مختلفة)
- ✅ يستخدم zoneStore و plugins و dragListeners

### dragListenerContext (LiveEditorDragDropContext):

- ⚠️ **موجود لكن غير مستخدم حالياً**
- ✅ نسخة مختلفة من dragListenerContext في EnhancedLiveEditorDragDropContext
- ✅ Hook: useDragListener(type, fn, deps)

### العلاقات بين Contexts:

- EnhancedLiveEditorDragDropContext → dragListenerContext → ZoneStoreProvider → DropZoneProvider
- ZoneStoreProvider → ZoneStoreContext → zoneStore (Zustand)
- DropZoneProvider → dropZoneContext → DropZoneContext (configuration)
- LiveEditorDragDropContext → نفس البنية لكن غير مستخدم

### العلاقات مع Stores:

- ZoneStoreProvider → zoneStore (من createZoneStore في zoneStore.ts)
- zoneStore → Zustand store لإدارة zone states

### العلاقات مع Libraries:

- DragDropProvider → @dnd-kit/react
- AutoScroller, defaultPreset → @dnd-kit/dom
- DragDropEvents → @dnd-kit/abstract

---

## ملخص شامل:

### EnhancedLiveEditorDragDropContext:

- **Status**: ✅ مستخدم بشكل نشط
- **Location**: `services-liveeditor\live-editor\dragDrop\EnhancedLiveEditorDragDropContext.tsx`
- **Used in**: `components\tenant\live-editor\LiveEditorUI\index.tsx` (line 287)
- **States**: dragListeners, zoneStore
- **Contexts**: dragListenerContext, ZoneStoreProvider, DropZoneProvider

### dragListenerContext (EnhancedLiveEditorDragDropContext):

- **Status**: ✅ مستخدم
- **Hook**: useDragListener()
- **Purpose**: إدارة drag listeners

### ZoneStoreContext:

- **Status**: ✅ مستخدم
- **Provider**: ZoneStoreProvider
- **Purpose**: توفير zoneStore عبر Context

### dropZoneContext:

- **Status**: ✅ مستخدم
- **Provider**: DropZoneProvider
- **Purpose**: توفير DropZoneContext configuration

### LiveEditorDragDropContext:

- **Status**: ⚠️ موجود لكن غير مستخدم حالياً
- **Location**: `services-liveeditor\live-editor\dragDrop\LiveEditorDragDropContext.tsx`
- **States**: zoneStore, plugins, dragListeners

### dragListenerContext (LiveEditorDragDropContext):

- **Status**: ⚠️ موجود لكن غير مستخدم حالياً
- **Hook**: useDragListener(type, fn, deps)

### إحصائيات:

- **إجمالي Drag & Drop Contexts**: 6 contexts
- **Contexts المستخدمة**: 4 (EnhancedLiveEditorDragDropContext, dragListenerContext, ZoneStoreContext, dropZoneContext)
- **Contexts غير المستخدمة**: 2 (LiveEditorDragDropContext و dragListenerContext الخاص به)
- **إجمالي Providers**: 2 (ZoneStoreProvider, DropZoneProvider)
- **إجمالي الاستدعاءات**: 10+ استدعاء
