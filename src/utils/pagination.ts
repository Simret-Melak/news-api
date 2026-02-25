export function getPagination(query: any, defaults = { page: 1, size: 10 }) {
  const page = Math.max(parseInt(query.page ?? defaults.page, 10) || defaults.page, 1);
  const size = Math.min(Math.max(parseInt(query.size ?? defaults.size, 10) || defaults.size, 1), 100);
  const skip = (page - 1) * size;
  return { page, size, skip };
}