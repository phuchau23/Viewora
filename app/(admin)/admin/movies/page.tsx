"use client";

import MoviesTables from "./components/MoviesTables";
import { TypeMovies } from "./components/TypeMovies";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
export default function Movies() {
  return (
    <main className="min-h-screen bg-background">
        <Tabs defaultValue="movies">
            <TabsList>
                <TabsTrigger value="movies">Movies</TabsTrigger>
                <TabsTrigger value="types">Types</TabsTrigger>
            </TabsList>
            <TabsContent value="movies">
                <MoviesTables />
            </TabsContent>
            <TabsContent value="types">
                <TypeMovies />
            </TabsContent>
        </Tabs>
    </main>
  );
}
