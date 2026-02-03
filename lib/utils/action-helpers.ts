import type {
  CustomerAction,
  CustomerActionType,
  CustomerSource,
  Priority,
  UnifiedCustomer,
} from "@/types/unified-customer";

/**
 * Maps customer source to action type
 */
export function getActionTypeFromSource(source: CustomerSource): CustomerActionType {
  const sourceToActionMap: Record<CustomerSource, CustomerActionType> = {
    whatsapp: 'whatsapp_incoming',
    inquiry: 'new_inquiry',
    manual: 'new_inquiry',
    import: 'follow_up',
    referral: 'new_inquiry',
  };
  
  return sourceToActionMap[source] || 'new_inquiry';
}

/**
 * Maps customer source to default priority
 */
export function getPriorityFromSource(source: CustomerSource): Priority {
  const sourceToPriorityMap: Record<CustomerSource, Priority> = {
    whatsapp: 'high',
    inquiry: 'high',
    manual: 'medium',
    import: 'low',
    referral: 'high',
  };
  
  return sourceToPriorityMap[source] || 'medium';
}

/**
 * Gets action title in Arabic based on action type
 */
export function getActionTitleAr(type: CustomerActionType): string {
  const actionTitles: Record<CustomerActionType, string> = {
    new_inquiry: 'استفسار عقاري جديد',
    callback_request: 'طلب إعادة اتصال',
    property_match: 'مطابقة عقار جديد',
    follow_up: 'متابعة مع العميل',
    document_required: 'مستندات مطلوبة',
    payment_due: 'تذكير بالدفع',
    site_visit: 'جدولة معاينة',
    whatsapp_incoming: 'رسالة واتساب واردة',
    ai_recommended: 'إجراء موصى به',
  };
  
  return actionTitles[type];
}

/**
 * Gets action description in Arabic based on action type and customer
 */
export function getActionDescriptionAr(
  type: CustomerActionType,
  customer: UnifiedCustomer
): string {
  const descriptions: Record<CustomerActionType, string> = {
    new_inquiry: `عميل جديد ${customer.name} مهتم بالعقارات. قم بالتواصل لفهم احتياجاته.`,
    callback_request: `العميل ${customer.name} طلب إعادة الاتصال به.`,
    property_match: `تم العثور على عقارات مطابقة لتفضيلات ${customer.name}.`,
    follow_up: `حان وقت متابعة العميل ${customer.name}.`,
    document_required: `مستندات مطلوبة من العميل ${customer.name}.`,
    payment_due: `تذكير بالدفعة المستحقة للعميل ${customer.name}.`,
    site_visit: `جدولة معاينة عقار للعميل ${customer.name}.`,
    whatsapp_incoming: `طلب عقاري من ${customer.name} يتتطلب الرد او جدولة موعد.`,
    ai_recommended: `إجراء موصى به للعميل ${customer.name}.`,
  };
  
  return descriptions[type];
}

/**
 * Creates an incoming action for a new customer
 */
export function createIncomingAction(
  customer: UnifiedCustomer,
  assignedTo?: string,
  assignedToName?: string
): CustomerAction {
  const actionType = getActionTypeFromSource(customer.source);
  const priority = customer.priority || getPriorityFromSource(customer.source);
  
  // Calculate due date (24 hours for high priority, 48 hours for others)
  const dueDate = new Date();
  if (priority === 'urgent' || priority === 'high') {
    dueDate.setHours(dueDate.getHours() + 24);
  } else {
    dueDate.setHours(dueDate.getHours() + 48);
  }
  
  return {
    id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    customerId: customer.id,
    customerName: customer.name,
    type: actionType,
    title: getActionTitleAr(actionType),
    description: getActionDescriptionAr(actionType, customer),
    priority,
    status: 'pending',
    source: customer.source,
    dueDate: dueDate.toISOString(),
    assignedTo: assignedTo || customer.assignedEmployeeId,
    assignedToName: assignedToName || customer.assignedEmployee?.name,
    createdAt: new Date().toISOString(),
    metadata: {
      customerStage: customer.stage,
      leadScore: customer.leadScore,
      sourceDetails: customer.sourceDetails,
    },
  };
}

/**
 * Creates a follow-up action
 */
