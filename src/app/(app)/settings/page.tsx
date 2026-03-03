"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useExercises } from "@/lib/hooks/useExercises"
import {
  addExercise,
  updateExercise,
  deleteExercise,
  getAllWorkouts,
  updateUserProfile,
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
import { Plus, Pencil, Trash2, Download, LogOut } from "lucide-react"
import { format } from "date-fns"
import { deleteUser } from "firebase/auth"

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const { exercises, refresh } = useExercises()
  const { toast } = useToast()
  const router = useRouter()
  const [displayName, setDisplayName] = useState(user?.displayName || "")
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  // 種目編集ダイアログ
  const [exerciseDialogOpen, setExerciseDialogOpen] = useState(false)
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null)
  const [exerciseName, setExerciseName] = useState("")
  const [exerciseBodyPart, setExerciseBodyPart] = useState<BodyPart>("chest")
  const [deleteExerciseId, setDeleteExerciseId] = useState<string | null>(null)

  // アカウント削除
  const [showDeleteAccount, setShowDeleteAccount] = useState(false)

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
        <CardContent className="space-y-3">
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
          <Button variant="outline" size="sm" onClick={handleAddExercise}>
            <Plus className="h-4 w-4 mr-1" />
            追加
          </Button>
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
