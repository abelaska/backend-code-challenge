export function toBoolean(str: string | undefined | null): boolean {
  return /true|yes|1|on|enabled?/i.test(str ?? '');
}
