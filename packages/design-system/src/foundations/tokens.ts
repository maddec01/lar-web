/** The semantic colour layer's values, light and dark, each a step of its theme's pure-grey ramp, an alpha step or a
 *  hue (theme.css). Surfaces are an alpha ladder, not opaque greys: in dark, white steps over the #000 page; in light,
 *  black steps over the #fafafa page (the light card, panel, control and field are white). An alpha value is checked for
 *  contrast composited over its theme's page (tokens.test.ts); over glass it only gets lighter in dark and stays as
 *  light in light. Roles that share a value in one theme (`fg-lead` and `fg-muted` in light, `line-strong-hover` and
 *  `fg-muted` in light) are kept apart on purpose, each documented below: they mean different things and may
 *  move separately. This is the one table theme.css's palettes are checked against (tokens.test.ts) and the docs draw
 *  their swatches from. Each name is a Tailwind colour (`--color-<name>`), so `bg-surface-card`, `text-fg-muted`,
 *  `border-line-panel` and `bg-danger-fill text-danger-on-fill` all work. */
export const semanticColors = {
    /** The page behind everything: pure black in dark (beside T3 Code), #fafafa in light. */
    'surface-page': { light: '#fafafa', dark: '#000000' },
    /** An opaque surface where something must not show through: a sticky header, a sign-in card, a chart's tooltip,
     *  the fallback where glass can't blur. In dark it is T3 Code's one floating step (#0e0e0e); inside glass it turns
     *  translucent (the glass tiers set it), so nothing opaque sits in a dialog. */
    'surface-raised': { light: '#ffffff', dark: '#0e0e0e' },
    /** A card: one thing you open or act on (a desk card, a catalog, a device, now playing). A faint fill (white 3.5%,
     *  so dark stays near black, as T3 Code's does) under `line-card`; white with a hairline drop (`--shadow-card`) in
     *  light. The `surface-card` utility. */
    'surface-card': { light: '#ffffff', dark: '#ffffff09' },
    /** A panel: a group of rows (a board lane, a track or file list, a settings group, an account group). No fill on
     *  black, white in light, under `line-panel`; inside glass a faint well (white 3% / black 3%). The `surface-panel`
     *  utility. */
    'surface-panel': { light: '#ffffff', dark: '#00000000' },
    /** A well inside a panel or card: a panel's footer, a table's header, a code block's bar. */
    'surface-sunken': { light: '#00000008', dark: '#ffffff08' },
    /** A menu's or popover's opaque tint (the menu glass's colour), where an overlay needs a solid colour. */
    'surface-overlay': { light: '#ffffff', dark: '#0e0e0e' },
    /** A control's fill: a button, a select, a checkbox (white 4% in dark, white in light). */
    'surface-control': { light: '#ffffff', dark: '#ffffff0a' },
    /** A field's fill (white 4% in dark, white in light): a text field, a select, a textarea, the title bar's and the
     *  settings' search. */
    'surface-field': { light: '#ffffff', dark: '#ffffff0a' },
    /** A translucent panel over a backdrop or artwork (a marketing page's cards and bands, the theme switch's track):
     *  the bar glass's tint (black 60% / #fafafa 66%). Text on it is checked against the page it tends to. */
    'surface-glass': { light: '#fafafaa8', dark: '#00000099' },
    /** A row, card or control under the pointer: +white 6% in dark, +black 3% in light, over whatever it sits on, so a
     *  hover reads on the page, on a card and on glass alike. */
    'fill-hover': { light: '#00000008', dark: '#ffffff0f' },
    /** The chosen item in a tab bar or menu (a place uses the `current` recipe instead): white 13% in dark, well past
     *  `fill-hover`, so hovered and chosen differ. */
    'fill-selected': { light: '#0000000f', dark: '#ffffff21' },
    /** A quiet neutral fill that marks a thing rather than a state: a neutral badge or chip, a key cap, a subtle
     *  button, a tone tile. */
    'fill-muted': { light: '#0000000a', dark: '#ffffff12' },
    /** `fill-muted` under the pointer (a subtle button's hover). */
    'fill-muted-hover': { light: '#00000012', dark: '#ffffff1a' },
    /** The chosen segment's pill (the `segment-chosen` recipe): white 12% in dark, white (on a hairline) in light. */
    'fill-chosen': { light: '#ffffff', dark: '#ffffff1f' },
    /** The empty part of a progress bar, meter or segmented track; what fills it carries the state. */
    track: { light: '#0000001a', dark: '#ffffff24' },

    /** Body text and icons. */
    fg: { light: '#262626', dark: '#f5f5f5' },
    /** Secondary text that still reads as content. */
    'fg-soft': { light: '#404040', dark: '#c7c7c7' },
    /** Meta text, captions, placeholders and quiet icons. On glass (a menu, a dialog) it rises a step: #a3a3a3 in dark,
     *  #575757 in light (the glass tiers set it). */
    'fg-muted': { light: '#666666', dark: '#8a8a8a' },
    /** Muted long-form text (a lead under a headline, prose, a caption under a hero). Its own role, not `fg-muted`:
     *  the same grey in light, where it already reads at 4.5:1 on every surface, but a step lighter in dark, where long
     *  runs of mid-grey on black tire the eye; meta text stays at `fg-muted` there so it recedes. */
    'fg-lead': { light: '#666666', dark: '#a3a3a3' },
    /** Text on an `fg`-coloured fill. */
    'fg-inverse': { light: '#fafafa', dark: '#000000' },

    /** A divider: decoration, which needs no contrast of its own (white 8% / black 7%). */
    line: { light: '#00000012', dark: '#ffffff14' },
    /** A panel's edge (`surface-panel`, a settings group): white 8.5% / black 8% (T3's #1c1c1c group edge), inside glass
     *  too. */
    'line-panel': { light: '#00000014', dark: '#ffffff16' },
    /** A card's edge (`surface-card`): white 11% / black 10%, a touch firmer than a panel's, as a card is a thing. */
    'line-card': { light: '#0000001a', dark: '#ffffff1c' },
    /** An edge under the pointer: a card that navigates lifts its edge to it (white 20% / black 20%). */
    'line-hover': { light: '#00000033', dark: '#ffffff33' },
    /** A control's edge at rest: a button, a select (white 13% / black 14%); its label identifies it. */
    'line-control': { light: '#00000024', dark: '#ffffff21' },
    /** A field's edge, T3 Code's select edge (white 13% / black 12%: ≈ #212121 on black, under T3's #2a2a2a), over the
     *  field's subtle fill: a field is never the loudest line on screen. Not held to 3:1: the field's fill, label and
     *  placeholder tell it apart, and a state lives in `focus` (with its ring) and the danger edge; a disabled field
     *  takes `line`. */
    'line-field': { light: '#0000001f', dark: '#ffffff21' },
    /** `line-field` under the pointer (white 20% / black 20%). */
    'line-field-hover': { light: '#00000033', dark: '#ffffff33' },
    /** A checkbox's or radio's edge (white 28% / black 26%): quieter than a status mark, still clearly a control;
     *  checked, it fills with the primary. Not held to 3:1, like `line-field`. */
    'line-choice': { light: '#00000042', dark: '#ffffff47' },
    /** A switch's track while off (white 16% / black 20%), under its white thumb, which makes it a control. */
    'fill-switch-off': { light: '#00000033', dark: '#ffffff29' },
    /** An edge or mark that carries a state at 3:1 on the page, a card and a menu: a status light that is off, a
     *  neutral progress segment, a dashed waiting slot. */
    'line-strong': { light: '#8a8a8a', dark: '#6b6b6b' },
    /** `line-strong` under the pointer. In light it takes the muted text's step; the roles move separately. */
    'line-strong-hover': { light: '#666666', dark: '#8a8a8a' },
    /** A scrollbar's thumb, translucent so it reads on any surface, and under the pointer. Decoration. */
    'scrollbar-thumb': { light: '#00000026', dark: '#ffffff14' },
    'scrollbar-thumb-hover': { light: '#00000040', dark: '#ffffff1f' },
    /** The keyboard focus ring, and a focused field's edge (navy-300 in dark). */
    focus: { light: '#355292', dark: '#9db7eb' },

    /** Lar's mark navy: a filled primary control (#4a68aa in dark, where the mark's #355292 would sink). */
    primary: { light: '#355292', dark: '#4a68aa' },
    /** Text on a primary fill. */
    'primary-content': { light: '#ffffff', dark: '#ffffff' },
    /** The primary hue as text, a link or an icon on a surface. */
    'primary-fg': { light: '#355292', dark: '#9db7eb' },
    /** A primary tint under `primary-fg`: a tinted button ("you can start this"). */
    'primary-surface': { light: '#ebeef4', dark: '#1c2230' },
    /** `primary-surface` under the pointer or while its popup is open (a tinted button, a chosen choice). */
    'primary-surface-hover': { light: '#dbe0eb', dark: '#25304a' },
    /** `primary` under the pointer: a primary button being hovered. */
    'primary-fill-hover': { light: '#49639d', dark: '#5072bb' },
    /** The `current` recipe: where you are (a settings nav item, the list sidebar's page, the command palette's cursor,
     *  a chosen option in a list). navy-500 at 18% under #9db7eb in dark; navy at 10% under #355292 in light. */
    'current-surface': { light: '#3552921a', dark: '#5072bb2e' },
    'current-fg': { light: '#355292', dark: '#9db7eb' },

    /** A tone's two edges, decoration that needs no contrast of its own (the icon and the words carry the meaning):
     *  `-edge` borders a neutral box in the tone (an Alert, a chosen option, a map part that asks), `-ring` is the
     *  hairline of a box already tinted in it (a Badge, a warning panel, a chosen row, a toned focus ring). Each
     *  tone's alpha is set for parity, as amber reads lighter than the others. */
    'primary-edge': { light: '#35529299', dark: '#5072bb99' },
    'primary-ring': { light: '#3552924d', dark: '#5072bb4d' },
    'success-edge': { light: '#10b98173', dark: '#10b98173' },
    'success-ring': { light: '#10b98133', dark: '#10b98133' },
    'warning-edge': { light: '#f59e0b8c', dark: '#f59e0b8c' },
    'warning-ring': { light: '#f59e0b40', dark: '#f59e0b40' },
    'danger-edge': { light: '#dc262673', dark: '#ef444473' },
    'danger-ring': { light: '#dc262633', dark: '#ef444433' },
    'info-edge': { light: '#5072bb73', dark: '#5072bb73' },
    'info-ring': { light: '#5072bb40', dark: '#5072bb40' },

    /** One status source: each status's solid fill is its hue (the bare `success`, `warning`, `danger`, `info` below,
     *  which statusStateColors and every status light, progress segment and stage draw), with the text that reads on
     *  it (tokens.test.ts holds them equal). */
    'success-fill': { light: '#10b981', dark: '#10b981' },
    'success-on-fill': { light: '#022c22', dark: '#022c22' },
    'success-fg': { light: '#047857', dark: '#34d399' },
    'success-surface': { light: '#ecfdf5', dark: '#121d18' },

    'warning-fill': { light: '#f59e0b', dark: '#f59e0b' },
    'warning-on-fill': { light: '#1c1917', dark: '#1c1917' },
    'warning-fg': { light: '#a84d08', dark: '#fbbf24' },
    'warning-surface': { light: '#fffbeb', dark: '#1f1b12' },

    'danger-fill': { light: '#dc2626', dark: '#dc2626' },
    /** `danger-fill` under the pointer: a destructive button being hovered. */
    'danger-fill-hover': { light: '#c22121', dark: '#c22121' },
    'danger-on-fill': { light: '#ffffff', dark: '#ffffff' },
    'danger-fg': { light: '#b91c1c', dark: '#f87171' },
    'danger-surface': { light: '#fef2f2', dark: '#221616' },

    /** Info is its own navy, the working state's, never the primary's tokens: the same hue, its own steps. */
    'info-fill': { light: '#5072bb', dark: '#5072bb' },
    'info-on-fill': { light: '#ffffff', dark: '#ffffff' },
    'info-fg': { light: '#3f5ea6', dark: '#aec4f0' },
    'info-surface': { light: '#eef2fa', dark: '#161d2c' },

    /** A notice's wash and edge (an Alert): in light the tone's surface and ring, in dark the tone at 6% and 35%, so it
     *  tints what it sits on (black, glass) instead of laying an opaque slab on it. */
    'success-wash': { light: '#ecfdf5', dark: '#10b9810f' },
    'success-wash-edge': { light: '#10b98133', dark: '#10b98159' },
    'warning-wash': { light: '#fffbeb', dark: '#f59e0b0f' },
    'warning-wash-edge': { light: '#f59e0b40', dark: '#f59e0b59' },
    'danger-wash': { light: '#fef2f2', dark: '#ef44440f' },
    'danger-wash-edge': { light: '#dc262633', dark: '#ef444459' },
    'info-wash': { light: '#eef2fa', dark: '#5072bb0f' },
    'info-wash-edge': { light: '#5072bb40', dark: '#5072bb59' },

    /** The status hues themselves (ninna-ui's names), for dots, bars and tints, never for text: their `-content`
     *  pair is what ninna-ui writes on a solid fill of the hue. */
    success: { light: '#10b981', dark: '#10b981' },
    'success-content': { light: '#022c22', dark: '#022c22' },
    warning: { light: '#f59e0b', dark: '#f59e0b' },
    'warning-content': { light: '#1c1917', dark: '#1c1917' },
    danger: { light: '#dc2626', dark: '#dc2626' },
    'danger-content': { light: '#ffffff', dark: '#ffffff' },
    info: { light: '#5072bb', dark: '#5072bb' },
    'info-content': { light: '#ffffff', dark: '#ffffff' },

    /** A chart's or a meter's series, in this order, never cycled and never for a state (a status hue says that):
     *  navy, teal and magenta (orange read as a warning), a set validated apart for every colour vision and 3:1 on a
     *  card in both themes. A series' words name it beside its swatch, so the hue is never the only key. */
    'series-1': { light: '#355292', dark: '#5072bb' },
    'series-2': { light: '#169c88', dark: '#169c88' },
    'series-3': { light: '#d76fad', dark: '#d76fad' },

    /** A product's halo behind its mark on a sign-in, a first run or an empty hero (the `halo` utility with
     *  `halo-factory`, `halo-server` or `halo-account`): the product's hue at 22%, fading from the top; Factory's
     *  amber a lighter step at 14%, which reads as amber, not brown, on black. */
    'halo-factory': { light: '#fbbf2424', dark: '#fbbf2424' },
    'halo-server': { light: '#5072bb38', dark: '#5072bb38' },
    'halo-account': { light: '#5072bb38', dark: '#5072bb38' },
} as const;

