"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export function PhotoAnalyzer() {
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImage(file)
    setAnalysis(null)
    setError(null)

    const reader = new FileReader()
    reader.onload = (ev) => {
      setPreview(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const analyzePhoto = async () => {
    if (!image) return

    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("image", image)

      const res = await fetch("/api/ai/analyze-photo", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (data.error) {
        setError(data.error)
      } else {
        setAnalysis(data.response)
      }
    } catch {
      setError("通信エラーが発生しました")
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setImage(null)
    setPreview(null)
    setAnalysis(null)
    setError(null)
    if (fileRef.current) fileRef.current.value = ""
  }

  return (
    <div className="space-y-4">
      {!preview ? (
        <div className="space-y-4">
          <div className="text-center text-muted-foreground py-8">
            <p className="text-lg font-medium mb-2">写真をAIが分析</p>
            <p className="text-sm">体の写真やトレーニングフォームの写真をアップロード</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo-upload">写真を選択</Label>
            <input
              ref={fileRef}
              id="photo-upload"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageChange}
              className="block w-full text-sm text-muted-foreground
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-primary file:text-primary-foreground
                hover:file:bg-primary/90
                cursor-pointer"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <img
              src={preview}
              alt="アップロード画像"
              className="w-full max-h-80 object-contain rounded-lg"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={analyzePhoto}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? "分析中..." : "AIで分析する"}
            </Button>
            <Button variant="outline" onClick={reset} disabled={isLoading}>
              やり直し
            </Button>
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {analysis && (
            <Card className="p-4">
              <h3 className="font-semibold mb-2 text-sm">AI分析結果（Gemini）</h3>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{analysis}</p>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
