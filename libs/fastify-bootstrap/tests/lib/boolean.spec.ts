import { toBoolean } from '../../src/lib/boolean';

describe('boolean', () => {
  it('should be true', () => {
    expect(toBoolean('1')).toBeTruthy();
    expect(toBoolean('true')).toBeTruthy();
    expect(toBoolean('yes')).toBeTruthy();
    expect(toBoolean('enable')).toBeTruthy();
    expect(toBoolean('enabled')).toBeTruthy();
  });

  it('should be false', () => {
    expect(toBoolean('')).toBeFalsy();
    expect(toBoolean(undefined)).toBeFalsy();
    expect(toBoolean(null)).toBeFalsy();
    expect(toBoolean('false')).toBeFalsy();
    expect(toBoolean('whatever')).toBeFalsy();
  });
});
