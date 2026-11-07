/** Numbered instructions in reading order. */
export function StepList({ steps }: { steps: readonly string[] }) {
    return (
        <ol className="text-base-800 list-decimal space-y-1 pl-5 text-sm">
            {steps.map((step) => (
                <li key={step}>{step}</li>
            ))}
        </ol>
    );
}
