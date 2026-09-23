/**
 * Helper to resolve static asset URLs correctly across all deployment environments:
 * - GitHub Pages with subpath (e.g. https://username.github.io/Cipher/)
 * - Vercel / Netlify / Custom Domain (root /)
 * - Localhost dev server (both / and /Cipher/)
 */
export function getAssetUrl(path) {
  if (!path) return '';
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('blob:') ||
    path.startsWith('data:')
  ) {
    return path;
  }

  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  if (typeof window !== 'undefined') {
    const { hostname, pathname } = window.location;

    // 1. Automatic GitHub Pages repo subpath detection
    // e.g. hostname is "mohammed-ahmed-ezzat.github.io", pathname is "/Cipher" or "/Cipher/"
    if (hostname.endsWith('github.io')) {
      const repoMatch = pathname.match(/^\/([^\/]+)(?:\/|$)/);
      if (repoMatch && repoMatch[1]) {
        return `/${repoMatch[1]}/${cleanPath}`;
      }
    }

    // 2. Base URL from Vite build config if specified
    const base = import.meta.env.BASE_URL;
    if (base && base !== './' && base !== '.') {
      const cleanBase = base.endsWith('/') ? base : `${base}/`;
      return `${cleanBase}${cleanPath}`;
    }

    // 3. Document-relative URL resolution with trailing-slash protection
    const baseUri = document.baseURI || window.location.href;
    try {
      let folderUrl = baseUri;
      if (!folderUrl.endsWith('/') && !/\.[a-zA-Z0-9]+$/.test(new URL(folderUrl).pathname)) {
        folderUrl += '/';
      }
      return new URL(cleanPath, folderUrl).href;
    } catch {
      return `/${cleanPath}`;
    }
  }

  return `/${cleanPath}`;
}
