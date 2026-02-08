import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useQuery, useMutation } from "@apollo/client/react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableHeader, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table"
import { Alert } from "@/components/ui/alert"
import { Loader2, Plus, Eye, Ban, CheckCircle, RefreshCw, Edit, XCircle, ArrowRightLeft, Lock, Unlock, Shield } from "lucide-react"
import { WorkItemActions } from "@/components/workitem-actions"
import { WorkItemCreateDialog } from "@/components/workitem-create-dialog"
import { WorkItemEditDialog } from "@/components/workitem-edit-dialog"
import { WORKITEMS_QUERY, WorkItem } from "@/graphql/queries/workitems"
import { WORKITEM_DETAIL_QUERY, WorkItemDetail } from "@/graphql/queries/workitemDetail"
import {
    CREATE_WORKITEM_MUTATION,
    UPDATE_WORKITEM_MUTATION,
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
    // Dialog state for edit
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState<string | null>(null);
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
    const [updateWorkItem] = useMutation(UPDATE_WORKITEM_MUTATION)
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
            const result = await createWorkItem({ variables: { input: { title: createTitle, description: createDescription } } });
            if (result.data?.createWorkItem?.status === false) {
                throw new Error(result.data.createWorkItem.message);
            }
            setCreateDialogOpen(false);
            setCreateTitle("");
            setCreateDescription("");
        } catch (err: unknown) {
            const message = (err as Error).message || "Failed to create work item";
            alert(message);
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
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Left Section: Work Item Details and Actions */}
                                <div className="lg:col-span-2 space-y-4">
                                    <Card className="shadow-lg border-0 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-lg font-bold text-gray-800 dark:text-gray-200">
                                                    Work Item Details
                                                </CardTitle>
                                                <Button variant="outline" size="sm" onClick={() => setSelectedId(null)}>
                                                    Back to List
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            {detailLoading ? (
                                                <div className="flex justify-center py-8"><Loader2 className="animate-spin w-6 h-6" /></div>
                                            ) : detailError ? (
                                                <Alert variant="destructive" className="text-sm">{detailError.message}</Alert>
                                            ) : detailData?.workItem?.data ? (
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <h3 className="font-semibold text-base text-gray-900 dark:text-gray-100">{detailData.workItem.data.title}</h3>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{detailData.workItem.data.description}</p>
                                                        <div className="flex gap-2">
                                                            <Badge variant="outline" className="text-xs">{detailData.workItem.data.state}</Badge>
                                                            {detailData.workItem.data.blocked && (
                                                                <Badge variant="destructive" className="text-xs">Blocked</Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {/* Actions */}
                                                    <WorkItemActions
                                                        user={user}
                                                        workItem={detailData.workItem.data}
                                                        onEdit={() => {
                                                            setEditTitle(detailData.workItem.data.title);
                                                            setEditDescription(detailData.workItem.data.description);
                                                            setEditDialogOpen(true);
                                                        }}
                                                        onBlock={() => setBlockDialogOpen(true)}
                                                        onUnblock={() => setUnblockDialogOpen(true)}
                                                        onCancel={() => setCancelDialogOpen(true)}
                                                    />
                                                    {/* State Transition Button */}
                                                    <div className="flex justify-center">
                                                        <Button size="sm" className="gap-1 font-semibold bg-black hover:bg-gray-800 text-white" onClick={() => setTransitionDialogOpen(true)}>
                                                            <ArrowRightLeft className="w-4 h-4" /> State Transition
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 text-gray-500">No details found.</div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                                {/* Right Section: Permissions */}
                                <div className="lg:col-span-1">
                                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-emerald-600" />
                                            Permissions
                                        </h3>
                                        <div className="space-y-2">
                                            {rolePermissions.map((perm) => (
                                                <div key={perm.action} className="text-xs">
                                                    <span className="font-medium text-gray-700 dark:text-gray-300">{perm.action}:</span>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {perm.roles.map((role) => (
                                                            <Badge key={role} variant="secondary" className="text-xs px-1 py-0">
                                                                {role}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Dialogs */}
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
                                                    const result = await reworkWorkItem({ variables: { id: detailData.workItem.data.id, justification: reworkJustification } });
                                                    if (result.data?.reworkWorkItem?.status === false) {
                                                        throw new Error(result.data.reworkWorkItem.message);
                                                    }
                                                    setReworkDialogOpen(false);
                                                    setReworkJustification("");
                                                } catch (err: unknown) {
                                                    const message = (err as Error).message || "Failed to send for rework";
                                                    setReworkError(message);
                                                    alert(message);
                                                } finally {
                                                    setReworkLoading(false);
                                                }
                                            }}
                                        >{reworkLoading ? "Sending..." : "Send for Rework"}</Button>
                                    </div>
                                </div>
                            </div>
                        )}
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
                                                    const result = await stateTransition({ variables: { id: detailData.workItem.data.id, toState: transitionState, justification: transitionJustification } });
                                                    if (result.data?.transitionWorkItem?.status === false) {
                                                        throw new Error(result.data.transitionWorkItem.message);
                                                    }
                                                    setTransitionDialogOpen(false);
                                                    setTransitionState("");
                                                    setTransitionJustification("");
                                                } catch (err: unknown) {
                                                    const message = (err as Error).message || "Failed to transition state";
                                                    setTransitionError(message);
                                                    alert(message);
                                                } finally {
                                                    setTransitionLoading(false);
                                                }
                                            }}
                                        >{transitionLoading ? "Transitioning..." : "Transition"}</Button>
                                    </div>
                                </div>
                            </div>
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
                                                    const result = await cancelWorkItem({ variables: { id: detailData.workItem.data.id, justification: cancelJustification } });
                                                    if (result.data?.cancelWorkItem?.status === false) {
                                                        throw new Error(result.data.cancelWorkItem.message);
                                                    }
                                                    setCancelDialogOpen(false);
                                                    setCancelJustification("");
                                                } catch (err: unknown) {
                                                    const message = (err as Error).message || "Failed to cancel work item";
                                                    setCancelError(message);
                                                    alert(message);
                                                } finally {
                                                    setCancelLoading(false);
                                                }
                                            }}
                                        >{cancelLoading ? "Cancelling..." : "Cancel Work Item"}</Button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Block dialog */}
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
                                                    const result = await blockWorkItem({ variables: { id: detailData.workItem.data.id, reason: blockReason } });
                                                    if (result.data?.blockWorkItem?.status === false) {
                                                        throw new Error(result.data.blockWorkItem.message);
                                                    }
                                                    setBlockDialogOpen(false);
                                                    setBlockReason("");
                                                } catch (err: unknown) {
                                                    const message = (err as Error).message || "Failed to block work item";
                                                    setBlockError(message);
                                                    alert(message);
                                                } finally {
                                                    setBlockLoading(false);
                                                }
                                            }}
                                        >{blockLoading ? "Blocking..." : "Block"}</Button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Unblock dialog */}
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
                                                    const result = await unblockWorkItem({ variables: { id: detailData.workItem.data.id } });
                                                    if (result.data?.unblockWorkItem?.status === false) {
                                                        throw new Error(result.data.unblockWorkItem.message);
                                                    }
                                                    setUnblockDialogOpen(false);
                                                } catch (err: unknown) {
                                                    const message = (err as Error).message || "Failed to unblock work item";
                                                    setUnblockError(message);
                                                    alert(message);
                                                } finally {
                                                    setUnblockLoading(false);
                                                }
                                            }}
                                        >{unblockLoading ? "Unblocking..." : "Unblock"}</Button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Edit dialog */}
                        <WorkItemEditDialog
                            open={editDialogOpen}
                            onOpenChange={(open) => {
                                setEditDialogOpen(open);
                                if (!open) {
                                    setEditTitle("");
                                    setEditDescription("");
                                    setEditError(null);
                                }
                            }}
                            onUpdate={async (e) => {
                                e.preventDefault();
                                setEditLoading(true);
                                setEditError(null);
                                try {
                                    const result = await updateWorkItem({
                                        variables: {
                                            input: {
                                                id: detailData.workItem.data.id,
                                                title: editTitle.trim(),
                                                description: editDescription.trim()
                                            }
                                        }
                                    });
                                    if (result.data?.updateWorkItem?.status === false) {
                                        throw new Error(result.data.updateWorkItem.message);
                                    }
                                    // Manually refetch data after successful update
                                    await refetch();
                                    setEditDialogOpen(false);
                                    setEditTitle("");
                                    setEditDescription("");
                                } catch (err: unknown) {
                                    const message = (err as Error).message || "Failed to update work item";
                                    setEditError(message);
                                    alert(message);
                                } finally {
                                    setEditLoading(false);
                                }
                            }}
                            title={editTitle}
                            description={editDescription}
                            setTitle={setEditTitle}
                            setDescription={setEditDescription}
                            loading={editLoading}
                            error={editError}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default WorkItemsPage
