/** Apple devices write the app's shortcuts with ⌘; everything else uses Ctrl. */
export const applePlatform = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent);

/** Whether a key press is the shortcut ⌘<key> (Ctrl+<key> off Apple devices), with no other modifier. */
export function isShortcut(event: KeyboardEvent, key: string): boolean {
    return (
        event.key.toLowerCase() === key.toLowerCase() &&
        (applePlatform ? event.metaKey && !event.ctrlKey : event.ctrlKey && !event.metaKey) &&
        !event.altKey &&
        !event.shiftKey
    );
}
