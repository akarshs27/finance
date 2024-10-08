"use client";

import { Button } from "@/components/ui/button";
import { transactions as transactionsSchema } from "@/database/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, PlusIcon } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useNewTransactions } from "@/app/features/transactions/hooks/use-new-transactions";
import { useGetTransactions } from "@/app/features/transactions/api/use-get-transactions";
import { useBulkDeleteTransactions } from "@/app/features/transactions/api/use-bulk-delete";
import { useState } from "react";
import { UploadButton } from "./upload-button";
import { ImportCard } from "./import-card";
import { useSelectAccount } from "@/app/features/transactions/hooks/use-select-account";
import { toast } from "sonner";
import { useBulkCreateTransactions } from "@/app/features/transactions/api/use-bulk-create-transactions";

enum VARIANTS {
    LIST = "LIST",
    IMPORT = "IMPORT"
};

const INITIAL_IMPORT_RESULTS = {
    data: [],
    errors: [],
    meta: {}
};


const TransactionsPage = () => {
    const [AccountDialog, confirm] = useSelectAccount();
    const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
    const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);

    const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
        setImportResults(results);
        setVariant(VARIANTS.IMPORT);
    }

    const onCancelImport = () => {
        setImportResults(INITIAL_IMPORT_RESULTS);
        setVariant(VARIANTS.LIST);
    }

    const newTransaction = useNewTransactions();
    const transactionsQuery = useGetTransactions();
    const bulkCreateTransactions = useBulkCreateTransactions();
    const deleteTransactions = useBulkDeleteTransactions();
    const transactions = transactionsQuery.data || [];

    const isDisabled = transactionsQuery.isLoading || deleteTransactions.isPending;

    const onSubmitImport = async (
        values: typeof transactionsSchema.$inferInsert[]
    ) => {
        const accountId = await confirm();

        if(!accountId) {
            return toast.error("Please select an account to continue");
        }

        const data = values.map((value) => ({
            ...value,
            accountId: accountId as string
        }))

        bulkCreateTransactions.mutate(data, {
            onSuccess: () => {
                onCancelImport();
            }
        })
    }

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

    if(variant === VARIANTS.IMPORT) {
        return (
            <>
             <AccountDialog />
             <ImportCard  
              data= {importResults.data}
              onCancel={onCancelImport}
              onSubmit={onSubmitImport}
             />
            </>
        )
    }

    return (
        <div className="max-w-screen-2xl mx-auto pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        Transaction History
                    </CardTitle>
                    <div className="flex items-center gap-x-2">
                    <Button size='sm' onClick={newTransaction.onOpen}>
                        <PlusIcon className="size-4 mr-2" />
                        Add new
                    </Button>
                    <UploadButton 
                        onUpload = {onUpload}
                    />
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={transactions} filterKey="payee" onDelete={(row) => {
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