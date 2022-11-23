export function omitUndefined<T extends Record<string, unknown>>(args: T): T | undefined {
  const entries = Object.entries(args as Record<string, unknown>).filter((arg) => arg[1] !== undefined);
  if (entries.length) {
    return entries.reduce((where, [key, value]) => Object.assign(where, { [key]: value }), {}) as T;
  }
  return undefined;
}
