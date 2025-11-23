export const DOCUMENT_TYPES = [
  { label: "PDF", value: "pdf", badgeType: "pdf" },
  { label: "Word", value: "word", badgeType: "docx" },
  { label: "Excel", value: "excel", badgeType: "xlsx" },
  { label: "Image", value: "image", badgeType: "png" },
  { label: "Video", value: "video", badgeType: "mp4" },
  { label: "Audio", value: "audio", badgeType: "mp3" },
  { label: "Archive", value: "archive", badgeType: "zip" },
  { label: "Code", value: "code", badgeType: "js" },
] as const;

export const TIME_PERIODS = [
  { label: "Today", value: "today" },
  { label: "Last 7 days", value: "last7days" },
  { label: "Last 30 days", value: "last30days" },
  { label: "This year", value: "thisyear" },
] as const;
