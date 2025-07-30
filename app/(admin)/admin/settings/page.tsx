"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sun, Moon } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Fix hydration mismatch

  return (
    <div>
      <h1 className="text-2xl font-bold my-4 text-center">
        {t("setting.themeSelectorTitle")}
      </h1>
      <div className="mx-auto w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
        {["light", "dark"].map((mode) => (
          <Card
            key={mode}
            className={`cursor-pointer transition-all ${
              theme === mode
                ? "ring-2 ring-blue-500 border-blue-500"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setTheme(mode)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      theme === mode
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {theme === mode && (
                      <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                    )}
                  </div>
                  <span className="font-medium text-gray-900 capitalize dark:text-white">
                    {mode === "light"
                      ? t("setting.lightModeLabel")
                      : t("setting.darkModeLabel")}
                  </span>
                </div>
                {mode === "light" ? (
                  <Sun className="h-5 w-5 text-gray-400" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-400" />
                )}
              </div>
              <div
                className={`rounded-lg p-4 h-32 ${
                  mode === "light" ? "bg-gray-100" : "bg-gray-800"
                }`}
              >
                <div
                  className={`rounded shadow-sm p-3 h-full ${
                    mode === "light" ? "bg-white" : "bg-gray-900"
                  }`}
                >
                  <div className="flex space-x-2 mb-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                    <div className="w-3 h-3 bg-green-400 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <div
                      className={`h-2 rounded w-3/4 ${
                        mode === "light" ? "bg-gray-200" : "bg-gray-600"
                      }`}
                    />
                    <div
                      className={`h-2 rounded w-1/2 ${
                        mode === "light" ? "bg-gray-200" : "bg-gray-600"
                      }`}
                    />
                    <div
                      className={`h-2 rounded w-2/3 ${
                        mode === "light" ? "bg-gray-200" : "bg-gray-600"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
