import { LoadingSpinner } from "./loading-spinner";
import { ErrorMessage } from "./error-message";

interface PDFPreviewProps {
  src: string;
  title: string;
  isLoading: boolean;
  hasError: boolean;
  onLoad: () => void;
  onError: () => void;
}

export function PDFPreview({
  src,
  title,
  isLoading,
  hasError,
  onLoad,
  onError,
}: PDFPreviewProps) {
  if (hasError) {
    return <ErrorMessage />;
  }

  return (
    <div className="relative h-full w-full">
      {isLoading && (
        <div className="bg-muted/50 absolute inset-0 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
      <iframe
        src={src}
        className="h-full w-full border-0"
        onLoad={onLoad}
        onError={onError}
        title={title}
      />
    </div>
  );
}
