import { createContext } from 'react';

/** Where a FormField's row sits: `panel` inside a settings panel (a FormSection or a settings InsetPanel), padded to
 *  the panel's rows; `plain` on the surface itself (a FormStack in a dialog), flush with the dialog's own text. */
export const FormRowsContext = createContext<'panel' | 'plain'>('panel');
