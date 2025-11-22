import { LoadingSpinner } from "./loading-spinner";
import { ErrorMessage } from "./error-message";

interface AudioPreviewProps {
  src: string;
  fileName: string;
  isLoading: boolean;
  hasError: boolean;
  onLoad: () => void;
  onError: () => void;
}

export function AudioPreview({
  src,
  fileName,
  isLoading,
  hasError,
  onLoad,
  onError,
}: AudioPreviewProps) {
  if (hasError) {
    return <ErrorMessage />;
  }

  return (
    <div className="bg-muted/50 flex h-full flex-col items-center justify-center">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <p className="text-lg font-medium">{fileName}</p>
        </div>
        <audio
          src={src}
          controls
          className="w-full"
          onLoadedData={onLoad}
          onError={onError}
        >
          Your browser does not support the audio tag.
        </audio>
      </div>
    </div>
  );
}
