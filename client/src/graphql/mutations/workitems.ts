import { gql } from "@apollo/client";

export const CREATE_WORKITEM_MUTATION = gql`
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
        blockReason
        reworkRequired
        createdBy {
          id
          email
          userName
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_WORKITEM_MUTATION = gql`
  mutation UpdateWorkItem($id: ID!, $input: UpdateWorkItemInput!) {
    updateWorkItem(id: $id, input: $input) {
      status
      message
      data {
        id
        title
        description
        state
        blocked
        blockReason
        reworkRequired
        updatedAt
      }
    }
  }
`;

export const BLOCK_WORKITEM_MUTATION = gql`
  mutation BlockWorkItem($id: ID!, $reason: String!) {
    blockWorkItem(id: $id, reason: $reason) {
      status
      message
      data {
        id
        blocked
        blockReason
        updatedAt
      }
    }
  }
`;

export const UNBLOCK_WORKITEM_MUTATION = gql`
  mutation UnblockWorkItem($id: ID!) {
    unblockWorkItem(id: $id) {
      status
      message
      data {
        id
        blocked
        blockReason
        updatedAt
      }
    }
  }
`;

export const REWORK_WORKITEM_MUTATION = gql`
  mutation ReworkWorkItem($id: ID!, $justification: String!) {
    reworkWorkItem(id: $id, justification: $justification) {
      status
      message
      data {
        id
        state
        reworkRequired
        updatedAt
      }
    }
  }
`;

export const STATE_TRANSITION_MUTATION = gql`
  mutation StateTransition(
    $id: ID!
    $toState: WorkItemState!
    $justification: String
  ) {
    transitionWorkItem(
      input: { id: $id, toState: $toState, justification: $justification }
    ) {
      status
      message
      data {
        id
        state
        updatedAt
      }
    }
  }
`;

export const CANCEL_WORKITEM_MUTATION = gql`
  mutation CancelWorkItem($id: ID!, $justification: String!) {
    cancelWorkItem(id: $id, justification: $justification) {
      status
      message
      data {
        id
        state
        updatedAt
      }
    }
  }
`;
