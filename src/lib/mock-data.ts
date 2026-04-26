export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  category: string;
  image: string;
  images: string[];
  variants: {
    color?: string[];
    size?: string[];
  };
  features: string[];
  isNew?: boolean;
}

export const categories = [
  { id: "tech", name: "Tech & Gadgets", icon: "laptop" },
  { id: "wearables", name: "Wearables", icon: "watch" },
  { id: "audio", name: "Audio", icon: "headphones" },
  { id: "smart-home", name: "Smart Home", icon: "home" },
  { id: "accessories", name: "Accessories", icon: "plug" },
];

export const mockProducts: Product[] = [
  {
    id: "p_1",
    name: "Aura Vision Pro",
    description: "Next-generation mixed reality headset with ultra-high resolution displays and seamless eye tracking. Immerse yourself in a blend of digital and physical worlds.",
    price: 3499,
    rating: 4.8,
    reviews: 124,
    category: "tech",
    image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=800",
    ],
    variants: {
      color: ["Silver", "Space Gray"],
      size: ["256GB", "512GB", "1TB"],
    },
    features: ["Dual 4K Micro-OLED displays", "Spatial Audio", "Hand tracking"],
    isNew: true,
  },
  {
    id: "p_2",
    name: "SonicPods Max",
    description: "High-fidelity over-ear headphones with industry-leading active noise cancellation and personalized spatial audio.",
    price: 549,
    originalPrice: 599,
    discount: 8,
    rating: 4.9,
    reviews: 3042,
    category: "audio",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800",
    ],
    variants: {
      color: ["Midnight", "Starlight", "Sky Blue", "Pink", "Green"],
    },
    features: ["Active Noise Cancellation", "Transparency mode", "Up to 20 hours listening time"],
  },
  {
    id: "p_3",
    name: "Lumina Smart Watch Series X",
    description: "The ultimate health and fitness companion. Features a tough titanium case, precision dual-frequency GPS, and up to 36 hours of battery life.",
    price: 799,
    rating: 4.7,
    reviews: 890,
    category: "wearables",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=800",
    ],
    variants: {
      color: ["Natural Titanium", "Black Titanium"],
      size: ["45mm", "49mm"],
    },
    features: ["Always-On Retina display", "Blood Oxygen app", "ECG app", "Water resistant 100m"],
  },
  {
    id: "p_4",
    name: "Quantum Keyboard Pro",
    description: "A mechanical keyboard designed for coders and creators. Features low-profile tactical switches and customizable RGB lighting.",
    price: 199,
    rating: 4.6,
    reviews: 432,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800",
    ],
    variants: {
      color: ["Space Gray", "White"],
    },
    features: ["Low-profile mechanical switches", "Multi-device wireless connectivity", "Smart backlighting"],
  },
  {
    id: "p_5",
    name: "Zenith Smart Display 10",
    description: "A vibrant 10-inch HD display to control your smart home, make video calls, and watch your favorite shows.",
    price: 249,
    originalPrice: 299,
    discount: 16,
    rating: 4.5,
    reviews: 1250,
    category: "smart-home",
    image: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&q=80&w=800",
    ],
    variants: {
      color: ["Chalk", "Charcoal"],
    },
    features: ["10-inch HD screen", "13MP camera", "Built-in smart hub"],
  },
  {
    id: "p_6",
    name: "Aero Drone 4K",
    description: "Compact and powerful drone with a 4K camera, 3-axis gimbal, and intelligent flight modes.",
    price: 899,
    rating: 4.8,
    reviews: 560,
    category: "tech",
    image: "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&q=80&w=800",
    ],
    variants: {
      color: ["Gray"],
    },
    features: ["4K HDR Video", "34-min Max Flight Time", "Obstacle Sensing"],
    isNew: true,
  }
];

export const mockReviews = [
  {
    id: "r_1",
    user: "Alex P.",
    rating: 5,
    date: "Oct 12, 2024",
    content: "Absolutely mind-blowing product. The interface is intuitive and the build quality is premium.",
  },
  {
    id: "r_2",
    user: "Sarah M.",
    rating: 4,
    date: "Sep 28, 2024",
    content: "Great device overall. Setup was slightly complicated but once running, it works flawlessly.",
  },
  {
    id: "r_3",
    user: "David K.",
    rating: 5,
    date: "Nov 02, 2024",
    content: "Worth every penny. The battery life is exactly as advertised.",
  }
];
