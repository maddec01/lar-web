import { Loading } from '@ninna-ui/feedback';
import { ChevronDownIcon, FolderIcon, FolderUpIcon, HouseIcon } from 'lucide-react';
import type { ComponentPropsWithoutRef } from 'react';

import { ButtonBase as Button } from '../actions/Button';
import { IconButton } from '../actions/IconButton';
import { Alert } from '../feedback/Alert';
import { formControlClasses } from '../forms/FormControlStyles';
import { useDesignSystemLabels } from '../foundations/DesignSystemProvider';
import { InlineBase, StackBase } from '../layout/Flow';
import { ScrollArea } from '../layout/ScrollArea';
import { Popover } from '../overlays/Popover';
import { Text, TextBase } from '../typography/Typography';

export interface FolderSelectorOption {
    name: string;
    path: string;
}

export interface FolderSelectorProps extends Pick<
    ComponentPropsWithoutRef<'button'>,
    'id' | 'title' | 'aria-describedby' | 'aria-invalid' | 'aria-required'
> {
    /** The folder the open browser lists. */
    browsePath: string;
    /** Can't be opened, such as while a form saves. */
    disabled?: boolean;
    /** Why the folder couldn't be listed, with a retry. */
    error?: string;
    /** The folder has more subfolders than listed, offering to load them. */
    hasMore?: boolean;
    /** The folder's list is on its way. */
    loading?: boolean;
    /** More subfolders are on their way. */
    loadingMore?: boolean;
    /** Called with a folder's path as the reader opens it or goes up. */
    onBrowsePathChange: (path: string) => void;
    /** Called with the folder the reader chooses. */
    onChange: (path: string) => void;
    /** Called as the reader asks for more subfolders. */
    onLoadMore: () => void;
    /** Called as the browser opens or closes. */
    onOpenChange: (open: boolean) => void;
    /** Called as the reader retries a listing that failed. */
    onRetry: () => void;
    /** The browser is open, for a controlled selector. */
    open: boolean;
    /** The listed folder's subfolders. */
    options: readonly FolderSelectorOption[];
    /** The folder above the listed one, for going up; none at the top. */
    parentPath?: string | null;
    /** The chosen folder's path, shown on the trigger. */
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
                    aria-label={value ? labels.folders.selectedPath(value) : labels.folders.chooseFolder}
                    className={`${formControlClasses} hover:bg-fill-hover justify-between font-normal [&>span>svg]:size-4`}
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
                <StackBase className="min-h-0" space="group">
                    <StackBase space="tight">
                        <InlineBase align="center" justify="between" space="related">
                            <TextBase className="min-w-0 flex-1 truncate" variant="label">
                                {labels.folders.title}
                            </TextBase>
                            <InlineBase space="tight">
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
                            </InlineBase>
                        </InlineBase>
                        <Text variant="caption" tone="muted">
                            {browsePath}
                        </Text>
                    </StackBase>

                    <ScrollArea>
                        {loading ? <Loading label={labels.folders.loading} /> : null}

                        {error ? (
                            <Alert
                                tone="danger"
                                title={labels.folders.loadFailed}
                                description={error}
                                action={
                                    <Button onClick={onRetry} variant="primary">
                                        {labels.retry}
                                    </Button>
                                }
                            />
                        ) : null}

                        {!loading && !error ? (
                            <StackBase space="tight">
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
                            </StackBase>
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
                </StackBase>
            </Popover.Content>
        </Popover>
    );
}
