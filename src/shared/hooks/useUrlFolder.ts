import { useParams } from "next/navigation";
import { extractLastUuid } from "../lib/uuid.utils";
import { useEffect, useState } from "react";

export function useUrlFolder() {
  const [folderId, setFolderId] = useState<string | null>(null);
  const params = useParams();

  useEffect(() => {
    const id = extractLastUuid((params?.slug as string[]) || []);
    setFolderId(id ?? null);
  }, [params?.slug, setFolderId]);

  return folderId;
}
