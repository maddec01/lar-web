import { CheckIcon, CopyIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '../actions/Button';
import { IconButton } from '../actions/IconButton';

const COPIED_FEEDBACK_MS = 1500;

interface CopyButtonProps {
    /** Says it copied, such as "Copied", as its name and tooltip for a moment after a copy. */
    copiedLabel: string;
    /** Names what it copies, such as "Copy the address". */
    label: string;
    /** The text it puts on the clipboard. */
    value: string;
    /** `icon` is a copy icon that turns into a tick; `text` is a compact button that reads `copyText`, then
     *  `copiedLabel`, as a dense tool's Copy beside a command. */
    presentation?: 'icon' | 'text';
    /** The text presentation's word before a copy, such as "Copy"; `label` stays its accessible name. */
    copyText?: string;
    /** Called after each copy, such as to announce it in a live region. */
    onCopied?: () => void;
}

/** Copies `value`. The LAN admin also runs over HTTP, where the async clipboard API is unavailable, so it falls back
 *  to a selected textarea. */
export function CopyButton({
    copiedLabel,
    label,
    value,
    presentation = 'icon',
    copyText = label,
    onCopied,
}: CopyButtonProps) {
    const [copiedValue, setCopiedValue] = useState<string | null>(null);
    const [copying, setCopying] = useState(false);
    const copied = copiedValue === value;

    useEffect(() => {
        if (copiedValue === null) return undefined;

        const timer = window.setTimeout(() => setCopiedValue(null), COPIED_FEEDBACK_MS);

        return () => window.clearTimeout(timer);
    }, [copiedValue]);

    const copy = async () => {
        setCopying(true);

        let done = false;

        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(value);
                done = true;
            } else {
                done = copySelection(value);
            }
        } catch {
            done = copySelection(value);
        } finally {
            setCopiedValue(done ? value : null);
            setCopying(false);
        }

        if (done) onCopied?.();
    };

    if (presentation === 'text')
        return (
            <Button variant="secondary" size="sm" aria-label={label} onClick={() => void copy()}>
                {copied ? copiedLabel : copyText}
            </Button>
        );

    return (
        <IconButton
            icon={copied ? <CheckIcon /> : <CopyIcon />}
            aria-label={copied ? copiedLabel : label}
            title={copied ? copiedLabel : label}
            loading={copying}
            onClick={copy}
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
