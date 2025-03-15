import { LoginWithZaloResponse } from "types/auth";
import { create } from "zustand";

type AuthState = LoginWithZaloResponse;

export const useAuthStore = create<AuthState>(() => {
  return {};
});
