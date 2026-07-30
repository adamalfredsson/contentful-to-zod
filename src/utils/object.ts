export function copyWithMetadata<
  T extends { clone: () => T },
  M extends object
>(instance: T, metadata: M): T & M {
  return Object.assign(instance.clone(), metadata);
}
