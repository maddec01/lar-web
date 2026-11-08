// The one link look the design system draws: Link, InlineLink, RichText's and the Markdown editor's links, and every
// link a composition draws itself (a fact, a reference, "Part of #12").

/** An underline at 40% of the link's colour, filled in on hover. */
const underline =
    'rounded-xs underline decoration-current/40 underline-offset-2 transition-colors hover:decoration-current';

/** A link's look by its tone: `accent` is the primary as text, for a link that stands on its own (in prose, a fact, a
 *  reference); `inherit` takes the colour of the text around it (a link inside a note or an alert); `muted` is a
 *  navigation trail's quiet link, whose underline shows on hover; `default` is the same in body text. */
export const linkRecipe = {
    accent: `${underline} text-primary-fg hover:text-primary-fg`,
    inherit: `${underline} text-inherit hover:text-inherit`,
    muted: 'rounded-xs underline decoration-transparent underline-offset-2 transition-colors text-fg-muted hover:text-fg hover:decoration-current',
    /** A cluster that reads as one fact, such as a rating's mark, score and scale: body text whose underline shows on
     *  hover, so its parts never read as separate underlined links. */
    default:
        'rounded-xs underline decoration-transparent underline-offset-2 transition-colors text-fg hover:text-fg hover:decoration-current',
} as const;

/** `linkRecipe.accent` for every link inside a block of prose (RichText). Spelled out, as Tailwind reads only literal
 *  classes; LinkRecipe.test.ts holds it to the recipe. */
export const proseLinkRecipe =
    '[&_a]:rounded-xs [&_a]:underline [&_a]:decoration-current/40 [&_a]:underline-offset-2 [&_a]:transition-colors [&_a:hover]:decoration-current [&_a]:text-primary-fg [&_a:hover]:text-primary-fg';
