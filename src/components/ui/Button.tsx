import { cva, VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import { ButtonOrLink, Props as ButtonOrLinkProps } from './ButtonOrLink';

const button = cva(['uppercase', 'font-medium', 'rounded-lg'], {
	variants: {
		variant: {
			primary: ['bg-blue-600', 'text-white', 'hover:bg-blue-700'],
			secondary: [
				'bg-blue-900',
				'bg-opacity-40',
				'text-blue-600',
				'text-opacity-75',
				'hover:bg-blue-800',
				'hover:bg-opacity-40',
				'hover:text-blue-500',
				'hover:text-opacity-75',
			],
		},
		size: {
			small: ['text-base', 'py-1', 'px-3'],
			medium: ['text-base', 'py-2', 'px-4'],
		},
		fullWidth: {
			false: '',
			true: 'w-full',
		},
	},
	defaultVariants: {
		variant: 'primary',
		size: 'medium',
	},
});

export interface ButtonProps
	extends VariantProps<typeof button>,
		ButtonOrLinkProps {
	['aria-label']: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ variant, size, fullWidth, ...props }, ref) => {
		return (
			<ButtonOrLink
				className={button({ variant, size, fullWidth })}
				{...props}
				ref={ref}
			/>
		);
	},
);
