/** Numbered instructions in reading order. */
export function StepList({
    steps,
}: {
    /** The steps, in order, each a sentence. */
    steps: readonly string[];
}) {
    return (
        <ol className="text-fg-soft list-decimal space-y-1 pl-5 text-sm">
            {steps.map((step) => (
                <li key={step}>{step}</li>
            ))}
        </ol>
    );
}
