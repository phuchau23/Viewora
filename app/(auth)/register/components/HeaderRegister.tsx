"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function HeaderRegister() {
    return (
        <header className="border-b border-gray-800 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <span className="text-2xl font-bold">
                <Image
                  src="/logo1.png"
                  alt="Viewora Logo"
                  width={60}
                  height={60}
                />
              </span>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại trang chủ
              </Button>
            </Link>
          </div>
        </div>
      </header>
    );
}