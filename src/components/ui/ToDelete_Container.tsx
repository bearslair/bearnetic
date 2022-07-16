import { ComponentProps } from 'react';
import { cva, VariantProps } from 'class-variance-authority';

const container = cva(
	['w-full', 'm-auto', 'p-4', 'flex', 'items-center', 'my-6'],
	{
		variants: {
			size: {
				sm: ['w-80'],
				md: ['w-[26rem]'],
				lg: ['w-[32rem]'],
			},
		},
		defaultVariants: {
			size: 'md',
		},
	},
);
type ContainerProps = ComponentProps<'div'>;
export type Props = VariantProps<typeof container> & ContainerProps;

export const Container = ({ size, children, ...props }: Props) => {
	return (
		<div className={container({ size })} {...props}>
			{children}
		</div>
	);
};
