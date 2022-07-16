import { object, string } from 'zod';
import { useMutation, gql } from '@apollo/client';
import { Form, useZodForm } from '../ui/Form';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { ErrorMessage } from '../ui/ErrorMessage';
import {
	SignUpFormMutation,
	SignUpFormMutationVariables,
} from './__generated__/SignUpForm.generated';
import Link from '../ui/Link';
import { useEffect } from 'react';
import { useAuthRedirect } from '../ui/utils/useAuthRedirect';

const signUpSchema = object({
	name: string().min(1),
	email: string().email(),
	password: string().min(6),
	confirmPassword: string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
	message: 'Passwords do not match',
	path: ['confirmPassword'],
});

export function SignUpForm() {
	const authRedirect = useAuthRedirect();
	const [signUp, { data, error }] = useMutation<
		SignUpFormMutation,
		SignUpFormMutationVariables
	>(
		gql`
			mutation SignUpFormMutation($input: SignUpInput!) {
				signUp(input: $input) {
					id
					name
				}
			}
		`,
	);

	useEffect(() => {
		if (data) {
			authRedirect();
		}
	}, [data, authRedirect]);

	const form = useZodForm({
		schema: signUpSchema,
	});

	return (
		<div className="flex items-center p-4 mx-auto w-[28rem]">
			<Form
				form={form}
				onSubmit={({ name, email, password }) =>
					signUp({
						variables: {
							input: { name, email, password },
						},
					})
				}
				className="w-full p-6 rounded-md bg-neutral-900 mt-1.5"
			>
				<div className="flex flex-col items-center mb-2">
					<h2 className="text-4xl font-bold text-center">Sign up</h2>
					<Link href="/auth/login" className="font-medium hover:underline">
						Already have an account? Sign in!
					</Link>
				</div>
				<ErrorMessage title="Error creating account" error={error} />
				<Input
					label="Name"
					type="text"
					autoComplete="name"
					autoFocus
					{...form.register('name')}
				/>
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
				<Input
					label="Confirm password"
					type="password"
					autoComplete="new-password"
					{...form.register('confirmPassword')}
				/>
				<Button aria-label="sign up" type="submit">
					Sign Up
				</Button>
			</Form>
		</div>
	);
}
