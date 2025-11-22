"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Folder, Loader2 } from "lucide-react";
import { Input } from "~/shared/components/ui/input";
import { Kbd, KbdGroup } from "~/shared/components/ui/kbd";
import { searchStorage, type SearchResults } from "~/server/actions/search.actions";
import { useDebounce } from "~/shared/hooks/use-debounce";
import { cn } from "~/shared/lib/utils";
import type { DocumentModel } from "~/server/db/schema/documents";
import {
  getFileIcon,
  getFileColors,
} from "../utils/file-icon.utils";
import { getFileTypeLabel } from '~/shared/lib/file.utils';
import { DocumentPreviewModal } from '~/features/document-viewer/components/document-preview-modal';

const DEBOUNCE_DELAY = 500;

export function SearchStorage() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentModel | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [results, setResults] = useState<SearchResults>({
    folders: [],
    files: [],
  });
  const debouncedQuery = useDebounce(query, DEBOUNCE_DELAY);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Perform search when debounced query changes
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedQuery.trim().length === 0) {
        setResults({ folders: [], files: [] });
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const searchResults = await searchStorage(debouncedQuery);
        setResults(searchResults);
      } catch (error) {
        console.error("Search error:", error);
        setResults({ folders: [], files: [] });
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  // Show dropdown when there's a query
  useEffect(() => {
    setIsOpen(query.trim().length > 0);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Keyboard shortcut to focus search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        const input = searchRef.current?.querySelector("input");
        input?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleFolderClick = (folder: { id: string; name: string }) => {
    router.push(`/dashboard/${folder.id}`);
    setIsOpen(false);
    setQuery("");
  };

  const handleFileClick = (file: DocumentModel & { type: string; size: number }) => {
    setIsOpen(false);
    setQuery("");
    setSelectedDocument(file);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setSelectedDocument(null);
  };

  const showNoResults =
    !isLoading &&
    debouncedQuery.trim().length > 0 &&
    results.folders.length === 0 &&
    results.files.length === 0;

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search files and folders..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-24"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
          <KbdGroup>
            <Kbd className="hidden sm:inline-flex">⌘</Kbd>
            <Kbd className="hidden sm:inline-flex">K</Kbd>
          </KbdGroup>
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full z-50 mt-2 w-full rounded-xl border border-border bg-card shadow-xl">
          <div className="max-h-96 overflow-y-auto">
            {showNoResults && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">No results found</p>
                <p className="mt-1 text-xs text-muted-foreground">Try searching with different keywords</p>
              </div>
            )}
            {results.folders.length > 0 && (
              <div className="border-b border-border">
                <div className="px-4 py-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Folders</p>
                </div>
                {results.folders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => handleFolderClick(folder)}
                    className="flex w-full items-center gap-3 px-4 py-3 transition-colors hover:bg-accent"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-950">
                      <Folder className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-foreground">{folder.name}</p>
                      <p className="text-xs text-muted-foreground">Folder</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {results.files.length > 0 && (
              <div>
                <div className="px-4 py-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Files</p>
                </div>
                {results.files.map((file) => {
                  const colors = getFileColors(file.name);
                  const fileLabel = getFileTypeLabel(file.mimeType, file.name);
                  return (
                    <button
                      key={file.id}
                      onClick={() => handleFileClick(file)}
                      className="flex w-full items-center gap-3 px-4 py-3 transition-colors hover:bg-accent"
                    >
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg",
                          colors.bg,
                        )}
                      >
                        {getFileIcon(file.name, cn("h-5 w-5", colors.icon))}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-foreground">
                          {file.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                              colors.bg.replace("/15", "/20"),
                              colors.icon,
                            )}
                          >
                            {fileLabel}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {(file.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      <DocumentPreviewModal
        document={selectedDocument}
        isOpen={isPreviewOpen}
        onOpenChange={handleClosePreview}
      />
    </div>
  );
}

