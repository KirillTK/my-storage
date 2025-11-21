import { useState, useEffect } from 'react';

interface UseTextContentResult {
  textContent: string | null;
  isLoading: boolean;
  hasError: boolean;
}

export function useTextContent(blobUrl: string | null, isOpen: boolean): UseTextContentResult {
  const [textContent, setTextContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!blobUrl || !isOpen) {
      return;
    }

    setIsLoading(true);
    setHasError(false);
    setTextContent(null);

    fetch(blobUrl)
      .then((res) => res.text())
      .then((text) => {
        setTextContent(text);
        setIsLoading(false);
      })
      .catch(() => {
        setHasError(true);
        setIsLoading(false);
      });
  }, [blobUrl, isOpen]);

  return { textContent, isLoading, hasError };
}

