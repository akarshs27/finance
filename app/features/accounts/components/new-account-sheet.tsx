"use client";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useNewAccount } from "../hooks/use-new-account"
import AccountForm from "./account-form";
import { inserAccountSchema } from "@/database/db/schema";
import { z } from "zod";
import { useCreateAccount } from "../api/use-create-account";

const formSchema = inserAccountSchema;

type FormValues = z.input<typeof formSchema>;

const NewAccountSheet = () => {
    const {isOpen, onClose} = useNewAccount();
    const mutation = useCreateAccount();

    const onSubmit = (values: FormValues) => {
        console.log({values});
        mutation.mutate(values, {
            onSuccess: () => {
                onClose();
            }
        });
    }

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
                <AccountForm onSubmit={onSubmit}  disabled={mutation.isPending} defaultValues={{
                    name: '',
                    id: '',
                    userId: ''
                }}/>
            </SheetContent>
        </Sheet>
    )
}

export default NewAccountSheet