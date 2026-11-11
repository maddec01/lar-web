import type { Meta, StoryObj } from '@storybook/react-vite';
import { RefreshCwIcon } from 'lucide-react';
import { type ComponentProps, type ReactNode, useState } from 'react';
import { fn, waitFor } from 'storybook/test';

import { Button } from '../actions/Button';
import { IconButton } from '../actions/IconButton';
import { Alert } from '../feedback/Alert';
import { StatusIndicator } from '../feedback/StatusIndicator';
import { Checkbox } from '../forms/Checkbox';
import { Field } from '../forms/Field';
import { Disclosure } from '../forms/FormDisclosure';
import { Input } from '../forms/Input';
import { Textarea } from '../forms/Textarea';
import { Stack } from '../layout/Flow';
import { SidebarNavigationItem } from '../layout/sidebar/SidebarNavigationItem';
import { SidebarPane } from '../layout/sidebar/SidebarPane';
import { Text } from '../typography/Typography';
import { Modal, useModalClose } from './Modal';
import { ModalExpandButton } from './ModalExpandButton';
import { ScrollFadeRegion } from './ScrollFadeRegion';

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

/** While loading, the dialog can’t be dismissed and its close button is disabled. */
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
                    <Text>1,204 of 3,890 files read. 12 files couldn’t be matched to an album.</Text>
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

/** A one-shot option for this submit sits at the footer’s start as a Checkbox, apart from the actions: it applies to
 *  this save only. A setting that stays is a row in the form (a Switch there), never a footer Switch. */
