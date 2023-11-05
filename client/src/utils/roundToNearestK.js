export default function roundToNearestK(num) {
  const rounded = Math.round(num / 1000) * 1000;
  return `${rounded / 1000}K`;
}
