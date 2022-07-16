import { gql, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { object, string } from 'zod';
import { Button } from '../ui/Button';
import { ErrorMessage } from '../ui/ErrorMessage';
import { Form, useZodForm } from '../ui/Form';
import { Input } from '../ui/Input';
import Link from '../ui/Link';
import { useAuthRedirect } from '../ui/utils/useAuthRedirect';
import {
	LogInFormMutation,
	LogInFormMutationVariables,
} from './__generated__/LogInForm.generated';

const logInSchema = object({
	email: string().email(),
	password: string().min(6),
});

export const LogInForm = () => {
	const authRedirect = useAuthRedirect();
	const [login, { data, error }] = useMutation<
		LogInFormMutation,
		LogInFormMutationVariables
	>(gql`
		mutation LogInFormMutation($input: LogInInput!) {
			login(input: $input) {
				id
			}
		}
	`);

	const form = useZodForm({
		schema: logInSchema,
	});

	useEffect(() => {
		if (data) {
			authRedirect();
		}
	}, [data, authRedirect]);

	return (
		<div className="flex items-center p-4 mx-auto w-[28rem]">
			<Form
				form={form}
				onSubmit={({ email, password }) =>
					login({
						variables: {
							input: { email, password },
						},
					})
				}
				className="w-full p-6 rounded-md bg-neutral-900 mt-1.5"
			>
				<div className="flex flex-col items-center mb-2">
					<h2 className="text-4xl font-bold text-center">Log in</h2>
					<Link href="/auth/signup" className="font-medium hover:underline">
						Need an account? Sign up!
					</Link>
				</div>
				<ErrorMessage title="Error creating account" error={error} />
				<Input
					label="Email"
					type="email"
					autoComplete="email"
					{...form.register('email')}
				/>
				<Input
					label="Password"
					type="password"
					autoComplete="new-password"
					{...form.register('password')}
				/>
				<Button aria-label="sign up" type="submit">
					Log in
				</Button>
			</Form>
		</div>
	);
};