export type SemanticColor = keyof typeof semanticColors;

/** The categorical palette's hues (oklch hue angles, theme.css's `--category-*`), for things that differ in kind, not
 *  state: an item's kind, a media kind, a project, an initials avatar. They sit in the gaps between the status hues
 *  (red 27, amber 70, emerald 163, navy 265). Draw one with `category-<name>` (or `category-<angle>`) and a recipe:
 *  `categorical-fill` (fill oklch(.62 .12 H / .11), edge / .2, text oklch(.82 .08 H) dark, oklch(.45 .1 H) light),
 *  `categorical-text` or `categorical-icon`; a badge takes the hue as Badge's `hue`. An app picking one for a name (an
 *  avatar, a project) hashes the name onto this list. */
export const categoricalHues = {
    lime: 118,
    teal: 192,
    cyan: 222,
    violet: 300,
    magenta: 330,
    rose: 358,
} as const;

export type CategoricalHue = keyof typeof categoricalHues;

/** The glass ladder (theme.css's `--lar-glass-*` and the glass-* utilities): three tiers and a backdrop, the only
 *  translucency. Each tier is a tint at an alpha under `saturate(1.8)` and a blur; the menu and dialog carry a rim and
 *  a lit top edge. In dark the tints sit at T3 Code's balance, near black, so glass reads through blur and rim, not
 *  brightness. A Modal is two zones under the dialog's one blur: the reading zone (header, body) in the dialog's tint,
 *  and the glass zone (its sidebar) in the lighter `zone` tint; its footer lays white 3% / black 3% over the reading
 *  tint. */
