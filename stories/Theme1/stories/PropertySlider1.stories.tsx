import type { Meta, StoryObj } from "@storybook/nextjs";
import PropertySlider1 from "@/components/tenant/propertySlider/propertySlider1";
import { Theme1Decorator } from "../decorators";
import { getMergedDefaultDataForStory } from "../utils/defaultData";

const defaultData = (getMergedDefaultDataForStory("propertySlider1") ?? {}) as Record<string, unknown>;

// Storybook: mock items so slider shows content without API
const mockItems = [
  {
    id: "mock-1",
    slug: "mock-1",
    title: "عقار فاخر للإيجار",
    district: "حي النرجس",
    price: "45,000",
    views: 320,
    bedrooms: 3,
    bathrooms: 2,
    area: "180",
    type: "شقة",
    transactionType: "للإيجار",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    status: "متاح",
    createdAt: new Date().toISOString(),
    description: "عقار فاخر بموقع استراتيجي",
    features: ["موقف سيارات", "مصعد", "حديقة"],
    location: { lat: 24.71, lng: 46.67, address: "الرياض، حي النرجس" },
    images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"],
  },
  {
    id: "mock-2",
    slug: "mock-2",
    title: "فيلا للبيع",
    district: "حي العليا",
    price: "2,500,000",
    views: 890,
    bedrooms: 5,
    bathrooms: 4,
    area: "450",
    type: "فيلا",
    transactionType: "للبيع",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    status: "متاح",
    createdAt: new Date().toISOString(),
    description: "فيلا فاخرة مع حديقة ومسابح",
    features: ["حديقة", "مسبح", "موقف سيارات"],
    location: { lat: 24.72, lng: 46.68, address: "الرياض، حي العليا" },
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"],
  },
  {
    id: "mock-3",
    slug: "mock-3",
    title: "شقة عصرية للإيجار",
    district: "حي الياسمين",
    price: "55,000",
    views: 210,
    bedrooms: 4,
    bathrooms: 3,
    area: "220",
    type: "شقة",
    transactionType: "للإيجار",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    status: "متاح",
    createdAt: new Date().toISOString(),
    description: "شقة عصرية بتصميم عصري",
    features: ["مصعد", "صالة رياضية"],
    location: { lat: 24.70, lng: 46.66, address: "الرياض، حي الياسمين" },
    images: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"],
  },
  {
    id: "mock-4",
    slug: "mock-4",
    title: "مكتب تجاري",
    district: "حي المطار",
    price: "1,800,000",
    views: 150,
    bedrooms: 2,
    bathrooms: 2,
    area: "300",
    type: "مكتب",
    transactionType: "للبيع",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
    status: "متاح",
    createdAt: new Date().toISOString(),
    description: "مكتب تجاري بموقع مميز",
    features: ["موقف سيارات", "مصعد"],
    location: { lat: 24.69, lng: 46.65, address: "الرياض، حي المطار" },
    images: ["https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800"],
  },
];

const meta: Meta<typeof PropertySlider1> = {
  title: "Theme1/PropertySlider/PropertySlider1",
  component: PropertySlider1,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [Theme1Decorator],
  args: {
    ...defaultData,
    useStore: false,
    tenantId: "demo",
    dataSource: { enabled: false },
    items: mockItems,
  },
};

export default meta;
type Story = StoryObj<typeof PropertySlider1>;

export const Default: Story = {};
