import snakecaseKeys from 'snakecase-keys';
import camelcaseKeys from 'camelcase-keys';

// Convert to DB shape
export function toDb<T>(data: T): any {
  return snakecaseKeys(data as Record<string, unknown>, { deep: true });
}

// Convert to app shape
export function fromDb<T>(data: any): T {
  return camelcaseKeys(data, { deep: true }) as T;
}