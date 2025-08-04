"use client";
import Link from "next/link";
import {
  Film,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-background border-t">
      <div className="container px-4 py-10 md:px-6 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Film className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Viewora</span>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              {t("description")}
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://www.facebook.com/viewora/"
                className="text-muted-foreground hover:text-primary"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary"
              >
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">
              {t("quickLinks.title")}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {t("quickLinks.movies")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {t("quickLinks.cinemas")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {t("quickLinks.promotions")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {t("quickLinks.events")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {t("quickLinks.membership")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">
              {t("helpSupport.title")}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {t("helpSupport.faq")}
                </Link>
              </li>
              <li>
                <Link
                  href="https://policies.google.com/terms"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {t("helpSupport.terms")}
                </Link>
              </li>
              <li>
                <Link
                  href="https://policies.google.com/privacy"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {t("helpSupport.privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {t("helpSupport.refund")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {t("helpSupport.contact")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">
              {t("contactInfo.title")}
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  support@viewora.com
                </span>
              </div>
              <div className="flex items-start">
                <Phone className="h-5 w-5 mr-3 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  +84 123 456 789
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Viewora. {t("allRights")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
