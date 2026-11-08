import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import type { KeyboardEvent } from 'react';

import { useSegmentedKeyboard } from '../forms/useSegmentedKeyboard';
import { useDesignSystemLabels } from '../foundations/DesignSystemProvider';
import { isThemePreference, type ThemePreference } from '../foundations/Theme';
import { DropdownMenu } from '../overlays/DropdownMenu';
import { segment, segmentTrack } from './SegmentRecipes';

const choices = [
    { value: 'system', Icon: MonitorIcon },
    { value: 'light', Icon: SunIcon },
    { value: 'dark', Icon: MoonIcon },
] as const;

/** Three small segments for the colour scheme: follow the system, light or dark. The one theme control of every
 *  app: in a settings row or a site header as it is, and in a menu (an account menu) with `placement="menu"`, where
 *  it is the menu's labelled row and its segments are the menu's own radio items (arrow keys move between them, and
 *  choosing keeps the menu open), drawn the same. */
export function ThemeSwitch({
    value,
    onChange,
    labelsVisible = false,
    placement = 'inline',
    label,
}: {
    /** Show each choice’s text, for navigation panels and other places without hover. */
    labelsVisible?: boolean;
    /** The chosen scheme: `system`, `light` or `dark`. */
    value: ThemePreference;
    /** Called with the scheme the reader picks. */
    onChange: (value: ThemePreference) => void;
    /** `inline` (the default) anywhere on a page; `menu` inside a DropdownMenu.Content, as its labelled row. */
    placement?: 'inline' | 'menu';
    /** The control's name (and, in a menu, its row's words) where the app calls it something else, such as
     *  "Appearance"; the design system's theme label otherwise. */
    label?: string;
}) {
    const labels = useDesignSystemLabels().theme;
    const name = label ?? labels.label;
    const { group, stop, onKeyDown } = useSegmentedKeyboard(
        choices.map((choice) => choice.value),
        value,
        onChange,
    );

    // Arrows belong to the radio group; Tab leaves it as one stop and reaches the surrounding menu entries.
    const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key !== 'Tab') return onKeyDown(event);

        const control = group.current;
        const menu = control?.closest('[role="menu"]');
        const entries = [
            ...(menu?.querySelectorAll<HTMLElement>('[role^="menuitem"]:not([data-disabled])') ?? []),
        ].filter((entry) => !control?.contains(entry));
        const target = event.shiftKey
            ? (entries.findLast((entry) =>
                  Boolean(entry.compareDocumentPosition(control!) & Node.DOCUMENT_POSITION_FOLLOWING),
              ) ?? entries.at(-1))
            : (entries.find((entry) =>
                  Boolean(entry.compareDocumentPosition(control!) & Node.DOCUMENT_POSITION_PRECEDING),
              ) ?? entries[0]);

        if (!target) return;

        event.preventDefault();
        event.stopPropagation();
        target.focus();
    };

    if (placement === 'menu')
        return (
            <DropdownMenu.ControlRow label={name}>
                <DropdownMenu.RadioGroup
                    ref={group}
                    onKeyDownCapture={onMenuKeyDown}
                    aria-label={name}
                    presentation="segmented"
                    value={value}
                    onValueChange={(next) => {
                        if (isThemePreference(next)) onChange(next);
                    }}
                >
                    {choices.map(({ value: choice, Icon }) => (
                        <DropdownMenu.RadioItem
                            key={choice}
                            presentation="segmented"
                            value={choice}
                            data-value={choice}
                            aria-label={labels[choice]}
                            title={labels[choice]}
                        >
                            <Icon />
                        </DropdownMenu.RadioItem>
                    ))}
                </DropdownMenu.RadioGroup>
            </DropdownMenu.ControlRow>
        );

    return (
        <div ref={group} onKeyDown={onKeyDown} role="radiogroup" aria-label={name} className={segmentTrack}>
            {choices.map(({ value: choice, Icon }) => (
                <button
                    key={choice}
                    tabIndex={choice === stop ? 0 : -1}
                    data-value={choice}
                    type="button"
                    role="radio"
                    aria-checked={value === choice}
                    aria-label={labels[choice]}
                    title={labels[choice]}
                    onClick={() => onChange(choice)}
                    className={`${segment.button} ${labelsVisible ? 'px-2.5' : 'w-7'}`}
                >
                    <Icon />
                    {labelsVisible ? <span>{labels[choice]}</span> : null}
                </button>
            ))}
        </div>
    );
}
