import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function WorkItemDetailDialog({ open, onOpenChange, workItem }: { open: boolean; onOpenChange: (open: boolean) => void; workItem: any }) {
    if (!workItem) return null;
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogHeader>
                <DialogTitle>Work Item Details</DialogTitle>
            </DialogHeader>
            <DialogContent>
                <div className="space-y-2">
                    <div className="text-sm text-foreground"><strong>Title:</strong> {workItem.title}</div>
                    <div className="text-sm text-foreground"><strong>Description:</strong> {workItem.description}</div>
                    <div className="text-sm text-foreground"><strong>State:</strong> {workItem.state}</div>
                    <div className="text-sm text-foreground"><strong>Blocked:</strong> {workItem.blocked ? "Yes" : "No"}</div>
                    <div className="text-sm text-foreground"><strong>Created:</strong> {new Date(workItem.createdAt).toLocaleString()}</div>
                    <div className="text-sm text-foreground"><strong>Updated:</strong> {new Date(workItem.updatedAt).toLocaleString()}</div>
                    <div className="text-sm text-foreground"><strong>Created By:</strong> {workItem.createdBy?.email || workItem.createdBy}</div>
                    {/* TODO: Show audit/history */}
                </div>
                <Button variant="default" size="sm" onClick={() => onOpenChange(false)}>Close</Button>
            </DialogContent>
        </Dialog>
    );
}
