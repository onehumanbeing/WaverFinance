export const trimEnd = (str: string, end: string) => {
  if (str.endsWith(end)) {
    return str.slice(0, str.length - end.length);
  }
  return str;
}
