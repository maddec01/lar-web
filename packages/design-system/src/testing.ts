// Helpers for apps' component tests (jsdom). Import them from `@lar-works/design-system/testing` in a test setup file.
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { dismissAllNotifications } from './feedback/ErrorNotification';
import { conceptIcons, type IconConcept } from './icons/ConceptIcons';

/** The problem-body rule for an app's own sources (see ProblemBodyRule.ts). */
export { problemBodyViolations } from './feedback/ProblemBodyRule';

/** The status-word rule for an app's own sources (see StatusWordRule.ts). */
export { statusWordViolations } from './feedback/StatusWordRule';

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

let concepts: Map<string, IconConcept> | undefined;

/** Each concept's icon by its lucide class name, such as `lucide-play` for `playback`. */
function conceptsByClass(): Map<string, IconConcept> {
    concepts ??= new Map(
        (Object.entries(conceptIcons) as [IconConcept, (typeof conceptIcons)[IconConcept]][]).map(([concept, Icon]) => [
            /class="lucide (lucide-[\w-]+)/.exec(renderToStaticMarkup(createElement(Icon)))![1]!,
            concept,
        ]),
    );

    return concepts;
}

/**
 * The icon glossary's concept whose icon `element` draws (the element itself or its first icon), or undefined when
 * it draws none of them. Apps' tests assert every toolbar button and empty state takes its icon from `conceptIcons`:
 * `expect(iconConcept(screen.getByRole('button', { name: 'Now playing' }))).toBe('playback')`.
 */
export function iconConcept(element: Element | null | undefined): IconConcept | undefined {
    const icon = element?.matches('svg.lucide') ? element : element?.querySelector('svg.lucide');
    const name = icon && [...icon.classList].find((name) => name.startsWith('lucide-'));

    return name ? conceptsByClass().get(name) : undefined;
}
