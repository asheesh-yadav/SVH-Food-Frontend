import Link from 'next/link'
import React from 'react'
import { Instagram, Facebook, MessageCircle } from 'lucide-react'
import InstallButton from '@/components/installButton'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#0a0f0a] border-t border-[#daa520]/20 py-12">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo and Copyright */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#2f422f] to-[#1f2a1f] rounded-full flex items-center justify-center border-2 border-[#daa520] text-[#daa520] font-bold text-lg shadow-lg">
              SVH
            </div>
            <p className="text-[#8a8470] text-sm">
              © {currentYear} SVH Foods. All rights reserved.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex gap-6">
            {['Home', 'Menu', 'Catering', 'Contact'].map((item) => (
              <Link 
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-[#b8aa8c] hover:text-[#daa520] text-sm font-medium transition-colors duration-200"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Social Icons */}
          <div className="flex gap-3">
            <Link 
              href="#"
              className="w-8 h-8 bg-[#1f261f] rounded-lg flex items-center justify-center text-[#daa520] hover:bg-[#daa520] hover:text-[#0a0f0a] transition-all duration-200"
              target="_blank"
              rel="noopener"
            >
              <Instagram className="w-4 h-4" />
            </Link>
            <Link 
              href="#"
              className="w-8 h-8 bg-[#1f261f] rounded-lg flex items-center justify-center text-[#daa520] hover:bg-[#daa520] hover:text-[#0a0f0a] transition-all duration-200"
              target="_blank"
              rel="noopener"
            >
              <Facebook className="w-4 h-4" />
            </Link>
            <Link 
              href="#"
              className="w-8 h-8 bg-[#1f261f] rounded-lg flex items-center justify-center text-[#daa520] hover:bg-[#daa520] hover:text-[#0a0f0a] transition-all duration-200"
              target="_blank"
              rel="noopener"
            >
              <MessageCircle className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Address - Optional, can be removed if too much */}
        <div className="mt-6 flex items-center justify-between text-center md:text-left border-t border-[#daa520]/10 pt-6">
          <p className="text-[#6a6558] text-xs">
            Shop No. LG-25, Cloud 9, Sec-1, Vaishali, Ghaziabad
          </p>
          <InstallButton />
        </div>
      </div>
    </footer>
  )
}

export default Footer