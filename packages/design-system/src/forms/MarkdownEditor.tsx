// The Markdown editor: Lexical, formatting as you type and storing Markdown, under a light toolbar. "- " starts a
// bullet list, "1. " a numbered list, "# " a heading and **bold** turns bold; pasted plain-text Markdown renders. It
// opens HTML, as an older Azure DevOps description holds, as the nodes it stands for, and still reports Markdown.

import { CodeNode } from '@lexical/code';
import { $generateNodesFromDOM } from '@lexical/html';
import { LinkNode } from '@lexical/link';
import { $isListItemNode, ListItemNode, ListNode } from '@lexical/list';
import {
    $convertFromMarkdownString,
    $convertToMarkdownString,
    $generateNodesFromMarkdownString,
    TRANSFORMERS,
} from '@lexical/markdown';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import {
    $findMatchingParent,
    $getRoot,
    $getSelection,
    $insertNodes,
    $isParagraphNode,
    $isRangeSelection,
    COMMAND_PRIORITY_EDITOR,
    COMMAND_PRIORITY_HIGH,
    INDENT_CONTENT_COMMAND,
    KEY_TAB_COMMAND,
    OUTDENT_CONTENT_COMMAND,
    PASTE_COMMAND,
} from 'lexical';
import type { EditorState, LexicalEditor, LexicalNode } from 'lexical';
import { useCallback, useEffect, useState } from 'react';

import type { RichTextFormat } from '../display/RichText';
import { scrollFadeClassName, useScrollFade } from '../overlays/useScrollFade';
import { linkRecipe } from '../typography/LinkRecipe';
import { MarkdownToolbar } from './MarkdownToolbar';

const theme = {
    heading: {
        h1: 'text-xl font-semibold mt-4 mb-1.5 first:mt-0',
        h2: 'text-lg font-semibold mt-4 mb-1 first:mt-0',
        h3: 'font-semibold mt-3 mb-1 first:mt-0',
    },
    list: {
        ul: 'list-disc ps-6 my-1.5',
        ol: 'list-decimal ps-6 my-1.5',
        listitem: 'my-0.5 marker:text-fg-muted',
        nested: { listitem: 'list-none' },
    },
    paragraph: 'my-1.5 first:mt-0',
    quote: 'border-s-2 border-line ps-3 text-fg-muted my-1.5',
    code: 'block rounded-md bg-fill-muted p-3 font-mono text-xs my-1.5 whitespace-pre-wrap',
    link: linkRecipe.accent,
    text: {
        bold: 'font-semibold',
        italic: 'italic',
        strikethrough: 'line-through',
        code: 'rounded-xs bg-fill-muted px-1 font-mono text-[0.85em]',
    },
};

const LOOKS_LIKE_MARKDOWN = /(^|\n)\s*([-*+] |\d+[.)] |#{1,6} |> |```)|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)/;

/** Puts pasted `nodes` in place of the selected text. Ones starting with a heading, list, quote or code block go in after
 *  the block the caret is in, unless it is empty, as inserted at the caret the first block's text would join that block's. */
function $insertPasted(nodes: LexicalNode[]) {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) selection.removeText();

    const block = $isRangeSelection(selection) ? selection.anchor.getNode().getTopLevelElement() : null;
    const first = nodes[0];

    if (!block || !first || $isParagraphNode(first) || block.getTextContentSize() === 0) return $insertNodes(nodes);

    let last: LexicalNode = block;

    for (const node of nodes) last = last.insertAfter(node);
    last.selectEnd();
}

/** Plain text that reads as Markdown, pasted without HTML, goes in as the nodes it stands for. */
function MarkdownPastePlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(
        () =>
            editor.registerCommand(
                PASTE_COMMAND,
                (event) => {
                    const data = 'clipboardData' in event ? event.clipboardData : null;

                    if (!data || data.types.includes('text/html')) return false;

                    const text = data.getData('text/plain');

                    if (!LOOKS_LIKE_MARKDOWN.test(text)) return false;

                    event.preventDefault();
                    editor.update(() => $insertPasted($generateNodesFromMarkdownString(text, TRANSFORMERS)));

                    return true;
                },
                COMMAND_PRIORITY_HIGH,
            ),
        [editor],
    );

    return null;
}

