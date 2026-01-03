import { ComponentData } from "@/lib/types";
import { createDefaultData } from "./types";

// Default data for contact cards
export const getDefaultContactCardsData = (): ComponentData => ({
  visible: true,
  layout: {
    container: {
      padding: {
        vertical: "py-[48px] md:py-[104px]",
        horizontal: "px-4 sm:px-10",
      },
    },
    grid: {
      columns: {
        mobile: "grid-cols-1",
        desktop: "md:grid-cols-3",
      },
      gap: "gap-[24px]",
      borderRadius: "rounded-[10px]",
    },
  },
  cards: [
    {
      icon: {
        src: "https://dalel-lovat.vercel.app/images/contact-us/address.svg",
        alt: "address Icon",
        size: {
          mobile: "w-[40px] h-[40px]",
          desktop: "md:w-[60px] md:h-[60px]",
        },
      },
      title: {
        text: "العنوان",
        style: {
          size: {
            mobile: "text-[16px]",
            desktop: "md:text-[24px]",
          },
          weight: "font-bold",
          color: "#525252",
          lineHeight: "leading-[35px]",
        },
      },
      content: {
        type: "text",
        text: "المملكة العربية السعودية",
        style: {
          size: {
            mobile: "text-[16px]",
            desktop: "md:text-[20px]",
          },
          weight: "font-normal",
          color: "#525252",
          lineHeight: "leading-[35px]",
        },
      },
      cardStyle: {
        height: {
          mobile: "h-[182px]",
          desktop: "md:h-[210px]",
        },
        gap: {
          main: "gap-y-[16px]",
          content: {
            mobile: "gap-y-[8px]",
            desktop: "md:gap-y-[16px]",
          },
          links: "gap-x-[50px]",
        },
        shadow: {
          enabled: true,
          value: "rgba(9, 46, 114, 0.32) 0px 2px 16px 0px",
        },
        alignment: {
          horizontal: "items-center",
          vertical: "justify-center",
        },
      },
    },
    {
      icon: {
        src: "https://dalel-lovat.vercel.app/images/contact-us/envelope.svg",
        alt: "email Icon",
        size: {
          mobile: "w-[40px] h-[40px]",
          desktop: "md:w-[60px] md:h-[60px]",
        },
      },
      title: {
        text: "الايميل",
        style: {
          size: {
            mobile: "text-[16px]",
            desktop: "md:text-[24px]",
          },
          weight: "font-bold",
          color: "#525252",
          lineHeight: "leading-[35px]",
        },
      },
      content: {
        type: "links",
        links: [
          {
            text: "guidealjiwa22@gmail.com",
            href: "mailto:guidealjiwa22@gmail.com",
          },
        ],
        style: {
          size: {
            mobile: "text-[16px]",
            desktop: "md:text-[20px]",
          },
          weight: "font-normal",
          color: "#525252",
          lineHeight: "leading-[35px]",
        },
      },
      cardStyle: {
        height: {
          mobile: "h-[182px]",
          desktop: "md:h-[210px]",
        },
        gap: {
          main: "gap-y-[16px]",
          content: {
            mobile: "gap-y-[8px]",
            desktop: "md:gap-y-[16px]",
          },
          links: "gap-x-[50px]",
        },
        shadow: {
          enabled: true,
          value: "rgba(9, 46, 114, 0.32) 0px 2px 16px 0px",
        },
        alignment: {
          horizontal: "items-center",
          vertical: "justify-center",
        },
      },
    },
    {
      icon: {
        src: "https://dalel-lovat.vercel.app/images/contact-us/phone.svg",
        alt: "phone Icon",
        size: {
          mobile: "w-[40px] h-[40px]",
          desktop: "md:w-[60px] md:h-[60px]",
        },
      },
      title: {
        text: "الجوال",
        style: {
          size: {
            mobile: "text-[16px]",
            desktop: "md:text-[24px]",
          },
          weight: "font-bold",
          color: "#525252",
          lineHeight: "leading-[35px]",
        },
      },
      content: {
        type: "links",
        links: [
          {
            text: "0535150222",
            href: "tel:0535150222",
          },
          {
            text: "0000",
            href: "tel:0000",
          },
        ],
        style: {
          size: {
            mobile: "text-[16px]",
            desktop: "md:text-[20px]",
          },
          weight: "font-normal",
          color: "#525252",
          lineHeight: "leading-[35px]",
        },
      },
      cardStyle: {
        height: {
          mobile: "h-[182px]",
          desktop: "md:h-[210px]",
        },
        gap: {
          main: "gap-y-[16px]",
          content: {
            mobile: "gap-y-[8px]",
            desktop: "md:gap-y-[16px]",
          },
          links: "gap-x-[50px]",
        },
        shadow: {
          enabled: true,
          value: "rgba(9, 46, 114, 0.32) 0px 2px 16px 0px",
        },
        alignment: {
          horizontal: "items-center",
          vertical: "justify-center",
        },
      },
    },
  ],
  responsive: {
    breakpoints: {
      mobile: "768px",
      desktop: "1024px",
    },
    gridColumns: {
      mobile: 1,
      desktop: 3,
    },
  },
  animations: {
    cards: {
      enabled: true,
      type: "fadeInUp",
      duration: 500,
      delay: 0,
      stagger: 100,
    },
    icons: {
      enabled: true,
      type: "scaleIn",
      duration: 300,
      delay: 200,
    },
  },
});

