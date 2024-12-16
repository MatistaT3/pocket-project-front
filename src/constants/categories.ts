export interface CategoryOption {
  id: string;
  name: string;
  subcategories?: SubcategoryOption[];
}

export interface SubcategoryOption {
  id: string;
  name: string;
}

export const TRANSACTION_CATEGORIES: CategoryOption[] = [
  {
    id: "subscriptions",
    name: "Suscripciones",
    subcategories: [
      { id: "digital_subscriptions", name: "Suscripciones digitales" },
      { id: "gym", name: "Gimnasio" },
      { id: "memberships", name: "Membresías" },
    ],
  },
  {
    id: "supermarket",
    name: "Supermercado",
    subcategories: [
      { id: "cleaning", name: "Limpieza" },
      { id: "liquor", name: "Botillería" },
      { id: "produce", name: "Frutas y verduras" },
      { id: "pantry", name: "Despensa" },
    ],
  },
  {
    id: "transport",
    name: "Transporte",
    subcategories: [
      { id: "metro", name: "Metro" },
      { id: "train", name: "Tren" },
      { id: "transport_apps", name: "Apps de transporte" },
    ],
  },
  {
    id: "health",
    name: "Salud",
    subcategories: [
      { id: "appointments", name: "Consultas" },
      { id: "exams", name: "Exámenes" },
      { id: "pharmacy", name: "Farmacia" },
    ],
  },
  {
    id: "insurance",
    name: "Seguros",
    subcategories: [
      { id: "life_insurance", name: "De vida" },
      { id: "health_insurance", name: "Médico" },
      { id: "home_insurance", name: "Hogar" },
    ],
  },
  {
    id: "fashion",
    name: "Moda",
    subcategories: [
      { id: "clothing", name: "Ropa" },
      { id: "accessories", name: "Accesorios" },
      { id: "makeup", name: "Maquillaje" },
    ],
  },
  {
    id: "tech",
    name: "Tecnología y electrónica",
    subcategories: [
      { id: "computers", name: "Computadores" },
      { id: "mobiles", name: "Celulares" },
      { id: "appliances", name: "Electrodomésticos" },
    ],
  },
  {
    id: "education",
    name: "Educación y desarrollo personal",
    subcategories: [
      { id: "school", name: "Colegio" },
      { id: "university", name: "Universidad" },
      { id: "courses", name: "Cursos" },
    ],
  },
  {
    id: "home_services",
    name: "Servicios del Hogar",
    subcategories: [
      { id: "water", name: "Agua" },
      { id: "electricity", name: "Luz" },
      { id: "gas", name: "Gas" },
      { id: "hoa", name: "Gastos Comunes" },
      { id: "internet", name: "Internet" },
      { id: "tv", name: "TV" },
      { id: "phone", name: "Teléfono" },
    ],
  },
  {
    id: "taxes",
    name: "Contribuciones",
  },
  {
    id: "rent",
    name: "Arriendo",
  },
  {
    id: "car",
    name: "Auto",
    subcategories: [
      { id: "fuel", name: "Bencina" },
      { id: "tag", name: "TAG" },
      { id: "circulation_permit", name: "Permiso circulación" },
      { id: "soap", name: "SOAP" },
      { id: "technical_review", name: "Revisión técnica" },
      { id: "maintenance", name: "Mantenimientos" },
      { id: "toll", name: "Peajes" },
    ],
  },
  {
    id: "parking",
    name: "Estacionamiento",
  },
  {
    id: "other",
    name: "Otra",
  },
];