export const FooterOption: Story = {
    render: (args) => (
        <ModalDemo {...args} trigger="Add catalog">
            <Modal.Content title="Add catalog" description="Lar reads the folder and adds what it finds.">
                <Modal.Form onSubmit={(event) => event.preventDefault()}>
                    <Modal.Body>
                        <Field label="Folder">
                            <Input defaultValue="/mnt/media/music" />
                        </Field>
                    </Modal.Body>
                    <Footer>
                        <Checkbox label="Scan for changes now" defaultChecked />
                    </Footer>
                </Modal.Form>
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

/** A sidebar of panes (tabs): the dialog holds one height as panes change, so switching never makes it jump. */
export const Paned: Story = {
    render: (args) => (
        <ModalDemo {...args} trigger="Server settings">
            <PanedSettings />
        </ModalDemo>
    ),
};

/** A workspace whose body fills the dialog (an editor) holds the window's height under its fixed top line. */
export const Workspace: Story = {
    render: (args) => (
        <ModalDemo {...args} trigger="Open editor">
            <Modal.Content presentation="workspace" title="Edit metadata: Kind of Blue" focusFirstField={false}>
                <Modal.Body layout="fill">
                    <div className="border-line flex flex-1 items-center justify-center rounded-lg border border-dashed">
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

/** The header’s expand control grows the dialog to the window, under a 52px title bar, and back. */
export const Expandable: Story = {
    render: (args) => (
        <ModalDemo {...args}>
            <ExpandableContent />
        </ModalDemo>
    ),
};

/** A workspace that only reads, such as an item with no description yet, takes its content’s height: no empty half. */
export const ReadingWorkspace: Story = {
    render: (args) => (
        <ModalDemo {...args} trigger="Open item">
            <Modal.Content
                presentation="workspace"
                title="#61 Arr instances, catalog bindings and content requests"
                focusFirstField={false}
            >
                <Modal.Body>
                    <Stack space="group">
                        <Text tone="muted">No description.</Text>
                        <Alert tone="info" title="The ticket now says Improvement. This item still says Feature.">
                            Changes this item only. Nothing is written to the ticket.
                        </Alert>
                        <Text tone="muted">No comments.</Text>
                    </Stack>
                </Modal.Body>
                <Footer />
            </Modal.Content>
        </ModalDemo>
    ),
};

/** A paned dialog whose short pane `fitsContent` even with tabs: it keeps its width and takes the pane’s height. */
export const FitsContent: Story = {
    render: (args) => (
        <ModalDemo {...args} trigger="Find a ticket">
            <Modal.Content title="Add item" presentation="paned" fitsContent focusFirstField={false}>
                <Modal.Body>
                    <Text tone="muted">Find tickets outside your list, or open one you’ve already added.</Text>
                </Modal.Body>
                <Footer />
            </Modal.Content>
        </ModalDemo>
    ),
};

/** One destination doesn’t need a navigation sidebar. */
export const SingleSection: Story = {
    args: {},
    render: () => (
        <ModalDemo onClose={fn()}>
            <Modal.Content
                title="Add catalog"
                sidebarSections={1}
                sidebar={<nav aria-label="Catalog sections">General</nav>}
            >
                <Modal.Body>Choose the folder to add to your library.</Modal.Body>
            </Modal.Content>
        </ModalDemo>
    ),
};

/** Every scrolling region in a dialog fades at an edge only while content runs past it: no app opts in. These stories
 *  overflow each presentation. An editor whose first field takes focus as it opens keeps its fade (the regression the
 *  server’s Edit movie showed): a focused field scrolls clear of the fade instead of lifting it. */
function ManyFields({ count = 14 }: { count?: number }) {
    return (
        <div className="flex flex-col gap-4">
            {Array.from({ length: count }, (_, index) => (
                <Field
                    key={index}
                    label={['Title', 'Original title', 'Year', 'Tagline', 'Studio', 'Director'][index % 6]!}
                >
                    <Input defaultValue={index === 0 ? 'Dune: Part Two' : ''} />
                </Field>
            ))}
        </div>
    );
}

export const OverflowingEditor: Story = {
    render: (args) => (
        <ModalDemo {...args} trigger="Edit movie">
            <Modal.Content title="Edit movie" description="Change what Lar shows for this movie.">
                <Modal.Body>
                    <ManyFields />
                </Modal.Body>
                <Footer />
            </Modal.Content>
        </ModalDemo>
    ),
};

function OverflowingPanes() {
    const panes = Array.from({ length: 16 }, (_, index) => `Section ${index + 1}`);
    const [pane, setPane] = useState(panes[0]!);

    return (
        <Modal.Content
            title={pane}
            accessibleTitle="Server settings"
            focusFirstField={false}
            sidebar={
                <SidebarPane label="Settings">
                    {panes.map((label) => (
                        <SidebarNavigationItem key={label} active={pane === label} onClick={() => setPane(label)}>
                            {label}
                        </SidebarNavigationItem>
                    ))}
                </SidebarPane>
            }
        >
            <Modal.Body>
                <ManyFields />
            </Modal.Body>
            <Footer />
        </Modal.Content>
    );
}

/** A settings pane longer than the dialog, with an opened disclosure and a status its test reveals. */
function LongPaneWithDisclosure() {
    const [tested, setTested] = useState(false);
    const panes = ['Server', 'Catalogs', 'Scans', 'Users', 'Remote access', 'Playback', 'Logs', 'Diagnostics'];

    return (
        <Modal.Content
            title="Remote access"
            accessibleTitle="Server settings"
            description="Set up internet access and check whether devices outside your home can connect."
            focusFirstField={false}
            sidebar={
                <SidebarPane label="Settings">
                    {panes.map((label) => (
                        <SidebarNavigationItem key={label} active={label === 'Remote access'} onClick={fn()}>
                            {label}
                        </SidebarNavigationItem>
                    ))}
                </SidebarPane>
            }
        >
            <Modal.Body>
                <div className="flex flex-col gap-4">
                    <ManyFields count={8} />
                    <Disclosure label="Server addresses" defaultOpen>
                        <Text>
                            Use these addresses in Lar apps. An outside device confirms which remote address works.
                        </Text>
                    </Disclosure>
                    <ManyFields count={6} />
                    {/* A status light’s screen-reader word is absolutely positioned: it must stay inside the body. */}
                    <StatusIndicator state="ready" srLabel="Outside connection works" />
                    <Button variant="secondary" onClick={() => setTested(true)}>
                        Test connection
                    </Button>
                    {tested ? (
                        <div
                            ref={(status) => status?.scrollIntoView({ block: 'nearest' })}
                            data-testid="connection-status"
                        >
                            <Alert tone="success" title="Connection healthy" />
                        </div>
                    ) : null}
                </div>
            </Modal.Body>
            <Footer />
        </Modal.Content>
    );
}

/** The frame never scrolls: opening a disclosure or revealing a status deep in a long pane scrolls only the body, so
 *  the title, close button, sidebar and footer stay in view. */
export const LongPaneWithOpenedDisclosure: Story = {
    render: (args) => (
        <ModalDemo {...args} trigger="Server settings">
            <LongPaneWithDisclosure />
        </ModalDemo>
    ),
};

/** A paned dialog: the long pane list and the long pane both fade. */
export const OverflowingPaned: Story = {
    render: (args) => (
        <ModalDemo {...args} trigger="Server settings">
            <OverflowingPanes />
        </ModalDemo>
    ),
};

/** A workspace whose body fills the dialog and whose picker scrolls inside it: the picker’s region fades too. */
export const OverflowingWorkspacePicker: Story = {
    render: (args) => (
        <ModalDemo {...args} trigger="Choose a cover">
            <Modal.Content presentation="workspace" title="Cover: Field guide" focusFirstField={false}>
                <Modal.Body layout="fill">
                    <ScrollFadeRegion className="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-3 p-1">
                        {Array.from({ length: 24 }, (_, index) => (
                            <div key={index} aria-hidden="true" className="bg-fill-muted aspect-[2/3] rounded-lg" />
                        ))}
                    </ScrollFadeRegion>
                </Modal.Body>
                <Footer />
            </Modal.Content>
        </ModalDemo>
    ),
};

/** A confirmation with more to say than fits a short window still fades. */
export const OverflowingConfirm: Story = {
    render: (args) => (
        <ModalDemo {...args} trigger="Delete catalog">
            <Modal.Content presentation="confirm" title="Delete Music?" focusFirstField={false}>
                <Modal.Body>
                    <div className="flex flex-col gap-3">
                        {Array.from({ length: 24 }, (_, index) => (
                            <Text key={index}>/mnt/media/music/Album {index + 1} stays on disk.</Text>
                        ))}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary">Cancel</Button>
                    <Button variant="destructive">Delete catalog</Button>
                </Modal.Footer>
            </Modal.Content>
        </ModalDemo>
    ),
};

/** An editor that knows when it holds unsaved changes: once the name is edited, Escape, a click outside, the close
 *  button and Cancel ask to discard them first; "Keep editing" returns to the form with the edit intact. */
function DirtyEditor({ onClose }: { onClose: () => void }) {
    const [open, setOpen] = useState(true);
    const [name, setName] = useState('Family photos');
    const close = () => {
        setOpen(false);
        setName('Family photos');
        onClose();
    };

    return (
        <>
            <Button variant="secondary" onClick={() => setOpen(true)}>
                Edit catalog
            </Button>
            {open ? (
                <Modal dirty={name !== 'Family photos'} onClose={close}>
                    <Modal.Content title="Edit catalog" description="Change how this catalog is named.">
                        <Modal.Form
                            onSubmit={(event) => {
                                event.preventDefault();
                                close();
                            }}
                        >
                            <Modal.Body>
                                <Field label="Name">
                                    <Input value={name} onChange={(event) => setName(event.target.value)} />
                                </Field>
                            </Modal.Body>
                            <Modal.Footer>
                                <Modal.Cancel />
                                <Button type="submit">Save</Button>
                            </Modal.Footer>
                        </Modal.Form>
                    </Modal.Content>
                </Modal>
            ) : null}
        </>
    );
}

export const DirtyDismissGuard: Story = {
    render: (args) => <DirtyEditor onClose={args.onClose} />,
};

/** A link in the dialog's body to another dialog: it leaves through the same guard as closing. */
function OpenCatalogLink({ name, onOpen }: { name: string; onOpen: (name: string) => void }) {
    const requestClose = useModalClose();

    return (
        <Button variant="secondary" size="sm" onClick={() => requestClose(() => onOpen(name))}>
            Open {name}
        </Button>
    );
}

/** One catalog's editor at a time, which can open the next catalog's in its place. */
function LinkedEditors({ onClose }: { onClose: () => void }) {
    const [catalog, setCatalog] = useState<string | null>('Family photos');
    const [name, setName] = useState('Family photos');
    const open = (next: string | null) => {
        setCatalog(next);
        setName(next ?? '');
    };

    return (
        <>
            <Button variant="secondary" onClick={() => open('Family photos')}>
                Edit catalog
            </Button>
            {catalog === null ? null : (
                <Modal
                    key={catalog}
                    dirty={name !== catalog}
                    onClose={() => {
                        open(null);
                        onClose();
                    }}
                >
                    <Modal.Content title={`Edit ${catalog}`} description="Change how this catalog is named.">
                        <Modal.Body>
                            <Stack space="group" align="start">
                                <Field label="Name">
                                    <Input value={name} onChange={(event) => setName(event.target.value)} />
                                </Field>
                                <OpenCatalogLink
                                    name={catalog === 'Holiday photos' ? 'Family photos' : 'Holiday photos'}
                                    onOpen={open}
                                />
                            </Stack>
                        </Modal.Body>
                        <Modal.Footer>
                            <Modal.Cancel />
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
            )}
        </>
    );
}

/** Leaving for another dialog with unsaved changes asks the same question as closing (`useModalClose()`'s
 *  `requestClose(next)`), then opens the other catalog on "Discard changes" instead of closing. */
export const DiscardThenNavigate: Story = {
    render: (args) => <LinkedEditors onClose={args.onClose} />,
};

/** The discard question, as Escape on a dirty editor asks it: ConfirmDialog's look, its one destructive button. */
export const DiscardQuestion: Story = {
    render: (args) => <DirtyEditor onClose={args.onClose} />,
    play: async () => {
        const input = await waitFor(() => {
            const field = document.querySelector<HTMLInputElement>('[role="dialog"] input');

            if (!field) throw new Error('The editor hasn’t opened yet.');

            return field;
        });
        const value = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');

        value?.set?.call(input, 'Family photos 2004–2024');
        input.dispatchEvent(new Event('input', { bubbles: true }));
        await waitFor(() => {
            if (input.value !== 'Family photos 2004–2024') throw new Error('The edit hasn’t landed yet.');
        });
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        await waitFor(() => {
            if (!document.querySelector('[role="alertdialog"]')) throw new Error('The question hasn’t opened yet.');
        });
    },
};
