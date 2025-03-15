import { ReactNode } from "react";
import { create } from "zustand";

export type ModalState = {
  modal?: {
    title?: string;
    description?: string;
    isFatal?: boolean;
    closeOnConfirm?: boolean;
    closeOnCancel?: boolean;
    dismissible?: boolean;
    content?: ReactNode;
    confirmButton?: {
      text: string;
      onClick?: () => void | Promise<void>;
    };
    cancelButton?: {
      text: string;
      onClick?: () => void | Promise<void>;
    };
  } | null;
};

export const useModalStore = create<ModalState>(() => {
  return {};
});
