"use client"

import { useState, useRef } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { uploadPhoto } from "@/lib/firebase/storage"
import { addPhoto } from "@/lib/firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Camera, Upload, X } from "lucide-react"
import { Timestamp } from "firebase/firestore"
import { format } from "date-fns"

interface PhotoUploadProps {
  onUploaded?: () => void
}

export function PhotoUpload({ onUploaded }: PhotoUploadProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [tag, setTag] = useState("")
  const [progress, setProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    setFile(selected)
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target?.result as string)
    reader.readAsDataURL(selected)
  }

  const handleUpload = async () => {
    if (!user || !file) return
    setIsUploading(true)
    try {
      const imageUrl = await uploadPhoto(user.uid, file, setProgress)
      await addPhoto(user.uid, {
        date: format(new Date(), "yyyy-MM-dd"),
        imageUrl,
        tag: tag || undefined,
        createdAt: Timestamp.now(),
      })
      toast({ title: "写真をアップロードしました" })
      setPreview(null)
      setFile(null)
      setTag("")
      setProgress(0)
      onUploaded?.()
    } catch {
      toast({ title: "アップロードに失敗しました", variant: "destructive" })
    } finally {
      setIsUploading(false)
    }
  }

  const handleClear = () => {
    setPreview(null)
    setFile(null)
    setTag("")
    setProgress(0)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="space-y-4">
      {!preview ? (
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-24 flex-col gap-2"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.capture = "environment"
                fileInputRef.current.click()
              }
            }}
          >
            <Camera className="h-6 w-6" />
            <span className="text-xs">カメラで撮影</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex-col gap-2"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.removeAttribute("capture")
                fileInputRef.current.click()
              }
            }}
          >
            <Upload className="h-6 w-6" />
            <span className="text-xs">アルバムから選択</span>
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <Card>
          <CardContent className="py-4 space-y-3">
            <div className="relative">
              <img
                src={preview}
                alt="プレビュー"
                className="w-full rounded-lg max-h-80 object-contain"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">タグ（任意）</Label>
              <Input
                placeholder="例: ダイエット2週目、バルクアップ3ヶ月"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              />
            </div>

            {isUploading && (
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            <Button
              onClick={handleUpload}
              className="w-full"
              disabled={isUploading}
            >
              {isUploading ? `アップロード中... ${Math.round(progress)}%` : "アップロード"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
