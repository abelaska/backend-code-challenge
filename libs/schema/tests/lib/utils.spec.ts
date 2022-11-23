import { omitUndefined } from '../../src/lib/utils';

describe('utils', () => {
  it('omitUndefined', () => {
    expect(omitUndefined({})).toBe(undefined);
    expect(omitUndefined({ a: undefined })).toBe(undefined);
    expect(omitUndefined({ a: null })).toEqual({ a: null });
    expect(omitUndefined({ a: '' })).toEqual({ a: '' });
    expect(omitUndefined({ a: undefined, b: '' })).toEqual({ b: '' });
    expect(omitUndefined({ a: null, b: null })).toEqual({ a: null, b: null });
    expect(omitUndefined({ a: '', b: undefined })).toEqual({ a: '' });
  });
});
