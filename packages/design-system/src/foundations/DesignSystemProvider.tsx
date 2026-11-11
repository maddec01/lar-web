/* oxlint-disable react/only-export-components -- Provider and consumer share the same UI label contract. */
import { LucideProvider } from 'lucide-react';
import { createContext, type ReactNode, useContext, useMemo } from 'react';

import { TooltipProvider } from '../overlays/Tooltip';

/** The design system's own words, in English. Apps pass their translations through DesignSystemProvider. */
export const defaultDesignSystemLabels = {
    close: 'Close',
    dateInvalid: 'Enter a valid date.',
    cancel: 'Cancel',
    retry: 'Try again',
    /** What a region that is still loading after a few seconds says under its skeleton (AsyncState). */
    stillTrying: 'Still trying…',
    toolbar: 'Toolbar',
    imageSize: (width: number, height: number) => `${width} × ${height}`,
    folders: {
        path: 'Folder path',
        selectedPath: (path: string) => `Selected folder: ${path}`,
        open: (name: string) => `Open ${name}`,
        chooseFolder: 'Choose folder',
        title: 'Select a folder',
        root: 'Root',
        upOneLevel: 'Up one level',
        loading: 'Loading folders',
        loadFailed: 'Couldn’t load folders',
        empty: 'No folders yet',
        loadMore: 'Load more',
        chooseThis: 'Choose this folder',
    },
    // The family's one theme vocabulary (Writing.mdx): an app translates these words, never renames them (no "Match
    // system" or "System default").
    theme: {
        label: 'Appearance',
        system: 'Follow system',
        light: 'Light',
        dark: 'Dark',
    },
    editor: {
        formatting: 'Formatting',
        bold: 'Bold',
        italic: 'Italic',
        heading: 'Heading',
        bulletedList: 'Bulleted list',
        numberedList: 'Numbered list',
        link: 'Link',
        linkUrl: 'Link URL',
        linkPlaceholder: 'https://…',
        apply: 'Apply',
        markdown: 'Markdown',
    },
    dialog: {
        expand: 'Expand',
        restoreSize: 'Restore size',
        /** A dirty Modal's question as the reader dismisses it (Modal `dirty`). */
        discardTitle: 'Discard changes?',
        discardConsequence: 'Your changes haven’t been saved. Discarding them can’t be undone.',
        discardConfirm: 'Discard changes',
        keepEditing: 'Keep editing',
    },
    /** SettingsDialog's, SettingsPage's and the settings save model's words. */
    settings: {
        title: 'Settings',
        navigation: 'Settings sections',
        search: 'Search settings',
        noMatchTitle: 'Nothing matches',
        noMatchDescription: 'Try another search, or clear it to see every setting.',
        clearSearch: 'Clear search',
        /** A child pane's way back to its section (SettingsChildPane). */
        back: 'Back',
        unsaved: 'Unsaved changes',
        saveChanges: 'Save changes',
        saved: 'Changes saved',
        saveFailed: 'Couldn’t save your changes. Try again.',
    },
    /** A CommandPalette's key hints, each after its key: "↑↓ move", "↵ select", "esc close", "⌫ remove filter". */
    commandPalette: {
        move: 'move',
        select: 'select',
        close: 'close',
        removeFilter: 'remove filter',
        leaveScope: 'back',
    },
};

export type DesignSystemLabels = typeof defaultDesignSystemLabels;

/** The labels an app translates: any group or label left out keeps its English default. */
export type DesignSystemLabelOverrides = {
    [Key in keyof DesignSystemLabels]?: DesignSystemLabels[Key] extends (...args: never[]) => unknown
        ? DesignSystemLabels[Key]
        : DesignSystemLabels[Key] extends object
          ? Partial<DesignSystemLabels[Key]>
          : DesignSystemLabels[Key];
};

const LabelContext = createContext(defaultDesignSystemLabels);

/** Lucide draws on a 24px grid at a 2px stroke; 1.75 matches the weight of Lar's type at the sizes icons use. */
const iconStrokeWidth = 1.75;

/** What every app wraps itself in once: the design system's labels in the app's language, Lar's icon weight, and one
 *  shared tooltip delay, so any component may show a tooltip. */
export function DesignSystemProvider({
    children,
    labels,
}: {
    /** The app. */
    children: ReactNode;
    /** The app's translations of the design system's own words; any left out keep their English default. */
    labels?: DesignSystemLabelOverrides;
}) {
    const value = useMemo(() => mergeLabels(labels), [labels]);

    return (
        <LabelContext.Provider value={value}>
            <LucideProvider strokeWidth={iconStrokeWidth}>
                <TooltipProvider>{children}</TooltipProvider>
            </LucideProvider>
        </LabelContext.Provider>
    );
}

function mergeLabels(labels: DesignSystemLabelOverrides | undefined): DesignSystemLabels {
    if (!labels) return defaultDesignSystemLabels;

    return {
        ...defaultDesignSystemLabels,
        ...labels,
        folders: { ...defaultDesignSystemLabels.folders, ...labels.folders },
        theme: { ...defaultDesignSystemLabels.theme, ...labels.theme },
        editor: { ...defaultDesignSystemLabels.editor, ...labels.editor },
        dialog: { ...defaultDesignSystemLabels.dialog, ...labels.dialog },
        settings: { ...defaultDesignSystemLabels.settings, ...labels.settings },
        commandPalette: { ...defaultDesignSystemLabels.commandPalette, ...labels.commandPalette },
    };
}

export function useDesignSystemLabels() {
    return useContext(LabelContext);
}
