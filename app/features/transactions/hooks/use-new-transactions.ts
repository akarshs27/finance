import { create } from "zustand"

type NewTransactionState = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useNewTransactions = create<NewTransactionState>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false})
}));