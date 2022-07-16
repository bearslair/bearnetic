import { VariantProps } from 'class-variance-authority';
import { ComponentProps } from 'react';

type Props = ComponentProps<'div'>;

export default ({ children, ...props }: Props) => {
	return (
		<div className="relative z-0 flex flex-col" {...props}>
			<div className="w-full px-0 mx-auto sm:px-4 max-w-7xl">{children}</div>
		</div>
	);
};
