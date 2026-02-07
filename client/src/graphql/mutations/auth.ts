import { gql } from "@apollo/client";

// Login mutation based on server schema
export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      status
      message
      data {
        id
        email
        userName
        firstName
        lastName
        role
        authToken
        isActive
        isVerified
      }
    }
  }
`;

// Login input type for TypeScript
export interface LoginInput {
  email: string;
  password: string;
}

// Login response type based on server response
export interface LoginResponse {
  login: {
    status: boolean;
    message: string;
    data: {
      id: string;
      email: string;
      userName?: string;
      firstName?: string;
      lastName?: string;
      role: string;
      authToken: string;
      isActive: boolean;
      isVerified: boolean;
    };
  };
}
