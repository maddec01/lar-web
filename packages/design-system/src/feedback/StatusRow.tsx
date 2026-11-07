import type { ReactNode } from 'react';

import { Inline, Stack } from '../layout/Flow';
import { Text } from '../typography/Typography';
import { StatusIndicator, type StatusTone } from './StatusIndicator';

interface StatusRowProps {
    loading?: boolean;
    compact?: boolean;
    detail?: string;
    indicator?: ReactNode;
    label: string;
    tone: StatusTone;
    trailing?: ReactNode;
    value?: string;
    secondaryDetail?: string;
}

export function StatusRow({
    compact = false,
    loading = false,
    detail,
    indicator,
    label,
    tone,
    trailing,
    value,
    secondaryDetail,
}: StatusRowProps) {
    return (
        <Inline align="center" justify="between" space="section" className="min-w-0 rounded-lg px-2 py-2">
            <Inline align="center" space="related" className="min-w-0 flex-1">
                {indicator || compact ? (
                    <span
                        className={`flex shrink-0 items-center justify-center [&>[data-slot=skeleton]]:size-full ${compact ? 'size-5' : 'size-8'}`}
                    >
                        {indicator ?? <StatusIndicator tone={tone} />}
                    </span>
                ) : (
                    <StatusIndicator tone={tone} />
                )}
                <Stack space="none" className="min-w-0 flex-1">
                    <Text as="span" variant={compact ? 'caption' : 'body'} truncate title={label} loading={loading}>
                        {label}
                    </Text>
                    {detail ? (
                        <Text as="span" title={detail} variant="caption" tone="muted" loading={loading}>
                            {detail}
                        </Text>
                    ) : null}
                    {secondaryDetail !== undefined ? (
                        <Text as="span" title={secondaryDetail} variant="caption" tone="muted" loading={loading}>
                            {secondaryDetail || '\u00a0'}
                        </Text>
                    ) : null}
                </Stack>
            </Inline>
            {trailing ?? (
                <Text
                    as="span"
                    variant={compact ? 'caption' : 'body'}
                    tone="muted"
                    className={compact ? 'w-20 shrink-0 text-end' : undefined}
                >
                    {value}
                </Text>
            )}
        </Inline>
    );
}
