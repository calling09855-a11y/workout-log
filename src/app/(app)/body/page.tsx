"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { getPhotos, deletePhotoRecord } from "@/lib/firebase/firestore"
import { PhotoUpload } from "@/components/photo/PhotoUpload"
import { PhotoTimeline } from "@/components/photo/PhotoTimeline"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import type { BodyPhoto } from "@/lib/types"

export default function BodyPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [photos, setPhotos] = useState<BodyPhoto[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPhotos = async () => {
    if (!user) return
    setLoading(true)
    const data = await getPhotos(user.uid)
    setPhotos(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchPhotos()
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (photoId: string) => {
    if (!user) return
    try {
      await deletePhotoRecord(user.uid, photoId)
      setPhotos((prev) => prev.filter((p) => p.id !== photoId))
      toast({ title: "写真を削除しました" })
    } catch {
      toast({ title: "削除に失敗しました", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-xl font-bold">ボディチェック</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">写真をアップロード</CardTitle>
        </CardHeader>
        <CardContent>
          <PhotoUpload onUploaded={fetchPhotos} />
        </CardContent>
      </Card>

      <div>
        <h2 className="text-base font-semibold mb-3">写真タイムライン</h2>
        {loading ? (
          <p className="text-center text-muted-foreground py-8">読み込み中...</p>
        ) : (
          <PhotoTimeline photos={photos} onDelete={handleDelete} />
        )}
      </div>
    </div>
  )
}
