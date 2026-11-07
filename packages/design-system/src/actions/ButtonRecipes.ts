// The app Button's filled and outlined recipes, which ButtonLink's compact links draw too.

export const primaryRecipe =
    'border-primary bg-primary text-primary-content shadow-xs shadow-primary/24 inset-shadow-[0_1px_rgb(255_255_255/16%)] hover:bg-primary/90 active:shadow-none active:inset-shadow-[0_1px_rgb(0_0_0/8%)]';

export const outlineRecipe =
    'border-base-400/90 bg-base-100 text-base-content shadow-xs/5 hover:bg-base-200/70 dark:border-base-400 dark:bg-base-400/30 dark:hover:bg-base-400/60 [&_[data-slot=icon]]:text-base-700';

export const ghostRecipe =
    'border-transparent text-base-content hover:bg-base-200 data-[state=open]:bg-base-200 [&_[data-slot=icon]]:text-base-700';
