import type { Meta, StoryObj } from '@storybook/react-vite';
import { RefreshCwIcon } from 'lucide-react';
import { type ComponentProps, type ReactNode, useState } from 'react';
import { fn } from 'storybook/test';

import { Button } from '../actions/Button';
import { IconButton } from '../actions/IconButton';
import { Field } from '../forms/Field';
import { Input } from '../forms/Input';
import { Textarea } from '../forms/Textarea';
import { SidebarNavigationItem } from '../layout/sidebar/SidebarNavigationItem';
import { SidebarPane } from '../layout/sidebar/SidebarPane';
import { Text } from '../typography/Typography';
import { Modal } from './Modal';
import { ModalExpandButton } from './ModalExpandButton';

/** Opens with the story, and reopens from the button after it is closed. */
function ModalDemo({
    loading,
    onClose,
    trigger = 'Edit catalog',
    children,
}: ComponentProps<typeof Modal> & { trigger?: string }) {
    const [open, setOpen] = useState(true);

    return (
        <>
            <Button variant="secondary" onClick={() => setOpen(true)}>
                {trigger}
            </Button>
            {open ? (
                <Modal
                    loading={loading}
                    onClose={() => {
                        setOpen(false);
                        onClose();
                    }}
                >
                    {children}
                </Modal>
            ) : null}
        </>
    );
}

function CatalogFields() {
    return (
        <div className="flex flex-col gap-4">
            <Field label="Name">
                <Input defaultValue="Family photos" />
            </Field>
            <Field label="Folder" helperText="Lar watches this folder and adds new files as they appear.">
                <Input defaultValue="/mnt/media/photos/family" />
            </Field>
            <Field label="Description" optionalText="Optional">
                <Textarea defaultValue="Holidays, birthdays and everything in between since 2004." />
            </Field>
        </div>
    );
}

function Footer({ children }: { children?: ReactNode }) {
    return (
        <Modal.Footer leading={children}>
            <Button variant="secondary">Cancel</Button>
            <Button variant="primary">Save</Button>
        </Modal.Footer>
    );
}

const meta = {
    title: 'Overlays/Modal',
    component: Modal,
    args: { onClose: fn(), loading: false, children: null },
    render: (args) => (
        <ModalDemo {...args}>
            <Modal.Content title="Edit catalog" description="Change how this catalog is named and where it lives.">
                <Modal.Form onSubmit={(event) => event.preventDefault()}>
                    <Modal.Body>
                        <CatalogFields />
                    </Modal.Body>
                    <Footer />
                </Modal.Form>
            </Modal.Content>
        </ModalDemo>
    ),
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** While loading, the dialog cannot be dismissed and its close button is disabled. */
export const Loading: Story = { args: { loading: true } };

export const HeaderActionsAndFooterLeading: Story = {
    render: (args) => (
        <ModalDemo {...args} trigger="Show job">
            <Modal.Content
                title="Scan /mnt/media/music"
                description="Started 4 minutes ago by Pedro."
                headerActions={<IconButton aria-label="Restart job" icon={<RefreshCwIcon />} />}
            >
                <Modal.Body>
                    <Text>1,204 of 3,890 files read. 12 files could not be matched to an album.</Text>
                </Modal.Body>
                <Footer>
                    <Text as="span" variant="caption" tone="muted">
                        Last updated a few seconds ago
                    </Text>
                </Footer>
            </Modal.Content>
        </ModalDemo>
    ),
};

function PanedSettings() {
    const [pane, setPane] = useState('general');
    const panes = [
        ['general', 'General'],
        ['playback', 'Playback'],
        ['libraries', 'Libraries'],
        ['users', 'Users'],
    ] as const;

    return (
        <Modal.Content
            title={panes.find(([id]) => id === pane)![1]}
            accessibleTitle="Server settings"
            sidebar={
                <SidebarPane label="Settings">
                    {panes.map(([id, label]) => (
                        <SidebarNavigationItem key={id} active={pane === id} onClick={() => setPane(id)}>
                            {label}
                        </SidebarNavigationItem>
                    ))}
                </SidebarPane>
            }
        >
            <Modal.Body>
                <Modal.Pane active={pane === 'general'}>
                    <Field label="Server name">
                        <Input defaultValue="Living room NAS" />
                    </Field>
                </Modal.Pane>
                <Modal.Pane active={pane === 'playback'}>
                    <Field label="Maximum streaming bitrate">
                        <Input defaultValue="20 Mbps" />
                    </Field>
                </Modal.Pane>
                <Modal.Pane active={pane === 'libraries'}>
                    <Text>Music, Movies, TV shows, Photos and Books.</Text>
                </Modal.Pane>
                <Modal.Pane active={pane === 'users'}>
                    <Text>Pedro (administrator), Ana, Guests.</Text>
                </Modal.Pane>
            </Modal.Body>
            <Footer />
        </Modal.Content>
    );
}

/** A sidebar of panes; the dialog keeps one height as panes change. */
export const Paned: Story = {
    render: (args) => (
        <ModalDemo {...args} trigger="Server settings">
            <PanedSettings />
        </ModalDemo>
    ),
};

export const Workspace: Story = {
    render: (args) => (
        <ModalDemo {...args} trigger="Open editor">
            <Modal.Content presentation="workspace" title="Edit metadata: Kind of Blue" focusFirstField={false}>
                <Modal.Body layout="fill">
                    <div className="border-base-300 flex flex-1 items-center justify-center rounded-lg border border-dashed">
                        <Text tone="muted">Workspace content fills the dialog.</Text>
                    </div>
                </Modal.Body>
                <Footer />
            </Modal.Content>
        </ModalDemo>
    ),
};

/** The body scrolls with fading edges while the header and footer stay put. */
export const LongContent: Story = {
    render: (args) => (
        <ModalDemo {...args} trigger="Show release notes">
            <Modal.Content
                title="What’s new in Lar Server 0.15 — faster scans, smarter matching and a redesigned photo timeline"
                description="Released 2 November 2026."
                focusFirstField={false}
            >
                <Modal.Body>
                    <div className="flex flex-col gap-3">
                        {Array.from({ length: 30 }, (_, index) => (
                            <Text key={index}>
                                {index + 1}. Library scans now read folders in parallel, so large music collections are
                                indexed up to three times faster on multi-core servers.
                            </Text>
                        ))}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary">Got it</Button>
                </Modal.Footer>
            </Modal.Content>
        </ModalDemo>
    ),
};

function ExpandableContent() {
    const [expanded, setExpanded] = useState(false);

    return (
        <Modal.Content
            title="Edit catalog"
            expanded={expanded}
            headerActions={
                <ModalExpandButton
                    expanded={expanded}
                    onToggle={() => setExpanded((on) => !on)}
                    shortcut={{ label: '⌘⇧E', keys: 'Meta+Shift+E' }}
                />
            }
        >
            <Modal.Body>
                <CatalogFields />
            </Modal.Body>
        </Modal.Content>
    );
}

/** The header's expand control grows the dialog to the window, under a 52px title bar, and back. */
export const Expandable: Story = {
    render: (args) => (
        <ModalDemo {...args}>
            <ExpandableContent />
        </ModalDemo>
    ),
};
