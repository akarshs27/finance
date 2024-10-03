"use client";

import EditAccountSheet from "@/app/features/accounts/components/edit-account-sheet";
import NewAccountSheet from "@/app/features/accounts/components/new-account-sheet";
import EditTransactionSheet from "@/app/features/transactions/components/edit-transaction-sheet";
import NewTransactionSheet from "@/app/features/transactions/components/new-transaction-sheet";
import { useMountedState } from "react-use";

export const SheetProvider = () => {
    const isMounted = useMountedState();

    if(!isMounted) return null;

    return (
        <>
            <EditAccountSheet />
            <NewAccountSheet />
            <EditTransactionSheet />
            <NewTransactionSheet />
        </>
    )
}

export default SheetProvider