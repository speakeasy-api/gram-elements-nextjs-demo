export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "fresh" | "organic" | "specialty";
  stock: number;
}

export const products: Product[] = [
  {
    id: "cavendish",
    name: "Cavendish Banana",
    description: "The classic yellow banana. Sweet, creamy, and perfect for everyday snacking.",
    price: 0.29,
    image: "🍌",
    category: "fresh",
    stock: 1250,
  },
  {
    id: "red-banana",
    name: "Red Banana",
    description: "Sweeter and softer than yellow bananas with a hint of raspberry flavor.",
    price: 0.89,
    image: "🍌",
    category: "specialty",
    stock: 340,
  },
  {
    id: "plantain",
    name: "Plantain",
    description: "Starchy cooking banana, perfect for frying, baking, or grilling.",
    price: 0.59,
    image: "🍌",
    category: "fresh",
    stock: 820,
  },
  {
    id: "baby-banana",
    name: "Baby Banana (Niño)",
    description: "Mini bananas with intense sweetness. Great for kids and snacking.",
    price: 0.49,
    image: "🍌",
    category: "specialty",
    stock: 560,
  },
  {
    id: "organic-cavendish",
    name: "Organic Cavendish",
    description: "Certified organic bananas grown without synthetic pesticides.",
    price: 0.45,
    image: "🍌",
    category: "organic",
    stock: 890,
  },
  {
    id: "burro-banana",
    name: "Burro Banana",
    description: "Lemony tang with a creamy texture. Excellent for desserts.",
    price: 0.69,
    image: "🍌",
    category: "specialty",
    stock: 210,
  },
  {
    id: "manzano",
    name: "Manzano (Apple Banana)",
    description: "Firm texture with apple and strawberry undertones.",
    price: 0.79,
    image: "🍌",
    category: "specialty",
    stock: 380,
  },
  {
    id: "organic-plantain",
    name: "Organic Plantain",
    description: "Organic cooking plantains for your favorite recipes.",
    price: 0.75,
    image: "🍌",
    category: "organic",
    stock: 420,
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
