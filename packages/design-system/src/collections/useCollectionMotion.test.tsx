import { render } from '@testing-library/react';
import { useRef } from 'react';
import { afterEach, expect, it, vi } from 'vite-plus/test';

import { useCollectionMotion } from './useCollectionMotion';

afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    Reflect.deleteProperty(HTMLElement.prototype, 'animate');
    Reflect.deleteProperty(HTMLElement.prototype, 'getAnimations');
});

function Collection({ ids, columns = 2 }: { ids: string[]; columns?: number }) {
    const root = useRef<HTMLDivElement>(null);

    useCollectionMotion(root);

    return (
        <div ref={root}>
            {ids.map((id, index) => (
                <div
                    key={id}
                    data-collection-key={id}
                    data-index={index}
                    style={{ left: (index % columns) * 180, top: Math.floor(index / columns) * 230 }}
                >
                    {id}
                </div>
            ))}
        </div>
    );
}

it.each([false, true])(
    'fades initial layout and moves existing cards for insertions, reduced motion: %s',
    (reduced) => {
        const animate = vi.fn();

        vi.stubGlobal('matchMedia', () => ({ matches: reduced }));
        Object.defineProperty(HTMLElement.prototype, 'animate', { configurable: true, value: animate });
        Object.defineProperty(HTMLElement.prototype, 'getAnimations', { configurable: true, value: () => [] });
        vi.spyOn(HTMLElement.prototype, 'offsetLeft', 'get').mockImplementation(function (this: HTMLElement) {
            return parseFloat(this.style.left);
        });
        vi.spyOn(HTMLElement.prototype, 'offsetTop', 'get').mockImplementation(function (this: HTMLElement) {
            return parseFloat(this.style.top);
        });

        const { container, rerender } = render(<Collection ids={['a', 'b', 'c']} />);
        const card = container.querySelector('[data-collection-key="b"]');

        if (reduced) expect(animate).not.toHaveBeenCalled();
        else {
            expect(animate).toHaveBeenCalledTimes(3);
            expect(
                animate.mock.calls.every(([frames]) => frames.every((frame: Keyframe) => !('transform' in frame))),
            ).toBe(true);
            expect(animate).toHaveBeenCalledWith([{ opacity: 0 }, { opacity: 1 }], expect.any(Object));
        }

        animate.mockClear();
        rerender(<Collection ids={['a', 'b', 'c']} columns={3} />);
        expect(animate).not.toHaveBeenCalled();
        rerender(<Collection ids={['a', 'b', 'c']} />);
        expect(animate).not.toHaveBeenCalled();

        animate.mockClear();
        rerender(<Collection ids={['new', 'a', 'b', 'c']} />);
        expect(container.querySelector('[data-collection-key="b"]')).toBe(card);

        if (reduced) expect(animate).not.toHaveBeenCalled();
        else
            expect(animate).toHaveBeenCalledWith(
                [{ transform: 'translate(180px, -230px)' }, { transform: 'translate(0, 0)' }],
                expect.objectContaining({ duration: 280 }),
            );
    },
);
