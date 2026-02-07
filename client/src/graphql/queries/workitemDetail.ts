export interface WorkItemDetailUser {
  id: string;
  email: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
}

export interface WorkItemHistoryEvent {
  eventType: string;
  user: WorkItemDetailUser;
  createdAt: string;
  justification?: string;
}

export interface WorkItemDetail {
  id: string;
  title: string;
  description: string;
  state: string;
  blocked: boolean;
  blockReason?: string;
  reworkRequired: boolean;
  createdBy: WorkItemDetailUser;
  createdAt: string;
  updatedAt: string;
  auditEvents: WorkItemHistoryEvent[];
}

export interface WorkItemDetailQueryResult {
  workItem: WorkItemDetail;
}
import { gql } from "@apollo/client";

export const WORKITEM_DETAIL_QUERY = gql`
  query WorkItem($id: ID!) {
    workItem(id: $id) {
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
          eventType
          user {
            id
            email
            userName
          }
          createdAt
          justification
        }
      }
    }
  }
`;
