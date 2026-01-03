import type {
  Product,
  TeamMember,
  Collection,
  ShippingZone,
  ReturnPolicy,
} from "./types";

// Mock data for development
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    slug: "wireless-headphones",
    description: "High-quality wireless headphones with noise cancellation.",
    price: 149.99,
    originalPrice: 199.99,
    discount: 25,
    images: ["/images/placeholders/products/Wireless Headphones.jpg"],
    category: "electronics",
    collections: ["audio", "featured"],
    tags: ["headphones", "wireless", "audio"],
    stock: 50,
    rating: 4.5,
    reviewCount: 128,
    featured: true,
    tenantId: "tenant1",
    specifications: {
      Brand: "AudioTech",
      Model: "AT-500",
      "Battery Life": "20 hours",
      Connectivity: "Bluetooth 5.0",
      Weight: "250g",
    },
    shippingInfo: {
      weight: 0.5,
      dimensions: {
        length: 20,
        width: 15,
        height: 8,
      },
      freeShipping: true,
      shippingRestrictions: [],
    },
  },
  {
    id: "2",
    name: "Smart Watch",
    slug: "smart-watch",
    description: "Track your fitness and stay connected with this smart watch.",
    price: 299.99,
    originalPrice: 349.99,
    discount: 14,
    images: ["/images/placeholders/products/Smart Watch.jpg"],
    category: "electronics",
    collections: ["wearables", "featured"],
    tags: ["watch", "smart", "fitness"],
    stock: 30,
    rating: 4.2,
    reviewCount: 75,
    featured: true,
    tenantId: "tenant1",
    specifications: {
      Brand: "TechFit",
      Model: "TF-Watch Pro",
      "Battery Life": "5 days",
      "Water Resistance": "50m",
      Display: "AMOLED",
    },
    shippingInfo: {
      weight: 0.3,
      dimensions: {
        length: 10,
        width: 5,
        height: 2,
      },
      freeShipping: true,
      shippingRestrictions: [],
    },
  },
  {
    id: "3",
    name: "Laptop Backpack",
    slug: "laptop-backpack",
    description:
      "Durable and comfortable backpack for laptops up to 15 inches.",
    price: 59.99,
    originalPrice: 59.99,
    discount: 0,
    images: ["/images/placeholders/products/Laptop Backpack.jpeg"],
    category: "accessories",
    collections: ["bags", "travel"],
    tags: ["backpack", "laptop", "travel"],
    stock: 100,
    rating: 4.8,
    reviewCount: 210,
    featured: true,
    tenantId: "tenant1",
    specifications: {
      Material: "Polyester",
      Capacity: "25L",
      "Laptop Compartment": "Up to 15 inches",
      "Water Resistant": "Yes",
      Weight: "0.8kg",
    },
    shippingInfo: {
      weight: 0.8,
      dimensions: {
        length: 45,
        width: 30,
        height: 15,
      },
      freeShipping: true,
      shippingRestrictions: [],
    },
  },
  {
    id: "4",
    name: "Coffee Maker",
    slug: "coffee-maker",
    description: "Programmable coffee maker with thermal carafe.",
    price: 89.99,
    originalPrice: 119.99,
    discount: 25,
    images: ["/images/placeholders/products/Coffee Maker.jpg"],
    category: "home",
    collections: ["kitchen", "appliances"],
    tags: ["coffee", "kitchen", "appliance"],
    stock: 45,
    rating: 4.0,
    reviewCount: 62,
    featured: true,
    tenantId: "tenant1",
    specifications: {
      Brand: "HomeBrewers",
      Model: "HB-5000",
      Capacity: "12 cups",
      Programmable: "Yes",
      "Auto Shut-off": "Yes",
    },
    shippingInfo: {
      weight: 2.5,
      dimensions: {
        length: 30,
        width: 25,
        height: 40,
      },
      freeShipping: false,
      shippingRestrictions: [],
    },
  },
];

const mockTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    position: "CEO & Founder",
    bio: "Sarah founded the company in 2015 with a vision to revolutionize e-commerce. With over 15 years of experience in retail and technology, she leads our strategic direction.",
    image: "/placeholder.svg?height=400&width=400",
    socialMedia: {
      linkedin: "https://linkedin.com/in/sarahjohnson",
      twitter: "https://twitter.com/sarahjohnson",
      email: "sarah@example.com",
    },
  },
  {
    id: "2",
    name: "Michael Chen",
    position: "CTO",
    bio: "Michael oversees all technical aspects of the company. His expertise in scalable architecture and multi-tenant systems has been crucial to our platform's success.",
    image: "/placeholder.svg?height=400&width=400",
    socialMedia: {
      linkedin: "https://linkedin.com/in/michaelchen",
      twitter: "https://twitter.com/michaelchen",
      email: "michael@example.com",
    },
  },
  {
    id: "3",
    name: "Aisha Patel",
    position: "Head of Design",
    bio: "Aisha leads our design team, ensuring all tenant storefronts are beautiful, functional, and on-brand. She has a background in UX/UI design and brand strategy.",
    image: "/placeholder.svg?height=400&width=400",
    socialMedia: {
      linkedin: "https://linkedin.com/in/aishapatel",
      email: "aisha@example.com",
    },
  },
  {
    id: "4",
    name: "David Rodriguez",
    position: "Customer Success Manager",
    bio: "David works closely with our tenants to ensure they get the most out of our platform. His customer-first approach has helped many businesses thrive online.",
    image: "/placeholder.svg?height=400&width=400",
    socialMedia: {
      linkedin: "https://linkedin.com/in/davidrodriguez",
      twitter: "https://twitter.com/davidrodriguez",
      email: "david@example.com",
    },
  },
];

const mockCollections: Collection[] = [
  {
    id: "1",
    name: "Summer Collection",
    slug: "summer-collection",
    description: "Beat the heat with our curated summer essentials.",
    image: "/placeholder.svg?height=600&width=800",
    featured: true,
    productCount: 24,
  },
  {
    id: "2",
    name: "Office Essentials",
    slug: "office-essentials",
    description: "Everything you need for a productive workspace.",
    image: "/placeholder.svg?height=600&width=800",
    featured: true,
    productCount: 18,
  },
  {
    id: "3",
    name: "Travel Gear",
    slug: "travel-gear",
    description: "Quality equipment for your adventures.",
    image: "/placeholder.svg?height=600&width=800",
    featured: false,
    productCount: 15,
  },
  {
    id: "4",
    name: "Smart Home",
    slug: "smart-home",
    description: "Transform your living space with smart technology.",
    image: "/placeholder.svg?height=600&width=800",
    featured: true,
    productCount: 12,
  },
];

const mockShippingZones: ShippingZone[] = [
  {
    id: "1",
    name: "United States",
    countries: ["US"],
    rates: [
      { minWeight: 0, maxWeight: 1, price: 5.99 },
      { minWeight: 1, maxWeight: 5, price: 9.99 },
      { minWeight: 5, maxWeight: 20, price: 19.99 },
    ],
    estimatedDelivery: { min: 3, max: 5 },
  },
  {
    id: "2",
    name: "Canada",
    countries: ["CA"],
    rates: [
      { minWeight: 0, maxWeight: 1, price: 7.99 },
      { minWeight: 1, maxWeight: 5, price: 12.99 },
      { minWeight: 5, maxWeight: 20, price: 24.99 },
    ],
    estimatedDelivery: { min: 5, max: 10 },
  },
  {
    id: "3",
    name: "Europe",
    countries: [
      "GB",
      "DE",
      "FR",
      "IT",
      "ES",
      "NL",
      "BE",
      "AT",
      "CH",
      "SE",
      "NO",
      "DK",
      "FI",
    ],
    rates: [
      { minWeight: 0, maxWeight: 1, price: 12.99 },
      { minWeight: 1, maxWeight: 5, price: 24.99 },
      { minWeight: 5, maxWeight: 20, price: 49.99 },
    ],
    estimatedDelivery: { min: 7, max: 14 },
  },
  {
    id: "4",
    name: "Rest of World",
    countries: [],
    rates: [
      { minWeight: 0, maxWeight: 1, price: 19.99 },
      { minWeight: 1, maxWeight: 5, price: 39.99 },
      { minWeight: 5, maxWeight: 20, price: 79.99 },
    ],
    estimatedDelivery: { min: 10, max: 21 },
  },
];

