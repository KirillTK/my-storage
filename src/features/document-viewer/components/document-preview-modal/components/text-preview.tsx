import { LoadingSpinner } from "./loading-spinner";
import { ErrorMessage } from "./error-message";

interface TextPreviewProps {
  content: string | null;
  isLoading: boolean;
  hasError: boolean;
}

export function TextPreview({
  content,
  isLoading,
  hasError,
}: TextPreviewProps) {
  if (isLoading) {
    return (
      <div className="bg-muted/50 flex h-full items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (hasError || !content) {
    return <ErrorMessage />;
  }

  return (
    <div className="bg-muted/30 h-full w-full overflow-auto rounded-lg border">
      <pre className="p-4 font-mono text-sm wrap-break-word whitespace-pre-wrap">
        {content}
      </pre>
    </div>
  );
}