// Contact cards functions
export const contactCardsFunctions = {
  // Get default data
  getDefaultData: getDefaultContactCardsData,

  // Create new contact cards data
  createNew: (): ComponentData => getDefaultContactCardsData(),

  // Ensure variant exists in store
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    // If variant already exists with data, don't override
    if (
      state.contactCardsStates?.[variantId] &&
      Object.keys(state.contactCardsStates[variantId]).length > 0
    ) {
      return {} as any;
    }

    // Use initial data if provided, otherwise use default
    const defaultData = getDefaultContactCardsData();
    const data: ComponentData = initial || state.tempData || defaultData;

    return {
      contactCardsStates: {
        ...(state.contactCardsStates || {}),
        [variantId]: data,
      },
    } as any;
  },

  // Get data for variant
  getData: (state: any, variantId: string): ComponentData => {
    return state.contactCardsStates?.[variantId] || {};
  },

  // Set data for variant
  setData: (state: any, variantId: string, data: ComponentData) => {
    return {
      contactCardsStates: {
        ...state.contactCardsStates,
        [variantId]: data,
      },
    };
  },

  // Update data by path
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const currentData =
      state.contactCardsStates?.[variantId] || getDefaultContactCardsData();

    const segments = path
      .replace(/\[(\d+)\]/g, ".$1")
      .split(".")
      .filter(Boolean);

    const newData: any = { ...currentData };
    let cursor: any = newData;

    for (let i = 0; i < segments.length - 1; i++) {
      const key = segments[i]!;
      const nextIsIndex = !Number.isNaN(Number(segments[i + 1]));
      const existing = cursor[key];

      if (
        existing == null ||
        typeof existing === "string" ||
        typeof existing === "number" ||
        typeof existing === "boolean"
      ) {
        cursor[key] = nextIsIndex ? [] : {};
      } else if (Array.isArray(existing) && !nextIsIndex) {
        cursor[key] = {};
      } else if (
        typeof existing === "object" &&
        !Array.isArray(existing) &&
        nextIsIndex
      ) {
        cursor[key] = [];
      }
      cursor = cursor[key];
    }

    const lastKey = segments[segments.length - 1]!;
    cursor[lastKey] = value;

    // Update pageComponentsByPage with the new data
    const currentPage = state.currentPage || "homepage";
    const updatedPageComponents = state.pageComponentsByPage[currentPage] || [];

    // Find and update the component in pageComponents
    const updatedComponents = updatedPageComponents.map((comp: any) => {
      if (comp.type === "contactCards" && comp.id === variantId) {
        return {
          ...comp,
          data: newData,
        };
      }
      return comp;
    });

    return {
      contactCardsStates: {
        ...state.contactCardsStates,
        [variantId]: newData,
      },
      pageComponentsByPage: {
        ...state.pageComponentsByPage,
        [currentPage]: updatedComponents,
      },
    };
  },

  // Update contact cards data
  update: (
    currentData: ComponentData,
    updates: Partial<ComponentData>,
  ): ComponentData => ({
    ...currentData,
    ...updates,
  }),

  // Add new contact card
  addContactCard: (currentData: ComponentData, card: any): ComponentData => ({
    ...currentData,
    cards: [...(currentData.cards || []), card],
  }),

  // Remove contact card
  removeContactCard: (
    currentData: ComponentData,
    index: number,
  ): ComponentData => ({
    ...currentData,
    cards: (currentData.cards || []).filter((_: any, i: number) => i !== index),
  }),

  // Update contact card
  updateContactCard: (
    currentData: ComponentData,
    index: number,
    updates: any,
  ): ComponentData => ({
    ...currentData,
    cards: (currentData.cards || []).map((card: any, i: number) =>
      i === index ? { ...card, ...updates } : card,
    ),
  }),

  // Add link to card
  addLinkToCard: (
    currentData: ComponentData,
    cardIndex: number,
    link: any,
  ): ComponentData => ({
    ...currentData,
    cards: (currentData.cards || []).map((card: any, i: number) => {
      if (i === cardIndex) {
        return {
          ...card,
          content: {
            ...card.content,
            links: [...(card.content?.links || []), link],
          },
        };
      }
      return card;
    }),
  }),

  // Remove link from card
  removeLinkFromCard: (
    currentData: ComponentData,
    cardIndex: number,
    linkIndex: number,
  ): ComponentData => ({
    ...currentData,
    cards: (currentData.cards || []).map((card: any, i: number) => {
      if (i === cardIndex) {
        return {
          ...card,
          content: {
            ...card.content,
            links: (card.content?.links || []).filter(
              (_: any, li: number) => li !== linkIndex,
            ),
          },
        };
      }
      return card;
    }),
  }),

  // Update card icon
  updateCardIcon: (
    currentData: ComponentData,
    cardIndex: number,
    icon: any,
  ): ComponentData => ({
    ...currentData,
    cards: (currentData.cards || []).map((card: any, i: number) =>
      i === cardIndex ? { ...card, icon: { ...card.icon, ...icon } } : card,
    ),
  }),

  // Update card title
  updateCardTitle: (
    currentData: ComponentData,
    cardIndex: number,
    title: any,
  ): ComponentData => ({
    ...currentData,
    cards: (currentData.cards || []).map((card: any, i: number) =>
      i === cardIndex ? { ...card, title: { ...card.title, ...title } } : card,
    ),
  }),

  // Update card content
  updateCardContent: (
    currentData: ComponentData,
    cardIndex: number,
    content: any,
  ): ComponentData => ({
    ...currentData,
    cards: (currentData.cards || []).map((card: any, i: number) =>
      i === cardIndex
        ? { ...card, content: { ...card.content, ...content } }
        : card,
    ),
  }),

  // Update card style
  updateCardStyle: (
    currentData: ComponentData,
    cardIndex: number,
    style: any,
  ): ComponentData => ({
    ...currentData,
    cards: (currentData.cards || []).map((card: any, i: number) =>
      i === cardIndex
        ? { ...card, cardStyle: { ...card.cardStyle, ...style } }
        : card,
    ),
  }),

  // Update layout settings
  updateLayout: (currentData: ComponentData, layout: any): ComponentData => ({
    ...currentData,
    layout: {
      ...currentData.layout,
      ...layout,
    },
  }),

  // Update animations
  updateAnimations: (
    currentData: ComponentData,
    animations: any,
  ): ComponentData => ({
    ...currentData,
    animations: {
      ...currentData.animations,
      ...animations,
    },
  }),

  // Update responsive settings
  updateResponsive: (
    currentData: ComponentData,
    responsive: any,
  ): ComponentData => ({
    ...currentData,
    responsive: {
      ...currentData.responsive,
      ...responsive,
    },
  }),

  // Validate contact cards data
  validate: (data: ComponentData): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!data.cards || data.cards.length === 0) {
      errors.push("At least one contact card is required");
    }

    if (data.cards) {
      data.cards.forEach((card: any, index: number) => {
        if (!card.icon?.src) {
          errors.push(`Card ${index + 1} is missing icon source`);
        }
        if (!card.title?.text) {
          errors.push(`Card ${index + 1} is missing title`);
        }
        if (!card.content) {
          errors.push(`Card ${index + 1} is missing content`);
        }
        if (
          card.content?.type === "links" &&
          (!card.content.links || card.content.links.length === 0)
        ) {
          errors.push(
            `Card ${index + 1} with links type must have at least one link`,
          );
        }
        if (card.content?.type === "text" && !card.content.text) {
          errors.push(
            `Card ${index + 1} with text type must have text content`,
          );
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Get card by index
  getCard: (data: ComponentData, index: number) => {
    return data.cards?.[index] || null;
  },

  // Get cards count
  getCardsCount: (data: ComponentData) => {
    return data.cards?.length || 0;
  },

  // Reorder cards
  reorderCards: (
    currentData: ComponentData,
    fromIndex: number,
    toIndex: number,
  ): ComponentData => {
    const cards = [...(currentData.cards || [])];
    const [movedCard] = cards.splice(fromIndex, 1);
    cards.splice(toIndex, 0, movedCard);

    return {
      ...currentData,
      cards,
    };
  },
};