const mockReturnPolicy: ReturnPolicy = {
  eligibilityPeriod: 30,
  conditions: [
    "Items must be unused and in original packaging",
    "Original receipt or proof of purchase required",
    "Return shipping costs are the responsibility of the customer unless the item is defective",
    "Personalized or custom-made items cannot be returned",
  ],
  excludedCategories: [
    "Gift Cards",
    "Downloadable Products",
    "Personalized Items",
  ],
  refundMethods: ["original_payment", "store_credit", "exchange"],
  restockingFee: 15,
};

// API functions
export async function fetchFeaturedProducts(): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network delay
  return mockProducts.filter((product) => product?.featured);
}

export async function fetchProductBySlug(
  slug: string,
): Promise<Product | null> {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
  return mockProducts.find((product) => product?.slug === slug) || null;
}

export async function fetchProductsByCategory(
  category: string,
): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network delay
  return mockProducts.filter((product) => product?.category === category);
}

export async function fetchProductsByCollection(
  collectionSlug: string,
): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network delay
  return mockProducts.filter((product) =>
    product?.collections.includes(collectionSlug.replace("-", "")),
  );
}

export async function searchProducts(query: string): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 600)); // Simulate network delay
  return mockProducts.filter(
    (product) =>
      product?.name.toLowerCase().includes(query.toLowerCase()) ||
      product?.description.toLowerCase().includes(query.toLowerCase()),
  );
}

export async function fetchTeamMembers(): Promise<TeamMember[]> {
  await new Promise((resolve) => setTimeout(resolve, 700)); // Simulate network delay
  return mockTeamMembers;
}

export async function fetchCollections(): Promise<Collection[]> {
  await new Promise((resolve) => setTimeout(resolve, 600)); // Simulate network delay
  return mockCollections;
}

export async function fetchCollectionBySlug(
  slug: string,
): Promise<Collection | null> {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
  return mockCollections.find((collection) => collection.slug === slug) || null;
}

export async function fetchShippingZones(): Promise<ShippingZone[]> {
  await new Promise((resolve) => setTimeout(resolve, 600)); // Simulate network delay
  return mockShippingZones;
}

export async function fetchReturnPolicy(): Promise<ReturnPolicy> {
  await new Promise((resolve) => setTimeout(resolve, 400)); // Simulate network delay
  return mockReturnPolicy;
}

interface ProductsQueryParams {
  tenantId: string;
  sort?: "newest" | "oldest" | "price-asc" | "price-desc";
  types?: string[];
  page?: number;
  limit?: number;
  search?: string;
}

interface ProductsResponse {
  products: Product[];
  totalProducts: number;
  totalPages: number;
  currentPage: number;
}

export async function fetchProducts({
  tenantId,
  sort = "newest",
  types = [],
  page = 1,
  limit = 12,
  search = "",
}: ProductsQueryParams): Promise<ProductsResponse> {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

  // Filter products by tenant
  let filteredProducts = mockProducts.filter(
    (product) => product?.tenantId === tenantId,
  );

  // Apply search filter if provided
  if (search) {
    const searchLower = search.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (product) =>
        product?.name.toLowerCase().includes(searchLower) ||
        product?.description.toLowerCase().includes(searchLower),
    );
  }

  // Apply type filters if provided
  if (types.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      types.some((type) => product?.tags.includes(type)),
    );
  }

  // Apply sorting
  switch (sort) {
    case "newest":
      // Assuming products have a createdAt field, which we'll mock with the id for now
      filteredProducts.sort(
        (a, b) => Number.parseInt(b.id) - Number.parseInt(a.id),
      );
      break;
    case "oldest":
      filteredProducts.sort(
        (a, b) => Number.parseInt(a.id) - Number.parseInt(b.id),
      );
      break;
    case "price-asc":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
  }

  // Calculate pagination
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / limit);
  const startIndex = (page - 1) * limit;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + limit,
  );

  return {
    products: paginatedProducts,
    totalProducts,
    totalPages,
    currentPage: page,
  };
}

