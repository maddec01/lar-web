// Renders a GitHub or Azure DevOps description or comment the way the provider shows it. Markdown is
// GitHub-flavoured and may hold raw HTML; an Azure DevOps field may be HTML. Both go through the same
// sanitizer, then images become links (the page never loads a remote image) and links open in a new tab. The output
// never makes its container scroll sideways.
import type { Element, ElementContent, Root } from 'hast';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import { CheckIcon, ChevronDownIcon, PaperclipIcon } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import Markdown, { type Components } from 'react-markdown';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import rehypeParse from 'rehype-parse';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import { unified } from 'unified';
import type { PluggableList } from 'unified';

import { proseLinkRecipe } from '../typography/LinkRecipe';

export type RichTextFormat = 'markdown' | 'html';

const link = (properties: Element['properties'], children: ElementContent[]): Element => ({
    type: 'element',
    tagName: 'a',
    properties: { ...properties, target: '_blank', rel: ['noopener', 'noreferrer'] },
    children,
});

/** Turns every image into a link to it, named "Image: " and its alt text, and gives every link a new tab. An image
 *  inside a link, or without a usable source, becomes its text, since a link cannot hold a link. */
function rehypeImagesAsLinks() {
    const walk = (node: Root | Element, inLink: boolean): void => {
        node.children = node.children.map((child) => {
            if (child.type !== 'element') return child;

            if (child.tagName === 'img') {
                const src = typeof child.properties.src === 'string' ? child.properties.src : '';
                const alt = String(child.properties.alt || '');
                const text: ElementContent = { type: 'text', value: alt || src };

                // A link standing in for an image says so, so it never reads as a stray link in the text.
                return src && !inLink
                    ? link({ href: src, dataAttachment: true }, [{ type: 'text', value: alt ? `Image: ${alt}` : src }])
                    : text;
            }

            walk(child, inLink || child.tagName === 'a');

            return child.tagName === 'a' ? link(child.properties, child.children) : child;
        });
    };

    return (tree: Root) => walk(tree, false);
}

const textOf = (node: ElementContent): string =>
    node.type === 'text' ? node.value : node.type === 'element' ? node.children.map(textOf).join('') : '';

/** Names each task list's checkbox by its item's text, so a screen reader says what is done or not. */
function rehypeLabelTaskItems() {
    const walk = (node: Root | Element): void => {
        for (const child of node.children) {
            if (child.type !== 'element') continue;

            if (child.tagName === 'li') {
                const box = child.children.find(
                    (item): item is Element => item.type === 'element' && item.tagName === 'input',
                );

                if (box?.properties.type === 'checkbox') box.properties.ariaLabel = textOf(child).trim();
            }

            walk(child);
        }
    };

    return (tree: Root) => walk(tree);
}

// The default schema is GitHub's: it keeps <details>, tables and task-list checkboxes and drops scripts,
// handlers, javascript: URLs, iframes and styles. It keeps a dropped <style>'s text, so strip that element whole.
const schema = { ...defaultSchema, strip: [...(defaultSchema.strip ?? []), 'style'] };
const rehypePlugins: PluggableList = [rehypeRaw, [rehypeSanitize, schema], rehypeImagesAsLinks, rehypeLabelTaskItems];
const htmlProcessor = unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeSanitize, schema)
    .use(rehypeImagesAsLinks)
    .use(rehypeLabelTaskItems);

/** A task list's checkbox, drawn as Checkbox draws one: the edge, fill and tick from the tokens, read-only. */
function TaskCheckbox(props: ComponentProps<'input'>) {
    return (
        <span className="relative me-1.5 inline-grid size-4 shrink-0 align-text-bottom">
            <input
                {...props}
                className="peer border-line-strong bg-surface-control checked:border-primary checked:bg-primary m-0 size-4 appearance-none rounded-sm border forced-colors:appearance-auto"
            />
            <CheckIcon
                aria-hidden="true"
                className="text-primary-content pointer-events-none absolute inset-0 hidden size-4 peer-checked:block forced-colors:hidden"
            />
        </span>
    );
}

/** The elements drawn as design-system components rather than styled in place: a task's checkbox, and a
 *  `<details>`' summary with the disclosure chevron Disclosure draws. */
