"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ShoppingCart, Menu, LogIn } from "lucide-react";
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
    <div className="w-full flex justify-center p-4">
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-11/12 max-w-6xl bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-full shadow-lg p-4"
      >
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold text-teal-600"
          >
            GenZ Groceries 🛒
          </motion.div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex space-x-4">
              {categories.map((category, index) => (
                <motion.a
                  key={category.name}
                  href={`#${category.name.toLowerCase()}`}
                  className="text-teal-700 hover:text-teal-500 transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="mr-1">{category.emoji}</span>
                  {category.name}
                </motion.a>
              ))}
            </div>

            <motion.div
              initial={false}
              animate={{ width: isSearchOpen ? "auto" : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <Input
                type="search"
                placeholder="Search..."
                className={`bg-white bg-opacity-50 text-teal-800 placeholder-teal-400 rounded-full ${
                  isSearchOpen ? "w-40 md:w-64" : "w-0"
                }`}
              />
            </motion.div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-teal-600 hover:text-teal-400"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-teal-600 hover:text-teal-400"
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex items-center space-x-2 bg-teal-500 text-white hover:bg-teal-600"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-teal-600 hover:text-teal-400"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </motion.nav>
    </div>
  );
}
