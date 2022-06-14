import { Transition } from '@headlessui/react';
import { cva, VariantProps } from 'class-variance-authority';
import { forwardRef, ReactNode } from 'react';
import { ButtonOrLink, Props as ButtonOrLinkProps } from './ButtonOrLink';
import Spinner from './Spinner';

const button = cva(
	[
		'uppercase',
		'font-medium',
		'rounded-lg',
		'flex',
		'items-center',
		'justify-center',
		'overflow-hidden',
		'disabled:opacity-75',
		'disabled:cursor-not-allowed',
		'disabled:pointer-events-none',
	],
	{
		variants: {
			variant: {
				primary: ['bg-blue-600', 'text-white', 'hover:bg-blue-700'],
				secondary: [
					'bg-blue-900',
					'bg-opacity-40',
					'text-blue-500',
					'text-opacity-90',
					'hover:bg-blue-800',
					'hover:bg-opacity-40',
					'hover:text-blue-600',
					'hover:text-opacity-90',
				],
				danger: ['bg-red-600', 'text-white', 'hover:bg-red-700'],
				muted: [
					'hover:bg-neutral-700',
					'hover:bg-opacity-40',
					'outline',
					'outline-1',
					'outline-zinc-600',
				],
				mutedDanger: [
					'text-red-500',
					'hover:bg-red-900/30',
					'outline',
					'outline-1',
					'outline-red-500',
				],
			},
			size: {
				sm: ['text-sm', 'px-3', 'py-2'],
				md: ['text-base', 'px-4', 'py-2.5'],
				lg: ['text-lg', 'px-6', 'py-3'],
			},
			fullWidth: {
				false: '',
				true: 'w-full',
			},
		},
		defaultVariants: {
			variant: 'primary',
			size: 'sm',
		},
	},
);

export interface ButtonProps
	extends VariantProps<typeof button>,
		ButtonOrLinkProps {
	['aria-label']: string;
	leftIcon?: ReactNode;
	children?: ReactNode;
	rightIcon?: ReactNode;
	isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			variant,
			size,
			fullWidth,
			isLoading,
			leftIcon,
			rightIcon,
			children,
			...props
		},
		ref,
	) => {
		return (
			<ButtonOrLink
				className={button({ variant, size, fullWidth })}
				{...props}
				ref={ref}
			>
				<Transition
					show={!!isLoading}
					enter="transition-all"
					enterFrom="w-0 opacity-0"
					enterTo="w-6 opacity-100"
					leave="transition-all"
					leaveFrom="w-6 opacity-100"
					leaveTo="w-0opacity-0"
				>
					<div className="mr-2">
						<Spinner />
					</div>
				</Transition>
				<div className="flex items-center justify-center space-x-2">
					{leftIcon && <div>{leftIcon}</div>}
					<div>{children}</div>
					{rightIcon && <div>{rightIcon}</div>}
				</div>
			</ButtonOrLink>
		);
	},
);
