import * as Types from '../../../__generated__/schema.generated';

export type NavbarQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type NavbarQuery = { __typename?: 'Query', viewer?: { __typename?: 'User', id: string, name: string, email: string } | null };
