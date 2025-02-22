"use client";
import Carousel from "@/components/ui/carousel";
import { BentoGridSecondDemo } from "@/components/bento";
export default function Home() {
  const slideData = [
    {
      title: "Top retailers from around you",
      button: "Explore",
      src: "https://images.unsplash.com/photo-1636661803528-6cb3e736375c?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Discover veggies",
      button: "Discover",
      src: "https://images.unsplash.com/photo-1700150618387-3f46b6d2cf8e?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Discover local fashion",
      button: "Discover",
      src: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Bargaining made easy",
      button: "Check it out",
      src: "https://plus.unsplash.com/premium_photo-1683121855240-5d3f67a5fdec?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];
  return (
    <div className="relative overflow-hidden w-full h-full py-20 flex flex-col items-center justify-center gap-24">
      <Carousel slides={slideData} />
      <BentoGridSecondDemo />
    </div>
  );
}
