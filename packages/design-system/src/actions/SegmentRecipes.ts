/** The segments of the theme control (ThemeSwitch), wherever it sits: on a page or a settings row as buttons, or in a
 *  menu as `segmented` DropdownMenu radio items. One track and one segment, so the theme choice reads the same in an
 *  account menu, a site header and a settings pane, in the family's one segment shape (SegmentedControl's and
 *  ViewToggle's): an 8px track around 6px segments. */
export const segmentTrack = 'border-line bg-surface-glass inline-flex h-8 items-center gap-0.5 rounded-lg border p-0.5';

/** One segment: 28px on a 6px radius, its icon at 15px, its word at a control's 13/500, the chosen one segment-chosen.
 *  `checked` is the variant prefix that marks the chosen one (`aria-checked:` for a button, `data-[state=checked]:` for
 *  a menu item). */
export const segment = {
    button: 'text-fg-muted hover:text-fg aria-checked:segment-chosen focus-ring inline-flex h-7 items-center justify-center gap-1.5 rounded-md text-(length:--text-ui) font-medium transition-colors [&_svg]:size-3.75',
    menuItem:
        'text-fg-muted focus:text-fg focus:bg-fill-hover data-[state=checked]:segment-chosen inline-flex size-7 min-h-7 items-center justify-center rounded-md p-0 transition-colors [&>span]:hidden [&>svg]:size-3.75',
} as const;
