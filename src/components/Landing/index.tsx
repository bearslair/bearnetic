import Link from 'next/link';
import { Button } from '../ui/Button';
import { NextSeo } from 'next-seo';

export function Landing() {
	return (
		<>
			<NextSeo title="bearnetic | Home" />
			<div
				style={{
					position: 'fixed',
					zIndex: 9999,
					top: '16px',
					left: '16px',
					right: '16px',
					bottom: '16px',
					pointerEvents: 'none',
				}}
			></div>
			<div className="w-full">
				<Button variant="mutedDanger" aria-label="test" isLoading={true}>
					test
				</Button>
				<Button variant="muted" aria-label="test">
					test
				</Button>
				<Button variant="danger" aria-label="test">
					test
				</Button>
				<Button variant="primary" aria-label="test">
					test
				</Button>
				<Button variant="secondary" aria-label="test">
					test
				</Button>
				<Button
					aria-label="Go to sign up page"
					href="/auth/signup"
					variant="special"
				>
					Sign Up
				</Button>
			</div>
		</>
	);
}
