import { Alert, Loading } from '@ninna-ui/feedback';
import { ChevronDownIcon, FolderIcon, FolderUpIcon, HouseIcon } from 'lucide-react';
import type { ComponentPropsWithoutRef } from 'react';

import { Button } from '../actions/Button';
import { IconButton } from '../actions/IconButton';
import { formControlClasses } from '../forms/FormControlStyles';
import { useDesignSystemLabels } from '../foundations/DesignSystemProvider';
import { Inline, Stack } from '../layout/Flow';
import { ScrollArea } from '../layout/ScrollArea';
import { Popover } from '../overlays/Popover';
import { Text } from '../typography/Typography';

export interface FolderSelectorOption {
    name: string;
    path: string;
}

export interface FolderSelectorProps extends Pick<
    ComponentPropsWithoutRef<'button'>,
    'id' | 'title' | 'aria-describedby' | 'aria-invalid' | 'aria-required'
> {
    browsePath: string;
    disabled?: boolean;
    error?: string;
    hasMore?: boolean;
    loading?: boolean;
    loadingMore?: boolean;
    onBrowsePathChange: (path: string) => void;
    onChange: (path: string) => void;
    onLoadMore: () => void;
    onOpenChange: (open: boolean) => void;
    onRetry: () => void;
    open: boolean;
    options: readonly FolderSelectorOption[];
    parentPath?: string | null;
    value: string;
}

export function FolderSelector({
    id,
    title,
    'aria-describedby': describedBy,
    'aria-invalid': invalid,
    'aria-required': required,
    browsePath,
    disabled,
    error,
    hasMore,
    loading,
    loadingMore,
    onBrowsePathChange,
    onChange,
    onLoadMore,
    onOpenChange,
    onRetry,
    open,
    options,
    parentPath,
    value,
}: FolderSelectorProps) {
    const labels = useDesignSystemLabels();

    return (
        <Popover open={open} onOpenChange={onOpenChange} modal>
            <Popover.Trigger asChild>
                <Button
                    id={id}
                    title={title}
                    aria-describedby={describedBy}
                    aria-invalid={invalid}
                    aria-required={required}
                    aria-label={value ? labels.folders.selectedPath(value) : labels.folders.path}
                    className={`${formControlClasses} hover:bg-base-200 justify-between font-normal [&>span>svg]:size-4`}
                    disabled={disabled}
                    fullWidth
                    leftIcon={<FolderIcon />}
                    rightIcon={<ChevronDownIcon />}
                    type="button"
                    variant="quiet"
                >
                    <span className="min-w-0 flex-1 truncate text-left">{value || labels.folders.chooseFolder}</span>
                </Button>
            </Popover.Trigger>
            <Popover.Content side="bottom" align="start" sideOffset={8} width="trigger" layout="fill">
                <Stack className="min-h-0" space="group">
                    <Stack space="tight">
                        <Inline align="center" justify="between" space="related">
                            <Text className="min-w-0 flex-1 truncate" variant="label">
                                {labels.folders.title}
                            </Text>
                            <Inline space="tight">
                                <IconButton
                                    type="button"
                                    aria-label={labels.folders.root}
                                    title={labels.folders.root}
                                    disabled={browsePath === '/'}
                                    icon={<HouseIcon />}
                                    onClick={() => onBrowsePathChange('/')}
                                />
                                <IconButton
                                    type="button"
                                    aria-label={labels.folders.upOneLevel}
                                    title={labels.folders.upOneLevel}
                                    disabled={!parentPath}
                                    icon={<FolderUpIcon />}
                                    onClick={() => parentPath && onBrowsePathChange(parentPath)}
                                />
                            </Inline>
                        </Inline>
                        <Text variant="caption" tone="muted">
                            {browsePath}
                        </Text>
                    </Stack>

                    <ScrollArea>
                        {loading ? <Loading label={labels.folders.loading} /> : null}

                        {error ? (
                            <Alert
                                color="danger"
                                title={labels.folders.loadFailed}
                                description={error}
                                showIcon
                                action={
                                    <Button onClick={onRetry} variant="primary">
                                        {labels.retry}
                                    </Button>
                                }
                            />
                        ) : null}

                        {!loading && !error ? (
                            <Stack space="tight">
                                {options.map((option) => (
                                    <Button
                                        key={option.path}
                                        aria-label={labels.folders.open(option.name)}
                                        className="justify-start"
                                        fullWidth
                                        leftIcon={<FolderIcon />}
                                        type="button"
                                        onClick={() => onBrowsePathChange(option.path)}
                                        variant="quiet"
                                    >
                                        <span className="min-w-0 flex-1 truncate text-left">{option.name}</span>
                                    </Button>
                                ))}
                                {options.length === 0 ? <Text tone="muted">{labels.folders.empty}</Text> : null}
                                {hasMore ? (
                                    <Button type="button" loading={loadingMore} onClick={onLoadMore} variant="quiet">
                                        {labels.folders.loadMore}
                                    </Button>
                                ) : null}
                            </Stack>
                        ) : null}
                    </ScrollArea>

                    <Button
                        type="button"
                        fullWidth
                        disabled={browsePath === '/' || Boolean(error)}
                        onClick={() => onChange(browsePath)}
                        variant="primary"
                    >
                        {labels.folders.chooseThis}
                    </Button>
                </Stack>
            </Popover.Content>
        </Popover>
    );
}
