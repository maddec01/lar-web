/** The semantic colour layer's values, light and dark, each a step of its theme's one twelve-step neutral ramp or a
 *  hue (theme.css). Roles that share a value in one theme (`fill-hover` and `fill-muted`, `fg-lead` and `fg-muted`
 *  in light; `line-hover` and `line-control` in both) are kept apart on purpose, each documented below: they mean
 *  different things and may move separately. This is the one table theme.css's palettes are checked against
 *  (tokens.test.ts) and the docs draw their swatches from. Each name is a Tailwind colour (`--color-<name>`), so
 *  `bg-surface-raised`, `text-fg-muted`, `border-line-strong` and `bg-danger-fill text-danger-on-fill` all work. */
export const semanticColors = {
    /** The page behind everything. */
    'surface-page': { light: '#fcfcfc', dark: '#0a0a0a' },
    /** A card, panel or field on the page. */
    'surface-raised': { light: '#ffffff', dark: '#111111' },
    /** A card, panel or grouped list on the page (the `surface-card` utility, with `line-card` and `--shadow-card`):
     *  `surface-raised` today, its own role so cards can move apart from fields and controls. */
    'surface-card': { light: '#ffffff', dark: '#111111' },
    /** A well inside a raised surface: a panel's footer, a code block, a quiet group. */
    'surface-sunken': { light: '#f9f9fa', dark: '#161616' },
    /** A menu, popover, tooltip or dialog, above the page. */
    'surface-overlay': { light: '#ffffff', dark: '#161616' },
    /** The fill of a control on a surface: a text field, select, checkbox, radio or outlined button. */
    'surface-control': { light: '#ffffff', dark: '#161616' },
    /** A translucent `surface-raised` for a panel over a backdrop or artwork (the website's cards and bands). Text on
     *  it is checked against `surface-raised`, the colour it tends to. */
    'surface-glass': { light: '#ffffffb3', dark: '#11111180' },
    /** A row or control under the pointer. A state, not a thing: it equals `fill-muted` in light (zinc-100, the
     *  lightest fill that reads on white), but the two are separate roles, as the dark palette shows, where a hover
     *  sits a step under a chip so a chip on a hovered row keeps its fill. (In light, a chip on a hovered row keeps
     *  its hairline edge.) */
    'fill-hover': { light: '#f4f4f5', dark: '#1c1c1c' },
    /** The chosen item in a tab bar, segmented control, sidebar or menu: a step deeper than `fill-hover`, so the
     *  hovered and the chosen item differ. In dark it shares its step with `fill-muted` (a lighter one would drop
     *  muted text on it under 4.5:1); the roles stay apart. */
    'fill-selected': { light: '#eeeef0', dark: '#222222' },
    /** A quiet neutral fill that marks a thing rather than a state: a neutral badge or chip, a key cap, a subtle
     *  button, a tone tile. */
    'fill-muted': { light: '#f4f4f5', dark: '#222222' },
    /** `fill-muted` under the pointer (a subtle button's hover). */
    'fill-muted-hover': { light: '#e9e9ec', dark: '#282828' },
    /** The empty part of a progress bar, meter or segmented track; what fills it carries the state. */
    track: { light: '#e4e4e7', dark: '#282828' },

    /** Body text and icons. */
    fg: { light: '#27272a', dark: '#f5f5f5' },
    /** Secondary text that still reads as content. */
    'fg-soft': { light: '#3f3f46', dark: '#c7c7c7' },
    /** Meta text, captions, placeholders and quiet icons. */
    'fg-muted': { light: '#6b6b74', dark: '#8a8a8a' },
    /** Muted long-form text (a lead under a headline, prose, a caption under a hero). Its own role, not `fg-muted`:
     *  the same grey in light, where it already reads at 4.5:1 on every surface, but a step lighter in dark, where long
     *  runs of mid-grey on near-black tire the eye; meta text stays at `fg-muted` there so it recedes. */
    'fg-lead': { light: '#6b6b74', dark: '#a1a1a1' },
    /** Text on an `fg`-coloured fill. */
    'fg-inverse': { light: '#fcfcfc', dark: '#0a0a0a' },

    /** A divider or a container's edge: decoration, which needs no contrast of its own. */
    line: { light: '#e4e4e7', dark: '#222222' },
    /** A card's edge (`surface-card`): half a step deeper than `line` in light and a step lighter in dark, so a card
     *  holds its shape on the page as the website's do, while dividers inside it stay at `line`. */
    'line-card': { light: '#dedee3', dark: '#282828' },
    /** `line` under the pointer: a card that opens, a hovered panel. A state of `line`; its value is the next step of
     *  the ramp, which happens to be `line-control`'s, but the roles move separately (a hover could deepen without
     *  every outlined button deepening with it). */
    'line-hover': { light: '#d4d4d8', dark: '#282828' },
    /** An outlined button's or chip's edge, at rest: a step deeper than `line`, so a control reads apart from a card's
     *  edge, still decoration, as its label identifies it. Shares its value with `line-hover` (see there). */
    'line-control': { light: '#d4d4d8', dark: '#282828' },
    /** An edge that tells a control apart or carries its state (a checkbox, a switch's track): 3:1 on the page. */
    'line-strong': { light: '#8b8b94', dark: '#6b6b6b' },
    /** `line-strong` under the pointer: a text field or an outlined button being hovered. In light it takes the
     *  muted text's step; the roles move separately. */
    'line-strong-hover': { light: '#6b6b74', dark: '#8a8a8a' },
    /** A scrollbar's thumb, translucent so it reads on any surface, and under the pointer. Decoration. */
    'scrollbar-thumb': { light: '#00000026', dark: '#ffffff14' },
    'scrollbar-thumb-hover': { light: '#00000040', dark: '#ffffff1f' },
    /** The keyboard focus ring. */
    focus: { light: '#355292', dark: '#5072bb' },

    /** Lar's mark navy: a filled primary control. */
    primary: { light: '#355292', dark: '#5072bb' },
    /** Text on a primary fill. */
    'primary-content': { light: '#ffffff', dark: '#ffffff' },
    /** The primary hue as text, a link or an icon on a surface. */
    'primary-fg': { light: '#355292', dark: '#9db7eb' },
    /** A primary tint under `primary-fg`: a chosen option, a tinted button. */
    'primary-surface': { light: '#ebeef4', dark: '#1c2230' },
    /** `primary-surface` under the pointer or while its popup is open (a tinted button, a chosen choice). */
    'primary-surface-hover': { light: '#dbe0eb', dark: '#25304a' },
    /** `primary` under the pointer: a primary button being hovered. */
    'primary-fill-hover': { light: '#49639d', dark: '#4a68aa' },

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
    'info-edge': { light: '#3b82f673', dark: '#3b82f673' },
    'info-ring': { light: '#3b82f640', dark: '#3b82f640' },

    'success-fill': { light: '#047857', dark: '#047857' },
    'success-on-fill': { light: '#ffffff', dark: '#ffffff' },
    'success-fg': { light: '#047857', dark: '#34d399' },
    'success-surface': { light: '#ecfdf5', dark: '#121d18' },

    'warning-fill': { light: '#f59e0b', dark: '#f59e0b' },
    'warning-on-fill': { light: '#1c1917', dark: '#1c1917' },
    'warning-fg': { light: '#b45309', dark: '#fbbf24' },
    'warning-surface': { light: '#fffbeb', dark: '#1f1b12' },

    'danger-fill': { light: '#dc2626', dark: '#dc2626' },
    /** `danger-fill` under the pointer: a destructive button being hovered. */
    'danger-fill-hover': { light: '#c22121', dark: '#c22121' },
    'danger-on-fill': { light: '#ffffff', dark: '#ffffff' },
    'danger-fg': { light: '#b91c1c', dark: '#f87171' },
    'danger-surface': { light: '#fef2f2', dark: '#221616' },

    'info-fill': { light: '#2563eb', dark: '#2563eb' },
    'info-on-fill': { light: '#ffffff', dark: '#ffffff' },
    'info-fg': { light: '#1d4ed8', dark: '#60a5fa' },
    'info-surface': { light: '#eff6ff', dark: '#141b26' },

    /** The status hues themselves (ninna-ui's names), for dots, bars and tints, never for text: their `-content`
     *  pair is what ninna-ui writes on a solid fill of the hue. */
    success: { light: '#10b981', dark: '#10b981' },
    'success-content': { light: '#022c22', dark: '#022c22' },
    warning: { light: '#f59e0b', dark: '#f59e0b' },
    'warning-content': { light: '#1c1917', dark: '#1c1917' },
    danger: { light: '#dc2626', dark: '#ef4444' },
    'danger-content': { light: '#ffffff', dark: '#190404' },
    info: { light: '#3b82f6', dark: '#3b82f6' },
    'info-content': { light: '#0b1a33', dark: '#0b1a33' },

    /** A chart's or a meter's series, in this order, never cycled and never for a state (a status hue says that):
     *  navy, teal and orange, a set validated apart for every colour vision and 3:1 on a card in both themes. A
     *  series' words name it beside its swatch, so the hue is never the only key. */
    'series-1': { light: '#355292', dark: '#5072bb' },
    'series-2': { light: '#169c88', dark: '#169c88' },
    'series-3': { light: '#d9663f', dark: '#d9663f' },
} as const;

