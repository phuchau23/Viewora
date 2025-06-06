"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit3 } from "lucide-react";
import EditProfileModal from "./components/Editprofile";
import PersonalInfo from "./components/PersonalInfoPage";
import Points from "./components/Points";
import Preferences from "./components/Preferences";
import BookingHistory from "./components/BookingHistory";
import { sampleUser, User } from "@/lib/data";
import { useUpdateProfile, useUserProfile } from "@/hooks/useUsers";
import { ProfileUpdateDataResponse } from "@/lib/api/service/fetchUser";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ThemeToggle } from "@/components/common/ThemeToggle";

interface ProfilePageProps {
  userId?: string;
}

export default function ProfilePage({
  userId = "default-id",
}: ProfilePageProps) {
  const { data: profileData, isLoading, error } = useUserProfile();
  const user = profileData?.data;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  const renderContent = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalInfo />;
      case "Points":
        return <Points user={user!} />;
      case "preferences":
        return <Preferences user={user!} />;
      case "booking":
        return <BookingHistory user={user!} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f9fbfc] dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center bg-[#f9fbfc] dark:bg-gray-900 text-black dark:text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300 mb-4"></div>
        <h2 className="text-2xl font-bold mb-2">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fbfc] dark:bg-gray-900 text-black dark:text-white flex flex-col">
      <Header />
      <div className="container mx-auto max-w-6xl flex justify-end pt-4"></div>
      <div className="flex-1">
        <div className="container mx-auto p-6 max-w-6xl">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Sidebar */}
            <aside className="w-full md:w-1/4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="w-16 h-16">
                  <AvatarImage
                    src={user.avatar || "/profile1.png"}
                    alt="User Avatar"
                  />
                  <AvatarFallback>
                    {`${user.fullName?.[0] ?? ""}${user.email?.[0] ?? ""}`}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{`${user.fullName}`}</h2>
                </div>
              </div>
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("personal")}
                  className={`flex items-center gap-2 px-4 py-2 w-full text-sm font-medium rounded ${
                    activeTab === "personal"
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-white"
                      : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  🧑 My Profile
                </button>
                <button
                  onClick={() => setActiveTab("Points")}
                  className={`flex items-center gap-2 px-4 py-2 w-full text-sm font-medium rounded ${
                    activeTab === "Points"
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-white"
                      : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  📋 View Requests
                </button>
                <button
                  onClick={() => setActiveTab("preferences")}
                  className={`flex items-center gap-2 px-4 py-2 w-full text-sm font-medium rounded ${
                    activeTab === "preferences"
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-white"
                      : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  📍 Track Request
                </button>
                <button
                  onClick={() => setActiveTab("booking")}
                  className={`flex items-center gap-2 px-4 py-2 w-full text-sm font-medium rounded ${
                    activeTab === "booking"
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-white"
                      : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  🕓 History
                </button>
              </nav>
            </aside>

            {/* Main content */}
            <div className="w-full md:w-3/4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Account Settings</h1>
                <Button
                  variant="outline"
                  className="border-gray-300 dark:border-gray-700 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Edit3 className="w-4 h-4 mr-2" /> Edit
                </Button>
              </div>
              <h2 className="text-xl font-semibold mb-4">My Profile</h2>
              {renderContent()}
            </div>
          </div>
        </div>
        <EditProfileModal
          user={user}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      </div>
      <Footer />
    </div>
  );
}
