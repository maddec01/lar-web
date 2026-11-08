// One icon per concept, in every app: the icon glossary (docs/Icons.mdx) as code. Apps draw a concept's icon from
// here, so "activity" is the pulse everywhere and the pulse means nothing else.
import {
    ActivityIcon,
    ArchiveIcon,
    CircleFadingArrowUpIcon,
    CircleStopIcon,
    FolderGit2Icon,
    GlobeIcon,
    LibraryIcon,
    type LucideIcon,
    LogsIcon,
    PlayIcon,
    PlugIcon,
    RefreshCwIcon,
    ScanLineIcon,
    SearchIcon,
    SettingsIcon,
    ShieldCheckIcon,
    SlidersHorizontalIcon,
    SparklesIcon,
    SquareDashedIcon,
    StethoscopeIcon,
    TagIcon,
    UserRoundIcon,
    UsersIcon,
} from 'lucide-react';

/** Each concept's one icon. */
export const conceptIcons = {
    /** Work running in the background: Background tasks, the activity toolbar. Pulse. */
    activity: ActivityIcon,
    /** Checking the app's own tools and connections: Diagnostics. Stethoscope. */
    diagnostics: StethoscopeIcon,
    /** Titles, artists, artwork and the details read about media: a Metadata pane. Tag. */
    metadata: TagIcon,
    /** Comparing a catalog's files with a source of truth for integrity: Check-up. Shield with a tick. */
    checkUp: ShieldCheckIcon,
    /** Reading folders for new, changed or removed files and their metadata: Scans, Scan now, a scan running or
     *  queued, a catalog's "scanning" empty state. Scan line; never refresh. */
    scans: ScanLineIcon,
    /** A newer version of the app: Updates. Circle with an up arrow. */
    updates: CircleFadingArrowUpIcon,
    /** Reload what is shown, or try a failed step again. Circular arrows; never an update or a scan. */
    refresh: RefreshCwIcon,
    /** General settings, and the way into settings. Gear. */
    settings: SettingsIcon,
    /** Media catalogs. Library. */
    catalogs: LibraryIcon,
    /** Metadata providers and their order. Sliders. */
    providers: SlidersHorizontalIcon,
    /** People with access: Settings › Users, Invite user. Users; never what is playing. */
    users: UsersIcon,
    /** People credited on media: actors, directors and other contributors; never account access. */
    people: UserRoundIcon,
    /** Reaching the server from outside the home network. Globe. */
    remoteAccess: GlobeIcon,
    /** Playback, transcoding and what is playing now (the Now playing toolbar button). Play. */
    playback: PlayIcon,
    /** Log files. Logs. */
    logs: LogsIcon,
    /** Code projects (repositories). Folder with a branch. */
    projects: FolderGit2Icon,
    /** Connected services, such as issue trackers. Plug. */
    integrations: PlugIcon,
    /** Agent skills. Sparkles; nothing else takes sparkles. */
    skills: SparklesIcon,
    /** Put away, kept but out of the way: Archive. Archive box. */
    archive: ArchiveIcon,
    /** Search and the command palette. Magnifier. */
    search: SearchIcon,
    /** Work that was stopped before it finished, such as a stopped build: the board's Stopped glyph. Circle with a
     *  square; never the review eye. */
    stopped: CircleStopIcon,
    /** An item with no kind (no type label): the No kind filter and choice. Dashed square; the dashed circle is
     *  Shaping's status glyph. */
    noKind: SquareDashedIcon,
} as const satisfies Record<string, LucideIcon>;

/** A concept that has its one icon. */
export type IconConcept = keyof typeof conceptIcons;