export function createFollowUpAction(
  customer: UnifiedCustomer,
  dueDate: string,
  notes?: string
): CustomerAction {
  return {
    id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    customerId: customer.id,
    customerName: customer.name,
    type: 'follow_up',
    title: 'متابعة مع العميل',
    description: notes || `متابعة مجدولة مع ${customer.name}`,
    priority: customer.priority,
    status: 'pending',
    source: customer.source,
    dueDate,
    assignedTo: customer.assignedEmployeeId,
    assignedToName: customer.assignedEmployee?.name,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Creates a site visit action
 */
export function createSiteVisitAction(
  customer: UnifiedCustomer,
  propertyId?: string,
  propertyTitle?: string,
  scheduledDate?: string
): CustomerAction {
  return {
    id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    customerId: customer.id,
    customerName: customer.name,
    type: 'site_visit',
    title: 'جدولة معاينة عقار',
    description: propertyTitle 
      ? `معاينة عقار "${propertyTitle}" مع ${customer.name}`
      : `جدولة معاينة عقار مع ${customer.name}`,
    priority: 'high',
    status: 'pending',
    source: customer.source,
    dueDate: scheduledDate,
    assignedTo: customer.assignedEmployeeId,
    assignedToName: customer.assignedEmployee?.name,
    createdAt: new Date().toISOString(),
    metadata: {
      propertyId,
      propertyTitle,
    },
  };
}

/**
 * Filters actions by status
 */
export function filterActionsByStatus(
  actions: CustomerAction[],
  statuses: string[]
): CustomerAction[] {
  return actions.filter((action) => statuses.includes(action.status));
}

/**
 * Filters actions by type
 */
export function filterActionsByType(
  actions: CustomerAction[],
  types: CustomerActionType[]
): CustomerAction[] {
  return actions.filter((action) => types.includes(action.type));
}

/**
 * Gets overdue actions
 */
export function getOverdueActions(actions: CustomerAction[]): CustomerAction[] {
  const now = new Date();
  return actions.filter((action) => {
    if (!action.dueDate || action.status === 'completed' || action.status === 'dismissed') {
      return false;
    }
    return new Date(action.dueDate) < now;
  });
}

/**
 * Gets actions due today
 */
export function getActionsDueToday(actions: CustomerAction[]): CustomerAction[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return actions.filter((action) => {
    if (!action.dueDate || action.status === 'completed' || action.status === 'dismissed') {
      return false;
    }
    const dueDate = new Date(action.dueDate);
    return dueDate >= today && dueDate < tomorrow;
  });
}

/**
 * Gets snoozed actions that should be unsnoozed
 */
export function getActionsToUnsnooze(actions: CustomerAction[]): CustomerAction[] {
  const now = new Date();
  return actions.filter((action) => {
    if (action.status !== 'snoozed' || !action.snoozedUntil) {
      return false;
    }
    return new Date(action.snoozedUntil) <= now;
  });
}

/**
 * Groups actions by type
 */
export function groupActionsByType(
  actions: CustomerAction[]
): Record<CustomerActionType, CustomerAction[]> {
  const groups: Record<CustomerActionType, CustomerAction[]> = {
    new_inquiry: [],
    callback_request: [],
    property_match: [],
    follow_up: [],
    document_required: [],
    payment_due: [],
    site_visit: [],
    whatsapp_incoming: [],
    ai_recommended: [],
  };
  
  actions.forEach((action) => {
    if (groups[action.type]) {
      groups[action.type].push(action);
    }
  });
  
  return groups;
}

/**
 * Groups actions by source
 */
export function groupActionsBySource(
  actions: CustomerAction[]
): Record<CustomerSource, CustomerAction[]> {
  const groups: Record<CustomerSource, CustomerAction[]> = {
    inquiry: [],
    manual: [],
    whatsapp: [],
    import: [],
    referral: [],
  };
  
  actions.forEach((action) => {
    if (groups[action.source]) {
      groups[action.source].push(action);
    }
  });
  
  return groups;
}

/**
 * Sorts actions by priority and due date
 */
export function sortActionsByPriority(actions: CustomerAction[]): CustomerAction[] {
  const priorityOrder: Record<Priority, number> = {
    urgent: 0,
    high: 1,
    medium: 2,
    low: 3,
  };
  
  return [...actions].sort((a, b) => {
    // First by priority
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    // Then by due date
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
}
