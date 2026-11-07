import { ChevronDownIcon } from 'lucide-react';

import { Button } from '../actions/Button';
import { DropdownMenu } from '../overlays/DropdownMenu';

/** A menu of the ways a list sorts, its button naming the current one. */
export function SortMenu<Value extends string>({
    value,
    options,
    onChange,
}: {
    value: Value;
    options: readonly { value: Value; label: string }[];
    onChange: (value: Value) => void;
}) {
    return (
        <DropdownMenu>
            <DropdownMenu.Trigger asChild>
                <Button variant="secondary" compact rightIcon={<ChevronDownIcon />}>
                    {options.find((option) => option.value === value)?.label}
                </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end">
                <DropdownMenu.RadioGroup
                    value={value}
                    onValueChange={(next) => {
                        const picked = options.find((option) => option.value === next);

                        if (picked) onChange(picked.value);
                    }}
                >
                    {options.map((option) => (
                        <DropdownMenu.RadioItem key={option.value} value={option.value}>
                            {option.label}
                        </DropdownMenu.RadioItem>
                    ))}
                </DropdownMenu.RadioGroup>
            </DropdownMenu.Content>
        </DropdownMenu>
    );
}
