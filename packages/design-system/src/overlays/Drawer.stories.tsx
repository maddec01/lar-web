import type { Meta, StoryObj } from '@storybook/react-vite';
import { ExternalLinkIcon, PencilIcon } from 'lucide-react';
import { fn } from 'storybook/test';

import { Button } from '../actions/Button';
import { IconButton } from '../actions/IconButton';
import { Badge } from '../display/Badge';
import { ProgressStatusRow } from '../feedback/ProgressStatusRow';
import { Text } from '../typography/Typography';
import { Drawer } from './Drawer';

const meta = {
    title: 'Overlays/Drawer',
    component: Drawer,
    args: { defaultOpen: true, onOpenChange: fn(), children: null },
    render: (args) => (
        <Drawer {...args}>
            <Drawer.Trigger asChild>
                <Button variant="secondary">Show job</Button>
            </Drawer.Trigger>
            <Drawer.Content title="Scan /mnt/media/music" subtitle="Started 4 minutes ago by Pedro">
                <Drawer.Body>
                    <div className="flex flex-col gap-4">
                        <ProgressStatusRow
                            active
                            label="Reading files"
                            detail="1,204 of 3,890 files"
                            progress={{ value: 1204, max: 3890 }}
                        />
                        <Text>12 files could not be matched to an album and were added to Unmatched.</Text>
                    </div>
                </Drawer.Body>
                <Drawer.Footer>
                    <Button variant="destructive-quiet">Cancel job</Button>
                    <Button variant="secondary">Close</Button>
                </Drawer.Footer>
            </Drawer.Content>
        </Drawer>
    ),
} satisfies Meta<typeof Drawer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Open: Story = {};

export const Closed: Story = { args: { defaultOpen: false } };

export const WithHeaderActions: Story = {
    render: (args) => (
        <Drawer {...args}>
            <Drawer.Trigger asChild>
                <Button variant="secondary">Show track</Button>
            </Drawer.Trigger>
            <Drawer.Content
                title="So What"
                subtitle={
                    <span className="flex items-center gap-2">
                        Miles Davis · Kind of Blue <Badge tone="accent">FLAC</Badge>
                    </span>
                }
                actions={
                    <>
                        <IconButton aria-label="Edit metadata" icon={<PencilIcon />} variant="header" />
                        <IconButton aria-label="Open album" icon={<ExternalLinkIcon />} variant="header" />
                    </>
                }
            >
                <Drawer.Body>
                    <Text>9:22 · 24-bit / 96 kHz · 112 MB</Text>
                </Drawer.Body>
            </Drawer.Content>
        </Drawer>
    ),
};

export const LongContent: Story = {
    render: (args) => (
        <Drawer {...args}>
            <Drawer.Trigger asChild>
                <Button variant="secondary">Show log</Button>
            </Drawer.Trigger>
            <Drawer.Content
                title="Transcoding “The Lord of the Rings: The Return of the King (Extended Edition)”"
                description="4K HDR to 1080p H.264 for the living room TV, using the CPU because hardware acceleration is unavailable."
            >
                <Drawer.Body>
                    <div className="flex flex-col gap-2 font-mono text-xs">
                        {Array.from({ length: 80 }, (_, index) => (
                            <span key={index}>
                                [00:{String(index).padStart(2, '0')}:12] frame={index * 1440} fps=48 speed=2.0x
                            </span>
                        ))}
                    </div>
                </Drawer.Body>
                <Drawer.Footer>
                    <Button variant="destructive-quiet">Stop</Button>
                    <Button variant="secondary">Close</Button>
                </Drawer.Footer>
            </Drawer.Content>
        </Drawer>
    ),
};
