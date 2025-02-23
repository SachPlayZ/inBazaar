"use client";

import { useState, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { UserButton } from "./UserButton";

const categories = [
  { name: "Fashion", emoji: "🎀", hyperlink: "/category/fashion" },
  { name: "Groceries", emoji: "🛒", hyperlink: "/category/groceries" },
  { name: "Electronics", emoji: "💻", hyperlink: "/category/electronics" },
  { name: "Toys", emoji: "🧸", hyperlink: "/category/kids" },
];

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full flex justify-center p-4">
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-11/12 max-w-6xl bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-full shadow-lg p-4"
      >
        <div className="flex items-center justify-between relative">
          {/* Left Section - Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold text-teal-600 flex-shrink-0"
          >
            <Link href="/">
              <Image
                className="rounded-full"
                src="/logo.png"
                alt="inBazaar"
                width={44}
                height={44}
              />
            </Link>
          </motion.div>

          {/* Middle Section - Navigation */}
          <AnimatePresence>
            {!isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="hidden md:flex justify-center flex-grow mx-4"
              >
                <div className="flex space-x-6">
                  {categories.map((category) => (
                    <motion.a
                      key={category.name}
                      href={`${category.hyperlink.toLowerCase()}`}
                      className="text-teal-700 hover:text-teal-500 transition-colors duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="mr-1">{category.emoji}</span>
                      {category.name}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right Section - Search, Cart, Login */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="relative">
              <motion.div
                initial={false}
                animate={{
                  width: isSearchOpen ? "500px" : "0px",
                  opacity: isSearchOpen ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="absolute right-0 top-1/2 -translate-y-1/2"
              >
                <Input
                  type="search"
                  placeholder="Search..."
                  className="bg-white bg-opacity-50 text-teal-800 placeholder-teal-400 rounded-full w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
              </motion.div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-teal-600 hover:text-teal-400 relative z-10"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-teal-600 hover:text-teal-400"
              onClick={() => {
                router.push("/cart");
              }}
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <UserButton />
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
