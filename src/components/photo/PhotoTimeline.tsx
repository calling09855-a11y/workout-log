"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Grid3X3, List, Trash2, ArrowLeftRight } from "lucide-react"
import type { BodyPhoto } from "@/lib/types"
import { format, parseISO } from "date-fns"
import { ja } from "date-fns/locale"

interface PhotoTimelineProps {
  photos: BodyPhoto[]
  onDelete?: (photoId: string) => void
}

export function PhotoTimeline({ photos, onDelete }: PhotoTimelineProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedPhoto, setSelectedPhoto] = useState<BodyPhoto | null>(null)
  const [compareMode, setCompareMode] = useState(false)
  const [comparePhotos, setComparePhotos] = useState<BodyPhoto[]>([])
  const [deletePhotoId, setDeletePhotoId] = useState<string | null>(null)

  const handleCompareSelect = (photo: BodyPhoto) => {
    if (comparePhotos.length < 2) {
      setComparePhotos((prev) => [...prev, photo])
    }
    if (comparePhotos.length === 1) {
      setCompareMode(false)
    }
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>写真がありません</p>
        <p className="text-sm mt-1">ボディチェック写真をアップロードしてみましょう</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setCompareMode(true)
            setComparePhotos([])
          }}
        >
          <ArrowLeftRight className="h-4 w-4 mr-1" />
          比較
        </Button>
      </div>

      {compareMode && (
        <div className="mb-4 p-3 bg-primary/5 rounded-lg text-sm text-center">
          {comparePhotos.length === 0
            ? "比較する1枚目の写真を選択してください"
            : "比較する2枚目の写真を選択してください"}
        </div>
      )}

      {comparePhotos.length === 2 && (
        <Card className="mb-4">
          <CardContent className="py-4">
            <div className="grid grid-cols-2 gap-2">
              {comparePhotos.map((photo) => (
                <div key={photo.id} className="text-center">
                  <img
                    src={photo.imageUrl}
                    alt="比較写真"
                    className="w-full rounded-lg aspect-[3/4] object-cover"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(parseISO(photo.date), "yyyy/M/d", { locale: ja })}
                  </p>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3"
              onClick={() => setComparePhotos([])}
            >
              比較をクリア
            </Button>
          </CardContent>
        </Card>
      )}

      {viewMode === "grid" ? (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative cursor-pointer group"
              onClick={() => {
                if (compareMode) {
                  handleCompareSelect(photo)
                } else {
                  setSelectedPhoto(photo)
                }
              }}
            >
              <img
                src={photo.imageUrl}
                alt={photo.tag || "ボディチェック"}
                className="w-full aspect-square object-cover rounded-lg"
              />
              {photo.tag && (
                <Badge
                  variant="secondary"
                  className="absolute bottom-1 left-1 text-[10px] max-w-full truncate"
                >
                  {photo.tag}
                </Badge>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {photos.map((photo) => (
            <Card
              key={photo.id}
              className="cursor-pointer"
              onClick={() => {
                if (compareMode) {
                  handleCompareSelect(photo)
                } else {
                  setSelectedPhoto(photo)
                }
              }}
            >
              <CardContent className="flex items-center gap-4 py-3">
                <img
                  src={photo.imageUrl}
                  alt={photo.tag || "ボディチェック"}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium">
                    {format(parseISO(photo.date), "yyyy/M/d (E)", { locale: ja })}
                  </p>
                  {photo.tag && (
                    <p className="text-sm text-muted-foreground truncate">{photo.tag}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedPhoto && format(parseISO(selectedPhoto.date), "yyyy/M/d (E)", { locale: ja })}
            </DialogTitle>
          </DialogHeader>
          {selectedPhoto && (
            <div className="space-y-3">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.tag || "ボディチェック"}
                className="w-full rounded-lg"
              />
              {selectedPhoto.tag && (
                <Badge variant="secondary">{selectedPhoto.tag}</Badge>
              )}
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setDeletePhotoId(selectedPhoto.id)
                  setSelectedPhoto(null)
                }}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                削除
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletePhotoId} onOpenChange={() => setDeletePhotoId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>写真を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletePhotoId) {
                  onDelete?.(deletePhotoId)
                  setDeletePhotoId(null)
                }
              }}
              className="bg-destructive text-destructive-foreground"
            >
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
