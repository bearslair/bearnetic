import { ApolloProvider } from '@apollo/client';
import type { AppProps } from 'next/app';
import Navbar from '~/components/Navbar';
import Container from '~/components/ui/Container';
import { NProgress } from '~/components/ui/utils/NProgress';
import { useApollo } from '~/utils/apollo';
import { DefaultSeo } from 'next-seo';
import '../styles.css';

function App({ Component, pageProps }: AppProps) {
	const client = useApollo(pageProps.initialClientState);

	return (
		<ApolloProvider client={client}>
			<DefaultSeo
				defaultTitle="bearnetic"
				titleTemplate="%s | bearnetic"
				description="cocooooo"
			/>
			<NProgress />
			<Navbar />
			<Container>
				<Component {...pageProps} />
			</Container>
		</ApolloProvider>
	);
}

export default App;
