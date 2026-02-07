import { gql } from "@apollo/client";

// Me query to get current user profile
export const ME_QUERY = gql`
  query Me {
    me {
      status
      message
      data {
        id
        email
        userName
        firstName
        lastName
        profileImageUrl
        phoneNumber
        role
        isActive
        isVerified
        createdAt
        updatedAt
        lastLogin
      }
    }
  }
`;

// Me query response type
export interface MeResponse {
  me: {
    status: boolean;
    message: string;
    data: {
      id: string;
      email: string;
      userName?: string;
      firstName?: string;
      lastName?: string;
      profileImageUrl?: string;
      phoneNumber?: string;
      role: "SYSADMIN" | "ADMIN" | "USER" | "MODERATOR";
      isActive: boolean;
      isVerified: boolean;
      createdAt: string;
      updatedAt: string;
      lastLogin?: string;
    };
  };
}
