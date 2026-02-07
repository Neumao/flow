import { gql } from "@apollo/client";

export const WORKITEMS_QUERY = gql`
  query WorkItems {
    workItems {
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
        firstName
        lastName
      }
      createdAt
      updatedAt
      auditEvents {
        id
        eventType
        fromState
        toState
        justification
        createdAt
        user {
          id
          email
        }
      }
    }
  }
`;

export interface WorkItem {
  id: string;
  title: string;
  description: string;
  state: string;
  blocked: boolean;
  blockReason?: string;
  reworkRequired: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkItemsResponse {
  workItems: WorkItem[];
}
