import nprogress, { start } from 'nprogress';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

// Progress indicator at the header of the page when navigating between pages.
const NProgress = () => {
	const router = useRouter();

	useEffect(() => {
		let timeout: NodeJS.Timeout;

		function startProgress() {
			clearTimeout(timeout);
			timeout = setTimeout(() => nprogress.start(), 100);
		}

		function stopProgress() {
			clearTimeout(timeout);
			nprogress.done();
		}

		router.events.on('routeChangeStart', startProgress);
		router.events.on('routeChangeComplete', stopProgress);
		router.events.on('routeChangeError', stopProgress);
		return () => {
			stopProgress();
			router.events.off('routeChangeStart', startProgress);
			router.events.off('routeChangeComplete', stopProgress);
			router.events.off('routeChangeError', stopProgress);
		};
	});

	return null;
};

export default NProgress;
