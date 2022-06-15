import type { AppProps } from 'next/app';
import Navbar from '~/components/Navbar';
import NProgress from '~/components/ui/utils/NProgress';
import '../styles.css';

function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<NProgress />
			<Navbar />
			<Component {...pageProps} />
		</>
	);
}

export default App;
