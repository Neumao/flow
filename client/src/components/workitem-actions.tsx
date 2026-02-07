import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

export function WorkItemActions({ workItem, onAction }: { workItem: any; onAction: (action: string, payload?: any) => void }) {
    const [open, setOpen] = useState(false);
    const [actionType, setActionType] = useState<string | null>(null);

    const handleAction = (type: string) => {
        setActionType(type);
        setOpen(true);
    };

    const handleDialogClose = () => {
        setOpen(false);
        setActionType(null);
    };

    // Example: Only show block/unblock for MODERATOR/ADMIN/SYSADMIN
    // Add role checks as needed

    return (
        <>
            <div className="flex gap-2">
                <Button variant="default" size="sm" onClick={() => handleAction("view")}>View</Button>
                <Button variant="default" size="sm" onClick={() => handleAction("edit")}>Edit</Button>
                <Button variant="default" size="sm" onClick={() => handleAction("transition")}>Transition</Button>
                {workItem.blocked ? (
                    <Button variant="secondary" size="sm" onClick={() => handleAction("unblock")}>Unblock</Button>
                ) : (
                    <Button variant="destructive" size="sm" onClick={() => handleAction("block")}>Block</Button>
                )}
                <Button variant="outline" size="sm" onClick={() => handleAction("rework")}>Rework</Button>
                <Button variant="destructive" size="sm" onClick={() => handleAction("cancel")}>Cancel</Button>
            </div>
            {actionType === "view" && open && (
                <WorkItemDetailDialog open={open} onOpenChange={handleDialogClose} workItem={workItem} />
            )}
            {/* TODO: Add dialogs for other actions */}
        </>
    );
}
