// The app Button's filled and outlined recipes, which ButtonLink's compact links draw too.

export const primaryRecipe =
    'border-primary bg-primary text-primary-content shadow-(--shadow-raised) shadow-primary-ring inset-shadow-(--shadow-highlight) hover:bg-primary-fill-hover active:shadow-none active:inset-shadow-(--shadow-pressed)';

export const outlineRecipe =
    'border-line-control bg-surface-control text-fg shadow-(--shadow-raised) hover:bg-fill-hover [&_[data-slot=icon]]:text-fg-muted';

export const ghostRecipe =
    'border-transparent text-fg hover:bg-fill-hover data-[state=open]:bg-fill-hover [&_[data-slot=icon]]:text-fg-muted';

/** The primary colour tinted on the card, with no border or shadow, deeper on hover and while its popup is open: "you
 *  can start this". */
export const tintedRecipe =
    'border-transparent bg-primary-surface text-primary-fg shadow-none not-disabled:not-aria-disabled:hover:bg-primary-surface-hover data-[state=open]:bg-primary-surface-hover [&_[data-slot=icon]]:text-current';
