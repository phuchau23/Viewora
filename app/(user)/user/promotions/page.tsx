import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { promotions } from "@/lib/data";

export default function PromotionsPage() {
  return (
    <div className="container px-4 py-8 md:py-12">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Promotions & Offers</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {promotions.map((promo) => (
            <Card key={promo.id} className="overflow-hidden">
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={promo.image}
                  alt={promo.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{promo.title}</h3>
                <p className="text-muted-foreground mb-4">{promo.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Valid until: {new Date(promo.validUntil).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </span>
                  <Button>Learn More</Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Additional promotions */}
          <Card className="overflow-hidden">
            <div className="relative aspect-video overflow-hidden">
              <Image
                src="https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Weekend Combo Deal"
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Weekend Combo Deal</h3>
              <p className="text-muted-foreground mb-4">Get 15% off when you book 2 or more tickets for weekend shows!</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Valid until: December 31, 2024
                </span>
                <Button>Learn More</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden">
            <div className="relative aspect-video overflow-hidden">
              <Image
                src="https://images.pexels.com/photos/2084701/pexels-photo-2084701.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Birthday Special"
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Birthday Special</h3>
              <p className="text-muted-foreground mb-4">Free ticket on your birthday! Just show your ID and celebrate with us.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Valid until: December 31, 2024
                </span>
                <Button>Learn More</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden">
            <div className="relative aspect-video overflow-hidden">
              <Image
                src="https://images.pexels.com/photos/2931353/pexels-photo-2931353.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Senior Citizen Discount"
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Senior Citizen Discount</h3>
              <p className="text-muted-foreground mb-4">Seniors (65+) get 25% off on all movie tickets. Valid ID required.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Valid until: December 31, 2024
                </span>
                <Button>Learn More</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}