export type SemanticColor = keyof typeof semanticColors;

/** The text pairs that must reach WCAG AA (4.5:1) in both themes. */
const textSurfaces = [
    'surface-page',
    'surface-raised',
    'surface-card',
    'surface-sunken',
    'surface-overlay',
    'surface-control',
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
    ...(['success', 'warning', 'danger', 'info'] as const).flatMap((status) =>
        (['fg', 'fg-soft', 'fg-muted'] as const).map((fg) => [fg, `${status}-surface`] as const),
    ),
    ['fg', 'primary-surface-hover'],
    ['fg', 'fill-muted-hover'],
    ['fg-soft', 'fill-muted-hover'],
    ['danger-on-fill', 'danger-fill-hover'],
    ...(['success', 'warning', 'danger', 'info'] as const).flatMap((status) => [
        [`${status}-on-fill`, `${status}-fill`] as const,
        [`${status}-fg`, `${status}-surface`] as const,
        [`${status}-content`, status] as const,
        // A status's text sits on any surface but a chosen item's fill, where the item's own text carries the choice.
        ...textSurfaces
            .filter((surface) => surface !== 'fill-selected')
            .map((surface) => [`${status}-fg`, surface] as const),
    ]),
];

/** The non-text pairs that must reach 3:1 (WCAG 1.4.11): a control's edge (at rest and hovered), the focus ring and a
 *  primary fill against the surfaces they sit on, and a control's edge against the field it bounds. */
export const nonTextPairs: readonly (readonly [SemanticColor, SemanticColor])[] = [
    ...(['line-strong', 'line-strong-hover', 'focus', 'primary'] as const).flatMap((mark) =>
        (['surface-page', 'surface-raised', 'surface-sunken', 'surface-overlay'] as const).map(
            (s) => [mark, s] as const,
        ),
    ),
    ...(['series-1', 'series-2', 'series-3'] as const).map((series) => [series, 'surface-card'] as const),
    ['line-strong', 'surface-control'],
    ['line-strong-hover', 'surface-control'],
    ['focus', 'surface-control'],
];
