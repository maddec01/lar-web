/** A value a form submits that nobody edits in place, such as a pick made in a popover: a hidden field. */
export function HiddenField({ name, value }: { name: string; value: string }) {
    return <input type="hidden" name={name} value={value} />;
}
