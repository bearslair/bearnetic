import type { NextPage } from 'next';
import { Button } from '~/components/ui/Button';

const Home: NextPage = () => {
	return (
		<>
			<div className="w-full">
				<Button variant="primary" aria-label="test">
					test
				</Button>
			</div>
		</>
	);
};

export default Home;
