"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { List } from "lucide-react";
import SnacksTable from "./components/SnackTables";

export default function SnacksPage() {
  return (
    <main className="bg-background">
      <Tabs defaultValue="snacks">
        <TabsContent value="snacks">
          <SnacksTable />
        </TabsContent>
      </Tabs>
    </main>
  );
}
