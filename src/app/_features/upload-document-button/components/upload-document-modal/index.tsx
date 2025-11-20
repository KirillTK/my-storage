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

interface UploadDocumentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (file: File) => Promise<{ success: boolean; error?: string }>
}

export function UploadDocumentModal({ open, onOpenChange, onConfirm }: UploadDocumentModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setError(null)
      
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
        setError(`File size (${sizeMB}MB) exceeds the maximum limit of 5MB.`)
        return
      }
      
      setSelectedFile(file)
    }
  }

  const handleSubmit = async () => {
    if (selectedFile) {
      setUploading(true)
      setError(null)
      setUploadProgress(0)
      
      try {
        const result = await onConfirm(selectedFile)
        
        if (result.success) {
          setUploadProgress(100)
          setSelectedFile(null)
          // Close modal after successful upload
          setTimeout(() => {
            onOpenChange(false)
            setUploadProgress(0)
          }, 500)
        } else if (result.error) {
          setError(result.error)
        }
      } catch (err) {
        setError('An unexpected error occurred. Please try again.')
      } finally {
        setUploading(false)
      }
    }
  }

  const handleClose = () => {
    if (!uploading) {
      setSelectedFile(null)
      setError(null)
      setUploadProgress(0)
      onOpenChange(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
              <Upload className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle>{"Upload File"}</DialogTitle>
          </div>
          <DialogDescription>
            {"Select a file to upload. Maximum file size: 5MB. All file types are supported."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {!selectedFile ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full border-2 border-dashed border-border rounded-lg p-8 hover:border-primary transition-colors cursor-pointer group disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="rounded-full bg-muted p-3 group-hover:bg-primary/10 transition-colors">
                  <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-sm font-medium text-foreground">{"Click to select a file"}</p>
                <p className="text-xs text-muted-foreground">{"Maximum size: 5MB • All file types supported"}</p>
              </div>
            </button>
          ) : (
            <div className="space-y-3">
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
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => {
                    setSelectedFile(null)
                    setError(null)
                  }} 
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {uploading && uploadProgress > 0 && (
                <div className="space-y-1">
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-primary h-full transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    {uploadProgress < 100 ? "Uploading..." : "Upload complete!"}
                  </p>
                </div>
              )}
            </div>
          )}
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
          <Button onClick={handleSubmit} disabled={!selectedFile || uploading}>
            {uploading ? "Uploading..." : "Upload File"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
