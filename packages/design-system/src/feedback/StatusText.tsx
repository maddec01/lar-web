const tones = {
    success: 'text-(--lar-success-text)',
    warning: 'text-(--lar-warning-text)',
    danger: 'text-(--lar-danger-text)',
    muted: 'text-base-700',
} as const;

export type StatusTextTone = keyof typeof tones;

/** A check's state as a short coloured word after a dot, such as "● Installed"; muted for a check that didn't run. */
export function StatusText({ text, tone }: { text: string; tone: StatusTextTone }) {
    return <span className={`tool-state text-xs font-medium whitespace-nowrap ${tones[tone]}`}>● {text}</span>;
}
