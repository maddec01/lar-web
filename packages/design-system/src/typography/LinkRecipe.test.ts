import { expect, it } from 'vite-plus/test';

import { linkRecipe, proseLinkRecipe } from './LinkRecipe';

it('draws prose links with the accent link recipe', () => {
    const prose = linkRecipe.accent
        .split(' ')
        .map((name) => (name.startsWith('hover:') ? `[&_a:hover]:${name.slice(6)}` : `[&_a]:${name}`));

    expect(proseLinkRecipe.split(' ')).toEqual(prose);
});
