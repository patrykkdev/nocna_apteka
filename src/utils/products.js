const products = [
  {
    name: "Aspirin 500mg",
    price: 12.5,
    barcode: "6935364021153",
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop",
    description:
      "Lek przeciwbólowy i przeciwgorączkowy. Zawiera kwas acetylosalicylowy.",
    category: "Leki przeciwbólowe",
    stock: 150,
    expiry: "2025-12-31",
  },
  {
    name: "Vitamin C 1000mg",
    price: 24.99,
    barcode: "5902510865320",
    image:
      "https://images.unsplash.com/photo-1550572017-edd951aa8ca6?w=200&h=200&fit=crop",
    description:
      "Suplement diety z witaminą C wspierający układ odpornościowy.",
    category: "Suplementy",
    stock: 89,
    expiry: "2025-06-30",
  },
  {
    name: "Vitamin C 1000mg",
    price: 24.99,
    barcode: "4752224002761",
    image:
      "https://images.unsplash.com/photo-1550572017-edd951aa8ca6?w=200&h=200&fit=crop",
    description:
      "Suplement diety z witaminą C wspierający układ odpornościowy.",
    category: "Suplementy",
    stock: 89,
    expiry: "2025-06-30",
  },
  {
    name: "Paracetamol 500mg",
    price: 8.75,
    barcode: "4752224002761",
    image:
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=200&h=200&fit=crop",
    description: "Lek przeciwbólowy i przeciwgorączkowy na bazie paracetamolu.",
    category: "Leki przeciwbólowe",
    stock: 200,
    expiry: "2025-11-15",
  },
  {
    name: "Ibuprofen 400mg",
    price: 15.3,
    barcode: "4567890123456",
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop",
    description: "Lek przeciwzapalny, przeciwbólowy i przeciwgorączkowy.",
    category: "Leki przeciwbólowe",
    stock: 120,
    expiry: "2025-09-20",
  },
  {
    name: "Syrop na kaszel",
    price: 18.6,
    barcode: "5678901234567",
    image:
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=200&h=200&fit=crop",
    description: "Syrop łagodzący kaszel suchy i mokry.",
    category: "Leki na przeziębienie",
    stock: 65,
    expiry: "2025-08-10",
  },
];

export const getProductByCode = (code) =>
  products.find((p) => p.barcode === code);

export const searchProducts = (query) =>
  products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

export default products;
