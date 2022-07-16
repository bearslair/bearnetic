import { GetServerSideProps } from 'next';
import { unauthenticatedRoute } from '~/utils/redirects';

export const getServerSideProps: GetServerSideProps = unauthenticatedRoute;

export { LogInForm as default } from '~/components/Auth/LogInForm';
