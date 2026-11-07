import { CheckIcon, CopyIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { IconButton } from '../actions/IconButton';

const COPIED_FEEDBACK_MS = 1500;

interface CopyButtonProps {
    copiedLabel: string;
    label: string;
    value: string;
}

/** The LAN admin also runs over HTTP, where the async clipboard API is unavailable. */
export function CopyButton({ copiedLabel, label, value }: CopyButtonProps) {
    const [copiedValue, setCopiedValue] = useState<string | null>(null);
    const [copying, setCopying] = useState(false);
    const copied = copiedValue === value;

    useEffect(() => {
        if (copiedValue === null) return undefined;

        const timer = window.setTimeout(() => setCopiedValue(null), COPIED_FEEDBACK_MS);

        return () => window.clearTimeout(timer);
    }, [copiedValue]);

    return (
        <IconButton
            icon={copied ? <CheckIcon /> : <CopyIcon />}
            aria-label={copied ? copiedLabel : label}
            title={copied ? copiedLabel : label}
            loading={copying}
            onClick={async () => {
                setCopying(true);

                try {
                    if (navigator.clipboard) {
                        await navigator.clipboard.writeText(value);
                        setCopiedValue(value);
                    } else {
                        setCopiedValue(copySelection(value) ? value : null);
                    }
                } catch {
                    setCopiedValue(copySelection(value) ? value : null);
                } finally {
                    setCopying(false);
                }
            }}
            tone={copied ? 'success' : 'neutral'}
        />
    );
}

function copySelection(value: string): boolean {
    if (typeof document.execCommand !== 'function') return false;

    const previousFocus = document.activeElement;
    const input = document.createElement('textarea');

    input.value = value;
    input.readOnly = true;
    input.className = 'fixed -left-full top-0 opacity-0';
    document.body.append(input);
    input.focus({ preventScroll: true });
    input.select();

    try {
        return document.execCommand('copy');
    } catch {
        return false;
    } finally {
        input.remove();

        if (previousFocus instanceof HTMLElement) previousFocus.focus();
    }
}
