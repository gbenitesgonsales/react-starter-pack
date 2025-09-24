import { cn } from "package-gbg-components";
import { Link as ReactRouterLink, useLocation, useNavigate } from "react-router";

export type LinkProps = {
  href: string;
  params?: { [key: string]: string | number | null | undefined }
  children?: React.ReactNode;
  className?: string;
}

export function Link({ href, children, params, className, ...props }: LinkProps) {

  const queryString = Object.entries(params || {}).map(([key, value]) => {
    if (!value)
      return;

    return `${key}=${value}`
  }).filter(Boolean).join("&");

  return <ReactRouterLink to={[href, queryString].filter(Boolean).join("?")} className={cn("hover:underline", className)} {...props}>
    {children}
  </ReactRouterLink>
}

export function KeepLink({ href, children, className, ...props }: LinkProps) {
  const location = useLocation();

  // 1. Analisa a query string da URL atual
  const currentParams = new URLSearchParams(location.search);

  // 2. Analisa a query string do href do link
  const linkUrl = new URL(href, window.location.origin);
  const linkParams = new URLSearchParams(linkUrl.search);

  // 3. Combina as duas query strings, priorizando a do link
  currentParams.forEach((value, key) => {
    if (!linkParams.has(key)) {
      linkParams.set(key, value);
    }
  });

  // 4. Constrói o novo 'to' com a query string combinada
  const newTo = `${linkUrl.pathname}?${linkParams.toString()}`;
  console.log(newTo);

  return <ReactRouterLink to={newTo} className={cn("hover:underline", className)} {...props}>
    {children}
  </ReactRouterLink>
}

export function GoBack({ children, ...props }: Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'>) {
  const navigate = useNavigate();
  return <a onClick={(e) => {
    e.preventDefault();
    navigate(-1);
  }} {...props}>
    {children}
  </a>
}