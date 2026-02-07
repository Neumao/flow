import { gql } from "@apollo/client";

export const WORKITEMS_QUERY = gql`
  query WorkItems {
    workItems {
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
  createdBy: {
    id: string;
    email: string;
    userName?: string;
    firstName?: string;
    lastName?: string;
  };
  createdAt: string;
  updatedAt: string;
  auditEvents?: Array<{
    id: string;
    eventType: string;
    fromState?: string;
    toState?: string;
    justification?: string;
    createdAt: string;
    user: {
      id: string;
      email: string;
    };
  }>;
}

export interface WorkItemsResponse {
  workItems: WorkItem[];
}
