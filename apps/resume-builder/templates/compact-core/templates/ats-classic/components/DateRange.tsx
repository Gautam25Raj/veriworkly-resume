import { formatDate } from "@/features/resume/utils/format-date";

export function DateRange({
  startDate,
  endDate,
  current,
}: {
  startDate: string;
  endDate: string;
  current: boolean;
}) {
  return (
    <span>
      {formatDate(startDate)} - {current ? "Present" : formatDate(endDate)}
    </span>
  );
}
