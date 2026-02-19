
import { Link as RouterLink } from 'react-router';
import type { LinkProps as RouterLinkProps } from 'react-router';

function Link(props: RouterLinkProps) {
    const baseStyle = "text-gray-700 hover:text-orange-500";
    return <RouterLink to={props.to} className={props.className + " " + baseStyle}>{props.children}</RouterLink>;
}

export  { Link };