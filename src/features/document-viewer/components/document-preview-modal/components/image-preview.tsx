import Image from "next/image";
import { LoadingSpinner } from "./loading-spinner";
import { ErrorMessage } from "./error-message";

interface ImagePreviewProps {
  src: string;
  alt: string;
  isLoading: boolean;
  hasError: boolean;
  onLoad: () => void;
  onError: () => void;
}

export function ImagePreview({
  src,
  alt,
  isLoading,
  hasError,
  onLoad,
  onError,
}: ImagePreviewProps) {
  if (hasError) {
    return <ErrorMessage />;
  }

  return (
    <div className="bg-muted/50 relative flex h-[60vh] w-full items-center justify-center">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain"
        onLoad={onLoad}
        onError={onError}
        unoptimized
      />
    </div>
  );
}
