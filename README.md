# Website Builder Dashboard

A powerful **Live Editor System** for building websites dynamically with drag-and-drop components.

---

## 🚀 Quick Start

### **For Cursor AI Users:**

```
✅ System is pre-configured with .cursorrules
✅ All documentation is indexed
✅ AI knows all patterns and rules

Read: docs/CURSOR_AI_SETUP.md (3-minute setup)
```

### **For Manual Setup:**

```
1. npm install
2. Configure environment variables
3. Read: docs/important/INDEX.md
4. Start development
```

---

## 📚 Documentation

### **📋 Previous changes and updates**

- **All implementation notes and change history:** `docs/updates/`  
  Use this folder when you need to know what was done before (dashboard, tenantWebsite, backend, landing pages, etc.).

### **🎯 Start Here:**

- **Setup Guide:** `docs/CURSOR_AI_SETUP.md` - Visual setup guide
- **Complete Index:** `docs/important/INDEX.md` - All 56+ docs mapped
- **Cursor Rules:** `.cursorrules` - AI instruction file
- **Agent instructions:** `AGENTS.md` - Rules for AI (e.g. docs/updates, docs/live-editor)

### **🎨 Component Work:**

- **Create:** `docs/important/components/ADD_NEW_COMPONENT.md`
- **Fix:** `docs/important/components/FIX_COMPONENT_PROMPT.md`
- **Overview:** `docs/important/components/README.md`
- **Rule:** In component structures, **padding, height, width, margin, maxWidth, maxHeight** must be **`type: "number"`** with **`unit`**, not `text`; use **`toDimension()`** in components when applying to `style`. See `AGENTS.md` and `docs/live-editor/componentsStructure/README.md`.

### **⚡ Live Editor:**

- **Logic and docs (read before editing):** `docs/live-editor/` — agents must read this before any Live Editor or Tenant work
- **Architecture:** `docs/important/liveEditor/COMPONENT_ARCHITECTURE.md`
- **State:** `docs/important/liveEditor/STATE_MANAGEMENT.md`
- **Overview:** `docs/important/liveEditor/README.md`

---

## 🎯 For Cursor AI Users

Your Cursor AI is **fully trained** on this project:

```
Just ask naturally:

"Create pricing component"
→ Cursor creates perfectly following all patterns

"Fix testimonials component"
→ Cursor runs diagnostics and repairs

"Explain the state management system"
→ Cursor explains with references to docs
```

**See:** `docs/CURSOR_AI_SETUP.md` for full guide

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **State:** Zustand
- **UI:** Tailwind CSS + shadcn/ui
- **Editor:** Live drag-and-drop system

---

## 📁 Project Structure

```
project/
├── AGENTS.md                 ← AI agent rules (docs/updates, docs/live-editor)
├── .cursorrules              ← AI instruction file
├── app/                      ← Next.js app directory
├── components/               ← React components
│   ├── tenant/              ← Tenant-specific components
│   └── ui/                  ← UI components
├── context/                  ← Context & stores (including Live Editor)
├── componentsStructure/      ← Component structure definitions
├── lib-liveeditor/          ← Live Editor utilities
├── docs/                     ← Documentation
│   ├── updates/             ← Change history & implementation notes
│   ├── live-editor/         ← Live Editor logic & docs (read before editing)
│   ├── CURSOR_AI_SETUP.md   ← Start here for Cursor
│   ├── SETUP_COMPLETE.md    ← Setup overview
│   └── important/           ← Complete documentation (56+ files)
└── [more...]
```

---

## 🎨 Core Features

- ✨ **Live Editor:** Drag-and-drop website builder
- 🎯 **Component System:** Modular, reusable components
- 💾 **State Management:** Zustand-based state system
- 🔄 **Real-time Updates:** See changes instantly
- 💾 **Persistence:** Save to database
- 🌐 **Multi-tenant:** Support multiple tenants
- 🌍 **i18n:** Arabic & English support
- 📱 **Responsive:** Mobile-first design

---

## 🤖 AI-Enhanced Development

This project has **comprehensive AI integration**:

### **What Cursor Knows:**

- ✅ Complete component architecture
- ✅ All patterns and conventions
- ✅ All integration requirements
- ✅ All troubleshooting guides
- ✅ All best practices

### **What Cursor Can Do:**

- 🚀 Create components in minutes
- 🔧 Fix broken components automatically
- ✅ Review code quality
- 📚 Update documentation
- 💡 Explain any concept

### **How to Use:**

1. Open Cursor
2. Ask naturally
3. Cursor handles everything!

