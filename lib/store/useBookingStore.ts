// import { create } from "zustand";
// import { Seat } from "@/lib/api/service/fetchSeat";
// import { Snack } from "@/lib/api/service/fetchSnack";

// interface SnackWithQuantity extends Snack {
//   quantity: number;
// }

// interface BookingState {
//   selectedSeatIds: string[];
//   selectedCombos: SnackWithQuantity[];
//   promotionCode: string;
//   discountAmount: number;
//   step: "seat" | "combo";

//   setSelectedSeatIds: (ids: string[]) => void;
//   updateComboQuantity: (combo: Snack, quantity: number) => void;
//   setPromotionCode: (code: string) => void;
//   applyPromotion: () => void;
//   setStep: (step: "seat" | "combo") => void;
//   resetBooking: () => void;
// }

// export const useBookingStore = create<BookingState>((set, get) => ({
//   selectedSeatIds: [],
//   selectedCombos: [],
//   promotionCode: "",
//   discountAmount: 0,
//   step: "seat",

//   setSelectedSeatIds: (ids) => set({ selectedSeatIds: ids }),
//   updateComboQuantity: (combo, quantity) =>
//     set((state) => {
//       if (quantity <= 0) {
//         return {
//           selectedCombos: state.selectedCombos.filter((c) => c.id !== combo.id),
//         };
//       }
//       const exists = state.selectedCombos.find((c) => c.id === combo.id);
//       if (exists) {
//         return {
//           selectedCombos: state.selectedCombos.map((c) =>
//             c.id === combo.id ? { ...c, quantity } : c
//           ),
//         };
//       }
//       return {
//         selectedCombos: [...state.selectedCombos, { ...combo, quantity }],
//       };
//     }),
//   setPromotionCode: (code) => set({ promotionCode: code }),
//   applyPromotion: () => {
//     const code = get().promotionCode;
//     const discount =
//       code === "VIEWORA100" ? 10000 : code === "MOVIEVIP" ? 20000 : 0;
//     set({ discountAmount: discount });
//   },
//   setStep: (step) => set({ step }),
//   resetBooking: () =>
//     set({
//       selectedSeatIds: [],
//       selectedCombos: [],
//       promotionCode: "",
//       discountAmount: 0,
//       step: "seat",
//     }),
// }));
