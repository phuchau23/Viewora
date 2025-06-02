"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Film,
  User,
  Menu,
  MapPin,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./common/ThemeToggle";

const NAVIGATION = [
  { name: "Home", href: "/" },
  { name: "Movies", href: "/user/movies" },
  { name: "Cinemas", href: "/user/cinemas" },
  { name: "Promotions", href: "/user/promotions" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const renderNavLinks = () =>
    NAVIGATION.map(({ name, href }) => (
      <Link
        key={name}
        href={href}
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === href ? "text-primary" : "text-muted-foreground"
        )}
      >
        {name}
      </Link>
    ));

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-background/90 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo & Mobile Menu */}
        <div className="flex items-center gap-2">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 sm:w-80">
              <div className="flex items-center h-16 gap-2">
                <Film className="h-6 w-6 text-primary" />
                <Link href="/" className="text-xl font-bold">CinemaTix</Link>
              </div>
              <nav className="mt-6 flex flex-col gap-4">
                {renderNavLinks()}
                <Button variant="outline" onClick={() => router.push("/login")}>
                  Sign In
                </Button>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Film className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold hidden md:inline-block">
              CinemaTix
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {renderNavLinks()}
          </nav>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Location */}
          <div className="hidden md:flex items-center border rounded-full px-3 py-1 text-sm text-muted-foreground">
            <MapPin className="mr-1 h-3 w-3" />
            <span>Ho Chi Minh City</span>
          </div>

          {/* Search */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search movies..."
              className="w-[200px] lg:w-[280px] pl-9 rounded-full bg-secondary"
            />
          </div>

          {/* Search icon for mobile */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          {/* Account */}
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <Link href="/account">
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Link>
          </Button>

          {/* Sign in (desktop) */}
          <Button onClick={() => router.push("/login")} className="hidden md:flex">
            Sign In
          </Button>

          {/* Theme Toggle */}
          <div className="">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
  