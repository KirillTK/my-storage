import type { DocumentModel } from '~/server/db/schema';
import Image from 'next/image';



export function ImageBadge({ document }: { document: DocumentModel }) {
  return (
    <div className="bg-primary/15 border-border relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border">
      <Image
        src={document.blobUrl}
        alt={document.name}
        width={48}
        height={48}
        quality={60}
        loading="lazy"
      />
    </div>
  );
}