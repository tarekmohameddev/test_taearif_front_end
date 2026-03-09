# WhatsApp Management Module

A comprehensive WhatsApp management system for handling customer conversations, campaigns, automation, and AI-powered responses.

## Features

### 1. Conversations Module
- **Real-time chat interface** with customer conversation management
- **Conversation list** with search, filters, and sorting
- **Message threading** showing full conversation history
- **Customer information** display with property interests
- **Message templates** for quick responses
- **Read receipts** and message status indicators
- **Star/favorite** conversations
- **Status management** (active, pending, resolved)

### 2. Campaigns Module
- **Broadcast campaigns** for mass messaging
- **Drip campaigns** for gradual messaging
- **Triggered campaigns** based on events
- **Audience segmentation**
- **Performance metrics** (sent, delivered, read, replied)
- **Scheduling** (immediate or scheduled)
- **Cost estimation**

### 3. Automation Module
- **Rule-based automation** for common scenarios:
  - New inquiry responses
  - No response follow-ups (24h, 48h, 72h)
  - Appointment reminders
  - Property match notifications
  - Follow-up messages
- **Message templates** with variable substitution
- **Delay configuration** for timed responses
- **Active/inactive** toggle per rule
- **Statistics tracking** (triggers, success rate)

### 4. AI Auto-Responder Module
- **Enable/disable** AI responses per number
- **Business hours** configuration
- **Scenario-based responses**:
  - Initial greeting
  - FAQ responses
  - Property inquiries
  - Appointment booking
  - General questions
- **Tone settings** (formal/friendly/professional)
- **Language preference** (Arabic/English/Both)
- **Custom instructions** for AI behavior
- **Fallback to human** with configurable delay
- **Performance metrics** (response time, satisfaction rate)

### 5. Settings Module
- **WhatsApp number management**
- **Facebook Business** integration
- **Employee assignment** to numbers
- **Number activation/deactivation**
- **Usage quota** tracking

## File Structure

```
components/whatsapp-management/
├── types.ts                      # TypeScript interfaces
├── mock-data.ts                  # Mock data for development
├── index.ts                      # Export barrel
├── WhatsAppManagementPage.tsx   # Main container with tabs
├── WhatsAppNumberSelector.tsx   # Number switcher
├── ConversationsModule.tsx      # Conversations integration
├── ConversationsList.tsx        # Conversations sidebar
├── ConversationDetail.tsx       # Individual conversation
├── AutomationModule.tsx         # Automation rules management
├── AIResponderModule.tsx        # AI configuration
└── README.md                    # This file

services/
└── whatsapp-management-api.ts   # API service layer

app/dashboard/whatsapp-management/
└── page.tsx                     # Route page
```

## Usage

### Accessing the Page

Navigate to `/dashboard/whatsapp-management` in your application.

### Importing Components

```typescript
import { 
  WhatsAppManagementPage,
  ConversationsModule,
  AutomationModule,
  AIResponderModule 
} from "@/components/whatsapp-management";
```

### Using the API Service

```typescript
import {
  getConversations,
  sendMessage,
  getAutomationRules,
  updateAIConfig
} from "@/services/whatsapp-management-api";

// Get conversations
const conversations = await getConversations(numberId, {
  status: "active",
  search: "محمد"
});

// Send a message
const message = await sendMessage(conversationId, "مرحباً بك");

// Get automation rules
const rules = await getAutomationRules(numberId);

// Update AI config
await updateAIConfig(numberId, {
  enabled: true,
  tone: "friendly"
});
```

## Mock Data

The module currently uses mock data for development. All API functions in `services/whatsapp-management-api.ts` are designed to be easily replaced with real backend endpoints.

### Mock Data Includes:
- 5 WhatsApp conversations with different statuses
- Multiple message threads
- 5 message templates
- 5 automation rules
- 3 AI responder configurations
- Performance statistics

## Key Types

### Conversation
```typescript
interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  whatsappNumberId: number;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: 'active' | 'pending' | 'resolved';
  isStarred: boolean;
  propertyInterests?: PropertyInterest[];
}
```

### AutomationRule
```typescript
interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  delayMinutes: number;
  templateId: string;
  isActive: boolean;
  whatsappNumberId?: number;
}
```

### AIResponderConfig
```typescript
interface AIResponderConfig {
  whatsappNumberId: number;
  enabled: boolean;
  businessHoursOnly: boolean;
  scenarios: {
    initialGreeting: boolean;
    faqResponses: boolean;
    propertyInquiryResponse: boolean;
    appointmentBooking: boolean;
    generalQuestions: boolean;
  };
  tone: 'formal' | 'friendly' | 'professional';
  language: 'ar' | 'en' | 'both';
}
```

## Features in Detail

### Multi-Number Support
- Switch between different WhatsApp numbers
- Filter conversations and data by number
- Separate configurations per number

### Real-time Updates
- Conversation list updates on new messages
- Message status indicators (sent, delivered, read)
- Unread count badges

### Template System
- Pre-built message templates
- Variable substitution (customer name, property details)
- Category-based organization

### Responsive Design
- Mobile-friendly layout
- Collapsible sidebars
- Touch-optimized controls
- Adaptive grid layouts

### Arabic-First Design
- RTL (right-to-left) layout
- Arabic labels and content
- Arabic date formatting
- Bilingual support

## Backend Integration

To connect to a real backend:

1. Update the API functions in `services/whatsapp-management-api.ts`
2. Replace mock data with actual API calls
3. Update the base URL in `axiosInstance`
4. Ensure proper authentication headers

### Example Backend Endpoints

```
GET    /api/whatsapp/conversations
GET    /api/whatsapp/conversations/:id
GET    /api/whatsapp/conversations/:id/messages
POST   /api/whatsapp/conversations/:id/messages
GET    /api/whatsapp/automation/rules
POST   /api/whatsapp/automation/rules
PUT    /api/whatsapp/automation/rules/:id
GET    /api/whatsapp/ai/config/:numberId
PUT    /api/whatsapp/ai/config/:numberId
GET    /api/whatsapp/numbers
```

## Performance Considerations

- **Pagination**: Conversations list supports infinite scroll (ready for implementation)
- **Lazy loading**: Messages load on-demand per conversation
- **Debounced search**: Search input debounced to reduce API calls
- **Optimistic updates**: UI updates immediately before API confirmation

## Future Enhancements

- [ ] Real-time WebSocket integration
- [ ] Voice message support
- [ ] Media attachments (images, videos, documents)
- [ ] Conversation tags and labels
- [ ] Advanced search with filters
- [ ] Export conversation history
- [ ] WhatsApp Business API integration
- [ ] Analytics dashboard
- [ ] Team collaboration features
- [ ] Scheduled messages

## Dependencies

- React 19
- Next.js 16
- shadcn/ui components
- Tailwind CSS
- date-fns (for date formatting)
- Lucide React (icons)

## Troubleshooting

### Conversations not loading
- Check WhatsApp number is selected
- Verify API service is running
- Check browser console for errors

### Messages not sending
- Ensure conversation is selected
- Verify WhatsApp number is active
- Check network connectivity

### AI Responder not working
- Confirm AI is enabled for the selected number
- Check business hours configuration
- Verify scenarios are enabled

## Support

For issues or questions, please contact the development team or refer to the main project documentation.
