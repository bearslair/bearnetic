import Logo from './Logo';
import { gql, useQuery } from '@apollo/client';
import LoggedInMenu, { LoggedInMenuFragment } from './LoggedInMenu';
import SignedOut from './SignedOut';
import {
	NavbarQuery,
	NavbarQueryVariables,
} from './__generated__/index.generated';

export const query = gql`
	query NavbarQuery {
		viewer {
			id
			...LoggedInMenu_user
		}
	}

	${LoggedInMenuFragment}
`;

const Navbar = () => {
	const { data, loading } = useQuery<NavbarQuery, NavbarQueryVariables>(query);
	return (
		<div className="sticky top-0 z-10 flex items-center justify-between px-4 py-4 shadow bg-neutral-900 h-[72px]">
			<Logo />
			<div>Workspace</div>
			{data &&
				(data.viewer ? <LoggedInMenu user={data?.viewer} /> : <SignedOut />)}
		</div>
	);
};

export default Navbar;
