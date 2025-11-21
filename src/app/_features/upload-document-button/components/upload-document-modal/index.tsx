"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, FileText, X, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/app/_shared/components/ui/dialog"
import { Button } from "~/app/_shared/components/ui/button"
import { formatFileSize } from '~/app/_shared/lib/formatters.utils'
import { MAX_FILE_SIZE, MAX_FILE_SIZE_MB, MAX_FILES_PER_UPLOAD } from '~/app/_shared/lib/constants'

interface UploadDocumentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (files: File[]) => void
}

interface FileWithStatus {
  id: string
  file: File
  name: string
  size: number
}

export function UploadDocumentModal({ open, onOpenChange, onConfirm }: UploadDocumentModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileWithStatus[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragCounter = useRef(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFiles = (files: File[]): { valid: File[]; errors: string[] } => {
    const valid: File[] = []
    const errors: string[] = []

    files.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
        errors.push(`${file.name}: File size (${sizeMB}MB) exceeds the maximum limit of ${MAX_FILE_SIZE_MB}MB.`)
      } else {
        valid.push(file)
      }
    })

    return { valid, errors }
  }

  const addFiles = (files: File[]) => {
    setError(null)

    const currentFileCount = selectedFiles.length
    const newFilesCount = files.length
    const totalFiles = currentFileCount + newFilesCount

    let filesToProcess = files
    if (totalFiles > MAX_FILES_PER_UPLOAD) {
      const remainingSlots = MAX_FILES_PER_UPLOAD - currentFileCount
      if (remainingSlots <= 0) {
        setError(`Maximum file limit reached. You can upload up to ${MAX_FILES_PER_UPLOAD} files at once.`)
        return
      } else {
        setError(`You can only add ${remainingSlots} more file${remainingSlots !== 1 ? 's' : ''}. Maximum limit is ${MAX_FILES_PER_UPLOAD} files.`)
        filesToProcess = files.slice(0, remainingSlots)
      }
    }

    const { valid, errors } = validateFiles(filesToProcess)

    if (errors.length > 0) {
      setError((prev) => prev ? `${prev}\n${errors.join('\n')}` : errors.join('\n'))
    }

    if (valid.length > 0) {
      const filesWithStatus: FileWithStatus[] = valid.map((file, index) => ({
        id: `${Date.now()}-${index}-${Math.random()}`,
        file,
        name: file.name,
        size: file.size,
      }))
      setSelectedFiles((prev) => [...prev, ...filesWithStatus])
      if (errors.length === 0) {
        setError(null)
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length > 0) {
      addFiles(files)
      // Reset input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current++

    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current--

    if (dragCounter.current === 0) {
      setIsDragging(false)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    dragCounter.current = 0

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      addFiles(files)
    }
  }

  const handleSubmit = () => {
    if (selectedFiles.length === 0) {
      return
    }

    const files = selectedFiles.map((f) => f.file)
    
    // Clear selected files and close modal
    setSelectedFiles([])
    setError(null)
    
    // Call onConfirm which handles upload with toasts
    onConfirm(files)
    onOpenChange(false)
  }

  const handleClose = () => {
    setSelectedFiles([])
    setError(null)
    onOpenChange(false)
  }

  const removeFile = (fileId: string) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== fileId))
    setError(null)
  }

  const hasFiles = selectedFiles.length > 0
  const canAddMoreFiles = selectedFiles.length < MAX_FILES_PER_UPLOAD

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
              <Upload className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle>{"Upload Files"}</DialogTitle>
          </div>
          <DialogDescription>
            {`Select files to upload or drag and drop them here. Maximum ${MAX_FILES_PER_UPLOAD} files, ${MAX_FILE_SIZE_MB}MB per file. All file types are supported.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive whitespace-pre-line">{error}</p>
            </div>
          )}

          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="relative"
          >
            {selectedFiles.length === 0 ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`w-full border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer group ${isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary'
                  }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`rounded-full p-3 transition-colors ${isDragging
                    ? 'bg-primary/20'
                    : 'bg-muted group-hover:bg-primary/10'
                    }`}>
                    <Upload className={`h-6 w-6 transition-colors ${isDragging
                      ? 'text-primary'
                      : 'text-muted-foreground group-hover:text-primary'
                      }`} />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {isDragging ? "Drop files here" : "Click to select files or drag and drop"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {`Maximum ${MAX_FILES_PER_UPLOAD} files • ${MAX_FILE_SIZE_MB}MB per file • All file types supported`}
                  </p>
                </div>
              </button>
            ) : (
              <div className="space-y-3">
                <div className="max-h-[300px] overflow-y-auto space-y-2">
                  {selectedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="border rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg shrink-0 bg-primary/15">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(file.id)}
                        className="shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                {canAddMoreFiles && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    + Add more files ({MAX_FILES_PER_UPLOAD - selectedFiles.length} remaining)
                  </button>
                )}
                {!canAddMoreFiles && (
                  <p className="text-xs text-muted-foreground text-center">
                    Maximum file limit reached ({MAX_FILES_PER_UPLOAD} files)
                  </p>
                )}
              </div>
            )}

            {isDragging && (
              <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg border-2 border-dashed border-primary overflow-hidden">
                <div className="flex flex-col items-center gap-3 px-4">
                  <div className="rounded-full bg-primary/20 p-4">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-foreground mb-1">
                      {"Drop files here"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {"Release to add files"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!hasFiles}>
            Upload {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
