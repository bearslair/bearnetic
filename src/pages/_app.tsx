import { ApolloProvider } from '@apollo/client';
import type { AppProps } from 'next/app';
import Navbar from '~/components/Navbar';
import NProgress from '~/components/ui/utils/NProgress';
import { useApollo } from '~/utils/apollo';
import '../styles.css';

function App({ Component, pageProps }: AppProps) {
	const client = useApollo(pageProps.initialClientState);

	return (
		<ApolloProvider client={client}>
			<NProgress />
			<Navbar />
			<Component {...pageProps} />
		</ApolloProvider>
	);
}

export default App;
