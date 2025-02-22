import React from "react";
import {
  IconMail,
  IconPhone,
  IconArrowUpRight,
  IconMapPin,
} from "@tabler/icons-react";

export function Footer() {
  return (
    <footer className="mt-8 p-6 bg-white/20 backdrop-blur-lg border-t border-white/20">
      <div className="max-w-4xl mx-auto">
        {/* 3-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Column */}
          <div className="flex flex-col space-y-2">
            {/* Logo (optional) */}
            <div className="text-xl font-bold text-black-500">Logo</div>
            <p className="text-black-500 text-sm leading-relaxed">
              We are a young company always looking for new and creative ideas
              to help you with our products in your everyday work.
            </p>
            <a
              href="#"
              className="text-black-500 hover:text-white transition-colors text-sm"
            >
              Our Team
            </a>
          </div>

          {/* Contact Column */}
          <div className="flex flex-col space-y-2">
            <h2 className="text-black-500 font-semibold text-sm mb-2">
              Contact
            </h2>
            <div className="flex items-start space-x-2">
              <IconMapPin className="h-4 w-4 text-black-500" />
              <p className="text-black-500 text-sm">
                Via Rossini 10, 10136 Turin, Italy
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <IconPhone className="h-4 w-4 text-black-500" />
              <p className="text-black-500 text-sm">
                Phone: (0039) 333 12 68 347
              </p>
            </div>
            <a
              href="mailto:info@yourcompany.com"
              className="group flex items-center text-black-500 hover:text-white transition-colors text-sm"
            >
              <IconMail className="h-4 w-4 mr-1" />
              <span>info@yourcompany.com</span>
              <IconArrowUpRight className="h-4 w-4 ml-1 transform opacity-0 translate-x-[-5px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
            </a>
          </div>

          {/* Links Column */}
          <div className="flex flex-col space-y-2">
            <h2 className="text-black-500 font-semibold text-sm mb-2">Links</h2>
            <a
              href="#"
              className="text-black-500 hover:text-white transition-colors text-sm"
            >
              Home
            </a>
            <a
              href="#"
              className="text-black-500 hover:text-white transition-colors text-sm"
            >
              Features
            </a>
            <a
              href="#"
              className="text-black-500 hover:text-white transition-colors text-sm"
            >
              How it works
            </a>
            <a
              href="#"
              className="text-black-500 hover:text-white transition-colors text-sm"
            >
              Our clients
            </a>
            <a
              href="#"
              className="text-black-500 hover:text-white transition-colors text-sm"
            >
              Plans & pricing
            </a>
            <a
              href="#"
              className="text-black-500 hover:text-white transition-colors text-sm"
            >
              Affiliates
            </a>
            <a
              href="#"
              className="text-black-500 hover:text-white transition-colors text-sm"
            >
              Terms
            </a>
          </div>
        </div>

        {/* Footer Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-8">
          <div className="text-sm text-black-500">
            &copy; {new Date().getFullYear()} Your Company Name. All rights
            reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
