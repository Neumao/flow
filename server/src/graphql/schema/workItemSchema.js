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

  type Query {
    workItems: [WorkItem!]!
    workItem(id: ID!): WorkItem
  }

  type Mutation {
    createWorkItem(input: CreateWorkItemInput!): WorkItem!
    updateWorkItem(input: UpdateWorkItemInput!): WorkItem!
    transitionWorkItem(input: StateTransitionInput!): WorkItem!
    blockWorkItem(id: ID!, reason: String!): WorkItem!
    unblockWorkItem(id: ID!): WorkItem!
    reworkWorkItem(id: ID!, justification: String!): WorkItem!
    cancelWorkItem(id: ID!, justification: String!): WorkItem!
  }
`;

export default workItemSchema;
