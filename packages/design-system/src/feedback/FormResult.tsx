import type { ReactNode } from 'react';

import { Alert } from './Alert';

/**
 * A form's result, such as a dialog's validation message or what its submit did. It stays mounted as a live region,
 * so screen readers hear each new message; empty, it has no border, padding or icon. With no tone it is a warning, as
 * a validation message is. Line breaks in `text` show.
 */
export function FormResult({
    id,
    text,
    tone = 'warning',
    children,
    list,
}: {
    id: string;
    text: string;
    tone?: 'success' | 'warning' | 'error' | undefined;
    /** Shown under the text. */
    children?: ReactNode;
    /** A list under the text, such as the paths a call touched, indented and wrapping normally. */
    list?: readonly ReactNode[] | undefined;
}) {
    return (
        <Alert
            id={id}
            tone={tone === 'error' ? 'danger' : tone}
            data-tone={tone}
            role="status"
            aria-atomic="true"
            showIcon={Boolean(text)}
            className={text ? 'wrap-anywhere whitespace-pre-line' : 'border-0 p-0'}
        >
            {text && (
                <>
                    {text}
                    {children}
                    {list && list.length > 0 && (
                        <ul className="pl-4.5 whitespace-normal">
                            {list.map((entry, index) => (
                                <li key={index}>{entry}</li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </Alert>
    );
}
