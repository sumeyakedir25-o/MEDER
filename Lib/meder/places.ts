 import type { MederPlace } from "./matching";

export const mederPlaces: MederPlace[] = [
  {
    id: "sky-lounge",
    name: "Sky Lounge",
    type: "Rooftop Lounge",
    area: "Bole",
    description:
      "A rooftop lounge with a relaxed atmosphere, city views, and a lively evening experience.",

    latitude: 8.999,
    longitude: 38.789,
    distance: "2.4 km away",
    address: "Bole, Addis Ababa",

    rating: 4.8,
    reviews: 120,

    image:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80",
      photos: [
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80",
],

cuisine: [
  "International",
  "Cocktails",
  "Drinks",
],

amenities: [
  "Rooftop seating",
  "City view",
  "Wi-Fi",
  "Parking",
],

payment: [
  "Cash",
  "Card",
],

    who: ["Friends", "Date", "Colleagues"],
    what: ["Drinks", "Entertainment", "Experience"],
    vibe: ["Chill", "Luxury", "Lively"],
    budget: ["500–1,000 ETB", "1,000–2,000 ETB", "2,000+ ETB"],
    location: ["Bole"],
    time: ["Right Now", "Today", "Tonight", "This Weekend"],

    priceRange: "500–2,000+ ETB",

    tags: [
      "Rooftop",
      "City View",
      "Nightlife",
      "Drinks",
    ],

   openingHours: [
  { day: "Monday", open: "12:00", close: "23:00" },
  { day: "Tuesday", open: "12:00", close: "23:00" },
  { day: "Wednesday", open: "12:00", close: "23:00" },
  { day: "Thursday", open: "12:00", close: "23:00" },
  { day: "Friday", open: "12:00", close: "00:00" },
  { day: "Saturday", open: "12:00", close: "00:00" },
  { day: "Sunday", open: "12:00", close: "22:00" },
],

    phone: "+251900000000",
    whatsapp: "251900000000",
    website: "https://example.com",

    socialLinks: {
      instagram: "https://instagram.com",
      tiktok: "https://tiktok.com",
      facebook: "https://facebook.com",
    },

    menu: [
  {
    category: "Food",
    items: [
      {
        name: "Chicken Wings",
        price: 450,
      },
      {
        name: "Burger",
        price: 550,
      },
    ],
  },
  {
    category: "Drinks",
    items: [
      {
        name: "Fresh Juice",
        price: 180,
      },
      {
        name: "Mocktail",
        price: 250,
      },
    ],
  },
],

    experiences: [
      "Great for dates",
      "Good with friends",
      "City views",
      "Lively at night",
    ],

    videos: [
      {
        title: "Sky Lounge experience",
        url: "https://tiktok.com",
      },
    ],

    verified: true,
    lastVerified: "August 2026",
    lastUpdated: "August 2026",
  },

  {
    id: "tomoca-coffee",
    name: "Tomoca Coffee",
    type: "Coffee Shop",
    area: "Kazanchis",
    description:
      "A coffee spot for relaxing, meeting friends, or enjoying a quiet coffee break.",

    latitude: 9.018,
    longitude: 38.765,
    distance: "3.1 km away",
    address: "Kazanchis, Addis Ababa",

    rating: 4.6,
    reviews: 180,

    image:
      "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=900&q=80",

    photos: [
      "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=900&q=80",
    ],
cuisine: [
  "Ethiopian Coffee",
  "Coffee",
  "Pastries",
],

amenities: [
  "Indoor seating",
  "Takeaway",
  "Wi-Fi",
],

payment: [
  "Cash",
  "Card",
],

    who: ["Solo", "Friends", "Date", "Colleagues"],
    what: ["Coffee", "Dessert"],
    vibe: ["Chill", "Quiet"],
    budget: ["Under 500 ETB", "500–1,000 ETB"],
    location: ["Kazanchis"],
    time: ["Right Now", "Today", "Tonight", "This Weekend"],

    priceRange: "Under 500–1,000 ETB",

    tags: [
      "Coffee",
      "Quiet",
      "Traditional",
    ],

    openingHours: [
  { day: "Monday", open: "07:00", close: "20:00" },
  { day: "Tuesday", open: "07:00", close: "20:00" },
  { day: "Wednesday", open: "07:00", close: "20:00" },
  { day: "Thursday", open: "07:00", close: "20:00" },
  { day: "Friday", open: "07:00", close: "20:00" },
  { day: "Saturday", open: "08:00", close: "19:00" },
  { day: "Sunday", open: "08:00", close: "18:00" },
],

    phone: "+251911111111",
    whatsapp: "251911111111",
 socialLinks: {
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
    },

    menu: [
  {
    category: "Coffee",
    items: [
      {
        name: "Macchiato",
        price: 90,
        description: "A rich Ethiopian-style coffee.",
      },
      {
        name: "Espresso",
        price: 100,
      },
      {
        name: "Cappuccino",
        price: 140,
      },
    ],
  },
  {
    category: "Snacks",
    items: [
      {
        name: "Croissant",
        price: 120,
      },
      {
        name: "Cake",
        price: 150,
      },
    ],
  },
],

    experiences: [
      "Good for solo visits",
      "Quiet atmosphere",
      "Coffee lovers",
    ],

    verified: true,
    lastVerified: "August 2026",
    lastUpdated: "August 2026",
  },

  {
    id: "yod-abyssinia",
    name: "Yod Abyssinia",
    type: "Traditional Restaurant",
    area: "Bole",
    description:
      "A traditional Ethiopian restaurant known for food, cultural entertainment, and group experiences.",

    latitude: 9.010,
    longitude: 38.787,
    distance: "1.8 km away",
    address: "Bole, Addis Ababa",

    rating: 4.8,
    reviews: 320,

    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",

    photos: [
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",
    ],

cuisine: [
  "Ethiopian",
  "Traditional Food",
  "Local Drinks",
],

amenities: [
  "Live music",
  "Cultural entertainment",
  "Indoor seating",
  "Parking",
],

payment: [
  "Cash",
  "Card",
],

    who: ["Friends", "Family", "Colleagues"],
    what: ["Eat", "Experience", "Entertainment"],
    vibe: ["Fun", "Lively"],
    budget: ["500–1,000 ETB", "1,000–2,000 ETB"],
    location: ["Bole"],
    time: ["Today", "Tonight", "This Weekend"],

    priceRange: "500–2,000 ETB",

    tags: [
      "Ethiopian Food",
      "Traditional",
      "Entertainment",
    ],

    openingHours: [
  { day: "Monday", open: "11:00", close: "23:00" },
  { day: "Tuesday", open: "11:00", close: "23:00" },
  { day: "Wednesday", open: "11:00", close: "23:00" },
  { day: "Thursday", open: "11:00", close: "23:00" },
  { day: "Friday", open: "11:00", close: "00:00" },
  { day: "Saturday", open: "11:00", close: "00:00" },
  { day: "Sunday", open: "11:00", close: "23:00" },
],

    phone: "+251922222222",
    whatsapp: "251922222222",

    socialLinks: {
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
    },

   menu: [
  {
    category: "Main dishes",
    items: [
      {
        name: "Vegetarian Beyaynetu",
        price: 450,
      },
      {
        name: "Meat Beyaynetu",
        price: 650,
      },
      {
        name: "Doro Wat",
        price: 700,
      },
    ],
  },
  {
    category: "Drinks",
    items: [
      {
        name: "Traditional Coffee",
        price: 100,
      },
      {
        name: "Soft Drink",
        price: 80,
      },
    ],
  },
],

    experiences: [
      "Great for groups",
      "Traditional Ethiopian experience",
      "Live entertainment",
    ],

    verified: true,
    lastVerified: "August 2026",
    lastUpdated: "August 2026",
  },

  {
    id: "kategna",
    name: "Kategna",
    type: "Ethiopian Restaurant",
    area: "Megenagna",
    description:
      "A casual Ethiopian restaurant for enjoying traditional food with friends and family.",

    latitude: 9.030,
    longitude: 38.780,
    distance: "4.2 km away",
    address: "Megenagna, Addis Ababa",

    rating: 4.6,
    reviews: 215,

    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",

    photos: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
    ],
    
cuisine: [
  "Ethiopian",
  "Traditional Food",
  "Injera",
],

amenities: [
  "Indoor seating",
  "Family-friendly",
  "Parking",
  "Takeaway",
],

payment: [
  "Cash",
  "Card",
],

    who: ["Friends", "Family", "Colleagues"],
    what: ["Eat"],
    vibe: ["Chill", "Fun"],
    budget: ["Under 500 ETB", "500–1,000 ETB"],
    location: ["Megenagna"],
    time: ["Today", "Tonight", "This Weekend"],

    priceRange: "Under 500–1,000 ETB",

    tags: [
      "Ethiopian Food",
      "Casual",
      "Family Friendly",
    ],
 openingHours: [
  { day: "Monday", open: "08:00", close: "22:00" },
  { day: "Tuesday", open: "08:00", close: "22:00" },
  { day: "Wednesday", open: "08:00", close: "22:00" },
  { day: "Thursday", open: "08:00", close: "22:00" },
  { day: "Friday", open: "08:00", close: "23:00" },
  { day: "Saturday", open: "08:00", close: "23:00" },
  { day: "Sunday", open: "08:00", close: "22:00" },
],

    phone: "+251933333333",
    whatsapp: "251933333333",

    socialLinks: {
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
    },

    menu: [
  {
    category: "Main dishes",
    items: [
      {
        name: "Kategna Special",
        price: 350,
      },
      {
        name: "Tibs",
        price: 550,
      },
      {
        name: "Shiro",
        price: 250,
      },
    ],
  },
  {
    category: "Drinks",
    items: [
      {
        name: "Traditional Coffee",
        price: 80,
      },
      {
        name: "Soft Drink",
        price: 70,
      },
    ],
  },
],

    experiences: [
      "Good for families",
      "Casual dining",
      "Affordable Ethiopian food",
    ],

    verified: true,
    lastVerified: "August 2026",
    lastUpdated: "August 2026",
  },
];