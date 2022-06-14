import type { NextPage } from 'next';
import { Button } from '~/components/ui/Button';

const Home: NextPage = () => {
	return (
		<>
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
			</div>
		</>
	);
};

export default Home;
