"use client";
import StaffChat from "./components/staff-chat";
import { getUserIdFromToken } from "@/utils/signalr";
import Header from "@/components/header";
export default function Home() {
  const staffId = getUserIdFromToken();

  return (
    <>
      {/* <Header /> */}
      <StaffChat staffId={staffId} staffName="Employee" />
    </>
  );
}
