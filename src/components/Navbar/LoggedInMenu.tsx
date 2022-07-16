import { gql } from '@apollo/client';
import SignedOut from './SignedOut';
import { LoggedInMenu_User } from './__generated__/LoggedInMenu.generated';
import UserInfo from './UserInfo';

export const LoggedInMenuFragment = gql`
	fragment LoggedInMenu_user on User {
		name
		email
	}
`;

interface LoggedInMenuProps {
	user: LoggedInMenu_User;
}

const LoggedInMenu = ({ user }: LoggedInMenuProps) => {
	return (
		<div className="flex-1">
			<div className="flex justify-end">
				<UserInfo user={user} />
			</div>
		</div>
	);
};

export default LoggedInMenu;
