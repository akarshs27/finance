"use client";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import AccountForm from "./account-form";
import { inserAccountSchema } from "@/database/db/schema";
import { z } from "zod";
import { useCreateAccount } from "../api/use-create-account";
import { useOpenAccount } from "../hooks/use-open-account";
import { useGetAccount } from "../api/use-get-account";
import { Loader2 } from "lucide-react";

const formSchema = inserAccountSchema;

type FormValues = z.input<typeof formSchema>;

const EditAccountSheet = () => {
    const {isOpen, onClose, id} = useOpenAccount();

    console.log("EditAccountSheet", isOpen)
    const mutation = useCreateAccount();

    const accountQuery = useGetAccount(id);

    const isLoading = accountQuery.isLoading;

    const onSubmit = (values: FormValues) => {
        console.log({values});
        mutation.mutate(values, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    const defaultValues = accountQuery.data ? {
        name: accountQuery.data.name,
        id: accountQuery.data.id,
        userId: ''
    } : { name : '', id: '', userId: '' };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        New Account
                    </SheetTitle>
                    <SheetDescription>
                        Create a new account to track your transactions.
                    </SheetDescription>
                </SheetHeader>
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="size-4 text-muted-foreground animate-spin" />
                    </div>
                ) : (
                <AccountForm onSubmit={onSubmit} disabled={mutation.isPending} defaultValues={defaultValues}/>
                )}
            </SheetContent>
        </Sheet>
    )
}

export default EditAccountSheet