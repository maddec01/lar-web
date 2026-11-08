import { isValidElement } from 'react';
import type { ArgTypesEnhancer, StrictInputType } from 'storybook/internal/types';

/** Props that take markup by name, even when a story leaves them out. */
const nodeProps = [
    'children',
    'actions',
    'artwork',
    'icon',
    'leftIcon',
    'rightIcon',
    'leading',
    'trailing',
    'footer',
    'header',
];

/** Whether a value is, or holds anywhere inside an object or array, a function or a React node: a control would only
 *  print its source (a mock function's body, an element's fibre) and could not edit it. */
function holdsCode(value: unknown, seen = new Set<unknown>()): boolean {
    if (typeof value === 'function' || isValidElement(value)) return true;

    if (value === null || typeof value !== 'object' || seen.has(value)) return false;

    seen.add(value);

    return Object.values(value).some((entry) => holdsCode(entry, seen));
}

/** Run after Storybook infers types from args, including compound-component React node props. */
export const disableNodeControls: ArgTypesEnhancer = ({ argTypes, initialArgs }) =>
    Object.fromEntries(
        Object.entries({
            ...Object.fromEntries<StrictInputType>(Object.keys(initialArgs).map((name) => [name, { name }])),
            ...argTypes,
        }).map(([name, arg]) => {
            const summary = `${arg.type?.name ?? ''} ${arg.type && 'raw' in arg.type ? arg.type.raw : ''} ${arg.table?.type?.summary ?? ''}`;
            const value = initialArgs[name];
            // A prop typed by a named object type (StateAction, TitleBarTrailItem[]) that the story leaves unset: an
            // empty JSON editor can't build one, which may hold callbacks or nodes the docs can't show.
            const namedObject =
                value === undefined &&
                /^(?:readonly )?[A-Z]\w*(?:\[\])?$/.test((arg.table?.type?.summary ?? '').trim());
            const node =
                /ReactNode|ReactElement|JSX.Element|=>|function/.test(summary) ||
                holdsCode(value) ||
                namedObject ||
                nodeProps.includes(name);

            return [name, node ? { ...arg, control: false } : arg];
        }),
    );

disableNodeControls.secondPass = true;
