import { LoadingSpinner } from "./loading-spinner";
import { ErrorMessage } from "./error-message";

interface VideoPreviewProps {
  src: string;
  isLoading: boolean;
  hasError: boolean;
  onLoad: () => void;
  onError: () => void;
}

export function VideoPreview({
  src,
  isLoading,
  hasError,
  onLoad,
  onError,
}: VideoPreviewProps) {
  if (hasError) {
    return <ErrorMessage />;
  }

  return (
    <div className="relative flex h-[60vh] w-full items-center justify-center bg-black">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner className="text-white" />
        </div>
      )}
      <video
        src={src}
        controls
        className="max-h-full max-w-full"
        onLoadedData={onLoad}
        onError={onError}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
