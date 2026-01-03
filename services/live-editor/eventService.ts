// خدمة إدارة الأحداث

// أنواع الأحداث المتاحة
export type EventType =
  | "component-added"
  | "component-deleted"
  | "component-updated"
  | "component-moved"
  | "page-deleted"
  | "page-created"
  | "theme-changed"
  | "data-saved"
  | "error-occurred"
  | "user-action";

// واجهة البيانات الأساسية للحدث
export interface BaseEventData {
  timestamp: number;
  userId?: string;
  tenantId?: string;
  pageSlug?: string;
}

// واجهة حدث المكون
export interface ComponentEventData extends BaseEventData {
  componentId: string;
  componentType: string;
  componentName: string;
  action: "added" | "deleted" | "updated" | "moved";
  oldPosition?: { row: number; col: number };
  newPosition?: { row: number; col: number };
}

// واجهة حدث الصفحة
export interface PageEventData extends BaseEventData {
  pageSlug: string;
  action: "created" | "deleted" | "updated";
  componentCount?: number;
}

// واجهة حدث الثيم
export interface ThemeEventData extends BaseEventData {
  componentId: string;
  oldTheme: string;
  newTheme: string;
}

// واجهة حدث الخطأ
export interface ErrorEventData extends BaseEventData {
  error: string;
  errorCode?: string;
  stack?: string;
}

// واجهة حدث عام
export interface GenericEventData extends BaseEventData {
  action: string;
  details?: any;
}

// نوع البيانات المشتركة للأحداث
export type EventData =
  | ComponentEventData
  | PageEventData
  | ThemeEventData
  | ErrorEventData
  | GenericEventData;

// واجهة الحدث الكامل
export interface Event {
  id: string;
  type: EventType;
  data: EventData;
}

// نوع دالة معالج الحدث
export type EventHandler = (event: Event) => void;

// إدارة الأحداث
export class EventManager {
  private static instance: EventManager;
  private handlers: Map<EventType, EventHandler[]> = new Map();
  private events: Event[] = [];
  private maxEvents: number = 1000; // الحد الأقصى لعدد الأحداث المحفوظة

  static getInstance(): EventManager {
    if (!EventManager.instance) {
      EventManager.instance = new EventManager();
    }
    return EventManager.instance;
  }

  // تسجيل معالج حدث
  subscribe(eventType: EventType, handler: EventHandler): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }

    this.handlers.get(eventType)!.push(handler);

    // إرجاع دالة إلغاء الاشتراك
    return () => {
      const handlers = this.handlers.get(eventType);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    };
  }

  // إرسال حدث
  emit(eventType: EventType, data: EventData): void {
    const event: Event = {
      id: this.generateEventId(),
      type: eventType,
      data: {
        ...data,
        timestamp: Date.now(),
      },
    };

    // حفظ الحدث
    this.events.push(event);

    // الحفاظ على الحد الأقصى لعدد الأحداث
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }

    // إرسال الحدث لجميع المعالجين
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(event);
        } catch (error) {
          console.error(`Error in event handler for ${eventType}:`, error);
        }
      });
    }
  }

  // الحصول على جميع الأحداث
  getEvents(): Event[] {
    return [...this.events];
  }

  // الحصول على أحداث نوع معين
  getEventsByType(eventType: EventType): Event[] {
    return this.events.filter((event) => event.type === eventType);
  }

  // الحصول على أحداث مؤخراً
  getRecentEvents(count: number = 10): Event[] {
    return this.events.slice(-count);
  }

  // مسح جميع الأحداث
  clearEvents(): void {
    this.events = [];
  }

  // إنشاء معرف فريد للحدث
  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// دوال مساعدة لإنشاء أحداث شائعة
export const createComponentAddedEvent = (
  componentId: string,
  componentType: string,
  componentName: string,
  pageSlug: string,
  userId?: string,
  tenantId?: string,
): ComponentEventData => {
  return {
    componentId,
    componentType,
    componentName,
    action: "added",
    pageSlug,
    userId,
    tenantId,
    timestamp: Date.now(),
  };
};

export const createComponentDeletedEvent = (
  componentId: string,
  componentType: string,
  componentName: string,
  pageSlug: string,
  userId?: string,
  tenantId?: string,
): ComponentEventData => {
  return {
    componentId,
    componentType,
    componentName,
    action: "deleted",
    pageSlug,
    userId,
    tenantId,
    timestamp: Date.now(),
  };
};

export const createComponentMovedEvent = (
  componentId: string,
  componentType: string,
  componentName: string,
  pageSlug: string,
  oldPosition: { row: number; col: number },
  newPosition: { row: number; col: number },
  userId?: string,
  tenantId?: string,
): ComponentEventData => {
  return {
    componentId,
    componentType,
    componentName,
    action: "moved",
    oldPosition,
    newPosition,
    pageSlug,
    userId,
    tenantId,
    timestamp: Date.now(),
  };
};

export const createPageDeletedEvent = (
  pageSlug: string,
  componentCount: number,
  userId?: string,
  tenantId?: string,
): PageEventData => {
  return {
    pageSlug,
    action: "deleted",
    componentCount,
    userId,
    tenantId,
    timestamp: Date.now(),
  };
};

export const createThemeChangedEvent = (
  componentId: string,
  oldTheme: string,
  newTheme: string,
  pageSlug: string,
  userId?: string,
  tenantId?: string,
): ThemeEventData => {
  return {
    componentId,
    oldTheme,
    newTheme,
    pageSlug,
    userId,
    tenantId,
    timestamp: Date.now(),
  };
};

export const createErrorEvent = (
  error: string,
  errorCode?: string,
  stack?: string,
  userId?: string,
  tenantId?: string,
): ErrorEventData => {
  return {
    error,
    errorCode,
    stack,
    userId,
    tenantId,
    timestamp: Date.now(),
  };
};

// الحصول على مثيل مدير الأحداث
export const getEventManager = (): EventManager => {
  return EventManager.getInstance();
};