export const glassTiers = {
    /** A title bar or site header: `glass-bar`, a hairline once scrolled. */
    bar: { blur: '20px', light: { tint: '#fafafa', alpha: '66%' }, dark: { tint: '#000000', alpha: '60%' } },
    /** Every menu, popover, select, tooltip and toast: `glass-menu`, a rim of white 10% and a white 4% top light. */
    menu: { blur: '28px', light: { tint: '#ffffff', alpha: '82%' }, dark: { tint: '#141414', alpha: '72%' } },
    /** Every dialog, drawer and the command palette, and a Modal's reading zone: `glass-dialog`, a rim of white 11% and
     *  a white 4% top light, no veil. */
    dialog: { blur: '32px', light: { tint: '#ffffff', alpha: '94%' }, dark: { tint: '#000000', alpha: '93%' } },
    /** A Modal's glass zone (its sidebar), under the dialog's blur: ≈ #111 over black, divided from the reading zone by
     *  white 8% / black 10%. */
    zone: { blur: '32px', light: { tint: '#f5f5f5', alpha: '80%' }, dark: { tint: '#171717', alpha: '70%' } },
    /** Under a dialog: `dialog-backdrop`, black 14% / 38% under a 4px blur. */
    backdrop: { blur: '4px', light: { tint: '#000000', alpha: '14%' }, dark: { tint: '#000000', alpha: '38%' } },
} as const;

