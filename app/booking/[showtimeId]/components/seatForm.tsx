import { Seat } from "@/lib/data";

export const generateSeatData_A = (): Seat[] => {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const defaultSeatPerRow = 12;
  const coupleSeatPerRow = 6;

  const seats: Seat[] = [];

  rows.forEach((row) => {
    const isCoupleRow = row === "H";
    const isVipRow = ["D", "E", "F", "G"].includes(row);
    const seatCount = isCoupleRow ? coupleSeatPerRow : defaultSeatPerRow;

    for (let i = 1; i <= seatCount; i++) {
      seats.push({
        id: `${row}${i}`,
        row,
        number: i,
        type: isCoupleRow ? "couple" : isVipRow ? "vip" : "regular",
        status: "available",
        price: isCoupleRow ? 50 : isVipRow ? 20 : 10,
      });
    }
  });

  return seats;
};

export const generateSeatData_B = (): Seat[] => {
  const rows = ["A", "B", "C", "D", "E", "F", "G"];
  const defaultSeatPerRow = 11; // Tăng từ 10 lên 11 để chừa lối đi
  const coupleSeatPerRow = 5;
  const aisleIndex = 9; // Vị trí ghế muốn bỏ (giữa ghế 8 và 9)

  const seats: Seat[] = [];

  rows.forEach((row) => {
    const isCoupleRow = row === "G";
    const isVipRow = ["E", "F"].includes(row);
    const seatCount = isCoupleRow ? coupleSeatPerRow : defaultSeatPerRow;

    let seatNumber = 1;

    for (let i = 1; i <= seatCount; i++) {
      if (!isCoupleRow && i === aisleIndex) {
        continue; // Bỏ qua để tạo lối đi
      }

      seats.push({
        id: `${row}${seatNumber}`,
        row,
        number: seatNumber,
        type: isCoupleRow ? "couple" : isVipRow ? "vip" : "regular",
        status: "available",
        price: isCoupleRow ? 50 : isVipRow ? 20 : 10,
      });

      seatNumber++;
    }
  });

  return seats;
};

export const generateSeatData_C = (): Seat[] => {
  const rows = ["A", "B", "C", "D", "E"];
  const seats: Seat[] = [];

  rows.forEach((row, rowIndex) => {
    const seatCount = row === "E" ? 4 : 6; // Hàng E là couple
    const isCoupleRow = row === "E";
    const isVipRow = ["C", "D"].includes(row);

    for (let i = 1; i <= seatCount; i++) {
      seats.push({
        id: `${row}${i}`,
        row,
        number: i,
        type: isCoupleRow ? "couple" : isVipRow ? "vip" : "regular",
        status: "available",
        price: isCoupleRow ? 50 : isVipRow ? 20 : 10,
      });
    }
  });

  return seats;
};

export const generateSeatData_D = (): Seat[] => {
  const seats: Seat[] = [];

  const seatLayout: {
    row: string;
    count: number;
    type: "regular" | "vip" | "couple";
  }[] = [
    { row: "A", count: 5, type: "regular" },
    { row: "B", count: 5, type: "regular" },
    { row: "C", count: 6, type: "vip" },
    { row: "D", count: 8, type: "vip" },
    { row: "E", count: 6, type: "vip" },
    { row: "F", count: 4, type: "couple" },
  ];

  seatLayout.forEach(({ row, count, type }) => {
    for (let i = 1; i <= count; i++) {
      seats.push({
        id: `${row}${i}`,
        row,
        number: i,
        type,
        status: "available",
        price: type === "couple" ? 50 : type === "vip" ? 20 : 10,
      });
    }
  });

  return seats;
};

export const generateSeatData_E = (): Seat[] => {
  const seats: Seat[] = [];

  const seatLayout: {
    row: string;
    count: number;
    type: "regular" | "vip" | "couple";
  }[] = [
    { row: "A", count: 7, type: "regular" },
    { row: "B", count: 6, type: "regular" },
    { row: "C", count: 4, type: "vip" },
    { row: "D", count: 4, type: "vip" },
    { row: "E", count: 5, type: "vip" },
    { row: "F", count: 4, type: "couple" },
  ];

  seatLayout.forEach(({ row, count, type }) => {
    for (let i = 1; i <= count; i++) {
      seats.push({
        id: `${row}${i}`,
        row,
        number: i,
        type,
        status: "available",
        price: type === "couple" ? 50 : type === "vip" ? 20 : 10,
      });
    }
  });

  return seats;
};

export const generateSeatData_F = (): Seat[] => {
  const seats: Seat[] = [];

  const seatLayout: {
    row: string;
    count: number;
    type: "regular" | "vip" | "couple";
  }[] = [
    { row: "A", count: 6, type: "regular" },
    { row: "B", count: 7, type: "regular" },
    { row: "C", count: 8, type: "vip" },
    { row: "D", count: 9, type: "vip" },
    { row: "E", count: 8, type: "vip" },
    { row: "F", count: 4, type: "couple" },
  ];

  seatLayout.forEach(({ row, count, type }) => {
    for (let i = 1; i <= count; i++) {
      seats.push({
        id: `${row}${i}`,
        row,
        number: i,
        type,
        status: "available",
        price: type === "couple" ? 50 : type === "vip" ? 20 : 10,
      });
    }
  });

  return seats;
};
