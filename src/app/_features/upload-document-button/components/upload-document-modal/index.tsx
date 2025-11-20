"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, FileText, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/app/_shared/components/ui/dialog"
import { Button } from "~/app/_shared/components/ui/button"

interface UploadDocumentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (file: File) => Promise<void>
}

export function UploadDocumentModal({ open, onOpenChange, onConfirm }: UploadDocumentModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleSubmit = async () => {
    if (selectedFile) {
      setUploading(true)
      await onConfirm(selectedFile)
      setUploading(false)
      setSelectedFile(null)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
              <Upload className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle>{"Upload PDF File"}</DialogTitle>
          </div>
          <DialogDescription>
            {"Select a PDF file to upload to the current folder. Only PDF files are supported."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileSelect}
            className="hidden"
          />

          {!selectedFile ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-border rounded-lg p-8 hover:border-primary transition-colors cursor-pointer group"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="rounded-full bg-muted p-3 group-hover:bg-primary/10 transition-colors">
                  <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-sm font-medium text-foreground">{"Click to select a PDF file"}</p>
                <p className="text-xs text-muted-foreground">{"or drag and drop"}</p>
              </div>
            </button>
          ) : (
            <div className="border border-border rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedFile(null)} disabled={uploading}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSelectedFile(null)
              onOpenChange(false)
            }}
            disabled={uploading}
          >
            {"Cancel"}
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedFile || uploading}>
            {uploading ? "Uploading..." : "Upload File"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
