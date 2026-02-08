import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

export function WorkItemActions({ workItem, onAction }: { workItem: any; onAction: (action: string, payload?: any) => void }) {
    // Permission checks (user is passed as prop)
    const user = arguments[0].user;
    const canEdit = user?.role === "SYSADMIN" || user?.role === "ADMIN" || (user?.role === "USER" && workItem.createdBy?.id === user.id);
    const canBlock = (user?.role === "SYSADMIN" || user?.role === "ADMIN" || (user?.role === "USER" && workItem.createdBy?.id === user.id)) && !workItem.blocked && workItem.state !== "NEW" && workItem.state !== "BLOCKED";
    const canUnblock = (user?.role === "SYSADMIN" || user?.role === "ADMIN" || user?.role === "MODERATOR" || (user?.role === "USER" && workItem.createdBy?.id === user.id)) && workItem.blocked;
    const canCancel = user?.role === "SYSADMIN" || user?.role === "ADMIN" || (user?.role === "USER" && workItem.createdBy?.id === user.id);

    return (
        <div className="flex flex-wrap gap-3 my-4">
            {/* Edit button */}
            <div className="flex flex-col items-center">
                {canEdit ? (
                    <Button size="sm" variant="outline" className="gap-1 font-semibold" onClick={() => onAction("edit")}>
                        Edit
                    </Button>
                ) : (
                    <span className="text-xs text-muted-foreground">Edit <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded">Denied</span></span>
                )}
            </div>
            {/* Block button */}
            <div className="flex flex-col items-center">
                {canBlock ? (
                    <Button size="sm" variant="destructive" className="gap-1 font-semibold" onClick={() => onAction("block")}>
                        Block
                    </Button>
                ) : (
                    <span className="text-xs text-muted-foreground">Block <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded">Denied</span></span>
                )}
            </div>
            {/* Unblock button */}
            <div className="flex flex-col items-center">
                {canUnblock ? (
                    <Button size="sm" variant="secondary" className="gap-1 font-semibold" onClick={() => onAction("unblock")}>
                        Unblock
                    </Button>
                ) : (
                    <span className="text-xs text-muted-foreground">Unblock <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded">Denied</span></span>
                )}
            </div>
            {/* Cancel button */}
            <div className="flex flex-col items-center">
                {canCancel ? (
                    <Button size="sm" variant="destructive" className="gap-1 font-semibold" onClick={() => onAction("cancel")}>
                        Cancel
                    </Button>
                ) : (
                    <span className="text-xs text-muted-foreground">Cancel <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded">Denied</span></span>
                )}
            </div>
        </div>
    );
}
