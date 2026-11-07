/** A small round mark in a colour that comes with data, such as a tracker label's; grey when it has none. */
export function ColorDot({ color }: { color?: string | undefined }) {
    return (
        <span
            aria-hidden="true"
            className="bg-base-400 size-2 shrink-0 rounded-full"
            style={color ? { background: color } : undefined}
        />
    );
}