**Full Guide:** `docs/CURSOR_AI_SETUP.md`

---

## 📖 Documentation Index

**56+ Documentation Files Organized by Topic:**

### **Components (5 files):**

- Complete creation guide (2003 lines)
- AI prompts and templates
- Comprehensive repair system (1722 lines)
- Quick fixes and scenarios

### **Live Editor (25+ files):**

- Architecture deep dive
- State management guide
- Data flow patterns
- EditorSidebar system
- Context integration
- Troubleshooting

### **Dashboard (7 files):**

- Core infrastructure
- Authentication
- Data flows
- Modules breakdown

### **Systems (15+ files):**

- GA4 Analytics
- Authentication
- Routing & Locales
- reCAPTCHA
- Metadata/SEO

**See:** `docs/important/INDEX.md` for complete map

---

## 🔧 Development Commands

```bash
# Development
npm run dev

# Build
npm run build

# Lint
npm run lint

# Type check
npm run type-check
```

---

## 📋 Contributing

### **Creating Components:**

1. Read: `docs/important/components/ADD_NEW_COMPONENT.md`
2. OR ask Cursor: "Create [name] component"
3. Follow verification checklist
4. Test in Live Editor

### **Fixing Components:**

1. Read: `docs/important/components/FIX_COMPONENT_PROMPT.md`
2. OR ask Cursor: "Fix [name] component"
3. Review repair report
4. Verify fixes work

### **Updating Documentation:**

1. Read: `docs/important/MAINTENANCE_GUIDE.md`
2. Make changes to code + docs together
3. Update "Last Updated" dates
4. Commit together

---

## 🎯 Quick Links

- **Setup:** [docs/CURSOR_AI_SETUP.md](docs/CURSOR_AI_SETUP.md)
- **Completion:** [docs/SETUP_COMPLETE.md](docs/SETUP_COMPLETE.md)
- **Index:** [docs/important/INDEX.md](docs/important/INDEX.md)
- **Components:** [docs/important/components/README.md](docs/important/components/README.md)
- **Live Editor (logic first):** [docs/live-editor/](docs/live-editor/)
- **Live Editor (detailed):** [docs/important/liveEditor/README.md](docs/important/liveEditor/README.md)
- **Previous updates:** [docs/updates/](docs/updates/)
- **Cursor Rules:** [.cursorrules](.cursorrules)
- **Agent rules:** [AGENTS.md](AGENTS.md)

---

## ✨ Special Features

### **🤖 AI-Powered Development:**

- Complete codebase knowledge via `.cursorrules`
- Automatic pattern compliance
- Smart code review
- Auto-updating documentation

### **📚 Comprehensive Documentation:**

- 56+ documentation files
- 20,000+ lines of guides
- Step-by-step tutorials
- Real code examples

### **🔧 Repair System:**

- 7-layer diagnostic system
- Automatic issue detection
- Priority-based fixing
- Detailed reporting

---

## 🎓 Learning Resources

### **New to Project?**

1. Read: `docs/CURSOR_AI_SETUP.md`
2. Read: `docs/important/INDEX.md`
3. Ask Cursor: "Explain the component system"
4. Create simple component to learn

### **Component Development?**

1. Read: `docs/important/components/README.md`
2. Use: AI prompts for creation
3. Reference: Architecture docs
4. Follow: Patterns exactly

### **Advanced Topics?**

1. Browse: `docs/important/liveEditor/`
2. Study: State management
3. Learn: Data flow patterns
4. Master: All patterns

---

## 📞 Getting Help

### **For Code Issues:**

```
Ask Cursor:
- "Fix [component] component"
- "Why is [X] not working?"
- "How do I [task]?"
```

### **For Documentation:**

```
Check:
- docs/important/INDEX.md (find what you need)
- .cursorrules (see all rules)
- Ask Cursor (it knows everything)
```

### **For Setup Issues:**

```
Read:
- docs/CURSOR_AI_SETUP.md
- docs/important/HOW_TO_USE_CURSORRULES.md
```

---

## 🎉 Status

```
✅ AI Integration: Complete
✅ Documentation: Complete (56+ files)
✅ Component System: Production-ready
✅ Repair System: Fully operational
✅ .cursorrules: Configured
✅ Ready for Development: YES!
```

---

## 📝 License

[Your License Here]

---

## 🙏 Acknowledgments

Built with modern tools and comprehensive AI integration for the best developer experience.

---

**Ready to build? Start with Cursor AI! 🚀**

**Questions?** Ask Cursor - it knows everything! 🤖✨
