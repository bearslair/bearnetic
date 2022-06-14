import type { AppProps } from 'next/app';
import NProgress from '~/components/ui/utils/NProgress';
import '../styles.css';

function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<NProgress />
			<Component {...pageProps} />
		</>
	);
}

export default App;
