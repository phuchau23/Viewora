"use client";

import React from "react";

const Booking = ({ params }: { params: { id: string } }) => {
  return <div>Booking {params.id}</div>;
};

export default Booking;
