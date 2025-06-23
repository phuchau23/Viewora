"use client";

import MoviesTables from "./components/MoviesTables";
import { TypeMovies } from "./components/TypeMovies";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function Movies() {
  return (
    <main className=" bg-background">
      <Tabs defaultValue="movies">
        <div className="flex justify-between px-4 py-2">
          <TabsList>
            <TabsTrigger value="movies">
              <List />
            </TabsTrigger>
            {/* <TabsTrigger value="types">
              <LayoutGrid />
            </TabsTrigger> */}
          </TabsList>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Add type</Button>
            </SheetTrigger>
            <SheetContent>
              <TypeMovies />
            </SheetContent>
          </Sheet>
        </div>
        <TabsContent value="movies">
          <MoviesTables />
        </TabsContent>
        {/* <TabsContent value="types"></TabsContent> */}
      </Tabs>
    </main>
  );
}
