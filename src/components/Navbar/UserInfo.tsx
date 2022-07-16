import { gql } from '@apollo/client';
import { LoggedInMenu_User } from './__generated__/LoggedInMenu.generated';

interface UserInfoProps {
	user: LoggedInMenu_User;
}

const UserInfo = ({ user }: UserInfoProps) => {
	return (
		<div>
			{user.email}, {user.name}
		</div>
	);
};

export default UserInfo;
