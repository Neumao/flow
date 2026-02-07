import { gql } from "@apollo/client";

export const WORKITEM_DETAIL_QUERY = gql`
  query WorkItem($id: ID!) {
    workItem(id: $id) {
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
      history {
        type
        user {
          id
          email
          userName
        }
        timestamp
        reason
      }
    }
  }
`;
