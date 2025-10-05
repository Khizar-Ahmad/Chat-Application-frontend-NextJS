"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "../ui/button"
// import { Menu, X } from "lucide-react"
import { motion } from "framer-motion"

// import Link from "next/link";
// import { Button } from "@/components/ui/button";
import { Menu, MessageCircle } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAppContext } from "../context-provider/context_Provider"

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const  {sigupModalFlag,setSigupModalFlag,loginModalFlag,setLoginModalFlag}= useAppContext();
  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    // <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
    //   <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
    //     {/* Logo */}
    //     <Link href="/" className="text-xl font-bold">
    //       MyApp
    //     </Link>

    //     {/* Desktop Links */}
    //     <div className="hidden md:flex items-center gap-6">
    //       {links.map((link) => (
    //         <Link
    //           key={link.href}
    //           href={link.href}
    //           className="text-sm font-medium hover:text-primary transition-colors"
    //         >
    //           {link.label}
    //         </Link>
    //       ))}
    //       <Button>Get Started</Button>
    //     </div>

    //     {/* Mobile Menu Button */}
    //     <button
    //       onClick={() => setOpen(!open)}
    //       className="md:hidden p-2 rounded-lg hover:bg-gray-100"
    //     >
    //       {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
    //     </button>
    //   </div>

    //   {/* Mobile Dropdown */}
    //   {open && (
    //     <motion.div
    //       initial={{ height: 0, opacity: 0 }}
    //       animate={{ height: "auto", opacity: 1 }}
    //       exit={{ height: 0, opacity: 0 }}
    //       className="md:hidden px-6 pb-4 space-y-3"
    //     >
    //       {links.map((link) => (
    //         <Link
    //           key={link.href}
    //           href={link.href}
    //           className="block text-sm font-medium hover:text-primary transition-colors"
    //           onClick={() => setOpen(false)}
    //         >
    //           {link.label}
    //         </Link>
    //       ))}
    //       <Button className="w-full">Get Started</Button>
    //     </motion.div>
    //   )}
    // </nav>
    <nav className="sticky top-0 z-50 w-full px-10 border-b bg-white/80 backdrop-blur-md pointer-events-auto">
      <div className="container flex h-16 items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <MessageCircle className="h-6 w-6 text-blue-600" />
          <span>ChatApp</span>
        </Link>

        {/* Links (desktop) */}
        <div className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="#features" className="hover:text-blue-600 transition-colors">
            Features
          </Link>
          <Link href="#pricing" className="hover:text-blue-600 transition-colors">
            Pricing
          </Link>
          <Link href="#about" className="hover:text-blue-600 transition-colors">
            About
          </Link>
        </div>

        {/* Right side: Auth buttons */}
        <div className="hidden md:flex gap-3">
          <Button onClick={()=>{
                setLoginModalFlag(!loginModalFlag);
              }}>
            {/* <Link href="/login">Login</Link> */}
            Login
          </Button>
          <Button onClick={()=>{
                setSigupModalFlag(!sigupModalFlag);
              }}>
            {/* <Link href="/signup">Sign Up</Link> */}
            Sign Up
          </Button>
        </div>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-6">
            <nav className="flex flex-col gap-4 text-lg">
              <Link href="#features">Features</Link>
              <Link href="#pricing">Pricing</Link>
              <Link href="#about">About</Link>
              <Link href="/login">Login</Link>
              <Button className="mt-2" onClick={()=>{
                setSigupModalFlag(!sigupModalFlag);
              }}>
                {/* <Link href="/signup">Sign Up</Link> */}
                Sign Up
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}