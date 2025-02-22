import React from "react";
import Image from "next/image";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white/10 backdrop-blur-md border-t border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
        {/* Logo and Description */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-white/20 flex items-center justify-center">
            <Image
              src="/logo.png" // Path to your logo in the public folder
              alt="App Logo"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <p className="text-sm text-black/100 max-w-xs">
            Bargaining at your fingertips. Shop local, pay on chain.
          </p>
        </div>

        {/* Footer Links (Vertical) */}
        <ul className="flex flex-col gap-2">
          <li>
            <a
              href="#"
              className="text-black hover:text-orange-400 transition-colors"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-black hover:text-orange-400 transition-colors"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-black hover:text-orange-400 transition-colors"
            >
              Services
            </a>
          </li>
        </ul>

        {/* Email and Phone */}
        <div className="flex flex-col gap-2">
          <a
            href="mailto:support@example.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:text-orange-400 transition-colors flex items-center gap-1"
          >
            support@example.com
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">
              ↗
            </span>
          </a>
          <a
            href="tel:+1234567890"
            className="text-black hover:text-orange-400 transition-colors"
          >
            +123 456 7890
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center py-4 text-sm text-black/70 border-t border-white/10">
        &copy; 2023 Your Company. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
