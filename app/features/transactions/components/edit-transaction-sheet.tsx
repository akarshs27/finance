"use client";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {  insertTransactionSchema } from "@/database/db/schema";
import { z } from "zod";
import {  useOpenTransaction } from "../hooks/use-open-transaction";
import { Loader2 } from "lucide-react";
import { useGetTransaction } from "../api/use-get-transaction";
import { useCreateTransaction } from "../api/use-create-transaction";
import TransactionForm from "./transaction-form";
import { useGetAccounts } from "../../accounts/api/use-get-accounts";
import { useCreateAccount } from "../../accounts/api/use-create-account";

const formSchema = insertTransactionSchema.omit({
    id: true
});

type FormValues = z.input<typeof formSchema>;

const EditTransactionSheet = () => {
    const {isOpen, onClose, id} = useOpenTransaction();

    const mutation = useCreateTransaction();

    const transactionQuery = useGetTransaction(id);

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

    const isPending = accountMutation.isPending;
    const isLoading = transactionQuery.isLoading || accountQuery.isLoading;

    const onSubmit = (values: FormValues) => {
        console.log({values});
        mutation.mutate(values, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    const defaultValues = transactionQuery.data ? {
        accountId: transactionQuery.data.accountId,
        amount: transactionQuery.data.amount.toString(),
        date: transactionQuery.data.date ? new Date(transactionQuery.data.date ) : new Date(),
        payee: transactionQuery.data.payee,
        notes: transactionQuery.data.notes,
    } : { 
        accountId: '',
        amount: '',
        date: new Date(),
        payee: '',
        notes: '',
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        Edit Transaction
                    </SheetTitle>
                    <SheetDescription>
                        Edit an existing transaction.
                    </SheetDescription>
                </SheetHeader>
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="size-4 text-muted-foreground animate-spin" />
                    </div>
                ) : (
                <TransactionForm 
                    id={id} 
                    onSubmit={onSubmit} 
                    disabled={isPending} 
                    accountOptions={accountOptions}
                    onCreateAccount={onCreateAccount} 
                    defaultValues={defaultValues}
                 />
                )}
            </SheetContent>
        </Sheet>
    )
}

export default EditTransactionSheet