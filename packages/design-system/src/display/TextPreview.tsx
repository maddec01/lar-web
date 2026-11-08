import { type ReactNode, useState } from 'react';

import { ButtonBase as Button } from '../actions/Button';
import { Stack } from '../layout/Flow';
import { Modal } from '../overlays/Modal';
import { TextBase } from '../typography/Typography';

type TextPreviewProps =
    | {
          /** Draws skeleton lines while the text loads. */
          loading: true;
      }
    | {
          loading?: false;
          /** Content under the clipped text, such as where it comes from. */
          children?: ReactNode;
          /** The whole text, clipped to a few lines, with all of it in a dialog. */
          value: string;
          /** The button that opens the whole text, such as "Read more". */
          moreLabel: string;
          /** The text's language (a BCP 47 tag), for hyphenation and screen readers. */
          language?: string;
          /** The dialog's title, such as "Overview". */
          title: string;
      };

/** A long text, such as a film's overview, clipped to a few lines with a button that opens all of it in a dialog. */
export function TextPreview(props: TextPreviewProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div className="flex max-w-3xl min-w-0 items-center gap-3">
                <TextBase
                    lang={props.loading ? undefined : props.language}
                    tone="muted"
                    className={`min-w-0 truncate leading-6 ${props.loading ? 'flex-1' : ''}`}
                    loading={props.loading}
                >
                    {!props.loading && props.value}
                </TextBase>
                {props.loading ? (
                    <TextBase className="w-20 shrink-0 leading-6" loading />
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
                                <TextBase
                                    lang={props.language}
                                    className="leading-7 text-pretty wrap-break-word whitespace-pre-line"
                                    variant="description"
                                >
                                    {props.value}
                                </TextBase>
                            </Stack>
                        </Modal.Body>
                    </Modal.Content>
                </Modal>
            ) : null}
        </>
    );
}
