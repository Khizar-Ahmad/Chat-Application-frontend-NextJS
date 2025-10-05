"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Menu, MessageCircle, Settings, LogOut, Users } from "lucide-react";
import { useAppContext } from "../context-provider/context_Provider";
import { useRouter } from "next/navigation";

export default function HomeNavbar() {

      const {setUserInfo}      =useAppContext();
      const router = useRouter();

    const logOut = () =>{
        setUserInfo({name:'',email:'',token:''})
        localStorage.setItem('token','')
        localStorage.setItem('email','')
        localStorage.setItem('name','')
        router.push('/');

    }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md px-10">
      <div className="container flex h-16 items-center justify-between">
        
        {/* Logo */}
        <Link href="/home" className="flex items-center gap-2 font-bold text-lg">
          <MessageCircle className="h-6 w-6 text-blue-600" />
          <span>ChatApp</span>
        </Link>

        {/* Links (desktop) */}
        <div className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="/chats" className="hover:text-blue-600 transition-colors">
            Chats
          </Link>
          <Link href="/contacts" className="hover:text-blue-600 transition-colors">
            Contacts
          </Link>
          <Link href="/settings" className="hover:text-blue-600 transition-colors">
            Settings
          </Link>
        </div>

        {/* Right: Avatar + Logout */}
        <div className="flex items-center gap-3">
          {/* <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/user.png" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar> */}
          <Button size="sm" variant="outline" className="hidden md:flex gap-1" onClick={logOut}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-6">
              <nav className="flex flex-col gap-4 text-lg">
                <Link href="/chats" className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" /> Chats
                </Link>
                <Link href="/contacts" className="flex items-center gap-2">
                  <Users className="h-5 w-5" /> Contacts
                </Link>
                <Link href="/settings" className="flex items-center gap-2">
                  <Settings className="h-5 w-5" /> Settings
                </Link>
                <Button  className="mt-4 flex gap-2">
                  <LogOut className="h-5 w-5" /> Logout
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}