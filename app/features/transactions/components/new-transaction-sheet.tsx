"use client";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useNewTransactions } from "../hooks/use-new-transactions"
import AccountForm from "./transaction-form";
import {  insertTransactionSchema } from "@/database/db/schema";
import { z } from "zod";
import {  useCreateTransaction } from "../api/use-create-account";
import { useCreateAccount } from "../../accounts/api/use-create-account";
import { useGetAccount } from "../../accounts/api/use-get-account";
import { useGetAccounts } from "../../accounts/api/use-get-accounts";
import TransactionForm from "./transaction-form";
import { Loader2 } from "lucide-react";

const formSchema = insertTransactionSchema.omit({
    id: true
});

type FormValues = z.input<typeof formSchema>;

const NewTransactionSheet = () => {
    const {isOpen, onClose} = useNewTransactions();

    const createMutation = useCreateTransaction();

    const accountQuery = useGetAccounts();
    const accountMutation = useCreateAccount();

    const onCreateAccount = (name: string, id: string, userId: string) => accountMutation.mutate({
        name,
        id,
        userId
    });
    const accountOptions = (accountQuery.data ?? []).map((account) => ({
        label: account.name,
        value: account.id
    }));

    const isPending = createMutation.isPending || accountMutation.isPending;
    const isLoading = accountQuery.isLoading

    const onSubmit = (values: FormValues) => {
        createMutation.mutate(values, {
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
                        New Transactions
                    </SheetTitle>
                    <SheetDescription>
                        Add a new transaction.
                    </SheetDescription>
                </SheetHeader>
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="size-4 text-muted-foreground animate-spin" />
                    </div>
                ): (
                    <>
                    <TransactionForm onSubmit={onSubmit} disabled={isPending} accountOptions={accountOptions}
                     onCreateAccount={onCreateAccount}/>
                    </>
                )}
            </SheetContent>
        </Sheet>
    )
}

export default NewTransactionSheet