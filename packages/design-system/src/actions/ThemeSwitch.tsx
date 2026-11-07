import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';

import { useDesignSystemLabels } from '../foundations/DesignSystemProvider';
import { tabbable } from '../foundations/KeyboardFocus';
import type { ThemePreference } from '../foundations/Theme';

const choices = [
    { value: 'system', Icon: MonitorIcon },
    { value: 'light', Icon: SunIcon },
    { value: 'dark', Icon: MoonIcon },
] as const;

/** Three small segments for the colour scheme: follow the system, light or dark. */
export function ThemeSwitch({
    value,
    onChange,
}: {
    value: ThemePreference;
    onChange: (value: ThemePreference) => void;
}) {
    const labels = useDesignSystemLabels().theme;

    return (
        <div
            role="radiogroup"
            aria-label={labels.label}
            className="border-base-300 bg-base-100/70 dark:bg-base-200/60 inline-flex h-8 items-center gap-0.5 rounded-full border p-0.5"
        >
            {choices.map(({ value: choice, Icon }) => (
                <button
                    key={choice}
                    {...tabbable}
                    type="button"
                    role="radio"
                    aria-checked={value === choice}
                    aria-label={labels[choice]}
                    title={labels[choice]}
                    onClick={() => onChange(choice)}
                    className="text-base-600 hover:text-base-content aria-checked:bg-base-200 aria-checked:text-base-content focus-visible:outline-primary dark:aria-checked:bg-base-400/70 inline-flex size-7 items-center justify-center rounded-full transition-colors focus-visible:outline-2 aria-checked:shadow-xs/10 [&_svg]:size-[15px]"
                >
                    <Icon />
                </button>
            ))}
        </div>
    );
}
