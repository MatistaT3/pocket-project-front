export interface Subscription {
  id: string;
  name: string;
  category: "subscriptions";
  subcategory: "digital_subscriptions" | "gym" | "memberships";
  type: "expense";
  service_type?: "streaming" | "music" | "cloud";
  iconName: string;
}

// Nota: Estas suscripciones predefinidas usan las subcategorías:
// - digital_subscriptions: Para servicios digitales (streaming, música, cloud)
// - gym: Para gimnasios
// - memberships: Disponible para suscripciones manuales

export const SUBSCRIPTIONS: Subscription[] = [
  // Streaming Video
  {
    id: "netflix",
    name: "Netflix",
    category: "subscriptions",
    subcategory: "digital_subscriptions",
    type: "expense",
    service_type: "streaming",
    iconName: "netflix",
  },
  {
    id: "disney_plus",
    name: "Disney+",
    category: "subscriptions",
    subcategory: "digital_subscriptions",
    type: "expense",
    service_type: "streaming",
    iconName: "disney",
  },
  {
    id: "prime_video",
    name: "Amazon Prime Video",
    category: "subscriptions",
    subcategory: "digital_subscriptions",
    type: "expense",
    service_type: "streaming",
    iconName: "prime",
  },
  {
    id: "max",
    name: "Max",
    category: "subscriptions",
    subcategory: "digital_subscriptions",
    type: "expense",
    service_type: "streaming",
    iconName: "max",
  },
  {
    id: "apple_tv",
    name: "Apple TV+",
    category: "subscriptions",
    subcategory: "digital_subscriptions",
    type: "expense",
    service_type: "streaming",
    iconName: "apple_tv",
  },
  {
    id: "paramount",
    name: "Paramount+",
    category: "subscriptions",
    subcategory: "digital_subscriptions",
    type: "expense",
    service_type: "streaming",
    iconName: "paramount",
  },
  {
    id: "crunchyroll",
    name: "Crunchyroll",
    category: "subscriptions",
    subcategory: "digital_subscriptions",
    type: "expense",
    service_type: "streaming",
    iconName: "crunchyroll",
  },
  {
    id: "funimation",
    name: "Funimation",
    category: "subscriptions",
    subcategory: "digital_subscriptions",
    type: "expense",
    service_type: "streaming",
    iconName: "funimation",
  },
  {
    id: "youtube_premium",
    name: "Youtube Premium",
    category: "subscriptions",
    subcategory: "digital_subscriptions",
    type: "expense",
    service_type: "streaming",
    iconName: "youtube_premium",
  },

  // Music Streaming
  {
    id: "spotify",
    name: "Spotify",
    category: "subscriptions",
    subcategory: "digital_subscriptions",
    type: "expense",
    service_type: "music",
    iconName: "spotify",
  },
  {
    id: "apple_music",
    name: "Apple Music",
    category: "subscriptions",
    subcategory: "digital_subscriptions",
    type: "expense",
    service_type: "music",
    iconName: "apple_music",
  },
  {
    id: "amazon_music",
    name: "Amazon Music",
    category: "subscriptions",
    subcategory: "digital_subscriptions",
    type: "expense",
    service_type: "music",
    iconName: "amazon_music",
  },
  {
    id: "youtube_music",
    name: "YouTube Music",
    category: "subscriptions",
    subcategory: "digital_subscriptions",
    type: "expense",
    service_type: "music",
    iconName: "youtube_music",
  },

  // Cloud Storage
  {
    id: "google_one",
    name: "Google One",
    category: "subscriptions",
    subcategory: "digital_subscriptions",
    type: "expense",
    service_type: "cloud",
    iconName: "google_one",
  },
  {
    id: "icloud",
    name: "iCloud",
    category: "subscriptions",
    subcategory: "digital_subscriptions",
    type: "expense",
    service_type: "cloud",
    iconName: "icloud",
  },

  // Gyms
  {
    id: "smartfit",
    name: "Smartfit",
    category: "subscriptions",
    subcategory: "gym",
    type: "expense",
    iconName: "smartfit",
  },
  {
    id: "pacific",
    name: "Gym Pacific",
    category: "subscriptions",
    subcategory: "gym",
    type: "expense",
    iconName: "pacific",
  },
  {
    id: "sportlife",
    name: "Sportlife",
    category: "subscriptions",
    subcategory: "gym",
    type: "expense",
    iconName: "sportlife",
  },
  {
    id: "energy",
    name: "Gym Energy",
    category: "subscriptions",
    subcategory: "gym",
    type: "expense",
    iconName: "energy",
  },
];

// Helper functions
export const getSubscriptionsByServiceType = (
  serviceType?: Subscription["service_type"]
) => {
  if (!serviceType) return SUBSCRIPTIONS;
  return SUBSCRIPTIONS.filter((sub) => sub.service_type === serviceType);
};

export const getSubscriptionsBySubcategory = (
  subcategory: Subscription["subcategory"]
) => {
  return SUBSCRIPTIONS.filter((sub) => sub.subcategory === subcategory);
};

export const getSubscriptionById = (id: string) => {
  return SUBSCRIPTIONS.find((sub) => sub.id === id);
};
