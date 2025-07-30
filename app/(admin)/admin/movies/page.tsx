"use client";

import MoviesTables from "./components/MoviesTables";
import { TypeMovies } from "./components/TypeMovies";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function Movies() {
  const { t } = useTranslation();

  return (
    <main className="bg-background">
      <Tabs defaultValue="movies">
        <div className="flex justify-between px-4 py-2">
          <TabsList />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">{t("movie.addType")}</Button>
            </SheetTrigger>
            <SheetContent>
              <TypeMovies />
            </SheetContent>
          </Sheet>
        </div>
        <TabsContent value="movies">
          <MoviesTables />
        </TabsContent>
      </Tabs>
    </main>
  );
}
