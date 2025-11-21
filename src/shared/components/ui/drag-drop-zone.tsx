"use client"

import { useState, useRef, type DragEvent, type ReactNode } from "react"
import { Upload } from "lucide-react"
import { useFileUpload } from "~/shared/hooks/useFileUpload"

interface DragDropZoneProps {
  folderId?: string | null
  children: ReactNode
}

export function DragDropZone({ folderId, children }: DragDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const dragCounter = useRef(0)
  const { uploadFiles } = useFileUpload({ folderId })

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current++

    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current--

    if (dragCounter.current === 0) {
      setIsDragging(false)
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    dragCounter.current = 0

    const files = Array.from(e.dataTransfer.files)

    if (files.length > 0) {
      await uploadFiles(files)
    }
  }

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="relative flex-1 overflow-auto"
    >
      {children}

      {isDragging && (
        <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="border-2 border-dashed border-primary rounded-xl p-12 bg-card/50">
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-primary/10 p-6">
                <Upload className="h-12 w-12 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-xl font-semibold text-foreground mb-1">{"Drop files here"}</p>
                <p className="text-sm text-muted-foreground">{"Release to upload to the current folder"}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
