"use client";

import { useOpenAccount } from "@/app/features/accounts/hooks/use-open-account";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal } from "lucide-react";

type Props = {
    id: string;
}

const Actions = ({id}: Props) => {
    const {onOpen,isOpen} = useOpenAccount();

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="size-8 p-0">
                        <MoreHorizontal className="size-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                     disabled={false}
                     onClick={() => {
                        console.log("opened", id);
                        onOpen(id);
                     }}
                     >
                        <Edit className="size-4 mr-2"/>
                        Edit
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export default Actions;