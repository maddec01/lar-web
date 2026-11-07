export const columnWidths = {
    primary: 'minmax(0, 2.5fr)',
    secondary: 'minmax(0, 1.5fr)',
    value: 'minmax(0, 1fr)',
    compact: '4rem',
    numeric: '5rem',
    index: '2.5rem',
    action: '1.5rem',
    wide: '14rem',
} as const;

export const columnBreakpoints = { primary: 0, secondary: 640, tertiary: 900 } as const;
