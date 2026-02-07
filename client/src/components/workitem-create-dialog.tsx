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

export function WorkItemCreateDialog({
    open,
    onOpenChange,
    onCreate,
    title,
    description,
    setTitle,
    setDescription,
    loading
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreate: (e: React.FormEvent) => void;
    title: string;
    description: string;
    setTitle: (v: string) => void;
    setDescription: (v: string) => void;
    loading?: boolean;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Create Work Item</DialogTitle>
                    <DialogDescription>
                        Enter the details for your new work item. Click create when done.
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
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" type="button">Cancel</Button>
                    </DialogClose>
                    <Button
                        variant="default"
                        disabled={!title || loading}
                        onClick={onCreate}
                    >
                        {loading ? "Creating..." : "Create"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
