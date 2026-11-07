/* oxlint-disable react/only-export-components -- Provider and consumer share the same UI label contract. */
import { LucideProvider } from 'lucide-react';
import { createContext, type ReactNode, useContext, useMemo } from 'react';

/** The design system's own words, in English. Apps pass their translations through DesignSystemProvider. */
export const defaultDesignSystemLabels = {
    close: 'Close',
    cancel: 'Cancel',
    retry: 'Try again',
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
        loadFailed: 'Could not load folders',
        empty: 'No folders',
        loadMore: 'Load more',
        chooseThis: 'Choose this folder',
    },
    theme: {
        label: 'Appearance',
        system: 'Match system',
        light: 'Light',
        dark: 'Dark',
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

export function DesignSystemProvider({
    children,
    labels,
}: {
    children: ReactNode;
    labels?: DesignSystemLabelOverrides;
}) {
    const value = useMemo(() => mergeLabels(labels), [labels]);

    return (
        <LabelContext.Provider value={value}>
            <LucideProvider strokeWidth={iconStrokeWidth}>{children}</LucideProvider>
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
    };
}

export function useDesignSystemLabels() {
    return useContext(LabelContext);
}
