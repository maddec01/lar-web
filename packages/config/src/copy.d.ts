export interface UiCopyIssue {
    path: string;
    rule: 'apostrophe' | 'contraction' | 'retry' | 'empty-search' | 'empty-state' | '404-heading';
    message: string;
    value: string;
}

/** Validate nested locale strings against Lar’s shared writing contract. */
export declare function checkUiCopy(
    strings: unknown,
    options?: {
        locale?: string;
        /** Exact paths of third-party quotations/names, reviewed by the app. */
        ignorePaths?: readonly string[];
    },
): UiCopyIssue[];
