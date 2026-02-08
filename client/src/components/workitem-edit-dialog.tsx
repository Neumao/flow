import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function WorkItemEditDialog({
    open,
    onOpenChange,
    onUpdate,
    title,
    description,
    setTitle,
    setDescription,
    loading,
    error
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdate: (e: React.FormEvent) => void;
    title: string;
    description: string;
    setTitle: (v: string) => void;
    setDescription: (v: string) => void;
    loading?: boolean;
    error?: string | null;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Edit Work Item</DialogTitle>
                    <DialogDescription>
                        Update the details for this work item. Click update when done.
                    </DialogDescription>
                </DialogHeader>
                <FieldGroup>
                    <Field>
                        <Label htmlFor="workitem-title">Title</Label>
                        <Input id="workitem-title" name="title" value={title} onChange={e => setTitle(e.target.value)} required />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="workitem-description">Description</FieldLabel>
                        <Textarea
                            id="workitem-description"
                            name="description"
                            placeholder="Describe the work item..."
                            rows={4}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                        <FieldDescription>
                            Add any details or context for this work item.
                        </FieldDescription>
                    </Field>
                </FieldGroup>
                {error && (
                    <div className="text-red-600 text-sm mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                        {error}
                    </div>
                )}
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" type="button">Cancel</Button>
                    </DialogClose>
                    <Button
                        variant="default"
                        disabled={!title || loading}
                        onClick={onUpdate}
                    >
                        {loading ? "Updating..." : "Update"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}