import { preloadQuery } from '~/utils/apollo';

import { GetServerSideProps } from 'next';
import { authenticatedRoute } from '~/utils/redirects';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const auth = await authenticatedRoute(ctx);
	if ('redirect' in auth) {
		return auth;
	}
	return preloadQuery(ctx);
};

export default () => {
	return <div>Homepage</div>;
};
