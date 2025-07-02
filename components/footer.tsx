import Link from "next/link";
import { Film, Facebook, Twitter, Instagram, Youtube, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="container px-4 py-10 md:px-6 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Film className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">CinemaTix</span>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Your ultimate destination for booking movie tickets online. Experience the best movies in premium theaters near you.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/user/movies" className="text-sm text-muted-foreground hover:text-primary">
                  Movies
                </Link>
              </li>
              <li>
                <Link href="/user/cinemas" className="text-sm text-muted-foreground hover:text-primary">
                  Cinemas
                </Link>
              </li>
              <li>
                <Link href="/user/promotions" className="text-sm text-muted-foreground hover:text-primary">
                  Promotions
                </Link>
              </li>
              <li>
                <Link href="/user/events" className="text-sm text-muted-foreground hover:text-primary">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/user/membership" className="text-sm text-muted-foreground hover:text-primary">
                  Membership
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Help & Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/user/faq" className="text-sm text-muted-foreground hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/policy?policy=terms-and-conditions" className="text-sm text-muted-foreground hover:text-primary">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/policy?policy=privacy-policy" className="text-sm text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policy?policy=refund-policy" className="text-sm text-muted-foreground hover:text-primary">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/user/contact" className="text-sm text-muted-foreground hover:text-primary">
                  Contact Us  
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  support@cinematix.com
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
            © {new Date().getFullYear()} CinemaTix. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;