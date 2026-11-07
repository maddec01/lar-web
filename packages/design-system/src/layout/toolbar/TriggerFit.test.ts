import { expect, test } from 'vite-plus/test';

import { fitTrigger } from './TriggerFit';

// By default a title bar wide enough that only the field's own room decides.
const room = (field: number, bar = 1280) => ({ field, bar });

// The field's chrome and the word Search take 76 px, a token its width plus 4, the count 28 and the key hint 38. So
// two 60 px tokens take 204 px with no count, one takes 168 with its count, and none takes 104 with the count.
test('with room to spare, every token and the key hint show', () => {
    expect(fitTrigger(room(416), [60, 60])).toMatchObject({ shown: 2, keyHint: true, folded: false });
});

test('the key hint goes first', () => {
    expect(fitTrigger(room(204), [60, 60])).toMatchObject({ shown: 2, keyHint: false, folded: false });
    expect(fitTrigger(room(242), [60, 60])).toMatchObject({ shown: 2, keyHint: true });
});

test('tokens that do not fit go into the count from the last, before the word Search', () => {
    expect(fitTrigger(room(203), [60, 60])).toMatchObject({ shown: 1, keyHint: false, folded: false });
    expect(fitTrigger(room(168), [60, 60])).toMatchObject({ shown: 1, folded: false });
    expect(fitTrigger(room(167), [60, 60])).toMatchObject({ shown: 0, folded: false });
    expect(fitTrigger(room(104), [60, 60])).toMatchObject({ shown: 0, folded: false });
});

test('below room for the word Search and the count, the field folds', () => {
    expect(fitTrigger(room(103), [60, 60])).toMatchObject({ shown: 0, folded: true });
    expect(fitTrigger(room(76), [])).toMatchObject({ shown: 0, folded: false });
    expect(fitTrigger(room(75), [])).toMatchObject({ shown: 0, folded: true });
});

test('with no tokens the field keeps its least width, and grows with tokens up to its room', () => {
    expect(fitTrigger(room(416), []).width).toBe(224);
    expect(fitTrigger(room(200), []).width).toBe(200);
    expect(fitTrigger(room(416), [100, 100, 60]).width).toBe(386);
    expect(fitTrigger(room(300), [100, 100, 60]).width).toBe(300);
});

test('on the narrowest title bar the field folds, though it has room for the word Search', () => {
    expect(fitTrigger(room(189, 320), [60, 60])).toMatchObject({ folded: true });
    expect(fitTrigger(room(189, 320), [])).toMatchObject({ folded: true });
    expect(fitTrigger(room(229, 360), [60, 60])).toMatchObject({ shown: 2, folded: false });
});
