import * as Types from '../../../__generated__/schema.generated';

export type LogInFormMutationVariables = Types.Exact<{
  input: Types.LogInInput;
}>;


export type LogInFormMutation = { __typename?: 'Mutation', login: { __typename?: 'User', id: string } };
