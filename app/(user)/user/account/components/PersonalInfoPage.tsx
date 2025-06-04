"use client";

import React from "react";
import { useUserProfile } from "@/hooks/useUsers";

export default function PersonalInfo() {
  const { data: profileData, isLoading, error } = useUserProfile();

  if (isLoading) return <div>Loading...</div>;
  console.log(profileData);

  if (error) return <div>Cannot load user information.</div>;
  // data format: { code, statusCode, message, data: user }
  const user = profileData?.data;

  return (
    <div>
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-gray-900">
            {user?.fullName || "No name"}
          </h2>
        </div>
        <p className="text-sm text-gray-500">{user?.address || "No address"}</p>
      </div>

      {/* Personal Information */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-gray-900">
            Personal Information
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Full Name</p>
            <p className="text-gray-900">{user?.fullName || "No full name"}</p>
          </div>
          <div>
            <p className="text-gray-500">Email</p>
            <p className="text-gray-900">{user?.email || "No email"}</p>
          </div>
          <div>
            <p className="text-gray-500">Phone Number</p>
            <p className="text-gray-900">
              {user?.phoneNumber || "No phone number"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Address</p>
            <p className="text-gray-900">{user?.address || "No address"}</p>
          </div>
          <div>
            <p className="text-gray-500">Gender</p>
            <p className="text-gray-900">
              {user?.gender === 0
                ? "Male"
                : user?.gender === 1
                ? "Female"
                : "Unspecified"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Date of Birth</p>
            <p className="text-gray-900">
              {user?.dateOfBirth || "No date of birth"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
