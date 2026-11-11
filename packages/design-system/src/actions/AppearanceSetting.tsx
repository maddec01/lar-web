import { SettingsRow } from '../forms/SettingsRow';
import { useDesignSystemLabels } from '../foundations/DesignSystemProvider';
import type { ThemePreference } from '../foundations/Theme';
import { ThemeSwitch } from './ThemeSwitch';

interface AppearanceSettingProps {
    /** The chosen scheme, from the app's theme controller (createThemeController's `useTheme`). */
    value: ThemePreference;
    /** Stores and applies the scheme the reader picks; it applies at once, the control being its own feedback. */
    onChange: (value: ThemePreference) => void;
    /** What the setting does, in a muted line under its name, such as "Follow the system, or always use light or
     *  dark." */
    description?: string;
    /** The row's name where the app calls it something else; the design system's theme label ("Appearance")
     *  otherwise. */
    label?: string;
    /** The row's element id, for a settings search or a link to scroll to it. */
    id?: string;
}

/** Settings › General › Appearance, the same row in every app: its name and description, and the ThemeSwitch's three
 *  segments (Follow system, Light, Dark) at its end. Drop it into the General page's group. */
export function AppearanceSetting({ value, onChange, description, label, id }: AppearanceSettingProps) {
    const labels = useDesignSystemLabels().theme;
    const name = label ?? labels.label;

    return (
        <SettingsRow id={id} label={name} description={description}>
            <ThemeSwitch value={value} onChange={onChange} label={name} />
        </SettingsRow>
    );
}
