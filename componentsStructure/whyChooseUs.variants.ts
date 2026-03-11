import type { VariantDefinition } from './types';

/** Why Choose Us variant definitions - split from whyChooseUs.ts */
export const WHY_CHOOSE_US_VARIANTS: VariantDefinition[] = [
    {
      id: "whyChooseUs1",
      name: "Why Choose Us 1 - Features Grid",
      fields: [
        { key: "visible", label: "Visible", type: "boolean" },
        {
          key: "layout",
          label: "Layout Settings",
          type: "object",
          fields: [
            {
              key: "direction",
              label: "Direction",
              type: "select",
              options: [
                { value: "rtl", label: "Right to Left" },
                { value: "ltr", label: "Left to Right" },
              ],
            },
            {
              key: "maxWidth",
              label: "Max Width",
              type: "number",
              placeholder: "1600",
              unit: "px",
            },
            {
              key: "padding",
              label: "Section Padding",
              type: "object",
              fields: [
                { key: "y", label: "Vertical Padding", type: "number", placeholder: "56", unit: "px" },
                { key: "smY", label: "Small Vertical Padding", type: "number", placeholder: "64", unit: "px" },
              ],
            },
          ],
        },
        {
          key: "header",
          label: "Header Section",
          type: "object",
          fields: [
            { key: "title", label: "Title", type: "text" },
            { key: "description", label: "Description", type: "text" },
            {
              key: "marginBottom",
              label: "Margin Bottom",
              type: "number",
              placeholder: "40",
              unit: "px",
            },
            {
              key: "textAlign",
              label: "Text Alignment",
              type: "text",
              placeholder: "text-right",
            },
            {
              key: "paddingX",
              label: "Horizontal Padding",
              type: "number",
              placeholder: "20",
              unit: "px",
            },
            {
              key: "typography",
              label: "Typography",
              type: "object",
              fields: [
                {
                  key: "title",
                  label: "Title Font",
                  type: "object",
                  fields: [
                    {
                      key: "className",
                      label: "CSS Classes",
                      type: "text",
                      placeholder: "section-title text-right",
                    },
                  ],
                },
                {
                  key: "description",
                  label: "Description Font",
                  type: "object",
                  fields: [
                    {
                      key: "className",
                      label: "CSS Classes",
                      type: "text",
                      placeholder: "section-subtitle-xl",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          key: "features",
          label: "Features Grid",
          type: "object",
          fields: [
            {
              key: "list",
              label: "Features List",
              type: "array",
              addLabel: "Add Feature",
              itemLabel: "Feature",
              of: [
                { key: "title", label: "Title", type: "text" },
                { key: "desc", label: "Description", type: "text" },
                {
                  key: "icon",
                  label: "Icon Settings",
                  type: "object",
                  fields: [
                    {
                      key: "type",
                      label: "Icon Type",
                      type: "select",
                      showIcons: true, // Flag to show icons in dropdown
                      options: [
                        // Lucide Icons - Most Common
                        {
                          value: "UserCircle",
                          label: "User Circle",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Building2",
                          label: "Building",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "GraduationCap",
                          label: "Graduation Cap",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "TrendingUp",
                          label: "Trending Up",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Briefcase",
                          label: "Briefcase",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Settings",
                          label: "Settings",
                          iconLibrary: "lucide",
                        },
                        { value: "Home", label: "Home", iconLibrary: "lucide" },
                        {
                          value: "MapPin",
                          label: "Map Pin",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Phone",
                          label: "Phone",
                          iconLibrary: "lucide",
                        },
                        { value: "Mail", label: "Mail", iconLibrary: "lucide" },
                        {
                          value: "Heart",
                          label: "Heart",
                          iconLibrary: "lucide",
                        },
                        { value: "Star", label: "Star", iconLibrary: "lucide" },
                        {
                          value: "Award",
                          label: "Award",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Shield",
                          label: "Shield",
                          iconLibrary: "lucide",
                        },
                        { value: "Zap", label: "Zap", iconLibrary: "lucide" },
                        {
                          value: "Target",
                          label: "Target",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Rocket",
                          label: "Rocket",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Lightbulb",
                          label: "Lightbulb",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "DollarSign",
                          label: "Dollar Sign",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "BarChart",
                          label: "Bar Chart",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "PieChart",
                          label: "Pie Chart",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "LineChart",
                          label: "Line Chart",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Users",
                          label: "Users",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "UserCheck",
                          label: "User Check",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Handshake",
                          label: "Handshake",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "ThumbsUp",
                          label: "Thumbs Up",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "CheckCircle",
                          label: "Check Circle",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "FileText",
                          label: "File Text",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Folder",
                          label: "Folder",
                          iconLibrary: "lucide",
                        },
                        { value: "Key", label: "Key", iconLibrary: "lucide" },
                        { value: "Lock", label: "Lock", iconLibrary: "lucide" },
                        {
                          value: "Search",
                          label: "Search",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Filter",
                          label: "Filter",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Calendar",
                          label: "Calendar",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Clock",
                          label: "Clock",
                          iconLibrary: "lucide",
                        },
                        { value: "Bell", label: "Bell", iconLibrary: "lucide" },
                        {
                          value: "MessageSquare",
                          label: "Message Square",
                          iconLibrary: "lucide",
                        },
                        { value: "Send", label: "Send", iconLibrary: "lucide" },
                        {
                          value: "Share",
                          label: "Share",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Download",
                          label: "Download",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Upload",
                          label: "Upload",
                          iconLibrary: "lucide",
                        },
                        { value: "Save", label: "Save", iconLibrary: "lucide" },
                        { value: "Edit", label: "Edit", iconLibrary: "lucide" },
                        {
                          value: "Trash2",
                          label: "Trash",
                          iconLibrary: "lucide",
                        },
                        { value: "Copy", label: "Copy", iconLibrary: "lucide" },
                        { value: "Plus", label: "Plus", iconLibrary: "lucide" },
                        {
                          value: "Minus",
                          label: "Minus",
                          iconLibrary: "lucide",
                        },
                        { value: "X", label: "X", iconLibrary: "lucide" },
                        {
                          value: "Check",
                          label: "Check",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "ChevronRight",
                          label: "Chevron Right",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "ChevronLeft",
                          label: "Chevron Left",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "ArrowRight",
                          label: "Arrow Right",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "ArrowLeft",
                          label: "Arrow Left",
                          iconLibrary: "lucide",
                        },
                        { value: "Menu", label: "Menu", iconLibrary: "lucide" },
                        { value: "Grid", label: "Grid", iconLibrary: "lucide" },
                        { value: "List", label: "List", iconLibrary: "lucide" },
                        {
                          value: "Image",
                          label: "Image",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Camera",
                          label: "Camera",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Video",
                          label: "Video",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Music",
                          label: "Music",
                          iconLibrary: "lucide",
                        },
                        { value: "Book", label: "Book", iconLibrary: "lucide" },
                        {
                          value: "BookOpen",
                          label: "Book Open",
                          iconLibrary: "lucide",
                        },
                        { value: "Tag", label: "Tag", iconLibrary: "lucide" },
                        { value: "Map", label: "Map", iconLibrary: "lucide" },
                        {
                          value: "Globe",
                          label: "Globe",
                          iconLibrary: "lucide",
                        },
                        { value: "Gift", label: "Gift", iconLibrary: "lucide" },
                        {
                          value: "Package",
                          label: "Package",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "ShoppingCart",
                          label: "Shopping Cart",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "CreditCard",
                          label: "Credit Card",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Wallet",
                          label: "Wallet",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Activity",
                          label: "Activity",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "QrCode",
                          label: "QR Code",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "ShieldCheck",
                          label: "Shield Check",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Badge",
                          label: "Badge",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Medal",
                          label: "Medal",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Trophy",
                          label: "Trophy",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Crown",
                          label: "Crown",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Sparkle",
                          label: "Sparkle",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Palette",
                          label: "Palette",
                          iconLibrary: "lucide",
                        },
                        { value: "Code", label: "Code", iconLibrary: "lucide" },
                        {
                          value: "Server",
                          label: "Server",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Database",
                          label: "Database",
                          iconLibrary: "lucide",
                        },
                        { value: "Wifi", label: "WiFi", iconLibrary: "lucide" },
                        {
                          value: "Laptop",
                          label: "Laptop",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Smartphone",
                          label: "Smartphone",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Printer",
                          label: "Printer",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Microphone",
                          label: "Microphone",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "PhoneCall",
                          label: "Phone Call",
                          iconLibrary: "lucide",
                        },
                        // React Icons - Font Awesome
                        {
                          value: "FaUser",
                          label: "User (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaHome",
                          label: "Home (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaBuilding",
                          label: "Building (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaEnvelope",
                          label: "Envelope (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaPhone",
                          label: "Phone (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaHeart",
                          label: "Heart (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaStar",
                          label: "Star (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaShieldAlt",
                          label: "Shield (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaRocket",
                          label: "Rocket (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaLightbulb",
                          label: "Lightbulb (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaDollarSign",
                          label: "Dollar (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaChartBar",
                          label: "Chart Bar (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaUsers",
                          label: "Users (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaHandshake",
                          label: "Handshake (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaCheckCircle",
                          label: "Check Circle (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaFile",
                          label: "File (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaLock",
                          label: "Lock (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaSearch",
                          label: "Search (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaCalendar",
                          label: "Calendar (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaBell",
                          label: "Bell (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaShare",
                          label: "Share (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaDownload",
                          label: "Download (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaEdit",
                          label: "Edit (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaTrash",
                          label: "Trash (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaPlus",
                          label: "Plus (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaMinus",
                          label: "Minus (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaCheck",
                          label: "Check (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaArrowRight",
                          label: "Arrow Right (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaArrowLeft",
                          label: "Arrow Left (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaBars",
                          label: "Bars (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaImage",
                          label: "Image (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaCamera",
                          label: "Camera (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaVideo",
                          label: "Video (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaBook",
                          label: "Book (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaMap",
                          label: "Map (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaGlobe",
                          label: "Globe (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaGift",
                          label: "Gift (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaShoppingCart",
                          label: "Shopping Cart (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaCreditCard",
                          label: "Credit Card (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaQrcode",
                          label: "QR Code (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaShield",
                          label: "Shield Alt (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaTrophy",
                          label: "Trophy (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaCode",
                          label: "Code (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaServer",
                          label: "Server (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaDatabase",
                          label: "Database (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaLaptop",
                          label: "Laptop (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaMobile",
                          label: "Mobile (FA)",
                          iconLibrary: "react-icons",
                        },
                        // React Icons - Material Design
                        {
                          value: "MdPerson",
                          label: "Person (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdHome",
                          label: "Home (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdBusiness",
                          label: "Business (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdEmail",
                          label: "Email (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdPhone",
                          label: "Phone (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdFavorite",
                          label: "Favorite (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdStar",
                          label: "Star (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdSecurity",
                          label: "Security (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdRocketLaunch",
                          label: "Rocket (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdLightbulb",
                          label: "Lightbulb (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdAttachMoney",
                          label: "Money (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdBarChart",
                          label: "Bar Chart (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdPeople",
                          label: "People (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdHandshake",
                          label: "Handshake (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdCheckCircle",
                          label: "Check Circle (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdDescription",
                          label: "File (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdLock",
                          label: "Lock (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdSearch",
                          label: "Search (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdCalendarToday",
                          label: "Calendar (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdNotifications",
                          label: "Notifications (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdShare",
                          label: "Share (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdDownload",
                          label: "Download (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdEdit",
                          label: "Edit (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdDelete",
                          label: "Delete (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdAdd",
                          label: "Add (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdRemove",
                          label: "Remove (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdCheck",
                          label: "Check (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdArrowForward",
                          label: "Arrow Forward (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdArrowBack",
                          label: "Arrow Back (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdMenu",
                          label: "Menu (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdImage",
                          label: "Image (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdCameraAlt",
                          label: "Camera (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdVideoLibrary",
                          label: "Video (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdBook",
                          label: "Book (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdLocationOn",
                          label: "Location (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdLanguage",
                          label: "Language (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdCardGiftcard",
                          label: "Gift (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdShoppingCart",
                          label: "Shopping Cart (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdCreditCard",
                          label: "Credit Card (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdQrCode",
                          label: "QR Code (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdVerified",
                          label: "Verified (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdEmojiEvents",
                          label: "Trophy (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdCode",
                          label: "Code (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdStorage",
                          label: "Storage (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdLaptop",
                          label: "Laptop (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdPhoneAndroid",
                          label: "Phone Android (MD)",
                          iconLibrary: "react-icons",
                        },
                      ],
                    },
                    {
                      key: "size",
                      label: "Size",
                      type: "text",
                      placeholder: "80",
                    },
                    {
                      key: "className",
                      label: "CSS Classes",
                      type: "text",
                      placeholder: "w-20 h-20",
                    },
                  ],
                },
              ],
            },
            {
              key: "grid",
              label: "Grid Layout",
              type: "object",
              fields: [
                {
                  key: "gap",
                  label: "Gap",
                  type: "text",
                  placeholder: "gap-6",
                },
                {
                  key: "columns",
                  label: "Columns",
                  type: "object",
                  fields: [
                    {
                      key: "sm",
                      label: "Small Screens",
                      type: "text",
                      placeholder: "sm:grid-cols-2",
                    },
                    {
                      key: "xl",
                      label: "Extra Large Screens",
                      type: "text",
                      placeholder: "xl:grid-cols-3",
                    },
                  ],
                },
                {
                  key: "paddingX",
                  label: "Horizontal Padding",
                  type: "number",
                  placeholder: "16",
                  unit: "px",
                },
              ],
            },
            {
              key: "card",
              label: "Card Style",
              type: "object",
              fields: [
                {
                  key: "className",
                  label: "CSS Classes",
                  type: "text",
                  placeholder:
                    "rounded-2xl border bg-white p-6 shadow-sm ring-1 ring-emerald-50",
                },
                {
                  key: "borderRadius",
                  label: "Border Radius",
                  type: "text",
                  placeholder: "rounded-2xl",
                },
                {
                  key: "border",
                  label: "Border",
                  type: "text",
                  placeholder: "border",
                },
                {
                  key: "backgroundColor",
                  label: "Background Color",
                  type: "text",
                  placeholder: "bg-white",
                },
                {
                  key: "padding",
                  label: "Padding",
                  type: "number",
                  placeholder: "24",
                  unit: "px",
                },
                {
                  key: "shadow",
                  label: "Shadow",
                  type: "text",
                  placeholder: "shadow-sm",
                },
                {
                  key: "ring",
                  label: "Ring",
                  type: "text",
                  placeholder: "ring-1 ring-emerald-50",
                },
              ],
            },
            {
              key: "icon",
              label: "Icon Style",
              type: "object",
              fields: [
                {
                  key: "container",
                  label: "Container",
                  type: "object",
                  fields: [
                    {
                      key: "className",
                      label: "CSS Classes",
                      type: "text",
                      placeholder:
                        "mx-auto flex size-20 items-center justify-center",
                    },
                    {
                      key: "size",
                      label: "Size",
                      type: "text",
                      placeholder: "size-20",
                    },
                    {
                      key: "flex",
                      label: "Flex",
                      type: "text",
                      placeholder: "flex",
                    },
                    {
                      key: "items",
                      label: "Items",
                      type: "text",
                      placeholder: "items-center",
                    },
                    {
                      key: "justify",
                      label: "Justify",
                      type: "text",
                      placeholder: "justify-center",
                    },
                  ],
                },
                {
                  key: "image",
                  label: "Image",
                  type: "object",
                  fields: [
                    {
                      key: "className",
                      label: "CSS Classes",
                      type: "text",
                      placeholder: "h-[7rem] w-[7rem]",
                    },
                    {
                      key: "height",
                      label: "Height",
                      type: "number",
                      placeholder: "112",
                      unit: "px",
                    },
                    {
                      key: "width",
                      label: "Width",
                      type: "number",
                      placeholder: "112",
                      unit: "px",
                    },
                  ],
                },
              ],
            },
            {
              key: "typography",
              label: "Typography",
              type: "object",
              fields: [
                {
                  key: "title",
                  label: "Title Font",
                  type: "object",
                  fields: [
                    {
                      key: "className",
                      label: "CSS Classes",
                      type: "text",
                      placeholder:
                        "mt-6 text-center text-lg font-bold text-emerald-700",
                    },
                    {
                      key: "marginTop",
                      label: "Margin Top",
                      type: "number",
                      placeholder: "24",
                      unit: "px",
                    },
                    {
                      key: "textAlign",
                      label: "Text Align",
                      type: "text",
                      placeholder: "text-center",
                    },
                    {
                      key: "fontSize",
                      label: "Font Size",
                      type: "number",
                      unit: "px",
                      defaultValue: 18,
                    },
                    {
                      key: "fontWeight",
                      label: "Font Weight",
                      type: "text",
                      placeholder: "font-bold",
                    },
                    {
                      key: "color",
                      label: "Color",
                      type: "text",
                      placeholder: "text-emerald-700",
                    },
                  ],
                },
                {
                  key: "description",
                  label: "Description Font",
                  type: "object",
                  fields: [
                    {
                      key: "className",
                      label: "CSS Classes",
                      type: "text",
                      placeholder:
                        "mt-3 text-center text-lg leading-7 text-gray-600",
                    },
                    {
                      key: "marginTop",
                      label: "Margin Top",
                      type: "number",
                      placeholder: "12",
                      unit: "px",
                    },
                    {
                      key: "textAlign",
                      label: "Text Align",
                      type: "text",
                      placeholder: "text-center",
                    },
                    {
                      key: "fontSize",
                      label: "Font Size",
                      type: "number",
                      unit: "px",
                      defaultValue: 18,
                    },
                    {
                      key: "lineHeight",
                      label: "Line Height",
                      type: "text",
                      placeholder: "leading-7",
                    },
                    {
                      key: "color",
                      label: "Color",
                      type: "text",
                      placeholder: "text-gray-600",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          key: "responsive",
          label: "Responsive",
          type: "object",
          fields: [
            {
              key: "mobile",
              label: "Mobile",
              type: "object",
              fields: [
                {
                  key: "padding",
                  label: "Padding",
                  type: "number",
                  placeholder: "56",
                  unit: "px",
                },
                {
                  key: "gridCols",
                  label: "Grid Columns",
                  type: "text",
                  placeholder: "grid-cols-1",
                },
              ],
            },
            {
              key: "tablet",
              label: "Tablet",
              type: "object",
              fields: [
                {
                  key: "padding",
                  label: "Padding",
                  type: "number",
                  placeholder: "64",
                  unit: "px",
                },
                {
                  key: "gridCols",
                  label: "Grid Columns",
                  type: "text",
                  placeholder: "sm:grid-cols-2",
                },
              ],
            },
            {
              key: "desktop",
              label: "Desktop",
              type: "object",
              fields: [
                {
                  key: "gridCols",
                  label: "Grid Columns",
                  type: "text",
                  placeholder: "xl:grid-cols-3",
                },
              ],
            },
          ],
        },
        {
          key: "animations",
          label: "Animations",
          type: "object",
          fields: [
            {
              key: "header",
              label: "Header Animation",
              type: "object",
              fields: [
                { key: "enabled", label: "Enable Animation", type: "boolean" },
                {
                  key: "type",
                  label: "Animation Type",
                  type: "select",
                  options: [
                    { value: "fade-up", label: "Fade Up" },
                    { value: "fade-left", label: "Fade Left" },
                    { value: "fade-right", label: "Fade Right" },
                    { value: "slide-up", label: "Slide Up" },
                  ],
                },
                { key: "duration", label: "Duration (ms)", type: "number" },
                { key: "delay", label: "Delay (ms)", type: "number" },
              ],
            },
            {
              key: "features",
              label: "Features Animation",
              type: "object",
              fields: [
                { key: "enabled", label: "Enable Animation", type: "boolean" },
                {
                  key: "type",
                  label: "Animation Type",
                  type: "select",
                  options: [
                    { value: "fade-up", label: "Fade Up" },
                    { value: "fade-left", label: "Fade Left" },
                    { value: "fade-right", label: "Fade Right" },
                    { value: "slide-up", label: "Slide Up" },
                  ],
                },
                { key: "duration", label: "Duration (ms)", type: "number" },
                { key: "delay", label: "Delay (ms)", type: "number" },
                { key: "stagger", label: "Stagger Delay (ms)", type: "number" },
              ],
            },
            {
              key: "icons",
              label: "Icons Animation",
              type: "object",
              fields: [
                { key: "enabled", label: "Enable Animation", type: "boolean" },
                {
                  key: "type",
                  label: "Animation Type",
                  type: "select",
                  options: [
                    { value: "fade-up", label: "Fade Up" },
                    { value: "fade-left", label: "Fade Left" },
                    { value: "fade-right", label: "Fade Right" },
                    { value: "slide-up", label: "Slide Up" },
                  ],
                },
                { key: "duration", label: "Duration (ms)", type: "number" },
                { key: "delay", label: "Delay (ms)", type: "number" },
                { key: "stagger", label: "Stagger Delay (ms)", type: "number" },
              ],
            },
          ],
        },
        {
          key: "styling",
          label: "Styling",
          type: "object",
          fields: [
            {
              key: "icon",
              label: "Icon Settings",
              type: "object",
              fields: [
                {
                  key: "color",
                  label: "Icon Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "primary", // Icon color uses primary color from branding
                },
              ],
            },
            {
              key: "colors",
              label: "Colors",
              type: "object",
              fields: [
                {
                  key: "background",
                  label: "Section Background",
                  type: "color",
                  useDefaultColor: false, // Background is usually white
                },
                {
                  key: "cardBackground",
                  label: "Card Background",
                  type: "color",
                  useDefaultColor: false, // Card background is usually white
                },
                {
                  key: "titleColor",
                  label: "Title Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "secondary", // Title text uses secondary color from branding
                },
                {
                  key: "descriptionColor",
                  label: "Description Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "secondary", // Description text uses secondary color from branding
                },
                {
                  key: "iconColor",
                  label: "Icon Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "primary", // Icon color uses primary color from branding
                },
                {
                  key: "borderColor",
                  label: "Border Color",
                  type: "color",
                  useDefaultColor: false, // Border color is usually custom
                },
                {
                  key: "ringColor",
                  label: "Ring Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "primary", // Ring color uses primary color (lighter shade) from branding
                },
              ],
            },
          ],
        },
        {
          key: "colors",
          label: "Colors",
          type: "object",
          fields: [
            {
              key: "background",
              label: "Section Background",
              type: "color",
              placeholder: "#ffffff",
            },
            {
              key: "cardBackground",
              label: "Card Background",
              type: "color",
              placeholder: "#ffffff",
            },
            {
              key: "titleColor",
              label: "Title Color",
              type: "color",
              placeholder: "#059669",
              useDefaultColor: true,
              globalColorType: "secondary", // Title uses secondary color
            },
            {
              key: "descriptionColor",
              label: "Description Color",
              type: "color",
              placeholder: "#4b5563",
              useDefaultColor: true,
              globalColorType: "secondary", // Description uses secondary color
            },
            {
              key: "iconColor",
              label: "Icon Color",
              type: "color",
              placeholder: "#059669",
              useDefaultColor: true,
              globalColorType: "primary", // Icon uses primary color
            },
            {
              key: "borderColor",
              label: "Border Color",
              type: "color",
              placeholder: "#e5e7eb",
              useDefaultColor: false, // Border color is usually custom
            },
            {
              key: "ringColor",
              label: "Ring Color",
              type: "color",
              placeholder: "#ecfdf5",
              useDefaultColor: true,
              globalColorType: "primary", // Ring color uses primary color (lighter shade)
            },
          ],
        },
      ],
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "header.title", label: "Header Title", type: "text" },
        {
          key: "header.description",
          label: "Header Description",
          type: "text",
        },
        {
          key: "features",
          label: "Features Grid",
          type: "object",
          fields: [
            {
              key: "list",
              label: "Features List",
              type: "array",
              addLabel: "Add Feature",
              itemLabel: "Feature",
              of: [
                { key: "title", label: "Title", type: "text" },
                { key: "desc", label: "Description", type: "text" },
                {
                  key: "icon",
                  label: "Icon Settings",
                  type: "object",
                  fields: [
                    {
                      key: "type",
                      label: "Icon Type",
                      type: "select",
                      showIcons: true, // Flag to show icons in dropdown
                      options: [
                        // Lucide Icons - Most Common
                        {
                          value: "UserCircle",
                          label: "User Circle",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Building2",
                          label: "Building",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "GraduationCap",
                          label: "Graduation Cap",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "TrendingUp",
                          label: "Trending Up",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Briefcase",
                          label: "Briefcase",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Settings",
                          label: "Settings",
                          iconLibrary: "lucide",
                        },
                        { value: "Home", label: "Home", iconLibrary: "lucide" },
                        {
                          value: "MapPin",
                          label: "Map Pin",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Phone",
                          label: "Phone",
                          iconLibrary: "lucide",
                        },
                        { value: "Mail", label: "Mail", iconLibrary: "lucide" },
                        {
                          value: "Heart",
                          label: "Heart",
                          iconLibrary: "lucide",
                        },
                        { value: "Star", label: "Star", iconLibrary: "lucide" },
                        {
                          value: "Award",
                          label: "Award",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Shield",
                          label: "Shield",
                          iconLibrary: "lucide",
                        },
                        { value: "Zap", label: "Zap", iconLibrary: "lucide" },
                        {
                          value: "Target",
                          label: "Target",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Rocket",
                          label: "Rocket",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Lightbulb",
                          label: "Lightbulb",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "DollarSign",
                          label: "Dollar Sign",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "BarChart",
                          label: "Bar Chart",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "PieChart",
                          label: "Pie Chart",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "LineChart",
                          label: "Line Chart",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Users",
                          label: "Users",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "UserCheck",
                          label: "User Check",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Handshake",
                          label: "Handshake",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "ThumbsUp",
                          label: "Thumbs Up",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "CheckCircle",
                          label: "Check Circle",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "FileText",
                          label: "File Text",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Folder",
                          label: "Folder",
                          iconLibrary: "lucide",
                        },
                        { value: "Key", label: "Key", iconLibrary: "lucide" },
                        { value: "Lock", label: "Lock", iconLibrary: "lucide" },
                        {
                          value: "Search",
                          label: "Search",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Filter",
                          label: "Filter",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Calendar",
                          label: "Calendar",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Clock",
                          label: "Clock",
                          iconLibrary: "lucide",
                        },
                        { value: "Bell", label: "Bell", iconLibrary: "lucide" },
                        {
                          value: "MessageSquare",
                          label: "Message Square",
                          iconLibrary: "lucide",
                        },
                        { value: "Send", label: "Send", iconLibrary: "lucide" },
                        {
                          value: "Share",
                          label: "Share",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Download",
                          label: "Download",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Upload",
                          label: "Upload",
                          iconLibrary: "lucide",
                        },
                        { value: "Save", label: "Save", iconLibrary: "lucide" },
                        { value: "Edit", label: "Edit", iconLibrary: "lucide" },
                        {
                          value: "Trash2",
                          label: "Trash",
                          iconLibrary: "lucide",
                        },
                        { value: "Copy", label: "Copy", iconLibrary: "lucide" },
                        { value: "Plus", label: "Plus", iconLibrary: "lucide" },
                        {
                          value: "Minus",
                          label: "Minus",
                          iconLibrary: "lucide",
                        },
                        { value: "X", label: "X", iconLibrary: "lucide" },
                        {
                          value: "Check",
                          label: "Check",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "ChevronRight",
                          label: "Chevron Right",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "ChevronLeft",
                          label: "Chevron Left",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "ArrowRight",
                          label: "Arrow Right",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "ArrowLeft",
                          label: "Arrow Left",
                          iconLibrary: "lucide",
                        },
                        { value: "Menu", label: "Menu", iconLibrary: "lucide" },
                        { value: "Grid", label: "Grid", iconLibrary: "lucide" },
                        { value: "List", label: "List", iconLibrary: "lucide" },
                        {
                          value: "Image",
                          label: "Image",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Camera",
                          label: "Camera",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Video",
                          label: "Video",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Music",
                          label: "Music",
                          iconLibrary: "lucide",
                        },
                        { value: "Book", label: "Book", iconLibrary: "lucide" },
                        {
                          value: "BookOpen",
                          label: "Book Open",
                          iconLibrary: "lucide",
                        },
                        { value: "Tag", label: "Tag", iconLibrary: "lucide" },
                        { value: "Map", label: "Map", iconLibrary: "lucide" },
                        {
                          value: "Globe",
                          label: "Globe",
                          iconLibrary: "lucide",
                        },
                        { value: "Gift", label: "Gift", iconLibrary: "lucide" },
                        {
                          value: "Package",
                          label: "Package",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "ShoppingCart",
                          label: "Shopping Cart",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "CreditCard",
                          label: "Credit Card",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Wallet",
                          label: "Wallet",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Activity",
                          label: "Activity",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "QrCode",
                          label: "QR Code",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "ShieldCheck",
                          label: "Shield Check",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Badge",
                          label: "Badge",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Medal",
                          label: "Medal",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Trophy",
                          label: "Trophy",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Crown",
                          label: "Crown",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Sparkle",
                          label: "Sparkle",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Palette",
                          label: "Palette",
                          iconLibrary: "lucide",
                        },
                        { value: "Code", label: "Code", iconLibrary: "lucide" },
                        {
                          value: "Server",
                          label: "Server",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Database",
                          label: "Database",
                          iconLibrary: "lucide",
                        },
                        { value: "Wifi", label: "WiFi", iconLibrary: "lucide" },
                        {
                          value: "Laptop",
                          label: "Laptop",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Smartphone",
                          label: "Smartphone",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Printer",
                          label: "Printer",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "Microphone",
                          label: "Microphone",
                          iconLibrary: "lucide",
                        },
                        {
                          value: "PhoneCall",
                          label: "Phone Call",
                          iconLibrary: "lucide",
                        },
                        // React Icons - Font Awesome
                        {
                          value: "FaUser",
                          label: "User (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaHome",
                          label: "Home (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaBuilding",
                          label: "Building (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaEnvelope",
                          label: "Envelope (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaPhone",
                          label: "Phone (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaHeart",
                          label: "Heart (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaStar",
                          label: "Star (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaShieldAlt",
                          label: "Shield (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaRocket",
                          label: "Rocket (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaLightbulb",
                          label: "Lightbulb (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaDollarSign",
                          label: "Dollar (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaChartBar",
                          label: "Chart Bar (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaUsers",
                          label: "Users (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaHandshake",
                          label: "Handshake (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaCheckCircle",
                          label: "Check Circle (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaFile",
                          label: "File (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaLock",
                          label: "Lock (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaSearch",
                          label: "Search (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaCalendar",
                          label: "Calendar (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaBell",
                          label: "Bell (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaShare",
                          label: "Share (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaDownload",
                          label: "Download (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaEdit",
                          label: "Edit (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaTrash",
                          label: "Trash (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaPlus",
                          label: "Plus (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaMinus",
                          label: "Minus (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaCheck",
                          label: "Check (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaArrowRight",
                          label: "Arrow Right (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaArrowLeft",
                          label: "Arrow Left (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaBars",
                          label: "Bars (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaImage",
                          label: "Image (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaCamera",
                          label: "Camera (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaVideo",
                          label: "Video (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaBook",
                          label: "Book (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaMap",
                          label: "Map (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaGlobe",
                          label: "Globe (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaGift",
                          label: "Gift (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaShoppingCart",
                          label: "Shopping Cart (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaCreditCard",
                          label: "Credit Card (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaQrcode",
                          label: "QR Code (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaShield",
                          label: "Shield Alt (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaTrophy",
                          label: "Trophy (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaCode",
                          label: "Code (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaServer",
                          label: "Server (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaDatabase",
                          label: "Database (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaLaptop",
                          label: "Laptop (FA)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "FaMobile",
                          label: "Mobile (FA)",
                          iconLibrary: "react-icons",
                        },
                        // React Icons - Material Design
                        {
                          value: "MdPerson",
                          label: "Person (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdHome",
                          label: "Home (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdBusiness",
                          label: "Business (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdEmail",
                          label: "Email (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdPhone",
                          label: "Phone (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdFavorite",
                          label: "Favorite (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdStar",
                          label: "Star (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdSecurity",
                          label: "Security (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdRocketLaunch",
                          label: "Rocket (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdLightbulb",
                          label: "Lightbulb (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdAttachMoney",
                          label: "Money (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdBarChart",
                          label: "Bar Chart (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdPeople",
                          label: "People (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdHandshake",
                          label: "Handshake (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdCheckCircle",
                          label: "Check Circle (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdDescription",
                          label: "File (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdLock",
                          label: "Lock (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdSearch",
                          label: "Search (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdCalendarToday",
                          label: "Calendar (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdNotifications",
                          label: "Notifications (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdShare",
                          label: "Share (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdDownload",
                          label: "Download (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdEdit",
                          label: "Edit (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdDelete",
                          label: "Delete (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdAdd",
                          label: "Add (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdRemove",
                          label: "Remove (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdCheck",
                          label: "Check (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdArrowForward",
                          label: "Arrow Forward (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdArrowBack",
                          label: "Arrow Back (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdMenu",
                          label: "Menu (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdImage",
                          label: "Image (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdCameraAlt",
                          label: "Camera (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdVideoLibrary",
                          label: "Video (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdBook",
                          label: "Book (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdLocationOn",
                          label: "Location (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdLanguage",
                          label: "Language (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdCardGiftcard",
                          label: "Gift (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdShoppingCart",
                          label: "Shopping Cart (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdCreditCard",
                          label: "Credit Card (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdQrCode",
                          label: "QR Code (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdVerified",
                          label: "Verified (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdEmojiEvents",
                          label: "Trophy (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdCode",
                          label: "Code (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdStorage",
                          label: "Storage (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdLaptop",
                          label: "Laptop (MD)",
                          iconLibrary: "react-icons",
                        },
                        {
                          value: "MdPhoneAndroid",
                          label: "Phone Android (MD)",
                          iconLibrary: "react-icons",
                        },
                      ],
                    },
                    {
                      key: "size",
                      label: "Size",
                      type: "text",
                      placeholder: "80",
                    },
                    {
                      key: "className",
                      label: "CSS Classes",
                      type: "text",
                      placeholder: "w-20 h-20",
                    },
                  ],
                },
              ],
            },
            {
              key: "grid",
              label: "Grid Layout",
              type: "object",
              fields: [
                {
                  key: "gap",
                  label: "Gap",
                  type: "text",
                  placeholder: "gap-6",
                },
                {
                  key: "columns",
                  label: "Columns",
                  type: "object",
                  fields: [
                    {
                      key: "sm",
                      label: "Small Screens",
                      type: "text",
                      placeholder: "sm:grid-cols-2",
                    },
                    {
                      key: "xl",
                      label: "Extra Large Screens",
                      type: "text",
                      placeholder: "xl:grid-cols-3",
                    },
                  ],
                },
                {
                  key: "paddingX",
                  label: "Horizontal Padding",
                  type: "number",
                  placeholder: "16",
                  unit: "px",
                },
              ],
            },
            {
              key: "card",
              label: "Card Style",
              type: "object",
              fields: [
                {
                  key: "className",
                  label: "CSS Classes",
                  type: "text",
                  placeholder:
                    "rounded-2xl border bg-white p-6 shadow-sm ring-1 ring-emerald-50",
                },
                {
                  key: "borderRadius",
                  label: "Border Radius",
                  type: "text",
                  placeholder: "rounded-2xl",
                },
                {
                  key: "border",
                  label: "Border",
                  type: "text",
                  placeholder: "border",
                },
                {
                  key: "backgroundColor",
                  label: "Background Color",
                  type: "text",
                  placeholder: "bg-white",
                },
                {
                  key: "padding",
                  label: "Padding",
                  type: "number",
                  placeholder: "24",
                  unit: "px",
                },
                {
                  key: "shadow",
                  label: "Shadow",
                  type: "text",
                  placeholder: "shadow-sm",
                },
                {
                  key: "ring",
                  label: "Ring",
                  type: "text",
                  placeholder: "ring-1 ring-emerald-50",
                },
              ],
            },
            {
              key: "icon",
              label: "Icon Style",
              type: "object",
              fields: [
                {
                  key: "container",
                  label: "Container",
                  type: "object",
                  fields: [
                    {
                      key: "className",
                      label: "CSS Classes",
                      type: "text",
                      placeholder:
                        "mx-auto flex size-20 items-center justify-center",
                    },
                    {
                      key: "size",
                      label: "Size",
                      type: "text",
                      placeholder: "size-20",
                    },
                    {
                      key: "flex",
                      label: "Flex",
                      type: "text",
                      placeholder: "flex",
                    },
                    {
                      key: "items",
                      label: "Items",
                      type: "text",
                      placeholder: "items-center",
                    },
                    {
                      key: "justify",
                      label: "Justify",
                      type: "text",
                      placeholder: "justify-center",
                    },
                  ],
                },
                {
                  key: "image",
                  label: "Image",
                  type: "object",
                  fields: [
                    {
                      key: "className",
                      label: "CSS Classes",
                      type: "text",
                      placeholder: "h-[7rem] w-[7rem]",
                    },
                    {
                      key: "height",
                      label: "Height",
                      type: "number",
                      placeholder: "112",
                      unit: "px",
                    },
                    {
                      key: "width",
                      label: "Width",
                      type: "number",
                      placeholder: "112",
                      unit: "px",
                    },
                  ],
                },
              ],
            },
            {
              key: "typography",
              label: "Typography",
              type: "object",
              fields: [
                {
                  key: "title",
                  label: "Title Font",
                  type: "object",
                  fields: [
                    {
                      key: "className",
                      label: "CSS Classes",
                      type: "text",
                      placeholder:
                        "mt-6 text-center text-lg font-bold text-emerald-700",
                    },
                    {
                      key: "marginTop",
                      label: "Margin Top",
                      type: "number",
                      placeholder: "24",
                      unit: "px",
                    },
                    {
                      key: "textAlign",
                      label: "Text Align",
                      type: "text",
                      placeholder: "text-center",
                    },
                    {
                      key: "fontSize",
                      label: "Font Size",
                      type: "number",
                      unit: "px",
                      defaultValue: 18,
                    },
                    {
                      key: "fontWeight",
                      label: "Font Weight",
                      type: "text",
                      placeholder: "font-bold",
                    },
                    {
                      key: "color",
                      label: "Color",
                      type: "text",
                      placeholder: "text-emerald-700",
                    },
                  ],
                },
                {
                  key: "description",
                  label: "Description Font",
                  type: "object",
                  fields: [
                    {
                      key: "className",
                      label: "CSS Classes",
                      type: "text",
                      placeholder:
                        "mt-3 text-center text-lg leading-7 text-gray-600",
                    },
                    {
                      key: "marginTop",
                      label: "Margin Top",
                      type: "number",
                      placeholder: "12",
                      unit: "px",
                    },
                    {
                      key: "textAlign",
                      label: "Text Align",
                      type: "text",
                      placeholder: "text-center",
                    },
                    {
                      key: "fontSize",
                      label: "Font Size",
                      type: "number",
                      unit: "px",
                      defaultValue: 18,
                    },
                    {
                      key: "lineHeight",
                      label: "Line Height",
                      type: "text",
                      placeholder: "leading-7",
                    },
                    {
                      key: "color",
                      label: "Color",
                      type: "text",
                      placeholder: "text-gray-600",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
];