/** The text pairs that must reach WCAG AA (4.5:1) in both themes. */
const textSurfaces = [
    'surface-page',
    'surface-raised',
    'surface-card',
    'surface-panel',
    'surface-sunken',
    'surface-overlay',
    'surface-control',
    'surface-field',
    'fill-hover',
    'fill-selected',
    'fill-muted',
] as const;

export const textPairs: readonly (readonly [SemanticColor, SemanticColor])[] = [
    ...(['fg', 'fg-soft', 'fg-muted', 'fg-lead', 'primary-fg'] as const).flatMap((fg) =>
        textSurfaces.map((surface) => [fg, surface] as const),
    ),
    ['fg-inverse', 'fg'],
    ['primary-content', 'primary'],
    ['primary-content', 'primary-fill-hover'],
    ['primary-fg', 'primary-surface'],
    ['primary-fg', 'primary-surface-hover'],
    ['fg', 'primary-surface'],
    // Meta text inside a chosen row or a notice.
    ['fg-muted', 'primary-surface'],
    // The current place: its own words, and the meta text beside them.
    ['current-fg', 'current-surface'],
    ['fg', 'current-surface'],
    ['fg-muted', 'current-surface'],
    ['fg', 'fill-chosen'],
    ...(['success', 'warning', 'danger', 'info'] as const).flatMap((status) =>
        (['fg', 'fg-soft', 'fg-muted'] as const).flatMap((fg) => [
            [fg, `${status}-surface`] as const,
            [fg, `${status}-wash`] as const,
        ]),
    ),
    ['fg', 'primary-surface-hover'],
    ['fg', 'fill-muted-hover'],
    ['fg-soft', 'fill-muted-hover'],
    ['danger-on-fill', 'danger-fill-hover'],
    ...(['success', 'warning', 'danger', 'info'] as const).flatMap((status) => [
        [`${status}-on-fill`, `${status}-fill`] as const,
        [`${status}-fg`, `${status}-surface`] as const,
        [`${status}-fg`, `${status}-wash`] as const,
        [`${status}-content`, status] as const,
        // A status's text sits on any surface but a chosen item's fill, where the item's own text carries the choice.
        ...textSurfaces
            .filter((surface) => surface !== 'fill-selected')
            .map((surface) => [`${status}-fg`, surface] as const),
    ]),
];

/** The non-text pairs that must reach 3:1 (WCAG 1.4.11): a state-carrying mark (at rest and hovered), the focus ring
 *  and a primary fill against the surfaces they sit on, and against a control's and a field's fill. A field's own edge
 *  (`line-field`), a checkbox's (`line-choice`) and a switch's off track (`fill-switch-off`) are T3 Code's quieter ones
 *  and are deliberately not held to 3:1: the fill, the label, the placeholder or the thumb tell the control apart, and
 *  its focus edge and ring (`focus`) are held to it. */
export const nonTextPairs: readonly (readonly [SemanticColor, SemanticColor])[] = [
    ...(['line-strong', 'line-strong-hover', 'focus', 'primary'] as const).flatMap((mark) =>
        (['surface-page', 'surface-raised', 'surface-card', 'surface-overlay'] as const).map((s) => [mark, s] as const),
    ),
    ...(['series-1', 'series-2', 'series-3'] as const).map((series) => [series, 'surface-card'] as const),
    ['line-strong', 'surface-control'],
    ['line-strong-hover', 'surface-control'],
    ['focus', 'surface-control'],
    ['focus', 'surface-field'],
];
