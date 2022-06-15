import { object, string } from 'zod';

import { useMutation, gql } from '@apollo/client';
import Link from '../ui/Link';

import { useEffect } from 'react';

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
	const [signUp, { data, error }] = useMutation(
		gql`
			mutation SignUpFormMutation($input: SignUpInput!) {
				signUp(input: $input) {
					id
					name
				}
			}
		`,
	);

	return <>Aha</>;
}
