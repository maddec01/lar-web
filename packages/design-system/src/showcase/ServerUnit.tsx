import { type KeyboardEvent, type ReactNode, useId, useRef, useState } from 'react';

import { Heading, Text } from '../typography/Typography';
import { type Readiness, StatusLight, ReadinessStatus } from './Status';

export type MediaApp = 'music' | 'video' | 'photos' | 'books';

export interface ServerBay {
    id: MediaApp;
    name: string;
    status: Readiness;
    statusLabel: string;
    panel: ReactNode;
}

interface ServerUnitProps {
    /** Names the unit for screen readers. */
    label: string;
    /** The key for the bays' lights, set under the unit. */
    legend?: ReactNode;
    /** The front display's name and state. */
    display: { name: string; state: string };
    /** The drive sleds, one per media app, each with what it can do. */
    bays: readonly ServerBay[];
}

const MARK_L = 'M0 0H27.52V72.48H100V100H3a3 3 0 0 1-3-3z';
const MARK_S =
    'M50.68 0H91.97a8.03 8.03 0 0 1 8.03 8.03V49.32a8.03 8.03 0 0 1-8.03 8.03H50.68a8.03 8.03 0 0 1-8.03-8.03V8.03a8.03 8.03 0 0 1 8.03-8.03z';

/** The server as a four-bay box, one drive sled per media app. Choosing a sled pulls it forward and shows what
 *  that app can do today and what is still to come. */
export function ServerUnit({ label, display, bays, legend }: ServerUnitProps) {
    const [selected, setSelected] = useState<MediaApp>(bays[0]?.id ?? 'music');
    const tabs = useRef<(HTMLButtonElement | null)[]>([]);
    const baseId = useId();
    const current = bays.find((bay) => bay.id === selected) ?? bays[0];

    function move(event: KeyboardEvent<HTMLButtonElement>, index: number) {
        const keys: Record<string, number> = {
            ArrowRight: 1,
            ArrowDown: 1,
            ArrowLeft: -1,
            ArrowUp: -1,
        };
        const step = keys[event.key];
        let next: number | undefined;

        if (step !== undefined) next = (index + step + bays.length) % bays.length;

        if (event.key === 'Home') next = 0;

        if (event.key === 'End') next = bays.length - 1;

        if (next === undefined) return;

        event.preventDefault();

        const bay = bays[next];

        if (!bay) return;

        setSelected(bay.id);
        tabs.current[next]?.focus();
    }

    return (
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center lg:gap-14">
            <div className="flex flex-col gap-8 [perspective:1600px]">
                <div className="lar-unit [transform:rotateX(2deg)_rotateY(5deg)] transition-transform duration-(--motion-duration-deliberate) hover:[transform:rotateX(1deg)_rotateY(3deg)]">
                    <div className="lar-unit__top" aria-hidden="true">
                        <svg viewBox="0 0 100 100" className="lar-unit__mark">
                            <path d={MARK_L} fill="var(--color-zinc-100)" />
                            <path d={MARK_S} fill="var(--color-brand-mark)" />
                        </svg>
                        <div className="lar-unit__lcd">
                            <span>{display.name}</span>
                            <b>{display.state}</b>
                        </div>
                        <div className="lar-unit__lights">
                            <i />
                            <i className="lar-led-pulse" />
                        </div>
                    </div>
                    <div role="tablist" aria-label={label} className="lar-unit__bays">
                        {bays.map((bay, index) => (
                            <button
                                key={bay.id}
                                ref={(element) => {
                                    tabs.current[index] = element;
                                }}
                                type="button"
                                role="tab"
                                id={`${baseId}-${bay.id}-tab`}
                                aria-controls={`${baseId}-panel`}
                                aria-selected={bay.id === selected}
                                tabIndex={bay.id === selected ? 0 : -1}
                                data-app={bay.id}
                                data-status={bay.status}
                                onClick={() => setSelected(bay.id)}
                                onKeyDown={(event) => move(event, index)}
                                className="lar-sled"
                            >
                                <i
                                    className="lar-sled__led lar-led-pulse"
                                    style={{ ['--lar-led-delay' as string]: `${index * 420}ms` }}
                                />
                                <i className="lar-sled__vents" />
                                <span className="lar-sled__name">{bay.name}</span>
                                <span className="lar-sled__state">{bay.statusLabel}</span>
                                <i className="lar-sled__latch" />
                            </button>
                        ))}
                    </div>
                </div>
                {legend}
            </div>
            {current ? (
                <div
                    role="tabpanel"
                    id={`${baseId}-panel`}
                    aria-labelledby={`${baseId}-${current.id}-tab`}
                    className="border-line bg-surface-glass rounded-2xl border p-5 sm:min-h-105 sm:p-7"
                >
                    {current.panel}
                </div>
            ) : null}
        </div>
    );
}

export interface ReadinessItem {
    label: string;
    status: Readiness;
    statusLabel: string;
}

interface ReadinessPanelProps {
    /** The app's icon. */
    icon: ReactNode;
    /** The app's name. */
    title: string;
    /** Where the app stands, such as a ReadinessStatus. */
    status: ReactNode;
    /** A sentence on the app today. */
    summary: string;
    /** Its capabilities, grouped by readiness. */
    groups: readonly { title: string; items: readonly ReadinessItem[]; wideOnly?: boolean }[];
}

/** One app's status: what works, what is being built and what is planned, line by line. */
export function ReadinessPanel({ icon, title, status, summary, groups }: ReadinessPanelProps) {
    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
                {icon}
                <Heading as="h3" variant="feature">
                    {title}
                </Heading>
                <span className="ml-auto">{status}</span>
            </div>
            <Text variant="prose" tone="muted">
                {summary}
            </Text>
            {groups.map((group) => (
                <div key={group.title} className={`flex-col gap-2 ${group.wideOnly ? 'hidden sm:flex' : 'flex'}`}>
                    <Text as="span" variant="overline" tone="muted">
                        {group.title}
                    </Text>
                    <ul className="divide-line/70 flex flex-col divide-y">
                        {group.items.map((item) => (
                            <li
                                key={item.label}
                                className="text-fg-soft flex items-center gap-3 py-1.5 text-sm sm:py-2"
                            >
                                <StatusLight status={item.status} />
                                <span className="min-w-0 flex-1">{item.label}</span>
                                <span className="text-fg-muted shrink-0 text-xs">{item.statusLabel}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

/** The key for the readiness lights. */
export function ReadinessLegend({
    items,
}: {
    /** Each readiness with its label. */
    items: readonly { status: Readiness; label: string }[];
}) {
    return (
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {items.map((item) => (
                <ReadinessStatus key={item.status} status={item.status}>
                    {item.label}
                </ReadinessStatus>
            ))}
        </div>
    );
}
