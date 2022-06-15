import Link from '../ui/Link';
import Logo from './Logo';
import UserSection from './UserSection';

const Navbar = () => {
	return (
		<div className="sticky top-0 z-10 flex items-center justify-between px-4 py-4 shadow bg-neutral-900 h-[72px]">
			<Logo />
			<div>Workspace</div>
			<UserSection />
		</div>
	);
};

export default Navbar;
