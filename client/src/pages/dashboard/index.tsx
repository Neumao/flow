import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@apollo/client/react";
import { WORKITEMS_QUERY, WorkItemsResponse } from "../../graphql/queries/workitems";
import { WorkItemActions } from "@/components/workitem-actions";
import { WorkItemCreateDialog } from "@/components/workitem-create-dialog";
import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
const CREATE_WORKITEM_MUTATION = gql`
  mutation CreateWorkItem($input: CreateWorkItemInput!) {
    createWorkItem(input: $input) {
      status
      message
      data {
        id
        title
        description
        state
        blocked
        reworkRequired
        createdAt
        updatedAt
      }
    }
  }
`;

const columns = [
  {
    header: "Title",
    accessorKey: "title",
    cell: (info: any) => info.getValue(),
  },
  {
    header: "State",
    accessorKey: "state",
    cell: (info: any) => info.getValue(),
  },
  {
    header: "Blocked",
    accessorKey: "blocked",
    cell: (info: any) => (info.getValue() ? "Yes" : "No"),
  },
  {
    header: "Created",
    accessorKey: "createdAt",
    cell: (info: any) => new Date(info.getValue()).toLocaleString(),
  },
  {
    header: "Actions",
    id: "actions",
    cell: (info: any) => <WorkItemActions workItem={info.row.original} onAction={() => { }} />, // TODO: Wire up mutation logic
  },
];

export default function DashboardPage() {
  const { data, loading, error, refetch } = useQuery<WorkItemsResponse>(WORKITEMS_QUERY);
  const workItems = data?.workItems || [];
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createWorkItem] = useMutation(CREATE_WORKITEM_MUTATION);

  const handleCreateWorkItem = async (title: string, description: string) => {
    await createWorkItem({ variables: { input: { title, description } } });
    refetch();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Work Items</h1>
      <Card className="p-4">
        <div className="mb-4 flex justify-end">
          <Button variant="default" size="sm" onClick={() => setCreateDialogOpen(true)}>Create Work Item</Button>
        </div>
        {loading ? (
          <div className="text-center py-8">
            <Button variant="secondary" size="sm" disabled>Loading...</Button>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <Button variant="destructive" size="sm" disabled>Error loading work items</Button>
          </div>
        ) : workItems.length === 0 ? (
          <div className="text-center py-8">
            <Button variant="outline" size="sm" disabled>No work items found</Button>
          </div>
        ) : (
          <DataTable columns={columns} data={workItems} />
        )}
      </Card>
      <WorkItemCreateDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} onCreate={handleCreateWorkItem} />
      {/* TODO: Add detail view, dialogs, and actions using shadcn/ui components */}
    </div>
  );
}