/** Tab nests the list item the selection is in, one deeper than the item before it at most, and Shift+Tab lifts it back
 *  out. Where neither can change anything, as outside a list or on a top-level item, Tab is left to the browser, so it
 *  moves focus on rather than trapping it in the editor. */
function ListTabPlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(
        () =>
            editor.registerCommand(
                KEY_TAB_COMMAND,
                (event) => {
                    const selection = $getSelection();

                    if (!$isRangeSelection(selection)) return false;

                    const items = selection
                        .getNodes()
                        .map((node) => ($isListItemNode(node) ? node : $findMatchingParent(node, $isListItemNode)));
                    const moves = (item: ListItemNode | null) =>
                        item !== null && (event.shiftKey ? item.getIndent() > 0 : item.getPreviousSibling() !== null);

                    if (!items.some(moves)) return false;

                    event.preventDefault();

                    return editor.dispatchCommand(
                        event.shiftKey ? OUTDENT_CONTENT_COMMAND : INDENT_CONTENT_COMMAND,
                        undefined,
                    );
                },
                COMMAND_PRIORITY_EDITOR,
            ),
        [editor],
    );

    return null;
}

/** Locks the text, as a disabled field does. */
function EditablePlugin({ editable }: { editable: boolean }) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => editor.setEditable(editable), [editor, editable]);

    return null;
}

/** The room the scroll fade takes at an edge the text runs past (scrollFadeClassName's 1.5rem). */
const FADE_CLEARANCE = 24;

/** Keeps the caret's line clear of the text area's scroll fade: after each edit or caret move, scrolls the area so the
 *  caret sits at least the fade's height from an edge the text continues past. Lexical scrolls the caret just into
 *  view (it ignores an inner scroll area's scroll-padding), which would leave the line being typed under the fade. */
function CaretClearancePlugin({ area }: { area: HTMLElement | null }) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!area) return;

        return editor.registerUpdateListener(() => {
            const selection = area.ownerDocument.getSelection();

            if (!selection?.rangeCount || !area.contains(selection.focusNode)) return;

            const range = selection.getRangeAt(0).cloneRange();

            // Without layout (a DOM without rects) there is nothing to measure.
            if (typeof range.getClientRects !== 'function') return;

            range.collapse(false);

            const caret = range.getClientRects()[0] ?? range.getBoundingClientRect();
            const { focusNode } = selection;
            const line =
                caret.height > 0
                    ? caret
                    : (focusNode instanceof Element ? focusNode : focusNode?.parentElement)?.getBoundingClientRect();

            if (!line) return;

            const view = area.getBoundingClientRect();
            const below = line.bottom - (view.bottom - FADE_CLEARANCE);
            const above = view.top + FADE_CLEARANCE - line.top;

            if (below > 0 && area.scrollTop + area.clientHeight < area.scrollHeight - 1) area.scrollTop += below;
            else if (above > 0 && area.scrollTop > 0) area.scrollTop -= above;
        });
    }, [editor, area]);

    return null;
}

/** Reports the Markdown the editor makes of its starting text, which a check for changes compares against. */
function BaselinePlugin({ onBaseline }: { onBaseline: (markdown: string) => void }) {
    const [editor] = useLexicalComposerContext();

    useEffect(
        () => editor.getEditorState().read(() => onBaseline($convertToMarkdownString(TRANSFORMERS))),
        [editor, onBaseline],
    );

    return null;
}

/** Fills a new editor from `value`, read as Markdown or as HTML. */
const startFrom = (value: string, format: RichTextFormat) => (editor: LexicalEditor) => {
    if (format === 'markdown') return $convertFromMarkdownString(value, TRANSFORMERS);

    $getRoot().select();
    $insertNodes($generateNodesFromDOM(editor, new DOMParser().parseFromString(value, 'text/html')));
};

