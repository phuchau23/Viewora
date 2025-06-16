// components/MovieDetails.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Showtime } from "@/lib/data";

interface MovieDetailsProps {
  showtime: Showtime;
}

export default function MovieDetails({ showtime }: MovieDetailsProps) {
  return (
    <Card className="bg-white shadow-md border-0">
      <CardHeader>
        <CardTitle className="text-slate-800">Movie Details</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <div className="flex justify-between">
          <span className="text-slate-600">Movie:</span>
          <span className="font-semibold">{showtime.movie}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Date:</span>
          <span className="font-semibold">{showtime.date}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Time:</span>
          <span className="font-semibold">{showtime.time}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Theater:</span>
          <span className="font-semibold">{showtime.theater}</span>
        </div>
      </CardContent>
    </Card>
  );
}
