"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { List } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import PromotionsTables from "./components/PromotionsTables";

export default function Promotions() {
  return (
    <main className="bg-background">
      <Tabs defaultValue="promotions">
        <div className="flex justify-between px-4 py-2">
          <Sheet>
            <SheetContent></SheetContent>
          </Sheet>
        </div>
        <TabsContent value="promotions">
          <PromotionsTables />
        </TabsContent>
      </Tabs>
    </main>
  );
}