interface MarkdownEditorProps {
    /** The Markdown it starts from; later changes to it are ignored. */
    value: string;
    /** How `value` is written; the editor reports Markdown either way. */
    format?: RichTextFormat;
    /** Called with the text as Markdown after each edit. */
    onChange: (markdown: string) => void;
    /** The editor's accessible name, such as "Description". */
    label: string;
    /** A hint shown while it is empty. */
    placeholder: string;
    /** Grows the editor into its parent's height, or, when 'wide', only while its container is 40rem wide or more and
     *  otherwise with its text, uncapped, as its parent scrolls. Without it, it grows with its text up to a cap. */
    fill?: boolean | 'wide';
    /** Read only, with its toolbar held. */
    disabled?: boolean;
    /** Takes the focus when it mounts, such as in a dialog opened to write. */
    autoFocus?: boolean;
    /** Called with the Markdown the editor makes of `value`, before any edit. */
    onBaseline?: (markdown: string) => void;
}

/** A rich text field that reads and reports Markdown, such as a ticket's description, with a formatting toolbar. */
export function MarkdownEditor({
    value,
    format = 'markdown',
    onChange,
    label,
    placeholder,
    fill = false,
    disabled = false,
    autoFocus = false,
    onBaseline,
}: MarkdownEditorProps) {
    // Below 40rem a 'wide' fill gives way to the editor's text height, with no scroll area of its own. The toolbar then
    // sticks to the top of the parent's scroll area, which needs the box to stop clipping, so the toolbar rounds its own
    // corners instead.
    const narrow =
        fill === 'wide'
            ? {
                  box: '@max-pane:flex-none @max-pane:overflow-visible',
                  area: '@max-pane:flex-none @max-pane:overflow-visible',
                  text: '@max-pane:min-h-44',
                  toolbar:
                      '@max-pane:sticky @max-pane:top-0 @max-pane:z-10 @max-pane:rounded-t-lg @max-pane:bg-surface-raised',
              }
            : { box: '', area: '', text: '', toolbar: '' };
    const onEdit = useCallback(
        (state: EditorState) => state.read(() => onChange($convertToMarkdownString(TRANSFORMERS))),
        [onChange],
    );
    // The text area is the editor's scroll owner: it fades where its text runs past an edge, like every scroll area,
    // under a toolbar that stays put, and the caret's line is kept clear of the fade.
    const [area, setArea] = useState<HTMLDivElement | null>(null);
    const { setViewport } = useScrollFade();
    const areaRef = useCallback(
        (element: HTMLDivElement | null) => {
            setArea(element);
            setViewport(element);
        },
        [setViewport],
    );

    return (
        <LexicalComposer
            initialConfig={{
                namespace: 'description',
                theme,
                onError: (error) => {
                    throw error;
                },
                nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, CodeNode, LinkNode],
                editorState: startFrom(value, format),
            }}
        >
            <div
                data-description-editor
                className={`border-line bg-surface-raised focus-field flex flex-col overflow-hidden rounded-lg border transition-[border-color,box-shadow] ${fill ? `min-h-0 flex-1 ${narrow.box}` : ''}`}
            >
                <MarkdownToolbar className={narrow.toolbar} />
                <div
                    ref={areaRef}
                    data-description-area
                    tabIndex={disabled ? 0 : undefined}
                    aria-label={disabled ? label : undefined}
                    className={`relative overflow-y-auto ${scrollFadeClassName} ${fill ? `min-h-0 flex-1 ${narrow.area}` : 'max-h-[min(24rem,45dvh)]'}`}
                >
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable
                                aria-label={label}
                                tabIndex={disabled ? -1 : 0}
                                className={`text-md px-4 py-3 leading-relaxed outline-none ${fill ? `min-h-full ${narrow.text}` : 'min-h-44'}`}
                            />
                        }
                        placeholder={
                            <div className="text-fg-muted text-md pointer-events-none absolute top-3 left-4 leading-relaxed">
                                {placeholder}
                            </div>
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                </div>
            </div>
            {autoFocus && <AutoFocusPlugin defaultSelection="rootEnd" />}
            <HistoryPlugin />
            <ListPlugin />
            <LinkPlugin />
            <ListTabPlugin />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
            <MarkdownPastePlugin />
            <EditablePlugin editable={!disabled} />
            <CaretClearancePlugin area={area} />
            {onBaseline && <BaselinePlugin onBaseline={onBaseline} />}
            <OnChangePlugin ignoreSelectionChange onChange={onEdit} />
        </LexicalComposer>
    );
}
