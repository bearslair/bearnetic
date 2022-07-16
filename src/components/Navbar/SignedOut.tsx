import React from 'react';
import { Button } from '../ui/Button';

const SignedOut: React.FC = () => {
	return (
		<div className="flex-1">
			<div className="flex justify-end space-x-4 align-center">
				<Button aria-label="Login" href="/auth/login" variant="muted">
					Login
				</Button>
				<Button aria-label="Sign Up" href="/auth/signup" variant="special">
					Sign Up
				</Button>
			</div>
		</div>
	);
};

export default SignedOut;
