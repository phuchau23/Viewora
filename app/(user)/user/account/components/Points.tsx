"use client";

import { ProfileDataResponse } from "@/lib/api/service/fetchUser";
import { User } from "@/utils/data";

interface PointsProps {
  user: ProfileDataResponse;
}

export default function Points({ user }: PointsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-gray-100 p-4 rounded-lg text-center">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <span className="text-blue-600">🎬</span>
        </div>
        <h3 className="text-lg font-semibold text-blue-600">42</h3>
        <p className="text-sm text-gray-500">View Requests</p>
      </div>
      <div className="bg-gray-100 p-4 rounded-lg text-center">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <span className="text-blue-600">📍</span>
        </div>
        <h3 className="text-lg font-semibold text-blue-600">3</h3>
        <p className="text-sm text-gray-500">Track Request</p>
      </div>
      <div className="bg-gray-100 p-4 rounded-lg text-center">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <span className="text-blue-600">⏳</span>
        </div>
        <h3 className="text-lg font-semibold text-blue-600">10</h3>
        <p className="text-sm text-gray-500">History</p>
      </div>
    </div>
  );
}
