export function canShowPageEditor(isAdmin: boolean, embedded: boolean, parentPath: string): boolean {
  return isAdmin && embedded && /^\/admin\/content\/?$/.test(parentPath);
}