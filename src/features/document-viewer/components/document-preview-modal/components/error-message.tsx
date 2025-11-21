interface ErrorMessageProps {
  title?: string;
  description?: string;
}

export function ErrorMessage({
  title = "Unable to preview this file",
  description = "Please download the file to view it",
}: ErrorMessageProps) {
  return (
    <div className="text-muted-foreground flex h-[60vh] flex-col items-center justify-center">
      <p className="mb-2 text-lg">{title}</p>
      <p className="text-sm">{description}</p>
    </div>
  );
}
