"use client";

import { useNewAccount } from "@/app/features/accounts/hooks/use-new-account";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, PlusIcon } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useNewTransactions } from "@/app/features/transactions/hooks/use-new-transactions";
import { useGetTransactions } from "@/app/features/transactions/api/use-get-transactions";
import { useBulkDeleteTransactions } from "@/app/features/transactions/api/use-bulk-delete";

const TransactionsPage = () => {
    const newTransaction = useNewTransactions();
    const transactionsQuery = useGetTransactions();
    const deleteTransactions = useBulkDeleteTransactions();
    const transactions = transactionsQuery.data || [];

    const isDisabled = transactionsQuery.isLoading || deleteTransactions.isPending;

    if(transactionsQuery.isLoading) {
        <div className="max-w-screen-2xl mx-auto pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
            <CardHeader>
                <Skeleton className="h-8 w-48"/>
            </CardHeader>
            <CardContent>
                <div className="h-[500px] w-full flex items-center justify-center">
                    <Loader2 className="size-6 text-slate-300 animate-spin"/>
                </div>
            </CardContent>
            </Card>
        </div>
    }

    return (
        <div className="max-w-screen-2xl mx-auto pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        Transaction History
                    </CardTitle>
                    <Button size='sm' onClick={newTransaction.onOpen}>
                        <PlusIcon className="size-4 mr-2" />
                        Add new
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={transactions} filterKey="name" onDelete={(row) => {
                            const ids = row.map((r) => r.original.id);
                            deleteTransactions.mutate({ids})
                    }} 
                    disabled={isDisabled}/>
                </CardContent>
            </Card>
        </div>
    )
}

export default TransactionsPage;