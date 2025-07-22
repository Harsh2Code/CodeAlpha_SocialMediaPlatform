/**
 * Utility function to conditionally join class names.
 * Accepts any number of arguments of type string, object, or array.
 * Objects with truthy values are included.
 */
export function cn(...args) {
  return args
    .flatMap(arg => {
      if (!arg) return [];
      if (typeof arg === 'string') return [arg];
      if (Array.isArray(arg)) return arg;
      if (typeof arg === 'object') {
        return Object.entries(arg)
          .filter(([_, value]) => Boolean(value))
          .map(([key]) => key);
      }
      return [];
    })
    .join(' ');
}
