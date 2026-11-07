/* oxlint-disable react/only-export-components -- Compound members are exported through Drawer. */
import {
    Drawer as NinnaDrawer,
    type DrawerBodyProps,
    type DrawerContentProps,
    type DrawerFooterProps,
} from '@ninna-ui/overlays';
import { XIcon } from 'lucide-react';
import { type ComponentProps, forwardRef, type ReactNode } from 'react';

import { IconButton } from '../actions/IconButton';
import { useDesignSystemLabels } from '../foundations/DesignSystemProvider';
import { Heading, Text } from '../typography/Typography';
import { useModalAutoFocus } from './useModalAutoFocus';

interface DrawerContentPolicyProps extends Omit<DrawerContentProps, 'className' | 'placement' | 'size' | 'title'> {
    title: string;
    subtitle?: ReactNode;
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
            ...autoFocus,
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
                className="flex w-full max-w-xl flex-col overflow-hidden"
            >
                <header
                    data-slot="drawer-header"
                    className="border-base-300 shrink-0 border-b px-5 py-5 sm:px-6 sm:py-6"
                >
                    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                        <Heading as="h2" className="min-w-0 wrap-break-word" variant="section">
                            {title}
                        </Heading>
                        <div className="flex items-center gap-1">
                            {actions}
                            <NinnaDrawer.Close asChild>
                                <IconButton aria-label={labels.close} icon={<XIcon />} variant="header" />
                            </NinnaDrawer.Close>
                        </div>
                    </div>
                    {(subtitle ?? description) ? (
                        <Text className="mt-2 wrap-break-word" variant="description" tone="muted">
                            {subtitle ?? description}
                        </Text>
                    ) : null}
                </header>
                {children}
            </NinnaDrawer.Content>
        );
    },
);

DrawerContent.displayName = 'Drawer.Content';

const DrawerBody = forwardRef<HTMLDivElement, Omit<DrawerBodyProps, 'className'>>((props, ref) => (
    <NinnaDrawer.Body
        ref={ref}
        {...props}
        className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6"
    />
));

DrawerBody.displayName = 'Drawer.Body';

const DrawerFooter = forwardRef<HTMLDivElement, Omit<DrawerFooterProps, 'className'>>((props, ref) => (
    <NinnaDrawer.Footer
        ref={ref}
        {...props}
        className="border-base-300 shrink-0 justify-between border-t px-5 py-3 sm:px-6 sm:py-3"
    />
));

DrawerFooter.displayName = 'Drawer.Footer';

export const Drawer = Object.assign(DrawerRoot, {
    Body: DrawerBody,
    Content: DrawerContent,
    Footer: DrawerFooter,
    Trigger: NinnaDrawer.Trigger,
});
