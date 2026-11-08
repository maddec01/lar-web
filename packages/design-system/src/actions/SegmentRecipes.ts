/** The pill segments of the theme control (ThemeSwitch), wherever it sits: on a page or a settings row as buttons, or
 *  in a menu as `segmented` DropdownMenu radio items. One track and one segment, so the theme choice reads the same
 *  in an account menu, a site header and a settings pane. */
export const segmentTrack =
    'border-line bg-surface-glass inline-flex h-8 items-center gap-0.5 rounded-full border p-0.5';

/** One segment: 28px, its icon at 15px, the chosen one on the selected fill and raised. `checked` is the variant
 *  prefix that marks the chosen one (`aria-checked:` for a button, `data-[state=checked]:` for a menu item). */
export const segment = {
    button: 'text-fg-muted hover:text-fg aria-checked:bg-fill-selected aria-checked:text-fg aria-checked:shadow-(--shadow-raised) focus-ring inline-flex h-7 items-center justify-center gap-1.5 rounded-full text-xs transition-colors [&_svg]:size-3.75',
    menuItem:
        'text-fg-muted focus:text-fg focus:bg-fill-hover data-[state=checked]:bg-fill-selected data-[state=checked]:text-fg data-[state=checked]:shadow-(--shadow-raised) inline-flex size-7 min-h-7 items-center justify-center rounded-full p-0 transition-colors [&>span]:hidden [&>svg]:size-3.75',
} as const;
