import { Download } from "lucide-react";
import { useDocument } from "~/entities/document/hooks/use-document";
import type { DocumentModel } from "~/server/db/schema";
import { Button } from "~/shared/components/ui/button";

export function DownloadFileButton({ document }: { document: DocumentModel }) {
  const { handleDownload: downloadDocument } = useDocument(document);

  return (
    <Button variant="outline" onClick={downloadDocument}>
      <Download className="h-4 w-4" />
      Download
    </Button>
  );
}
