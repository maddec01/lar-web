import type { Element, Root } from 'hast';
import { htmlTagNames } from 'html-tag-names';

const htmlTags = new Set(htmlTagNames);

/** Markdown's unknown bare tags are prose placeholders. Escape them before HTML parsing, keeping real HTML on
 *  the existing sanitizing path. Code, links and HTML attributes are not raw bare-tag nodes. */
export function rehypeMarkdownPlaceholders() {
    const walk = (node: Root | Element): void => {
        for (const child of node.children) {
            if (child.type === 'raw')
                child.value = child.value.replace(/<\/?([a-z][\w-]*)\s*>/gi, (token, name: string) =>
                    htmlTags.has(name.toLowerCase()) ? token : token.replace('<', '&lt;').replace('>', '&gt;'),
                );
            else if (child.type === 'element') walk(child);
        }
    };

    return (tree: Root) => walk(tree);
}
