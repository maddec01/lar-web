import type { ReactNode } from 'react';

import { SkeletonLoader } from '../feedback/SkeletonLoader';
import { tabbable } from '../foundations/KeyboardFocus';
import { Stack } from '../layout/Flow';
import { LinkBox, LinkOverlay } from '../typography/Link';
import { Text } from '../typography/Typography';

type ImageCardProps =
    | { loading: true; textRows?: 1 | 2 | 3; aspect?: 'square' | 'poster' }
    | {
          loading?: false;
          artwork: ReactNode;
          onClick?: () => void;
          href?: string;
          onNavigate?: (href: string) => void;
          subtitle?: ReactNode;
          label?: string;
          detail?: string;
          title: string;
          presentation?: 'person' | 'poster';
          /** A short qualifier shown muted after the title on the same line, such as an edition. */
          titleDetail?: string;
      };

export function ImageCard(props: ImageCardProps) {
    const lines = props.loading
        ? Array.from<unknown, ReactNode>({ length: props.textRows ?? 2 }, () => undefined)
        : [
              props.titleDetail ? (
                  <>
                      {props.title}
                      <span className="text-base-700 font-normal"> · {props.titleDetail}</span>
                  </>
              ) : (
                  props.title
              ),
              ...(props.subtitle || props.detail ? [props.subtitle || '\u00a0'] : []),
              ...(props.detail ? [props.detail] : []),
          ];
    const label = props.loading
        ? undefined
        : (props.label ??
          [
              props.title,
              props.titleDetail,
              typeof props.subtitle === 'string' ? props.subtitle : undefined,
              props.detail,
          ]
              .filter(Boolean)
              .join(', '));
    const content = (
        <Stack space="related" className="min-w-0 text-left">
            {props.loading ? (
                <SkeletonLoader.Shape presentation={props.aspect === 'poster' ? 'poster' : 'artwork'} />
            ) : props.presentation === 'person' ? (
                <span className="block size-16 overflow-hidden rounded-full [&>div]:size-full">{props.artwork}</span>
            ) : (
                props.artwork
            )}
            <Stack space="none" className="min-w-0">
                {lines.map((line, index) => (
                    <Text
                        key={index}
                        as="span"
                        variant={index === 0 ? 'label' : 'caption'}
                        tone={index === 0 ? 'default' : 'muted'}
                        truncate={props.loading || !props.presentation}
                        className={!props.loading && props.presentation ? 'wrap-anywhere' : undefined}
                        loading={props.loading}
                    >
                        {!props.loading && props.href && index === 0 ? (
                            <LinkOverlay href={props.href} onNavigate={props.onNavigate} aria-label={label}>
                                {line}
                            </LinkOverlay>
                        ) : (
                            line
                        )}
                    </Text>
                ))}
            </Stack>
        </Stack>
    );

    if (props.loading || (!props.href && !props.onClick)) return content;

    return (
        <LinkBox className="group/media-item rounded-lg">
            {content}
            {!props.href && props.onClick ? (
                <button
                    {...tabbable}
                    type="button"
                    data-slot="action-overlay"
                    aria-label={label}
                    className="focus-visible:outline-primary absolute inset-0 z-1 w-full cursor-pointer rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2"
                    onClick={props.onClick}
                />
            ) : null}
        </LinkBox>
    );
}
