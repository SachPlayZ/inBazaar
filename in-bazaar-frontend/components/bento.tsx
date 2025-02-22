import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import {
  IconShirt,
  IconShoppingCart,
  IconDeviceLaptop,
} from "@tabler/icons-react";
import { ToyBrick } from "lucide-react";

export function BentoGridSecondDemo() {
  return (
    <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem] gap-4">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={`${item.className} overflow-hidden transition-all duration-300 hover:shadow-xl bg-white/30 backdrop-blur-lg border border-white/40 rounded-2xl`}
          icon={item.icon}
        />
      ))}
    </BentoGrid>
  );
}

const items = [
  {
    title: "Fashion",
    description:
      "Discover the latest trends and timeless styles in clothing and accessories.",
    header: (
      <div className="relative w-full h-full rounded-xl overflow-hidden">
        <img
          src="./fashion.jpg"
          alt="Fashion"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
    ),
    className: "md:col-span-2",
    icon: <IconShirt className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Groceries",
    description:
      "Explore a wide range of fresh produce, pantry staples, and gourmet ingredients.",
    header: (
      <div className="relative w-full h-full rounded-xl overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Groceries"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
    ),
    className: "md:col-span-1",
    icon: <IconShoppingCart className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Electronics",
    description:
      "Stay up-to-date with cutting-edge gadgets and smart home devices.",
    header: (
      <div className="relative w-full h-full rounded-xl overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Electronics"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
    ),
    className: "md:col-span-1",
    icon: <IconDeviceLaptop className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Toys",
    description: "Find fun and educational toys for children of all ages.",
    header: (
      <div className="relative w-full h-full rounded-xl overflow-hidden">
        <img
          src="./toys.jpg"
          alt="Toys"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
    ),
    className: "md:col-span-2",
    icon: <ToyBrick className="h-4 w-4 text-neutral-500" />,
  },
];
