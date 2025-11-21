interface ErrorMessageProps {
  title?: string;
  description?: string;
}

export function ErrorMessage({ 
  title = 'Unable to preview this file',
  description = 'Please download the file to view it'
}: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
      <p className="text-lg mb-2">{title}</p>
      <p className="text-sm">{description}</p>
    </div>
  );
}

