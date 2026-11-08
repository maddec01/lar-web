import { MARK_L, MARK_S } from '../display/BrandMark';

// Real Lar marks, transparent SVGs with fixed light/dark ink, never a theme-dependent stand-in or opaque image.
function larLogo(ink: string) {
    return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100"><g fill="${ink}"><path d="${MARK_L}"/><path d="${MARK_S}"/><text x="105" y="98" font-family="Arial,sans-serif" font-size="130" font-weight="700" letter-spacing="-6">ar</text></g></svg>`)}`;
}

export const lightTitleLogo = larLogo('#ffffff');
export const darkTitleLogo = larLogo('#101010');
export const brightBackdrop = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720"><defs><linearGradient id="bright"><stop stop-color="white"/><stop offset=".5" stop-color="#ffff90"/><stop offset="1" stop-color="#a0ffff"/></linearGradient></defs><path fill="url(#bright)" d="M0 0h1280v720H0z"/></svg>')}`;