const components = {
    a: ({ node: _node, children, ...props }) => (
        <a {...props}>
            {'data-attachment' in props && (
                <PaperclipIcon aria-hidden="true" className="me-1 inline size-3.5 align-text-bottom" />
            )}
            {children}
        </a>
    ),
    input: ({ node: _node, ...props }) =>
        props.type === 'checkbox' ? <TaskCheckbox {...props} /> : <input {...props} />,
    summary: ({ node: _node, children, ...props }) => (
        <summary
            {...props}
            className="focus-ring flex w-fit cursor-pointer list-none items-center gap-1.5 rounded-xs py-1 font-medium [&::-webkit-details-marker]:hidden"
        >
            <ChevronDownIcon
                aria-hidden="true"
                className="text-fg-muted size-3.5 shrink-0 -rotate-90 transition-transform [[open]>summary>&]:rotate-0"
            />
            {children}
        </summary>
    ),
} satisfies Components;

// Tailwind has no typography plugin and its preflight resets headings, lists and tables, so the elements a
// provider's text holds are styled here.
const body = [
    'min-w-0 max-w-full text-sm leading-relaxed break-words [overflow-wrap:anywhere]',
    '[&_p]:max-w-reading [&_ul]:max-w-reading [&_ol]:max-w-reading',
    '[&>:first-child]:mt-0 [&>:last-child]:mb-0 [&_p]:my-2 [&_ul]:my-2 [&_ol]:my-2 [&_blockquote]:my-2',
    '[&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-semibold',
    '[&_h3]:mt-3 [&_h3]:mb-1.5 [&_h3]:font-semibold [&_h4]:mt-3 [&_h4]:mb-1.5 [&_h4]:font-semibold [&_h5]:font-semibold [&_h6]:font-semibold',
    '[&_ul]:list-disc [&_ul]:ps-6 [&_ol]:list-decimal [&_ol]:ps-6 [&_li]:my-0.5 [&_li::marker]:text-fg-muted [&_.task-list-item]:list-none [&_.task-list-item]:-ms-6',
    proseLinkRecipe,
    '[&_a[data-attachment]]:inline-flex [&_a[data-attachment]]:items-center [&_a[data-attachment]]:rounded-md [&_a[data-attachment]]:border [&_a[data-attachment]]:border-line [&_a[data-attachment]]:bg-surface-raised [&_a[data-attachment]]:px-2 [&_a[data-attachment]]:py-1',
    '[&_blockquote]:border-s-2 [&_blockquote]:border-line-control [&_blockquote]:ps-3 [&_blockquote]:text-fg-muted',
    '[&_hr]:my-4 [&_hr]:border-line',
    '[&_pre]:my-2 [&_pre]:max-w-full [&_pre]:overflow-x-hidden [&_pre]:whitespace-pre-wrap [&_pre]:rounded-md [&_pre]:bg-fill-muted [&_pre]:p-3 [&_pre]:font-mono [&_pre]:text-xs',
    '[&_:not(pre)>code]:rounded-xs [&_:not(pre)>code]:bg-fill-muted [&_:not(pre)>code]:px-1 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-xs',
    '[&_table]:my-2 [&_table]:w-full [&_table]:max-w-full [&_table]:table-fixed [&_th]:border [&_th]:border-line [&_th]:bg-surface-sunken [&_th]:px-2 [&_th]:py-1 [&_th]:text-start [&_th]:font-semibold [&_td]:border [&_td]:border-line [&_td]:px-2 [&_td]:py-1',
    '[&_details]:my-2',
].join(' ');

interface RichTextProps {
    /** The text, as the provider gives it. */
    text: string;
    /** How `text` is written: Markdown or HTML. */
    format: RichTextFormat;
    /** Draws each fenced ```mermaid block of Markdown, such as with `Diagram`, between the text around it. */
    renderDiagram?: (source: string) => ReactNode;
}

/** A provider's text, sanitized and styled; with `renderDiagram`, Markdown's Mermaid blocks draw as diagrams. */
export function RichText({ text, format, renderDiagram }: RichTextProps) {
    if (text === '') return null;

    if (renderDiagram && format === 'markdown') {
        const parts = text.split(/```mermaid[^\S\r\n]*\r?\n([\s\S]*?)```/g);

        if (parts.length > 1)
            return (
                <div className="grid min-w-0 gap-3" data-slot="rich-text-with-diagrams">
                    {parts.map((part, index) =>
                        index % 2 === 1 ? (
                            <Fragment key={index}>{renderDiagram(part.trim())}</Fragment>
                        ) : part.trim() ? (
                            <RichText key={index} text={part} format="markdown" />
                        ) : null,
                    )}
                </div>
            );
    }

    return (
        <div className={body} data-slot="rich-text">
            {format === 'markdown' ? (
                <Markdown rehypePlugins={rehypePlugins} remarkPlugins={[remarkGfm]} components={components}>
                    {text}
                </Markdown>
            ) : (
                toJsxRuntime(htmlProcessor.runSync(htmlProcessor.parse(text)), { Fragment, jsx, jsxs, components })
            )}
        </div>
    );
}
