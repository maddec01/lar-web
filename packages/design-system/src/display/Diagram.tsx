import { useEffect, useId, useRef, useState } from 'react';

interface DiagramProps {
    /** The diagram's text, such as a Mermaid flowchart. */
    source: string;
    /** Draws `source` as an SVG document's markup; `id` is unique to this diagram. A rejection shows `failedLabel`. */
    draw: (source: string, id: string) => Promise<string>;
    /** The drawing's accessible name. */
    label: string;
    /** Shown in place of the drawing when `draw` fails. */
    failedLabel: string;
    /** The disclosure that shows the source under the drawing. */
    sourceLabel: string;
}

/** A drawn diagram in a bordered figure, with its source under it in a disclosure. The SVG comes from `draw`, so the
 *  design system needs no diagram library; a drawing too wide for its figure scrolls inside it. */
export function Diagram({ source, draw, label, failedLabel, sourceLabel }: DiagramProps) {
    const id = useId().replace(/[^a-zA-Z0-9]/g, '');
    const host = useRef<HTMLDivElement>(null);
    // The source the diagram failed on, so a new source draws afresh.
    const [failed, setFailed] = useState<string | null>(null);

    useEffect(() => {
        const drawn = new AbortController();

        draw(source, id).then(
            (svg) => {
                if (!drawn.signal.aborted && host.current) host.current.innerHTML = svg;
            },
            () => {
                if (!drawn.signal.aborted) setFailed(source);
            },
        );

        return () => drawn.abort();
    }, [draw, id, source]);

    return (
        <figure className="m-0 grid min-w-0 gap-2 rounded-lg border p-3" data-map-diagram>
            {failed === source ? (
                <p role="status" className="text-base-700 m-0 text-xs">
                    {failedLabel}
                </p>
            ) : (
                <div
                    ref={host}
                    className="overflow-auto [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full"
                    role="img"
                    aria-label={label}
                />
            )}
            <details className="text-base-700 text-xs">
                <summary className="cursor-pointer">{sourceLabel}</summary>
                <pre className="overflow-auto pt-2 whitespace-pre-wrap">{source}</pre>
            </details>
        </figure>
    );
}
