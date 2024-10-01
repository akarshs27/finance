"use client";

import EditAccountSheet from "@/app/features/accounts/components/edit-account-sheet";
import NewAccountSheet from "@/app/features/accounts/components/new-account-sheet";
import { useMountedState } from "react-use";

export const SheetProvider = () => {
    const isMounted = useMountedState();

    if(!isMounted) return null;

    return (
        <>
            <EditAccountSheet />
            <NewAccountSheet />
        </>
    )
}

export default SheetProvider