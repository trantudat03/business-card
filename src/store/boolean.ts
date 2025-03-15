import { create } from "zustand";

type BooleanState = { [key: string]: boolean };

export const useBooleanStore = create<BooleanState>(() => {
  return {};
});
