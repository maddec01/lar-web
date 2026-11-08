// Helpers for apps' component tests (jsdom). Import them from `@lar-works/design-system/testing` in a test setup file.
import { type ComponentType, createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { dismissAllNotifications } from './feedback/ErrorNotification';
import { conceptIcons } from './icons/ConceptIcons';

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

const conceptsByGlossary = new WeakMap<object, Map<string, string>>();

/** Each concept's icon in `glossary` by its lucide class name, such as `lucide-settings` for `settings`. */
function conceptsByClass(glossary: Record<string, ComponentType>): Map<string, string> {
    let concepts = conceptsByGlossary.get(glossary);

    if (!concepts) {
        concepts = new Map(
            Object.entries(glossary).map(([concept, Icon]) => [
                /class="lucide (lucide-[\w-]+)/.exec(renderToStaticMarkup(createElement(Icon)))![1]!,
                concept,
            ]),
        );
        conceptsByGlossary.set(glossary, concepts);
    }

    return concepts;
}

/**
 * The concept whose icon `element` draws (the element itself or its first icon), or undefined when it draws none of
 * them. `glossary` is the icon glossary to read, the design system's `conceptIcons` unless an app passes its own
 * (which extends it). Apps' tests assert every toolbar button and empty state takes its icon from the glossary:
 * `expect(iconConcept(screen.getByRole('button', { name: 'Settings' }), conceptIcons)).toBe('settings')`.
 */
export function iconConcept<Glossary extends Record<string, ComponentType> = typeof conceptIcons>(
    element: Element | null | undefined,
    glossary: Glossary = conceptIcons as unknown as Glossary,
): (keyof Glossary & string) | undefined {
    const icon = element?.matches('svg.lucide') ? element : element?.querySelector('svg.lucide');
    const name = icon && [...icon.classList].find((name) => name.startsWith('lucide-'));

    return name ? (conceptsByClass(glossary).get(name) as (keyof Glossary & string) | undefined) : undefined;
}
