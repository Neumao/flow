import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export function WorkItemDetailDialog({ open, onOpenChange, workItem }: { open: boolean; onOpenChange: (open: boolean) => void; workItem: any }) {
    if (!workItem) return null;

    const formatEventType = (eventType: string) => {
        return eventType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

    const getEventColor = (eventType: string) => {
        switch (eventType) {
            case 'CREATED': return 'bg-green-100 text-green-800';
            case 'UPDATED': return 'bg-blue-100 text-blue-800';
            case 'STATE_CHANGED': return 'bg-purple-100 text-purple-800';
            case 'BLOCKED': return 'bg-red-100 text-red-800';
            case 'UNBLOCKED': return 'bg-yellow-100 text-yellow-800';
            case 'CANCELLED': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogHeader>
                <DialogTitle>Work Item Details</DialogTitle>
            </DialogHeader>
            <DialogContent className="max-w-4xl max-h-[80vh]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Work Item Details */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Basic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="grid grid-cols-1 gap-2">
                                    <div className="text-sm">
                                        <strong className="text-muted-foreground">Title:</strong>
                                        <div className="mt-1">{workItem.title}</div>
                                    </div>
                                    <div className="text-sm">
                                        <strong className="text-muted-foreground">Description:</strong>
                                        <div className="mt-1">{workItem.description}</div>
                                    </div>
                                    <div className="text-sm">
                                        <strong className="text-muted-foreground">State:</strong>
                                        <div className="mt-1">
                                            <Badge variant="outline" className="capitalize">
                                                {workItem.state?.toLowerCase().replace('_', ' ')}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="text-sm">
                                        <strong className="text-muted-foreground">Status:</strong>
                                        <div className="mt-1">
                                            <Badge variant={workItem.blocked ? "destructive" : "secondary"}>
                                                {workItem.blocked ? "Blocked" : "Active"}
                                            </Badge>
                                            {workItem.blocked && workItem.blockReason && (
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    Reason: {workItem.blockReason}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-sm">
                                        <strong className="text-muted-foreground">Created:</strong>
                                        <div className="mt-1">{new Date(workItem.createdAt).toLocaleString()}</div>
                                    </div>
                                    <div className="text-sm">
                                        <strong className="text-muted-foreground">Updated:</strong>
                                        <div className="mt-1">{new Date(workItem.updatedAt).toLocaleString()}</div>
                                    </div>
                                    <div className="text-sm">
                                        <strong className="text-muted-foreground">Created By:</strong>
                                        <div className="mt-1">{workItem.createdBy?.email || workItem.createdBy}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Audit Events History */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Activity History</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[400px] pr-4">
                                    {workItem.auditEvents && workItem.auditEvents.length > 0 ? (
                                        <div className="space-y-4">
                                            {workItem.auditEvents
                                                .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                                .map((event: any, index: number) => (
                                                    <div key={index} className="relative">
                                                        <div className="flex items-start space-x-3">
                                                            <div className="flex-shrink-0">
                                                                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                                                                    <span className="text-xs font-medium">
                                                                        {event.user?.email?.charAt(0).toUpperCase() || '?'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center space-x-2 mb-1">
                                                                    <span className="text-sm font-medium text-foreground">
                                                                        {event.user?.email || 'Unknown User'}
                                                                    </span>
                                                                    <Badge
                                                                        variant="secondary"
                                                                        className={`text-xs ${getEventColor(event.eventType)}`}
                                                                    >
                                                                        {formatEventType(event.eventType)}
                                                                    </Badge>
                                                                </div>
                                                                <div className="text-xs text-muted-foreground mb-2">
                                                                    {new Date(event.createdAt).toLocaleString()}
                                                                </div>
                                                                {event.justification && (
                                                                    <div className="text-sm text-foreground bg-muted/50 p-2 rounded-md">
                                                                        {event.justification}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {index < workItem.auditEvents.length - 1 && (
                                                            <Separator className="mt-4" />
                                                        )}
                                                    </div>
                                                ))}
                                        </div>
                                    ) : (
                                        <div className="text-center text-muted-foreground py-8">
                                            <div className="text-sm">No activity history available</div>
                                        </div>
                                    )}
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <Button variant="default" size="sm" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
