export function copyWithMetadata<T extends object, M extends object>(
  instance: T,
  metadata: M
): T & M {
  const copy = Object.create(Object.getPrototypeOf(instance));
  Object.assign(copy, instance, metadata);
  return copy as T & M;
}
