import { LoadingSpinner } from './loading-spinner';
import { ErrorMessage } from './error-message';

interface TextPreviewProps {
  content: string | null;
  isLoading: boolean;
  hasError: boolean;
}

export function TextPreview({ content, isLoading, hasError }: TextPreviewProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh] bg-muted/50">
        <LoadingSpinner />
      </div>
    );
  }

  if (hasError || !content) {
    return <ErrorMessage />;
  }

  return (
    <div className="w-full h-[60vh] overflow-auto bg-muted/30 rounded-lg border">
      <pre className="p-4 text-sm font-mono whitespace-pre-wrap wrap-break-word">
        {content}
      </pre>
    </div>
  );
}

