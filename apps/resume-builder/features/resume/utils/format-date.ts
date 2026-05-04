export function formatDate(value: string) {
  if (!value) {
    return "Present";
  }

  const date = new Date(`${value}-01`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(date);
}
