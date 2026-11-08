/** A value a form submits that nobody edits in place, such as a pick made in a popover: a hidden field. */
export function HiddenField({
    name,
    value,
}: {
    /** The form field's name. */
    name: string;
    /** The value the form submits under it. */
    value: string;
}) {
    return <input type="hidden" name={name} value={value} />;
}
