import { useEffect, useState } from 'react';

import { SkeletonLoader } from '../feedback/SkeletonLoader';

/** Encodes locally; the value is never sent to a QR service. */
export function QrCode({ label, value }: { label: string; value: string }) {
    const [encoded, setEncoded] = useState<{ source: string | null; value: string }>();

    useEffect(() => {
        let active = true;

        void import('qrcode-generator')
            .then(({ default: createQrCode }) => {
                try {
                    const code = createQrCode(0, 'M');

                    code.addData(value, 'Byte');
                    code.make();

                    if (active) setEncoded({ source: code.createDataURL(4), value });
                } catch {
                    // The copyable value remains available if it exceeds QR capacity.
                    if (active) setEncoded({ source: null, value });
                }
            })
            .catch(() => {
                // The copyable value remains usable if this optional chunk fails to load.
                if (active) setEncoded({ source: null, value });
            });

        return () => {
            active = false;
        };
    }, [value]);

    if (encoded?.value !== value) {
        return (
            <SkeletonLoader label={label}>
                <SkeletonLoader.Shape presentation="artwork" />
            </SkeletonLoader>
        );
    }

    return encoded.source ? (
        <img alt={label} src={encoded.source} className="block w-full max-w-sm rounded-lg bg-white" />
    ) : null;
}
