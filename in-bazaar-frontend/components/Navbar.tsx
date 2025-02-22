"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ShoppingCart, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const categories = [
  { name: "Fruits", emoji: "🍎" },
  { name: "Veggies", emoji: "🥕" },
  { name: "Snacks", emoji: "🍿" },
  { name: "Drinks", emoji: "🥤" },
  { name: "Frozen", emoji: "🧊" },
];

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-500 p-4 shadow-lg">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-white"
          >
            GenZ Groceries 🛒
          </motion.div>

          <div className="hidden md:flex space-x-4">
            {categories.map((category, index) => (
              <motion.a
                key={category.name}
                href={`#${category.name.toLowerCase()}`}
                className="text-white hover:text-yellow-300 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <span className="mr-1">{category.emoji}</span>
                {category.name}
              </motion.a>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <motion.div
              initial={false}
              animate={{ width: isSearchOpen ? "auto" : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <Input
                type="search"
                placeholder="Search for groceries..."
                className={`bg-white text-purple-800 placeholder-purple-400 rounded-full ${
                  isSearchOpen ? "w-64" : "w-0"
                }`}
              />
            </motion.div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-white hover:text-yellow-300"
            >
              <Search className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-yellow-300"
            >
              <ShoppingCart className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:text-yellow-300"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
