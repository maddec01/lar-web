// The Markdown editor's toolbar, internal to MarkdownEditor (not exported; its stories show it): bold, italic, heading,
// bulleted list, numbered list and link, each pressed while the selection has it. Link opens a URL field under the
// toolbar, as Electron has no window.prompt: Enter or Apply links the selection, Escape, a click outside or an empty URL
// closes it with no link, and Escape leaves the dialog open. Its tooltip stays shut while the field is open, so it covers
// none of it.

import { $isLinkNode, $toggleLink, TOGGLE_LINK_COMMAND } from '@lexical/link';
import {
    $isListNode,
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createHeadingNode, $isHeadingNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { $createParagraphNode, $getSelection, $isRangeSelection, $setSelection, FORMAT_TEXT_COMMAND } from 'lexical';
import type { BaseSelection, EditorState } from 'lexical';
import { BoldIcon, HeadingIcon, ItalicIcon, LinkIcon, ListIcon, ListOrderedIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { ComponentProps, ReactNode } from 'react';

import { Button } from '../actions/Button';
import { useDesignSystemLabels } from '../foundations/DesignSystemProvider';
import { applePlatform } from '../foundations/KeyboardShortcut';
import { Popover } from '../overlays/Popover';
import { Tooltip, TooltipPopup, TooltipTrigger } from '../overlays/Tooltip';

const MOD = applePlatform ? '⌘' : 'Ctrl+';

type Block = 'paragraph' | 'heading' | 'bullet' | 'number';
interface Active {
    bold: boolean;
    italic: boolean;
    link: boolean;
    block: Block;
}

const NONE: Active = { bold: false, italic: false, link: false, block: 'paragraph' };

/** What the selection has on. */
function readActive(state: EditorState): Active {
    return state.read(() => {
        const selection = $getSelection();

        if (!$isRangeSelection(selection)) return NONE;

        const node = selection.anchor.getNode();
        const top = node.getKey() === 'root' ? null : node.getTopLevelElement();
        const block = $isHeadingNode(top)
            ? 'heading'
            : $isListNode(top)
              ? top.getListType() === 'number'
                  ? 'number'
                  : 'bullet'
              : 'paragraph';

        return {
            bold: selection.hasFormat('bold'),
            italic: selection.hasFormat('italic'),
            link: $isLinkNode(node.getParent()) || $isLinkNode(node),
            block,
        };
    });
}

/** A toolbar button; `quiet` keeps its tooltip shut, as while the field it opens would sit under it. Any other props,
 *  such as a popover trigger's, go on the button itself. */
function ToolButton({
    label,
    keys,
    on,
    icon,
    run,
    quiet = false,
    ...button
}: {
    label: string;
    keys?: string;
    on: boolean;
    icon: ReactNode;
    run: () => void;
    quiet?: boolean;
} & ComponentProps<'button'>) {
    // Held here, so a hover while quiet doesn't leave the tooltip to show once it no longer is.
    const [tip, setTip] = useState(false);

    return (
        <Tooltip open={tip && !quiet} onOpenChange={(open) => setTip(open && !quiet)}>
            <TooltipTrigger asChild>
                {/* Pressing keeps the editor's selection: focus stays in the editor. */}
                <button
                    type="button"
                    {...button}
                    aria-label={label}
                    aria-pressed={on}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={(event) => {
                        run();
                        button.onClick?.(event);
                    }}
                    className={`focus-ring grid size-7 place-items-center rounded-md transition-colors [&_svg]:size-4 ${on ? 'bg-primary-surface text-primary-fg' : 'text-fg-muted hover:bg-fill-hover hover:text-fg'}`}
                >
                    {icon}
                </button>
            </TooltipTrigger>
            <TooltipPopup side="bottom">
                {label}
                {keys && <span className="text-fg-muted ms-2">{keys}</span>}
            </TooltipPopup>
        </Tooltip>
    );
}

/** The URL field Link opens, anchored under its button; `close` gets the URL to link, or null for none. A popover is a
 *  layer above the dialog, so Escape closes the field alone. */
function LinkField({
    open,
    close,
    children,
}: {
    open: boolean;
    close: (url: string | null) => void;
    children: ReactNode;
}) {
    const labels = useDesignSystemLabels().editor;
    const field = useRef<HTMLInputElement>(null);
    const apply = () => close(field.current!.value.trim() || null);

    return (
        <Popover open={open} onOpenChange={(opened) => !opened && close(null)}>
            {/* The button opens the field itself, so the trigger's own toggle is turned off. */}
            <Popover.Trigger asChild onClick={(event) => event.preventDefault()}>
                {children}
            </Popover.Trigger>
            {/* Portalled, its events still reach the form in the React tree, which would count them as edits. */}
            <Popover.Content
                side="bottom"
                align="start"
                onCloseAutoFocus={(event) => event.preventDefault()}
                onInput={(event) => event.stopPropagation()}
                onChange={(event) => event.stopPropagation()}
            >
                <div className="flex items-center gap-1.5">
                    <input
                        ref={field}
                        type="url"
                        aria-label={labels.linkUrl}
                        placeholder={labels.linkPlaceholder}
                        autoComplete="off"
                        className="border-line bg-surface-raised focus-field h-7 w-56 max-w-full rounded-md border px-2 text-sm"
                        onKeyDown={(event) => {
                            if (event.key !== 'Enter') return;

                            event.preventDefault();
                            apply();
                        }}
                    />
                    <Button size="sm" onClick={apply}>
                        {labels.apply}
                    </Button>
                </div>
            </Popover.Content>
        </Popover>
    );
}

/** `className` adds to the bar's own classes. */
export function MarkdownToolbar({ className = '' }: { className?: string }) {
    const labels = useDesignSystemLabels().editor;
    const [editor] = useLexicalComposerContext();
    const [active, setActive] = useState(NONE);
    // The selection Link opened its field on, which the field's focus would otherwise lose.
    const [linking, setLinking] = useState<BaseSelection | null>(null);

    useEffect(() => editor.registerUpdateListener(({ editorState }) => setActive(readActive(editorState))), [editor]);

    const heading = () =>
        editor.update(() => {
            const selection = $getSelection();

            if ($isRangeSelection(selection))
                $setBlocksType(selection, () =>
                    active.block === 'heading' ? $createParagraphNode() : $createHeadingNode('h2'),
                );
        });
    const list = (type: 'bullet' | 'number') => {
        if (active.block === type) editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
        else
            editor.dispatchCommand(
                type === 'bullet' ? INSERT_UNORDERED_LIST_COMMAND : INSERT_ORDERED_LIST_COMMAND,
                undefined,
            );
    };
    const link = () => {
        if (active.link) return editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);

        setLinking(editor.getEditorState().read(() => $getSelection()?.clone() ?? null));
    };
    const closeLink = (url: string | null) => {
        const selection = linking;

        setLinking(null);

        if (url && selection)
            editor.update(() => {
                $setSelection(selection.clone());
                $toggleLink(url);
            });

        editor.focus();
    };

    return (
        <div
            role="toolbar"
            aria-label={labels.formatting}
            className={`border-line/70 flex shrink-0 items-center gap-0.5 border-b px-2 py-1 ${className}`}
        >
            <ToolButton
                label={labels.bold}
                keys={`${MOD}B`}
                on={active.bold}
                icon={<BoldIcon />}
                run={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
            />
            <ToolButton
                label={labels.italic}
                keys={`${MOD}I`}
                on={active.italic}
                icon={<ItalicIcon />}
                run={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
            />
            <span aria-hidden="true" className="bg-line mx-1 h-4 w-px" />
            <ToolButton
                label={labels.heading}
                keys="#"
                on={active.block === 'heading'}
                icon={<HeadingIcon />}
                run={heading}
            />
            <ToolButton
                label={labels.bulletedList}
                keys="-"
                on={active.block === 'bullet'}
                icon={<ListIcon />}
                run={() => list('bullet')}
            />
            <ToolButton
                label={labels.numberedList}
                keys="1."
                on={active.block === 'number'}
                icon={<ListOrderedIcon />}
                run={() => list('number')}
            />
            <LinkField open={linking !== null} close={closeLink}>
                <ToolButton
                    label={labels.link}
                    on={active.link}
                    icon={<LinkIcon />}
                    run={link}
                    quiet={linking !== null}
                />
            </LinkField>
            <span className="text-fg-muted text-2xs ms-auto pe-1">{labels.markdown}</span>
        </div>
    );
}
