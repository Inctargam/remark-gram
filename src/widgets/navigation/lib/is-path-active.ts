/**
 * Returns true when `pathname` matches `href` or is a sub-path of it.
 * The root path ('/') matches only itself to avoid marking every route as active.
 * Returns false when pathname is null (not yet resolved by the router).
 */
export const isPathActive = (pathname: string | null, href: string): boolean => {
  if (!pathname) {
    return false
  }

  if (href === '/') {
    return pathname === href
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}
