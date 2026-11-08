// Building blocks for an app's own UI layer (`src/ui/**`): the styleable bases behind the public components, which take
// a class for the composition's layout, and the hooks and recipes the design system's compositions share. An app
// builds its product compositions from these, the public components and the tokens; a composition a second product
// needs is promoted into the main entry. Feature code never imports this entry (lint enforces it).
export { ButtonBase } from './actions/Button';
export { BadgeBase } from './display/Badge';
export { type VisibleBounds, useVisibleBounds } from './display/VisibleBounds';
export { type SplashLine, type SplashMark, SplashView } from './feedback/AppSplash';
export { SpinnerIcon } from './feedback/Loading';
export { StatusIndicatorBase, type StatusDotTone } from './feedback/StatusIndicator';
export { FormFieldsetBase } from './forms/FormDisclosure';
export { InputBase } from './forms/Input';
export { InlineBase, StackBase } from './layout/Flow';
export { GlassBarBase } from './layout/GlassBar';
export { useScrolled } from './layout/useScrolled';
export { ScrollFadeRegion } from './overlays/ScrollFadeRegion';
export { TooltipPopupBase, TooltipTriggerBase } from './overlays/Tooltip';
export { scrollFadeClassName, useScrollFade } from './overlays/useScrollFade';
export { LinkBase, LinkBoxBase, LinkOverlayBase } from './typography/Link';
export { linkRecipe } from './typography/LinkRecipe';
export { softBreaks } from './typography/SoftBreaks';
export { HeadingBase, TextBase } from './typography/Typography';
