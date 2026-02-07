const workItemSchema = `#graphql
  enum WorkItemState {
    NEW
    IN_PROGRESS
    REVIEW
    BLOCKED
    REWORK
    DONE
    CANCELLED
  }

  enum AuditEventType {
    STATE_CHANGE
    BLOCKED
    UNBLOCKED
    REWORK
    CANCELLED
  }

  type WorkItem {
    id: ID!
    title: String!
    description: String!
    state: WorkItemState!
    blocked: Boolean!
    blockReason: String
    reworkRequired: Boolean!
    createdById: ID!
    createdBy: User!
    createdAt: DateTime!
    updatedAt: DateTime!
    auditEvents: [WorkItemAuditEvent!]!
  }

  type WorkItemAuditEvent {
    id: ID!
    user: User!
    eventType: AuditEventType!
    fromState: WorkItemState
    toState: WorkItemState
    justification: String
    createdAt: DateTime!
  }

  input CreateWorkItemInput {
    title: String!
    description: String!
  }

  input UpdateWorkItemInput {
    id: ID!
    title: String
    description: String
  }

  input StateTransitionInput {
    id: ID!
    toState: WorkItemState!
    justification: String
  }


  type ApiResponse {
    status: Boolean!
    message: String!
    data: WorkItem
    pagination: Pagination
  }

  type ApiListResponse {
    status: Boolean!
    message: String!
    data: [WorkItem!]
    pagination: Pagination
  }

  type Pagination {
    page: Int
    pageSize: Int
    total: Int
    totalPages: Int
  }

  type Query {
    workItems: ApiListResponse!
    workItem(id: ID!): ApiResponse!
  }

  type Mutation {
    createWorkItem(input: CreateWorkItemInput!): ApiResponse!
    updateWorkItem(input: UpdateWorkItemInput!): ApiResponse!
    transitionWorkItem(input: StateTransitionInput!): ApiResponse!
    blockWorkItem(id: ID!, reason: String!): ApiResponse!
    unblockWorkItem(id: ID!): ApiResponse!
    reworkWorkItem(id: ID!, justification: String!): ApiResponse!
    cancelWorkItem(id: ID!, justification: String!): ApiResponse!
  }
`;

export default workItemSchema;
