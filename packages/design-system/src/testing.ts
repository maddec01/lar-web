// Helpers for apps' component tests (jsdom). Import them from `@lar-works/design-system/testing` in a test setup file.
import { dismissAllNotifications } from './feedback/ErrorNotification';

/** Clears state the design system keeps at module level, such as the toast store, which outlives a test. */
export function resetDesignSystem() {
    dismissAllNotifications();
}

/** Adds the browser APIs the design system's components use and jsdom does not implement. */
export function installDomStubs() {
    class ResizeObserverStub implements ResizeObserver {
        disconnect(): void {}
        observe(): void {}
        unobserve(): void {}
    }

    globalThis.ResizeObserver = ResizeObserverStub;

    let objectUrlSequence = 0;

    // jsdom has no object URL registry; components that show fetched bytes need a working (if fake) `blob:` URL.
    Object.defineProperty(URL, 'createObjectURL', {
        configurable: true,
        value: () => `blob:mock-object-url-${(objectUrlSequence += 1)}`,
    });

    Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: () => undefined });
    Object.defineProperty(HTMLElement.prototype, 'hasPointerCapture', { configurable: true, value: () => false });
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { configurable: true, value: () => undefined });

    // Browsers' element scrollTo returns a promise, which an effect must not return as its cleanup.
    Object.defineProperty(HTMLElement.prototype, 'scrollTo', { configurable: true, value: () => Promise.resolve() });
    Object.defineProperty(window, 'scrollTo', { configurable: true, value: () => undefined });
}
