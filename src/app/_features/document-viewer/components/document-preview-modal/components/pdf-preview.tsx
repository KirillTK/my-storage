import { LoadingSpinner } from './loading-spinner';
import { ErrorMessage } from './error-message';

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
    <div className="relative w-full h-[60vh]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <LoadingSpinner />
        </div>
      )}
      <iframe
        src={src}
        className="w-full h-full border-0"
        onLoad={onLoad}
        onError={onError}
        title={title}
      />
    </div>
  );
}

