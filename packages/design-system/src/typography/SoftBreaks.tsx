import { Fragment, type ReactNode } from 'react';

/** A single unbroken token such as a file name (`harbour_footage_2009_FINAL`) or an address
 *  (`https://lar.example.net:36900`), with a break opportunity after each of its separators, so a long one wraps
 *  between its parts rather than at whichever letter meets the edge. Text with spaces already wraps at words and is
 *  returned as it is. */
export function softBreaks(text: string): ReactNode {
    if (/\s/.test(text) || !/[_./:-]/.test(text)) return text;

    return text.split(/(?<=[_./:-])/).map((part, index) => (
        <Fragment key={index}>
            {index > 0 ? <wbr /> : null}
            {part}
        </Fragment>
    ));
}
