import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';

import { useDesignSystemLabels } from '../foundations/DesignSystemProvider';
import { formatDateField, formatDateLong, parseDateField } from './DateValue';
import { Input, type InputProps } from './Input';

/** What the reader has typed into a DateField, as `onDraftChange` reports it. */
export interface DateFieldDraft {
    /** The text in the field, as typed. */
    text: string;
    /** The ISO date the text reads as (empty for a cleared field), or `undefined` while it is not a date. */
    value: string | undefined;
    /** Whether the text reads as a date; an empty field is valid. A form keeps its submit from saving while this is
     *  false (the input is also natively invalid, so `form.checkValidity()` is false and a native submit is held). */
    valid: boolean;
    /** The validation message once the reader has left an invalid draft (blur, or Enter), to show as the Field's
     *  `errorText`; `undefined` while the draft is valid or still being typed. */
    message: string | undefined;
}

export interface DateFieldProps extends Omit<InputProps, 'value' | 'defaultValue' | 'onChange' | 'type'> {
    /** ISO date at its known precision: YYYY, YYYY-MM, YYYY-MM-DD, or empty. */
    value: string;
    /** Called with a valid ISO date or empty when the reader clears the field. */
    onValueChange: (value: string) => void;
    /** Locale used for display and date order, such as en-GB. Defaults to the browser locale. */
    locale?: string;
    /** Localised validation message; defaults to the provider’s dateInvalid label. */
    invalidMessage?: string;
    /** Called with the draft on every edit, and as the field opens or its `value` changes: its text, the date it reads
     *  as, whether it is valid, and the message to show once the reader has left it invalid. */
    onDraftChange?: (draft: DateFieldDraft) => void;
}

/** One metadata date field for full and partial dates. At rest it shows the long date the pages show ("January 10,
 * 2021", "January 2021", "2021"); while focused, the locale's numeric text to edit, and it also accepts ISO. An invalid draft stays visible and is marked invalid, never saved as ISO; the
 * form hears it through `onDraftChange` and holds its submit, and shows `message` as the Field's `errorText`:
 *
 *     const [date, setDate] = useState<DateFieldDraft>();
 *     <Field label="Released" invalid={Boolean(date?.message)} errorText={date?.message}>
 *         <DateField value={released} onValueChange={setReleased} onDraftChange={setDate} />
 *     </Field>
 *     <Button type="submit" disabled={date?.valid === false}>Save</Button>
 */
export const DateField = forwardRef<HTMLInputElement, DateFieldProps>(
    (
        { value, onValueChange, onDraftChange, locale, onBlur, onFocus, onKeyDown, invalid, invalidMessage, ...props },
        ref,
    ) => {
        const labels = useDesignSystemLabels();
        const validationMessage = invalidMessage ?? labels.dateInvalid;
        const input = useRef<HTMLInputElement>(null);

        useImperativeHandle(ref, () => input.current!, []);

        const [draft, setDraft] = useState(() => formatDateField(value, locale));
        const [invalidDraft, setInvalidDraft] = useState(false);
        const [editing, setEditing] = useState(false);
        // The long date shows only for the saved value, untouched: a draft being typed, or left invalid, stays as typed.
        const resting = !editing && !invalidDraft && draft === formatDateField(value, locale);
        const draftListener = useRef(onDraftChange);
        // Focus swaps the long date for the numeric text, which drops the selection Tab made; select the new text so
        // typing replaces it rather than appending to it.
        const selectOnEdit = useRef(false);

        draftListener.current = onDraftChange;

        useLayoutEffect(() => {
            if (!editing || !selectOnEdit.current) return;

            selectOnEdit.current = false;
            input.current?.select();
        }, [editing]);

        useEffect(() => {
            setDraft(formatDateField(value, locale));
            setInvalidDraft(false);
            input.current?.setCustomValidity('');
        }, [value, locale]);

        useEffect(() => {
            const parsed = parseDateField(draft, locale);

            draftListener.current?.({
                text: draft,
                value: parsed,
                valid: parsed !== undefined,
                message: invalidDraft ? validationMessage : undefined,
            });
        }, [draft, invalidDraft, locale, validationMessage]);

        return (
            <Input
                {...props}
                ref={input}
                type="text"
                inputMode="numeric"
                value={resting ? formatDateLong(value, locale) : draft}
                invalid={invalid || invalidDraft}
                onFocus={(event) => {
                    selectOnEdit.current = resting;
                    setEditing(true);
                    onFocus?.(event);
                }}
                onChange={(event) => {
                    const next = event.target.value;

                    event.currentTarget.setCustomValidity(
                        parseDateField(next, locale) === undefined ? validationMessage : '',
                    );
                    setDraft(next);
                    setInvalidDraft(false);
                }}
                onKeyDown={(event) => {
                    onKeyDown?.(event);

                    if (event.key === 'Enter' && !event.defaultPrevented) {
                        const next = parseDateField(draft, locale);

                        setInvalidDraft(next === undefined);

                        if (next !== undefined) onValueChange(next);
                    }
                }}
                onBlur={(event) => {
                    setEditing(false);

                    const next = parseDateField(draft, locale);

                    event.currentTarget.setCustomValidity(next === undefined ? validationMessage : '');
                    setInvalidDraft(next === undefined);

                    if (next !== undefined) {
                        onValueChange(next);
                        setDraft(formatDateField(next, locale));
                    }

                    onBlur?.(event);
                }}
            />
        );
    },
);
DateField.displayName = 'DateField';
