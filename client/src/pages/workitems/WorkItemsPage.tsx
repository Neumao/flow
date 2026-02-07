import { useState } from "react"
import { useQuery, useMutation } from "@apollo/client/react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableHeader, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table"
import { Alert } from "@/components/ui/alert"
import { Loader2, Plus, Eye, History, Ban, CheckCircle, RefreshCw, XCircle } from "lucide-react"
import { WORKITEMS_QUERY } from "@/graphql/queries/workitems"
import { WORKITEM_DETAIL_QUERY } from "@/graphql/queries/workitemDetail"
import { CREATE_WORKITEM_MUTATION, UPDATE_WORKITEM_MUTATION, BLOCK_WORKITEM_MUTATION, UNBLOCK_WORKITEM_MUTATION, REWORK_WORKITEM_MUTATION, STATE_TRANSITION_MUTATION } from "@/graphql/mutations/workitems"

// TODO: Import user context for role/permissions

const WorkItemsPage = () => {
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const { data, loading, error, refetch } = useQuery(WORKITEMS_QUERY)

    // Mutations (examples, actual usage below)
    const [createWorkItem] = useMutation(CREATE_WORKITEM_MUTATION, { onCompleted: refetch })
    const [updateWorkItem] = useMutation(UPDATE_WORKITEM_MUTATION, { onCompleted: refetch })
    const [blockWorkItem] = useMutation(BLOCK_WORKITEM_MUTATION, { onCompleted: refetch })
    const [unblockWorkItem] = useMutation(UNBLOCK_WORKITEM_MUTATION, { onCompleted: refetch })
    const [reworkWorkItem] = useMutation(REWORK_WORKITEM_MUTATION, { onCompleted: refetch })
    const [stateTransition] = useMutation(STATE_TRANSITION_MUTATION, { onCompleted: refetch })

    // Detail query
    const { data: detailData, loading: detailLoading, error: detailError, refetch: refetchDetail } = useQuery(WORKITEM_DETAIL_QUERY, {
        variables: { id: selectedId },
        skip: !selectedId
    })

    // UI Handlers (create, update, block, etc.)
    // ...implement as needed

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
                                <Button onClick={() => {/* open create dialog */ }}>
                                    <Plus className="w-4 h-4 mr-2" /> New Work Item
                                </Button>
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
                                                <TableHead>ID</TableHead>
                                                <TableHead>Title</TableHead>
                                                <TableHead>State</TableHead>
                                                <TableHead>Blocked</TableHead>
                                                <TableHead>Created</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {data?.workItems?.map((item: any) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>{item.id}</TableCell>
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
                                <CardContent>
                                    {detailLoading ? (
                                        <div className="flex justify-center py-12"><Loader2 className="animate-spin w-8 h-8" /></div>
                                    ) : detailError ? (
                                        <Alert variant="destructive">{detailError.message}</Alert>
                                    ) : detailData?.workItem ? (
                                        <div className="space-y-4">
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                                <div>
                                                    <div className="font-bold text-lg">{detailData.workItem.title}</div>
                                                    <div className="text-muted-foreground">{detailData.workItem.description}</div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <span className="px-2 py-1 rounded bg-muted text-xs">{detailData.workItem.state}</span>
                                                    {detailData.workItem.blocked && (
                                                        <span className="px-2 py-1 rounded bg-destructive/20 text-destructive text-xs">Blocked</span>
                                                    )}
                                                </div>
                                            </div>
                                            {/* Actions: update, block, unblock, rework, state transitions */}
                                            {/* ...implement action buttons here, show/hide based on permissions/state */}
                                            {/* History Section */}
                                            <div>
                                                <h3 className="font-semibold mb-2 flex items-center gap-2"><History className="w-4 h-4" /> History</h3>
                                                <ul className="space-y-1 text-sm">
                                                    {detailData.workItem.history?.map((h: any, idx: number) => (
                                                        <li key={idx}>
                                                            <span className="font-medium">{h.type}</span> by {h.user?.userName || h.user?.email} at {new Date(h.timestamp).toLocaleString()} {h.reason && (<span className="italic">({h.reason})</span>)}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
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
