export const getLastNDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};

export const percentChange = (current: number, previous: number) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(2));
};
export { default as Logger } from './logger';
