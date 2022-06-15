export interface AvatarProps {
	initials: string;
}

const Avatar = ({ initials }: AvatarProps) => {
	return <div>{initials}</div>;
};

export default Avatar;
