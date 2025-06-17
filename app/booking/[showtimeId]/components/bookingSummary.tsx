// components/BookingSummary.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Seat } from "@/lib/data";

interface Props {
  selectedSeats: Seat[];
  onClear: () => void;
  onBook: (seatIds: string[]) => void;
}

export default function BookingSummary({
  selectedSeats,
  onClear,
  onBook,
}: Props) {
  const total = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  return (
    <Card className="bg-white shadow-md border-0">
      <CardHeader>
        <CardTitle className="text-slate-800">Your Selection</CardTitle>
      </CardHeader>
      <CardContent>
        {selectedSeats.length === 0 ? (
          <p className="text-slate-500 text-center py-6">No seats selected</p>
        ) : (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Seats:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map((seat) => (
                  <span
                    key={seat.id}
                    className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-sm font-medium"
                  >
                    {seat.id}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t pt-3 space-y-1 text-sm">
              {selectedSeats.map((s) => (
                <div key={s.id} className="flex justify-between">
                  <span>
                    {s.type} - {s.id}
                  </span>
                  <span>${s.price}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold pt-2 border-t">
                <span>Total</span>
                <span className="text-emerald-600">${total}</span>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <Button
                className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={() => {
                  const seatIds = selectedSeats.map((s) => s.id);
                  onBook(seatIds); // Call booking handler
                }}
              >
                Book Now - ${total}
              </Button>
              <Button variant="outline" className="w-full" onClick={onClear}>
                Clear Selection
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
