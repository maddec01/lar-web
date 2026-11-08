// One icon per concept: the icon glossary (docs/Icons.mdx) as code. An app draws a concept's icon from here, so
// "activity" is the pulse everywhere and the pulse means nothing else. An app extends the glossary with its own
// concepts (`{ ...conceptIcons, scans: ScanLineIcon }`) and never redraws one of these.
import {
    ActivityIcon,
    ArchiveIcon,
    CircleFadingArrowUpIcon,
    type LucideIcon,
    LogsIcon,
    RefreshCwIcon,
    SearchIcon,
    SettingsIcon,
    StethoscopeIcon,
    UsersIcon,
} from 'lucide-react';

/** Each shared concept's one icon. */
export const conceptIcons = {
    /** Work running in the background: background tasks, an activity toolbar button. Pulse. */
    activity: ActivityIcon,
    /** Checking the app's own tools and connections: Diagnostics. Stethoscope. */
    diagnostics: StethoscopeIcon,
    /** A newer version of the app: Updates. Circle with an up arrow. */
    updates: CircleFadingArrowUpIcon,
    /** Reload what is shown, or try a failed step again. Circular arrows; never an update. */
    refresh: RefreshCwIcon,
    /** General settings, and the way into settings. Gear. */
    settings: SettingsIcon,
    /** People with access: users, invitations and permissions. Users. */
    users: UsersIcon,
    /** Log files. Logs. */
    logs: LogsIcon,
    /** Put away, kept but out of the way: Archive. Archive box. */
    archive: ArchiveIcon,
    /** Search and the command palette. Magnifier. */
    search: SearchIcon,
} as const satisfies Record<string, LucideIcon>;

/** A concept that has its one icon. */
export type IconConcept = keyof typeof conceptIcons;
