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

interface UploadDocumentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (file: File) => Promise<{ success: boolean; error?: string }>
}

interface FileWithStatus {
  id: string
  file: File
  name: string
  size: number
  status?: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}

export function UploadDocumentModal({ open, onOpenChange, onConfirm }: UploadDocumentModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileWithStatus[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragCounter = useRef(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
  const MAX_FILES = 10

  const validateFiles = (files: File[]): { valid: File[]; errors: string[] } => {
    const valid: File[] = []
    const errors: string[] = []

    files.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
        errors.push(`${file.name}: File size (${sizeMB}MB) exceeds the maximum limit of 5MB.`)
      } else {
        valid.push(file)
      }
    })

    return { valid, errors }
  }

  const addFiles = (files: File[]) => {
    setError(null)

    // Only count files that are not successfully uploaded (pending, uploading, error, or undefined)
    const currentFileCount = selectedFiles.filter(
      (f) => f.status !== 'success'
    ).length
    const newFilesCount = files.length
    const totalFiles = currentFileCount + newFilesCount

    let filesToProcess = files
    if (totalFiles > MAX_FILES) {
      const remainingSlots = MAX_FILES - currentFileCount
      if (remainingSlots <= 0) {
        setError(`Maximum file limit reached. You can upload up to ${MAX_FILES} files at once. Please remove some files or wait for uploads to complete.`)
        return
      } else {
        setError(`You can only add ${remainingSlots} more file${remainingSlots !== 1 ? 's' : ''}. Maximum limit is ${MAX_FILES} files.`)
        // Only process files up to the limit
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
        status: 'pending' as const,
      }))
      setSelectedFiles((prev) => [...prev, ...filesWithStatus])
      // Clear error if files were successfully added
      if (errors.length === 0) {
        setError(null)
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
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

  const handleSubmit = async () => {
    const pendingFiles = selectedFiles.filter((f) => f.status === 'pending' || !f.status)

    if (pendingFiles.length === 0) {
      return
    }

    setUploading(true)
    setError(null)

    // Update all files to uploading status
    setSelectedFiles((prev) =>
      prev.map((f) =>
        pendingFiles.some((pf) => pf.id === f.id)
          ? { ...f, status: 'uploading' as const }
          : f
      )
    )

    let successCount = 0
    let errorCount = 0

    // Upload files sequentially
    for (const fileWithStatus of pendingFiles) {
      try {
        const result = await onConfirm(fileWithStatus.file)

        setSelectedFiles((prev) =>
          prev.map((f) =>
            f.id === fileWithStatus.id
              ? {
                ...f,
                status: result.success ? ('success' as const) : ('error' as const),
                error: result.error,
              }
              : f
          )
        )

        if (result.success) {
          successCount++
        } else {
          errorCount++
        }
      } catch (err) {
        setSelectedFiles((prev) =>
          prev.map((f) =>
            f.id === fileWithStatus.id
              ? {
                ...f,
                status: 'error' as const,
                error: 'An unexpected error occurred. Please try again.',
              }
              : f
          )
        )
        errorCount++
      }
    }

    setUploading(false)

    // Close modal if all files uploaded successfully
    if (errorCount === 0 && successCount > 0) {
      setTimeout(() => {
        setSelectedFiles([])
        onOpenChange(false)
      }, 1000)
    }
  }

  const handleClose = () => {
    if (!uploading) {
      setSelectedFiles([])
      setError(null)
      onOpenChange(false)
    }
  }

  const removeFile = (fileId: string) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== fileId))
    // Clear error when removing files, as it might free up slots
    setError(null)
  }


  const pendingFiles = selectedFiles.filter((f) => f.status === 'pending' || !f.status)
  const uploadingFiles = selectedFiles.filter((f) => f.status === 'uploading')
  const hasPendingFiles = pendingFiles.length > 0

  // Count only files that can still be uploaded (not success status)
  const uploadableFilesCount = selectedFiles.filter((f) => f.status !== 'success').length
  const canAddMoreFiles = uploadableFilesCount < MAX_FILES

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
            {`Select files to upload or drag and drop them here. Maximum ${MAX_FILES} files, 5MB per file. All file types are supported.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
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
                disabled={uploading}
                className={`w-full border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer group disabled:cursor-not-allowed disabled:opacity-50 ${isDragging
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
                    {`Maximum ${MAX_FILES} files • 5MB per file • All file types supported`}
                  </p>
                </div>
              </button>
            ) : (
              <div className="space-y-3">
                <div className="max-h-[300px] overflow-y-auto space-y-2">
                  {selectedFiles.map((file) => (
                    <div
                      key={file.id}
                      className={`border rounded-lg p-4 flex items-center justify-between ${file.status === 'success'
                        ? 'border-green-500/50 bg-green-500/10'
                        : file.status === 'error'
                          ? 'border-destructive/50 bg-destructive/10'
                          : file.status === 'uploading'
                            ? 'border-primary/50 bg-primary/10'
                            : 'border-border'
                        }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg shrink-0 ${file.status === 'success'
                          ? 'bg-green-500/20'
                          : file.status === 'error'
                            ? 'bg-destructive/20'
                            : 'bg-primary/15'
                          }`}>
                          <FileText className={`h-5 w-5 ${file.status === 'success'
                            ? 'text-green-600'
                            : file.status === 'error'
                              ? 'text-destructive'
                              : 'text-primary'
                            }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {file.name}
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)}
                            </p>
                            {file.status === 'uploading' && (
                              <span className="text-xs text-primary">Uploading...</span>
                            )}
                            {file.status === 'success' && (
                              <span className="text-xs text-green-600">Uploaded</span>
                            )}
                            {file.status === 'error' && file.error && (
                              <span className="text-xs text-destructive truncate">
                                {file.error}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(file.id)}
                        disabled={uploading || file.status === 'uploading'}
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
                    disabled={uploading}
                    className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    + Add more files ({MAX_FILES - uploadableFilesCount} remaining)
                  </button>
                )}
                {!canAddMoreFiles && (
                  <p className="text-xs text-muted-foreground text-center">
                    Maximum file limit reached ({MAX_FILES} files)
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
            disabled={uploading}
          >
            {"Cancel"}
          </Button>
          <Button onClick={handleSubmit} disabled={!hasPendingFiles || uploading}>
            {uploading
              ? `Uploading ${uploadingFiles.length} file${uploadingFiles.length !== 1 ? 's' : ''}...`
              : `Upload ${pendingFiles.length} file${pendingFiles.length !== 1 ? 's' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
