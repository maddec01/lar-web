import { type ReactNode, useState } from 'react';

import { Button } from '../actions/Button';
import { Stack } from '../layout/Flow';
import { Modal } from '../overlays/Modal';
import { Text } from '../typography/Typography';

type TextPreviewProps =
    | { loading: true }
    | {
          loading?: false;
          children?: ReactNode;
          value: string;
          moreLabel: string;
          language?: string;
          title: string;
      };

export function TextPreview(props: TextPreviewProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div className="flex max-w-3xl min-w-0 items-center gap-3">
                <Text
                    lang={props.loading ? undefined : props.language}
                    tone="muted"
                    className={`min-w-0 truncate leading-6 ${props.loading ? 'flex-1' : ''}`}
                    loading={props.loading}
                >
                    {!props.loading && props.value}
                </Text>
                {props.loading ? (
                    <Text className="w-20 shrink-0 leading-6" loading />
                ) : (
                    <Button
                        className="h-auto shrink-0 px-0 py-0 text-sm leading-6 before:-inset-y-2.5"
                        aria-haspopup="dialog"
                        onClick={() => setOpen(true)}
                        variant="quiet"
                    >
                        {props.moreLabel}
                    </Button>
                )}
            </div>
            {!props.loading && open ? (
                <Modal onClose={() => setOpen(false)}>
                    <Modal.Content title={props.title}>
                        <Modal.Body>
                            <Stack space="section">
                                {props.children}
                                <Text
                                    lang={props.language}
                                    className="leading-7 text-pretty wrap-break-word whitespace-pre-line"
                                    variant="description"
                                >
                                    {props.value}
                                </Text>
                            </Stack>
                        </Modal.Body>
                    </Modal.Content>
                </Modal>
            ) : null}
        </>
    );
}
