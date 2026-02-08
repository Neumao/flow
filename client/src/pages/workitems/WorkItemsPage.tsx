import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useQuery, useMutation } from "@apollo/client/react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableHeader, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table"
import { Alert } from "@/components/ui/alert"
import { Loader2, Plus, Eye, Ban, CheckCircle, RefreshCw, Edit, XCircle, ArrowRightLeft, Lock, Unlock } from "lucide-react"
import { WorkItemActions } from "@/components/workitem-actions"
import { WorkItemCreateDialog } from "@/components/workitem-create-dialog"
import { WORKITEMS_QUERY, WorkItem } from "@/graphql/queries/workitems"
import { WORKITEM_DETAIL_QUERY, WorkItemDetail } from "@/graphql/queries/workitemDetail"
import {
    CREATE_WORKITEM_MUTATION,
    BLOCK_WORKITEM_MUTATION,
    UNBLOCK_WORKITEM_MUTATION,
    REWORK_WORKITEM_MUTATION,
    STATE_TRANSITION_MUTATION
} from "@/graphql/mutations/workitems"
import { CANCEL_WORKITEM_MUTATION } from "@/graphql/mutations/workitems"



const WorkItemsPage = () => {
    // Permission mapping for roles
    const rolePermissions = [
        { action: "Create Work Item", roles: ["SYSADMIN", "ADMIN", "USER (own items only)"] },
        { action: "Update Work Item", roles: ["SYSADMIN", "ADMIN", "USER (own items only)"] },
        { action: "Block Work Item", roles: ["SYSADMIN", "ADMIN", "USER (own items only)"] },
        { action: "Unblock Work Item", roles: ["SYSADMIN", "ADMIN", "MODERATOR", "USER (own items only)"] },
        { action: "Rework Work Item", roles: ["SYSADMIN", "ADMIN", "MODERATOR"] },
        { action: "Cancel Work Item", roles: ["SYSADMIN", "ADMIN", "USER (own items only)"] },
        { action: "State Transition", roles: ["SYSADMIN", "ADMIN", "MODERATOR", "USER (own items only)"] },
        { action: "View Work Item History", roles: ["SYSADMIN", "ADMIN", "MODERATOR", "USER (own items only)"] }
    ];
    // Get current user and role
    const { user } = useAuth();
    // Dialog state for cancel
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [cancelJustification, setCancelJustification] = useState("");
    const [cancelLoading, setCancelLoading] = useState(false);
    const [cancelError, setCancelError] = useState<string | null>(null);
    // Dialog state for state transition
    const [transitionDialogOpen, setTransitionDialogOpen] = useState(false);
    const [transitionState, setTransitionState] = useState("");
    const [transitionJustification, setTransitionJustification] = useState("");
    const [transitionLoading, setTransitionLoading] = useState(false);
    const [transitionError, setTransitionError] = useState<string | null>(null);

    // Allowed transitions by state
    const allowedTransitions: Record<string, string[]> = {
        NEW: ["IN_PROGRESS", "CANCELLED"],
        IN_PROGRESS: ["REVIEW", "CANCELLED"],
        REVIEW: ["DONE", "REWORK", "BLOCKED", "CANCELLED"],
        REWORK: ["IN_PROGRESS", "CANCELLED"],
        BLOCKED: ["IN_PROGRESS"],
    };
    // ...existing code...
    // Detail query and allowed transitions are handled below with other hooks
    // Dialog state for rework
    const [reworkDialogOpen, setReworkDialogOpen] = useState(false);
    const [reworkJustification, setReworkJustification] = useState("");
    const [reworkLoading, setReworkLoading] = useState(false);
    const [reworkError, setReworkError] = useState<string | null>(null);
    // Dialog state for block/unblock
    const [blockDialogOpen, setBlockDialogOpen] = useState(false);
    const [blockReason, setBlockReason] = useState("");
    const [blockLoading, setBlockLoading] = useState(false);
    const [blockError, setBlockError] = useState<string | null>(null);
    const [unblockDialogOpen, setUnblockDialogOpen] = useState(false);
    const [unblockLoading, setUnblockLoading] = useState(false);
    const [unblockError, setUnblockError] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const { data: rawListData, loading, error, refetch } = useQuery(WORKITEMS_QUERY)
    // Cast to correct ApiResponse structure
    const data = rawListData as { workItems?: { status: string; message: string; data: WorkItem[] } };

    // Mutations
    const [createWorkItem] = useMutation(CREATE_WORKITEM_MUTATION, { onCompleted: refetch })

    const [blockWorkItem] = useMutation(BLOCK_WORKITEM_MUTATION, { onCompleted: refetch })
    const [unblockWorkItem] = useMutation(UNBLOCK_WORKITEM_MUTATION, { onCompleted: refetch })
    const [reworkWorkItem] = useMutation(REWORK_WORKITEM_MUTATION, { onCompleted: refetch })
    const [stateTransition] = useMutation(STATE_TRANSITION_MUTATION, { onCompleted: refetch })
    const [cancelWorkItem] = useMutation(CANCEL_WORKITEM_MUTATION, { onCompleted: refetch })

    // Detail query
    // Add proper type for detailData
    const { data: rawDetailData, loading: detailLoading, error: detailError } = useQuery(WORKITEM_DETAIL_QUERY, {
        variables: { id: selectedId },
        skip: !selectedId
    });
    // Cast to correct ApiResponse structure
    const detailData = rawDetailData as { workItem?: { status: string; message: string; data: WorkItemDetail } };


    // Dialog state and form fields
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [createTitle, setCreateTitle] = useState("");
    const [createDescription, setCreateDescription] = useState("");
    const [createLoading, setCreateLoading] = useState(false);


    // Allowed transitions for the selected work item (for state transition dialog)
    const currentAllowed = detailData?.workItem?.data?.state ? allowedTransitions[detailData.workItem.data.state] || [] : [];

    // Handler for creating a work item
    const handleCreateWorkItem = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateLoading(true);
        try {
            await createWorkItem({ variables: { input: { title: createTitle, description: createDescription } } });
            setCreateDialogOpen(false);
            setCreateTitle("");
            setCreateDescription("");
        } finally {
            setCreateLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container max-w-7xl mx-auto px-4 py-8">
                <Tabs value={selectedId ? "detail" : "list"}>
                    <TabsList className="mb-8">
                        <TabsTrigger value="list" onClick={() => setSelectedId(null)}>
                            Work Items
                        </TabsTrigger>
                        <TabsTrigger value="detail" disabled={!selectedId}>
                            Details
                        </TabsTrigger>
                    </TabsList>

                    {/* Work Items List */}
                    <TabsContent value="list">
                        <Card className="border-border/50 shadow-sm mb-6">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <h2 className="text-2xl font-bold tracking-tight">Work Items</h2>
                                <div className="flex gap-2">
                                    <Button onClick={() => setCreateDialogOpen(true)}>
                                        <Plus className="w-4 h-4 mr-2" /> New Work Item
                                    </Button>
                                    <Button onClick={() => refetch()} variant="outline">
                                        <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                                    </Button>
                                </div>
                                <WorkItemCreateDialog
                                    open={createDialogOpen}
                                    onOpenChange={setCreateDialogOpen}
                                    onCreate={handleCreateWorkItem}
                                    title={createTitle}
                                    description={createDescription}
                                    setTitle={setCreateTitle}
                                    setDescription={setCreateDescription}
                                    loading={createLoading}
                                />
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="flex justify-center py-12"><Loader2 className="animate-spin w-8 h-8" /></div>
                                ) : error ? (
                                    <Alert variant="destructive">{error.message}</Alert>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                {/* <TableHead>ID</TableHead> */}
                                                <TableHead>Title</TableHead>
                                                <TableHead>State</TableHead>
                                                <TableHead>Blocked</TableHead>
                                                <TableHead>Created</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {data?.workItems?.data?.map((item: WorkItem) => (
                                                <TableRow key={item.id}>
                                                    {/* <TableCell>{item.id}</TableCell> */}
                                                    <TableCell>{item.title}</TableCell>
                                                    <TableCell>{item.state}</TableCell>
                                                    <TableCell>{item.blocked ? <Ban className="w-4 h-4 text-destructive" /> : <CheckCircle className="w-4 h-4 text-success" />}</TableCell>
                                                    <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                                                    <TableCell>
                                                        <Button size="sm" variant="outline" onClick={() => setSelectedId(item.id)}>
                                                            <Eye className="w-4 h-4 mr-1" /> View
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Work Item Detail */}
                    <TabsContent value="detail">
                        {selectedId && (
                            <Card className="border-border/50 shadow-sm">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <h2 className="text-xl font-semibold">Work Item Details</h2>
                                    <Button variant="outline" onClick={() => setSelectedId(null)}>
                                        Back to List
                                    </Button>
                                </CardHeader>
                                {/* Permissions Div */}
                                <div className="mb-4 p-3 rounded bg-muted/20 border border-muted">
                                    <h3 className="font-semibold text-sm mb-2">Permissions by Role</h3>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Action</TableHead>
                                                <TableHead>Allowed Roles</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {rolePermissions.map((perm) => (
                                                <TableRow key={perm.action}>
                                                    <TableCell>{perm.action}</TableCell>
                                                    <TableCell>{perm.roles.join(", ")}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                <CardContent>
                                    {detailLoading ? (
                                        <div className="flex justify-center py-12"><Loader2 className="animate-spin w-8 h-8" /></div>
                                    ) : detailError ? (
                                        <Alert variant="destructive">{detailError.message}</Alert>
                                    ) : detailData?.workItem?.data ? (
                                        <div className="space-y-4">
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                                <div>
                                                    <div className="font-bold text-lg">{detailData.workItem.data.title}</div>
                                                    <div className="text-muted-foreground">{detailData.workItem.data.description}</div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <span className="px-2 py-1 rounded bg-muted text-xs">{detailData.workItem.data.state}</span>
                                                    {detailData.workItem.data.blocked && (
                                                        <span className="px-2 py-1 rounded bg-destructive/20 text-destructive text-xs">Blocked</span>
                                                    )}
                                                </div>
                                            </div>
                                            {/* Actions: update, block, unblock, rework, state transitions */}
                                            <div className="flex flex-wrap gap-2 my-2">
                                                {/* Refactored: Use WorkItemActions component */}
                                                <WorkItemActions
                                                    user={user}
                                                    workItem={detailData.workItem.data}
                                                    onEdit={() => {/* open edit dialog or logic */ }}
                                                    onBlock={() => setBlockDialogOpen(true)}
                                                    onUnblock={() => setUnblockDialogOpen(true)}
                                                    onCancel={() => setCancelDialogOpen(true)}
                                                />
                                                {/* Rework dialog */}
                                                {reworkDialogOpen && (
                                                    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                                                        <div className="bg-white dark:bg-zinc-900 p-6 rounded shadow-lg w-full max-w-md">
                                                            <h4 className="font-semibold mb-2">Send for Rework</h4>
                                                            <input
                                                                className="w-full border p-2 rounded mb-4"
                                                                placeholder="Enter justification for rework"
                                                                value={reworkJustification}
                                                                onChange={e => setReworkJustification(e.target.value)}
                                                                disabled={reworkLoading}
                                                            />
                                                            {reworkError && <div className="text-red-600 text-sm mb-2">{reworkError}</div>}
                                                            <div className="flex gap-2 justify-end">
                                                                <Button variant="outline" onClick={() => { setReworkDialogOpen(false); setReworkJustification(""); setReworkError(null); }} disabled={reworkLoading}>Cancel</Button>
                                                                <Button
                                                                    variant="secondary"
                                                                    disabled={reworkLoading || !reworkJustification.trim()}
                                                                    onClick={async () => {
                                                                        setReworkLoading(true);
                                                                        setReworkError(null);
                                                                        try {
                                                                            await reworkWorkItem({ variables: { id: detailData.workItem.data.id, justification: reworkJustification } });
                                                                            setReworkDialogOpen(false);
                                                                            setReworkJustification("");
                                                                        } catch (err: unknown) {
                                                                            setReworkError((err as Error).message || "Failed to send for rework");
                                                                        } finally {
                                                                            setReworkLoading(false);
                                                                        }
                                                                    }}
                                                                >{reworkLoading ? "Sending..." : "Send for Rework"}</Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {/* State transition button (generic) */}
                                                <Button size="sm" variant="secondary" className="gap-1" onClick={() => setTransitionDialogOpen(true)}>
                                                    <ArrowRightLeft className="w-4 h-4" /> State Transition
                                                </Button>
                                                {/* State transition dialog */}
                                                {transitionDialogOpen && (
                                                    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                                                        <div className="bg-white dark:bg-zinc-900 p-6 rounded shadow-lg w-full max-w-md">
                                                            <h4 className="font-semibold mb-2">State Transition</h4>
                                                            <div className="mb-4">
                                                                <label className="block mb-1">Select new state:</label>
                                                                <select
                                                                    className="w-full border p-2 rounded mb-2"
                                                                    value={transitionState}
                                                                    onChange={e => setTransitionState(e.target.value)}
                                                                    disabled={transitionLoading}
                                                                >
                                                                    <option value="">-- Select --</option>
                                                                    {currentAllowed.map(state => (
                                                                        <option key={state} value={state}>{state}</option>
                                                                    ))}
                                                                </select>
                                                                {(transitionState === "REWORK" || transitionState === "BLOCKED" || transitionState === "CANCELLED") && (
                                                                    <input
                                                                        className="w-full border p-2 rounded mb-2"
                                                                        placeholder="Enter justification"
                                                                        value={transitionJustification}
                                                                        onChange={e => setTransitionJustification(e.target.value)}
                                                                        disabled={transitionLoading}
                                                                    />
                                                                )}
                                                            </div>
                                                            {transitionError && <div className="text-red-600 text-sm mb-2">{transitionError}</div>}
                                                            <div className="flex gap-2 justify-end">
                                                                <Button variant="outline" onClick={() => { setTransitionDialogOpen(false); setTransitionState(""); setTransitionJustification(""); setTransitionError(null); }} disabled={transitionLoading}>Cancel</Button>
                                                                <Button
                                                                    variant="secondary"
                                                                    disabled={transitionLoading || !transitionState || ((transitionState === "REWORK" || transitionState === "BLOCKED" || transitionState === "CANCELLED") && !transitionJustification.trim())}
                                                                    onClick={async () => {
                                                                        setTransitionLoading(true);
                                                                        setTransitionError(null);
                                                                        try {
                                                                            await stateTransition({ variables: { id: detailData.workItem.data.id, toState: transitionState, justification: transitionJustification } });
                                                                            setTransitionDialogOpen(false);
                                                                            setTransitionState("");
                                                                            setTransitionJustification("");
                                                                        } catch (err: unknown) {
                                                                            setTransitionError((err as Error).message || "Failed to transition state");
                                                                        } finally {
                                                                            setTransitionLoading(false);
                                                                        }
                                                                    }}
                                                                >{transitionLoading ? "Transitioning..." : "Transition"}</Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {/* Cancel button (allowed in any state, including NEW) */}
                                                {((user?.role === "SYSADMIN" || user?.role === "ADMIN" || (user?.role === "USER" && detailData.workItem.data.createdBy?.id === user.id))) ? (
                                                    <Button size="sm" variant="destructive" className="gap-1" onClick={() => setCancelDialogOpen(true)}>
                                                        <XCircle className="w-4 h-4" /> Cancel
                                                    </Button>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">You do not have permission to cancel this work item.</span>
                                                )}
                                                {/* Cancel dialog */}
                                                {cancelDialogOpen && (
                                                    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                                                        <div className="bg-white dark:bg-zinc-900 p-6 rounded shadow-lg w-full max-w-md">
                                                            <h4 className="font-semibold mb-2">Cancel Work Item</h4>
                                                            <input
                                                                className="w-full border p-2 rounded mb-4"
                                                                placeholder="Enter justification for cancel"
                                                                value={cancelJustification}
                                                                onChange={e => setCancelJustification(e.target.value)}
                                                                disabled={cancelLoading}
                                                            />
                                                            {cancelError && <div className="text-red-600 text-sm mb-2">{cancelError}</div>}
                                                            <div className="flex gap-2 justify-end">
                                                                <Button variant="outline" onClick={() => { setCancelDialogOpen(false); setCancelJustification(""); setCancelError(null); }} disabled={cancelLoading}>Cancel</Button>
                                                                <Button
                                                                    variant="destructive"
                                                                    disabled={cancelLoading || !cancelJustification.trim()}
                                                                    onClick={async () => {
                                                                        setCancelLoading(true);
                                                                        setCancelError(null);
                                                                        try {
                                                                            await cancelWorkItem({ variables: { id: detailData.workItem.data.id, justification: cancelJustification } });
                                                                            setCancelDialogOpen(false);
                                                                            setCancelJustification("");
                                                                        } catch (err: unknown) {
                                                                            setCancelError((err as Error).message || "Failed to cancel work item");
                                                                        } finally {
                                                                            setCancelLoading(false);
                                                                        }
                                                                    }}
                                                                >{cancelLoading ? "Cancelling..." : "Cancel Work Item"}</Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            {/* Block dialog (scaffold) */}
                                            {blockDialogOpen && (
                                                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                                                    <div className="bg-white dark:bg-zinc-900 p-6 rounded shadow-lg w-full max-w-md">
                                                        <h4 className="font-semibold mb-2">Block Work Item</h4>
                                                        <input
                                                            className="w-full border p-2 rounded mb-4"
                                                            placeholder="Enter block reason"
                                                            value={blockReason}
                                                            onChange={e => setBlockReason(e.target.value)}
                                                            disabled={blockLoading}
                                                        />
                                                        {blockError && <div className="text-red-600 text-sm mb-2">{blockError}</div>}
                                                        <div className="flex gap-2 justify-end">
                                                            <Button variant="outline" onClick={() => { setBlockDialogOpen(false); setBlockReason(""); setBlockError(null); }} disabled={blockLoading}>Cancel</Button>
                                                            <Button
                                                                variant="destructive"
                                                                disabled={blockLoading || !blockReason.trim()}
                                                                onClick={async () => {
                                                                    setBlockLoading(true);
                                                                    setBlockError(null);
                                                                    try {
                                                                        await blockWorkItem({ variables: { id: detailData.workItem.data.id, reason: blockReason } });
                                                                        setBlockDialogOpen(false);
                                                                        setBlockReason("");
                                                                    } catch (err: unknown) {
                                                                        setBlockError((err as Error).message || "Failed to block work item");
                                                                    } finally {
                                                                        setBlockLoading(false);
                                                                    }
                                                                }}
                                                            >{blockLoading ? "Blocking..." : "Block"}</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {/* Unblock dialog (scaffold) */}
                                            {unblockDialogOpen && (
                                                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                                                    <div className="bg-white dark:bg-zinc-900 p-6 rounded shadow-lg w-full max-w-md">
                                                        <h4 className="font-semibold mb-2">Unblock Work Item</h4>
                                                        <div className="mb-4">Are you sure you want to unblock this work item?</div>
                                                        {unblockError && <div className="text-red-600 text-sm mb-2">{unblockError}</div>}
                                                        <div className="flex gap-2 justify-end">
                                                            <Button variant="outline" onClick={() => { setUnblockDialogOpen(false); setUnblockError(null); }} disabled={unblockLoading}>Cancel</Button>
                                                            <Button
                                                                variant="secondary"
                                                                disabled={unblockLoading}
                                                                onClick={async () => {
                                                                    setUnblockLoading(true);
                                                                    setUnblockError(null);
                                                                    try {
                                                                        await unblockWorkItem({ variables: { id: detailData.workItem.data.id } });
                                                                        setUnblockDialogOpen(false);
                                                                    } catch (err: unknown) {
                                                                        setUnblockError((err as Error).message || "Failed to unblock work item");
                                                                    } finally {
                                                                        setUnblockLoading(false);
                                                                    }
                                                                }}
                                                            >{unblockLoading ? "Unblocking..." : "Unblock"}</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {/* History Section */}
                                            {/* History section placeholder - implement if history is available in detailData.workItem.data */}
                                        </div>
                                    ) : (
                                        <div>No details found.</div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default WorkItemsPage
