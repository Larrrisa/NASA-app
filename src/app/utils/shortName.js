export default function shortName(item) {
  const start = item.indexOf("(") + 1;
  const end = item.indexOf(")");
  const shorter = item.slice(start, end);
  return shorter;
}
