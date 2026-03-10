"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useExercises } from "@/lib/hooks/useExercises"
import {
  addExercise,
  updateExercise,
  deleteExercise,
  resetExercises,
  getAllWorkouts,
  updateUserProfile,
  getUserProfile,
} from "@/lib/firebase/firestore"
import { updateProfile } from "firebase/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { BODY_PART_LABELS, type BodyPart, type Exercise } from "@/lib/types"
import { Plus, Pencil, Trash2, Download, LogOut, RefreshCw, Camera, User } from "lucide-react"
import { format } from "date-fns"
import { deleteUser } from "firebase/auth"

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const { exercises, refresh } = useExercises()
  const { toast } = useToast()
  const router = useRouter()
  const [displayName, setDisplayName] = useState(user?.displayName || "")
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(user?.photoURL || "")
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Firestoreからアバター読み込み
  useEffect(() => {
    if (!user) return
    getUserProfile(user.uid).then((profile) => {
      if (profile?.avatarBase64) {
        setAvatarUrl(profile.avatarBase64)
      }
    })
  }, [user])

  // 種目編集ダイアログ
  const [exerciseDialogOpen, setExerciseDialogOpen] = useState(false)
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null)
  const [exerciseName, setExerciseName] = useState("")
  const [exerciseBodyPart, setExerciseBodyPart] = useState<BodyPart>("chest")
  const [deleteExerciseId, setDeleteExerciseId] = useState<string | null>(null)

  // アカウント削除
  const [showDeleteAccount, setShowDeleteAccount] = useState(false)

  const resizeAndConvertToBase64 = (file: File, maxWidth: number): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image()
      const url = URL.createObjectURL(file)
      img.onload = () => {
        URL.revokeObjectURL(url)
        const canvas = document.createElement("canvas")
        let { width, height } = img
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")!
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL("image/jpeg", 0.7))
      }
      img.src = url
    })
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setIsUploadingAvatar(true)
    try {
      const base64 = await resizeAndConvertToBase64(file, 200)
      await updateUserProfile(user.uid, { avatarBase64: base64 })
      setAvatarUrl(base64)
      toast({ title: "アイコンを更新しました" })
    } catch {
      toast({ title: "アップロードに失敗しました", variant: "destructive" })
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!user) return
    setIsSavingProfile(true)
    try {
      await updateProfile(user, { displayName })
      await updateUserProfile(user.uid, { displayName })
      toast({ title: "プロフィールを更新しました" })
    } catch {
      toast({ title: "更新に失敗しました", variant: "destructive" })
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleAddExercise = () => {
    setEditingExercise(null)
    setExerciseName("")
    setExerciseBodyPart("chest")
    setExerciseDialogOpen(true)
  }

  const handleEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise)
    setExerciseName(exercise.name)
    setExerciseBodyPart(exercise.bodyPart)
    setExerciseDialogOpen(true)
  }

  const handleSaveExercise = async () => {
    if (!user || !exerciseName.trim()) return
    try {
      if (editingExercise) {
        await updateExercise(user.uid, editingExercise.id, {
          name: exerciseName.trim(),
          bodyPart: exerciseBodyPart,
        })
        toast({ title: "種目を更新しました" })
      } else {
        await addExercise(user.uid, {
          name: exerciseName.trim(),
          bodyPart: exerciseBodyPart,
          isDefault: false,
          order: exercises.length,
        })
        toast({ title: "種目を追加しました" })
      }
      setExerciseDialogOpen(false)
      refresh()
    } catch {
      toast({ title: "保存に失敗しました", variant: "destructive" })
    }
  }

  const handleDeleteExercise = async () => {
    if (!user || !deleteExerciseId) return
    try {
      await deleteExercise(user.uid, deleteExerciseId)
      toast({ title: "種目を削除しました" })
      setDeleteExerciseId(null)
      refresh()
    } catch {
      toast({ title: "削除に失敗しました", variant: "destructive" })
    }
  }

  const handleExport = async (type: "csv" | "json") => {
    if (!user) return
    try {
      const workouts = await getAllWorkouts(user.uid)

      let content: string
      let filename: string
      let mimeType: string

      if (type === "csv") {
        const header = "日付,種目,重量(kg),回数,セット数,ボリューム(kg),コンディション,メモ"
        const rows = workouts.map(
          (w) => `${w.date},${w.exerciseName},${w.weightKg},${w.reps},${w.sets},${w.volume},${w.condition || ""},${w.memo || ""}`
        )
        content = [header, ...rows].join("\n")
        filename = `workoutlog_${format(new Date(), "yyyyMMdd")}.csv`
        mimeType = "text/csv;charset=utf-8;"
      } else {
        content = JSON.stringify(workouts, null, 2)
        filename = `workoutlog_${format(new Date(), "yyyyMMdd")}.json`
        mimeType = "application/json"
      }

      const blob = new Blob(["\ufeff" + content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
      toast({ title: `${type.toUpperCase()}ファイルをダウンロードしました` })
    } catch {
      toast({ title: "エクスポートに失敗しました", variant: "destructive" })
    }
  }

  const handleLogout = async () => {
    await signOut()
    router.push("/login")
  }

  const handleDeleteAccount = async () => {
    if (!user) return
    try {
      await deleteUser(user)
      router.push("/login")
    } catch {
      toast({
        title: "アカウント削除に失敗しました",
        description: "再ログイン後にお試しください",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-xl font-bold">設定</h1>

      {/* プロフィール */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">プロフィール</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* アバター */}
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="relative group"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden bg-muted border-2 border-border flex items-center justify-center">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="アバター"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-muted-foreground" />
                )}
              </div>
              <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
              {isUploadingAvatar && (
                <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <p className="text-xs text-muted-foreground">タップしてアイコンを変更</p>
          </div>

          <div className="space-y-2">
            <Label>表示名</Label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>メールアドレス</Label>
            <Input value={user?.email || ""} disabled />
          </div>
          <Button onClick={handleSaveProfile} disabled={isSavingProfile}>
            {isSavingProfile ? "保存中..." : "プロフィールを保存"}
          </Button>
        </CardContent>
      </Card>

      {/* カスタム種目管理 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">種目管理</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                if (!user) return
                try {
                  await resetExercises(user.uid)
                  refresh()
                  toast({ title: "種目を初期化しました" })
                } catch {
                  toast({ title: "初期化に失敗しました", variant: "destructive" })
                }
              }}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              初期化
            </Button>
            <Button variant="outline" size="sm" onClick={handleAddExercise}>
              <Plus className="h-4 w-4 mr-1" />
              追加
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div>
                  <p className="text-sm font-medium">{exercise.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {BODY_PART_LABELS[exercise.bodyPart]}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEditExercise(exercise)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  {!exercise.isDefault && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => setDeleteExerciseId(exercise.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* データエクスポート */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">データエクスポート</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button variant="outline" onClick={() => handleExport("csv")}>
            <Download className="h-4 w-4 mr-1" />
            CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport("json")}>
            <Download className="h-4 w-4 mr-1" />
            JSON
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* ログアウト */}
      <Button variant="outline" className="w-full" onClick={handleLogout}>
        <LogOut className="h-4 w-4 mr-2" />
        ログアウト
      </Button>

      {/* アカウント削除 */}
      <Button
        variant="destructive"
        className="w-full"
        onClick={() => setShowDeleteAccount(true)}
      >
        アカウントを削除
      </Button>

      {/* 種目編集ダイアログ */}
      <Dialog open={exerciseDialogOpen} onOpenChange={setExerciseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingExercise ? "種目を編集" : "種目を追加"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>種目名</Label>
              <Input
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                placeholder="例: ケーブルフライ"
              />
            </div>
            <div className="space-y-2">
              <Label>部位</Label>
              <Select
                value={exerciseBodyPart}
                onValueChange={(v) => setExerciseBodyPart(v as BodyPart)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(BODY_PART_LABELS) as BodyPart[]).map((bp) => (
                    <SelectItem key={bp} value={bp}>
                      {BODY_PART_LABELS[bp]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExerciseDialogOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleSaveExercise} disabled={!exerciseName.trim()}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 種目削除確認 */}
      <AlertDialog open={!!deleteExerciseId} onOpenChange={() => setDeleteExerciseId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>種目を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この種目に関連する記録は削除されません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteExercise}
              className="bg-destructive text-destructive-foreground"
            >
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* アカウント削除確認 */}
      <AlertDialog open={showDeleteAccount} onOpenChange={setShowDeleteAccount}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>アカウントを削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              アカウントとすべてのデータが完全に削除されます。この操作は取り消せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground"
            >
              アカウントを削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
