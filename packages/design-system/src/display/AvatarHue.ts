// A person's categorical hue, the same for the same key (their email) in every app.

/** The categorical hues an initials avatar comes in, in Lar Account's order (the order its hash was first used in), so a
 *  person keeps their colour in every product. */
const avatarHues = [
    'category-teal',
    'category-violet',
    'category-cyan',
    'category-rose',
    'category-lime',
    'category-magenta',
] as const;

/** The categorical hue (a `category-*` class) for a stable key, such as a person's email: the same key gives the same
 *  hue every time, in every app (a small string hash over the lowercased key). */
export function avatarHueOf(key: string): (typeof avatarHues)[number] {
    let hash = 0;

    for (const char of key.toLowerCase()) hash = (hash * 31 + (char.codePointAt(0) ?? 0)) >>> 0;

    return avatarHues[hash % avatarHues.length]!;
}
