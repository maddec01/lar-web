import type { Element, Root } from 'hast';
import { htmlTagNames } from 'html-tag-names';

const htmlTags = new Set(htmlTagNames);

/** Markdown's unknown bare tags and word sequences are prose placeholders. Escape them before HTML parsing,
 *  keeping real HTML on the sanitizer path. Match complete tags so quoted attributes and comments stay intact;
 *  Markdown code and link destinations have already been parsed into non-raw nodes. */
export function rehypeMarkdownPlaceholders() {
    const walk = (node: Root | Element): void => {
        for (const child of node.children) {
            if (child.type === 'raw')
                child.value = child.value.replace(
                    /<!--[\s\S]*?-->|<\/?[a-z](?:[^<>"']|"[^"]*"|'[^']*')*>/gi,
                    (token) => {
                        const placeholder = /^<\/?([a-z][\w-]*)(?:\s+[\w-]+)*\s*>$/i.exec(token);

                        return placeholder && !htmlTags.has(placeholder[1]!.toLowerCase())
                            ? token.replace('<', '&lt;').replace('>', '&gt;')
                            : token;
                    },
                );
            else if (child.type === 'element') walk(child);
        }
    };

    return (tree: Root) => walk(tree);
}
