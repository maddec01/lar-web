/* oxlint-disable react/only-export-components -- Compound members are exported through Drawer. */
import {
    Drawer as NinnaDrawer,
    type DrawerBodyProps,
    type DrawerContentProps,
    type DrawerFooterProps,
    type DrawerTriggerProps,
} from '@ninna-ui/overlays';
import { XIcon } from 'lucide-react';
import {
    type ComponentProps,
    type ForwardRefExoticComponent,
    forwardRef,
    type ReactNode,
    type RefAttributes,
    useCallback,
} from 'react';

import { IconButton } from '../actions/IconButton';
import { CompactAlertContext } from '../feedback/CompactAlertContext';
import { useDesignSystemLabels } from '../foundations/DesignSystemProvider';
import { HeadingBase, TextBase } from '../typography/Typography';
import { useModalAutoFocus } from './useModalAutoFocus';
import { scrollFadeBodyClassName, useScrollFade } from './useScrollFade';

interface DrawerContentPolicyProps extends Omit<
    DrawerContentProps,
    'className' | 'color' | 'placement' | 'size' | 'style' | 'title'
> {
    /** The drawer's heading and accessible name. */
    title: string;
    /** A line under the title, such as what the drawer is about. */
    subtitle?: ReactNode;
    /** The line under the title when there is no `subtitle`, read as the drawer's description. */
    description?: string;
    /** The drawer's body and footer. */
    children?: ReactNode;
    /** Header controls shown before the close button. */
    actions?: ReactNode;
    /** Runs as the drawer closes; preventing its default keeps focus from returning to the opening control. */
    onCloseAutoFocus?: (event: Event) => void;
}

function DrawerRoot(props: ComponentProps<typeof NinnaDrawer>) {
    return <NinnaDrawer {...props} />;
}

const DrawerContent = forwardRef<HTMLDivElement, DrawerContentPolicyProps>(
    ({ actions, children, description, subtitle, title, onCloseAutoFocus, ...props }, ref) => {
        const labels = useDesignSystemLabels();
        const autoFocus = useModalAutoFocus();
        const focusProps = {
            // A drawer opens on its first field, or else on the drawer itself, which its title names: never on its
            // first icon button, which would wear a focus ring the reader never asked for. Tab moves into it from there.
            onOpenAutoFocus: (event: Event) => {
                autoFocus.onOpenAutoFocus(event);

                if (event.defaultPrevented || !(event.target instanceof HTMLElement)) return;

                event.preventDefault();
                event.target.focus({ preventScroll: true });
            },
            onCloseAutoFocus: (event: Event) => {
                onCloseAutoFocus?.(event);

                if (!event.defaultPrevented) autoFocus.onCloseAutoFocus(event);
            },
        };

        return (
            <NinnaDrawer.Content
                ref={ref}
                {...props}
                {...focusProps}
                title={title}
                description={description}
                placement="right"
                size="lg"
                className="flex w-full max-w-xl flex-col overflow-clip focus-visible:outline-none"
            >
                <header data-slot="drawer-header" className="border-line shrink-0 border-b px-5 py-5 sm:px-6 sm:py-6">
                    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                        <HeadingBase as="h2" className="min-w-0 wrap-break-word" variant="section">
                            {title}
                        </HeadingBase>
                        <div className="flex items-center gap-1">
                            {actions}
                            <NinnaDrawer.Close asChild>
                                <IconButton aria-label={labels.close} icon={<XIcon />} variant="header" />
                            </NinnaDrawer.Close>
                        </div>
                    </div>
                    {(subtitle ?? description) ? (
                        <TextBase className="mt-2 wrap-break-word" variant="description" tone="muted">
                            {subtitle ?? description}
                        </TextBase>
                    ) : null}
                </header>
                <CompactAlertContext value={true}>{children}</CompactAlertContext>
            </NinnaDrawer.Content>
        );
    },
);

DrawerContent.displayName = 'Drawer.Content';

const DrawerBody = forwardRef<HTMLDivElement, Omit<DrawerBodyProps, 'className' | 'color' | 'style'>>((props, ref) => {
    const { setViewport } = useScrollFade({ body: true });
    const bodyRef = useCallback(
        (element: HTMLDivElement | null) => {
            setViewport(element);

            if (typeof ref === 'function') ref(element);
            else if (ref) ref.current = element;
        },
        [ref, setViewport],
    );

    return (
        <NinnaDrawer.Body
            tabIndex={0}
            ref={bodyRef}
            {...props}
            className={`relative min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6 ${scrollFadeBodyClassName}`}
        />
    );
});

DrawerBody.displayName = 'Drawer.Body';

const DrawerFooter = forwardRef<HTMLDivElement, Omit<DrawerFooterProps, 'className' | 'color' | 'style'>>(
    (props, ref) => (
        <NinnaDrawer.Footer
            ref={ref}
            {...props}
            className="border-line shrink-0 justify-between border-t px-5 py-3 sm:px-6 sm:py-3"
        />
    ),
);

DrawerFooter.displayName = 'Drawer.Footer';

/** What opens the drawer, usually with `asChild` around a Button. */
const DrawerTrigger: ForwardRefExoticComponent<
    Omit<DrawerTriggerProps, 'className' | 'color' | 'style'> & RefAttributes<HTMLButtonElement>
> = NinnaDrawer.Trigger;

export const Drawer = Object.assign(DrawerRoot, {
    Body: DrawerBody,
    Content: DrawerContent,
    Footer: DrawerFooter,
    Trigger: DrawerTrigger,
});
