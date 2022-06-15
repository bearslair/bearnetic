import { forwardRef } from 'react';
import { ButtonOrLink, Props as ButtonOrLinkProps } from './ButtonOrLink';

export interface LinkProps extends ButtonOrLinkProps {}

const Link = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
	return <ButtonOrLink {...props} ref={ref} />;
});

export default Link;
