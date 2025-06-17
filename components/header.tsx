"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { User, Menu, MapPin, Search, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./common/ThemeToggle";
import Image from "next/image";
import { LanguageSelector } from "./language-selector";

const NAVIGATION = [
  { name: "Home", href: "/" },
  { name: "Movies", href: "/user/movies" },
  { name: "Cinemas", href: "/user/cinemas" },
  { name: "Promotions", href: "/user/promotions" },
  { name: "Snack", href: "/user/snacks" },
];

export default function Header() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Effect để xử lý sự kiện cuộn
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Effect để cập nhật token dựa trên pathname
  useEffect(() => {
    const authToken = Cookies.get("auth-token");
    setToken(authToken || null);
  }, [pathname]);

  const handleLogout = () => {
    Cookies.remove("auth-token");
    setToken(null);
    router.push("/login");
  };

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
        {t(`nav.${name.toLowerCase()}`)}
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
                <span className="sr-only">{t("header.toggleMenu")}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 sm:w-80">
              <div className="flex items-center h-16 gap-2">
                <Link href="/" className="text-xl font-bold">
                  <Image
                    src="/logo1.png"
                    alt={t("header.logoAlt")}
                    width={120}
                    height={40}
                  />
                </Link>
              </div>
              <nav className="mt-6 flex flex-col gap-4">
                {renderNavLinks()}
                {!token ? (
                  <Button
                    variant="outline"
                    onClick={() => router.push("/login")}
                  >
                    {t("header.signIn")}
                  </Button>
                ) : (
                  <Button variant="outline" onClick={handleLogout}>
                    {t("header.signOut")}
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold hidden md:inline-block">
              <Image
                src="/logo1.png"
                alt={t("header.logoAlt")}
                width={120}
                height={40}
              />
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {renderNavLinks()}
          </nav>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center border rounded-full px-3 py-1 text-sm text-muted-foreground">
            <MapPin className="mr-1 h-3 w-3" />
            <span>{t("header.location")}</span>
          </div>

          <div className="relative hidden sm:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("header.searchPlaceholder")}
              className="w-[200px] lg:w-[280px] pl-9 rounded-full bg-secondary"
            />
          </div>

          {/* Mobile search */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
            <span className="sr-only">{t("header.search")}</span>
          </Button>

          {/* Nút Profile - chỉ hiển thị nếu có token */}
          {token && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              asChild
            >
              <Link href="/user/account">
                <User className="h-5 w-5" />
                <span className="sr-only">{t("header.account")}</span>
              </Link>
            </Button>
          )}
          <LanguageSelector />
          {/* Nút Sign In / Sign Out */}
          {!token ? (
            <Button
              onClick={() => router.push("/login")}
              className="hidden md:flex"
            >
              {t("header.signIn")}
            </Button>
          ) : (
            <Button
              onClick={handleLogout}
              className="hidden md:flex"
              variant="outline"
            >
              <LogOut className="h-4 w-4 mr-1" />
              {t("header.signOut")}
            </Button>
          )}

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