// Add more mock products with clothing types
const clothingProducts: Product[] = [
  {
    id: "101",
    name: "Classic White T-Shirt",
    slug: "classic-white-tshirt",
    description:
      "A comfortable and versatile white t-shirt made from 100% organic cotton.",
    price: 24.99,
    originalPrice: 29.99,
    discount: 17,
    images: ["/images/placeholders/products/Classic White T-Shirt.webp"],
    category: "clothing",
    collections: ["essentials", "summer"],
    tags: ["tshirts", "white", "cotton"],
    stock: 150,
    rating: 4.7,
    reviewCount: 128,
    featured: true,
    tenantId: "tenant1",
    specifications: {
      Material: "100% Organic Cotton",
      Fit: "Regular",
      Care: "Machine wash cold",
      Origin: "Ethically made in Portugal",
    },
    shippingInfo: {
      weight: 0.2,
      dimensions: {
        length: 25,
        width: 20,
        height: 2,
      },
      freeShipping: true,
      shippingRestrictions: [],
    },
  },
  {
    id: "102",
    name: "Slim Fit Jeans",
    slug: "slim-fit-jeans",
    description:
      "Modern slim fit jeans with a touch of stretch for comfort and mobility.",
    price: 59.99,
    originalPrice: 79.99,
    discount: 25,
    images: ["/images/placeholders/placeholderTest.jpeg"],
    category: "clothing",
    collections: ["essentials", "denim"],
    tags: ["jeans", "denim", "slim-fit"],
    stock: 85,
    rating: 4.5,
    reviewCount: 96,
    featured: false,
    tenantId: "tenant1",
    specifications: {
      Material: "98% Cotton, 2% Elastane",
      Fit: "Slim",
      Rise: "Mid-rise",
      Care: "Machine wash cold, inside out",
    },
    shippingInfo: {
      weight: 0.6,
      dimensions: {
        length: 30,
        width: 25,
        height: 5,
      },
      freeShipping: true,
      shippingRestrictions: [],
    },
  },
  {
    id: "103",
    name: "Floral Summer Dress",
    slug: "floral-summer-dress",
    description: "Light and airy floral dress perfect for warm summer days.",
    price: 49.99,
    originalPrice: 49.99,
    discount: 0,
    images: ["/images/placeholders/products/Floral Summer Dress.jpg"],
    category: "clothing",
    collections: ["summer", "dresses"],
    tags: ["dresses", "floral", "summer"],
    stock: 42,
    rating: 4.8,
    reviewCount: 64,
    featured: true,
    tenantId: "tenant1",
    specifications: {
      Material: "100% Viscose",
      Length: "Midi",
      Fit: "Regular",
      Care: "Hand wash cold",
    },
    shippingInfo: {
      weight: 0.3,
      dimensions: {
        length: 35,
        width: 25,
        height: 3,
      },
      freeShipping: true,
      shippingRestrictions: [],
    },
  },
  {
    id: "104",
    name: "Waterproof Hiking Jacket",
    slug: "waterproof-hiking-jacket",
    description:
      "Durable waterproof jacket with breathable membrane, perfect for outdoor adventures.",
    price: 129.99,
    originalPrice: 159.99,
    discount: 19,
    images: ["/images/placeholders/placeholderTest.jpeg"],
    category: "clothing",
    collections: ["outdoor", "jackets"],
    tags: ["outerwear", "waterproof", "hiking"],
    stock: 28,
    rating: 4.9,
    reviewCount: 47,
    featured: false,
    tenantId: "tenant1",
    specifications: {
      Material: "100% Polyester with waterproof coating",
      Waterproof: "10,000mm",
      Breathability: "8,000g/m²/24h",
      Features: "Adjustable hood, taped seams, multiple pockets",
    },
    shippingInfo: {
      weight: 0.8,
      dimensions: {
        length: 40,
        width: 30,
        height: 10,
      },
      freeShipping: true,
      shippingRestrictions: [],
    },
  },
  {
    id: "105",
    name: "Graphic Print T-Shirt",
    slug: "graphic-print-tshirt",
    description: "Unique graphic print t-shirt made from soft cotton blend.",
    price: 34.99,
    originalPrice: 34.99,
    discount: 0,
    images: ["/images/placeholders/placeholderTest.jpeg"],
    category: "clothing",
    collections: ["casual", "graphic-tees"],
    tags: ["tshirts", "graphic", "casual"],
    stock: 65,
    rating: 4.3,
    reviewCount: 38,
    featured: false,
    tenantId: "tenant1",
    specifications: {
      Material: "90% Cotton, 10% Polyester",
      Fit: "Regular",
      Care: "Machine wash cold",
      Print: "Water-based ink",
    },
    shippingInfo: {
      weight: 0.2,
      dimensions: {
        length: 25,
        width: 20,
        height: 2,
      },
      freeShipping: true,
      shippingRestrictions: [],
    },
  },
  {
    id: "106",
    name: "Wool Blend Peacoat",
    slug: "wool-blend-peacoat",
    description:
      "Classic peacoat made from a warm wool blend, perfect for colder months.",
    price: 189.99,
    originalPrice: 229.99,
    discount: 17,
    images: ["/images/placeholders/products/Wool Blend Peacoat.jpg"],
    category: "clothing",
    collections: ["winter", "coats"],
    tags: ["outerwear", "wool", "winter"],
    stock: 20,
    rating: 4.7,
    reviewCount: 29,
    featured: true,
    tenantId: "tenant1",
    specifications: {
      Material: "70% Wool, 30% Polyester",
      Lining: "100% Polyester",
      Fit: "Regular",
      Care: "Dry clean only",
    },
    shippingInfo: {
      weight: 1.5,
      dimensions: {
        length: 45,
        width: 35,
        height: 10,
      },
      freeShipping: true,
      shippingRestrictions: [],
    },
  },
  {
    id: "107",
    name: "Linen Summer Shirt",
    slug: "linen-summer-shirt",
    description:
      "Breathable linen shirt with a relaxed fit, perfect for hot summer days.",
    price: 44.99,
    originalPrice: 54.99,
    discount: 18,
    images: ["/images/placeholders/placeholderTest.jpeg"],
    category: "clothing",
    collections: ["summer", "shirts"],
    tags: ["shirts", "linen", "summer"],
    stock: 55,
    rating: 4.6,
    reviewCount: 42,
    featured: false,
    tenantId: "tenant1",
    specifications: {
      Material: "100% Linen",
      Fit: "Relaxed",
      Care: "Machine wash cold, gentle cycle",
      Features: "Button-down collar, chest pocket",
    },
    shippingInfo: {
      weight: 0.3,
      dimensions: {
        length: 30,
        width: 25,
        height: 3,
      },
      freeShipping: true,
      shippingRestrictions: [],
    },
  },
  {
    id: "108",
    name: "Wrap Midi Dress",
    slug: "wrap-midi-dress",
    description:
      "Elegant wrap dress with a flattering silhouette, suitable for various occasions.",
    price: 79.99,
    originalPrice: 99.99,
    discount: 20,
    images: ["/images/placeholders/products/Wrap Midi Dress.jpg"],
    category: "clothing",
    collections: ["dresses", "elegant"],
    tags: ["dresses", "wrap", "elegant"],
    stock: 30,
    rating: 4.8,
    reviewCount: 36,
    featured: true,
    tenantId: "tenant1",
    specifications: {
      Material: "95% Polyester, 5% Elastane",
      Length: "Midi",
      Fit: "Regular",
      Care: "Machine wash cold, gentle cycle",
    },
    shippingInfo: {
      weight: 0.4,
      dimensions: {
        length: 35,
        width: 25,
        height: 3,
      },
      freeShipping: true,
      shippingRestrictions: [],
    },
  },
  {
    id: "109",
    name: "Distressed Denim Jacket",
    slug: "distressed-denim-jacket",
    description:
      "Vintage-inspired denim jacket with distressed details for an edgy look.",
    price: 69.99,
    originalPrice: 89.99,
    discount: 22,
    images: ["/images/placeholders/placeholderTest.jpeg"],
    category: "clothing",
    collections: ["denim", "jackets"],
    tags: ["outerwear", "denim", "casual"],
    stock: 40,
    rating: 4.5,
    reviewCount: 52,
    featured: false,
    tenantId: "tenant1",
    specifications: {
      Material: "100% Cotton Denim",
      Fit: "Regular",
      Care: "Machine wash cold",
      Features: "Button closure, multiple pockets",
    },
    shippingInfo: {
      weight: 0.7,
      dimensions: {
        length: 35,
        width: 30,
        height: 5,
      },
      freeShipping: true,
      shippingRestrictions: [],
    },
  },
  {
    id: "110",
    name: "High-Waisted Leggings",
    slug: "high-waisted-leggings",
    description:
      "Comfortable high-waisted leggings perfect for workouts or casual wear.",
    price: 39.99,
    originalPrice: 49.99,
    discount: 20,
    images: ["/images/placeholders/placeholderTest.jpeg"],
    category: "clothing",
    collections: ["activewear", "essentials"],
    tags: ["leggings", "activewear", "high-waisted"],
    stock: 75,
    rating: 4.7,
    reviewCount: 89,
    featured: true,
    tenantId: "tenant1",
    specifications: {
      Material: "75% Polyester, 25% Spandex",
      Rise: "High-waisted",
      Length: "Full length",
      Care: "Machine wash cold, tumble dry low",
    },
    shippingInfo: {
      weight: 0.2,
      dimensions: {
        length: 25,
        width: 20,
        height: 2,
      },
      freeShipping: true,
      shippingRestrictions: [],
    },
  },
  {
    id: "111",
    name: "Striped Polo Shirt",
    slug: "striped-polo-shirt",
    description:
      "Classic striped polo shirt with a comfortable fit and breathable fabric.",
    price: 34.99,
    originalPrice: 44.99,
    discount: 22,
    images: ["/images/placeholders/placeholderTest.jpeg"],
    category: "clothing",
    collections: ["casual", "essentials"],
    tags: ["tshirts", "polo", "stripes"],
    stock: 60,
    rating: 4.4,
    reviewCount: 45,
    featured: false,
    tenantId: "tenant1",
    specifications: {
      Material: "100% Cotton Piqué",
      Fit: "Regular",
      Care: "Machine wash cold",
      Features: "Ribbed collar and cuffs",
    },
    shippingInfo: {
      weight: 0.3,
      dimensions: {
        length: 30,
        width: 25,
        height: 3,
      },
      freeShipping: true,
      shippingRestrictions: [],
    },
  },
  {
    id: "112",
    name: "Pleated Midi Skirt",
    slug: "pleated-midi-skirt",
    description:
      "Elegant pleated midi skirt with a flowing silhouette, perfect for various occasions.",
    price: 59.99,
    originalPrice: 69.99,
    discount: 14,
    images: ["/images/placeholders/placeholderTest.jpeg"],
    category: "clothing",
    collections: ["elegant", "skirts"],
    tags: ["skirts", "pleated", "elegant"],
    stock: 35,
    rating: 4.6,
    reviewCount: 32,
    featured: false,
    tenantId: "tenant1",
    specifications: {
      Material: "100% Polyester",
      Length: "Midi",
      Fit: "A-line",
      Care: "Hand wash cold",
    },
    shippingInfo: {
      weight: 0.3,
      dimensions: {
        length: 30,
        width: 25,
        height: 3,
      },
      freeShipping: true,
      shippingRestrictions: [],
    },
  },
];

// Add the clothing products to the mockProducts array
mockProducts.push(...clothingProducts);
