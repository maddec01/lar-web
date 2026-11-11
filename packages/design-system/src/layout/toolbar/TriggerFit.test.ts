import { expect, test } from 'vite-plus/test';

import { fitTrigger } from './TriggerFit';

// By default a title bar wide enough that only the field's own room decides.
const room = (field: number, bar = 1280) => ({ field, bar });

// The field's chrome and the word Search take 96 px, a token its width plus 4, the count 28 and the key hint 30; the
// field keeps 224 px or folds. So two 60 px tokens take 224 px with no count, two 100 px ones and a 60 take 368.
test('with room to spare, every token and the key hint show', () => {
    expect(fitTrigger(room(416), [60, 60])).toMatchObject({ shown: 2, keyHint: true, folded: false });
});

test('the key hint goes first', () => {
    expect(fitTrigger(room(224), [60, 60])).toMatchObject({ shown: 2, keyHint: false, folded: false });
    expect(fitTrigger(room(254), [60, 60])).toMatchObject({ shown: 2, keyHint: true });
});

test('tokens that do not fit go into the count from the last', () => {
    expect(fitTrigger(room(367), [100, 100, 60])).toMatchObject({ shown: 2, keyHint: false, folded: false });
    expect(fitTrigger(room(300), [100, 100, 60])).toMatchObject({ shown: 1, folded: false });
    expect(fitTrigger(room(224), [100, 100, 60])).toMatchObject({ shown: 0, folded: false });
});

test('below its least width the field folds, rather than shrinking to a stub', () => {
    expect(fitTrigger(room(223), [60, 60])).toMatchObject({ shown: 1, folded: true });
    expect(fitTrigger(room(224), [])).toMatchObject({ shown: 0, folded: false });
    expect(fitTrigger(room(223), [])).toMatchObject({ shown: 0, folded: true });
    expect(fitTrigger(room(96), [])).toMatchObject({ shown: 0, folded: true });
});

test('with no tokens the field keeps its least width, and grows with tokens up to its room', () => {
    expect(fitTrigger(room(416), []).width).toBe(224);
    expect(fitTrigger(room(416), [100, 100, 60]).width).toBe(398);
    expect(fitTrigger(room(300), [100, 100, 60]).width).toBe(300);
});

test('on the narrowest title bar the field folds, though it has room for the word Search', () => {
    expect(fitTrigger(room(229, 320), [60, 60])).toMatchObject({ folded: true });
    expect(fitTrigger(room(229, 320), [])).toMatchObject({ folded: true });
    expect(fitTrigger(room(229, 360), [60, 60])).toMatchObject({ shown: 2, folded: false });
});
