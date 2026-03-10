"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { addMeal, getMealsByDate, deleteMeal } from "@/lib/firebase/firestore"
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
import { useToast } from "@/components/ui/use-toast"
import {
  MEAL_TYPE_LABELS,
  MEAL_TYPE_EMOJI,
  type MealType,
  type MealLog,
} from "@/lib/types"
import { Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { format, addDays, subDays } from "date-fns"
import { ja } from "date-fns/locale"

export default function MealsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [meals, setMeals] = useState<MealLog[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)

  // フォーム
  const [mealType, setMealType] = useState<MealType>("breakfast")
  const [description, setDescription] = useState("")
  const [calories, setCalories] = useState("")
  const [protein, setProtein] = useState("")
  const [memo, setMemo] = useState("")

  const loadMeals = async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await getMealsByDate(user.uid, selectedDate)
      setMeals(data as MealLog[])
    } catch {
      toast({ title: "読み込みに失敗しました", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMeals()
  }, [user, selectedDate])

  const handleAdd = () => {
    setMealType("breakfast")
    setDescription("")
    setCalories("")
    setProtein("")
    setMemo("")
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!user || !description.trim()) return
    try {
      await addMeal(user.uid, {
        date: selectedDate,
        mealType,
        description: description.trim(),
        ...(calories ? { calories: Number(calories) } : {}),
        ...(protein ? { protein: Number(protein) } : {}),
        ...(memo ? { memo: memo.trim() } : {}),
      })
      toast({ title: "食事を記録しました" })
      setDialogOpen(false)
      loadMeals()
    } catch {
      toast({ title: "保存に失敗しました", variant: "destructive" })
    }
  }

  const handleDelete = async (mealId: string) => {
    if (!user) return
    try {
      await deleteMeal(user.uid, mealId)
      toast({ title: "削除しました" })
      loadMeals()
    } catch {
      toast({ title: "削除に失敗しました", variant: "destructive" })
    }
  }

  const totalCalories = meals.reduce((sum, m) => sum + (m.calories || 0), 0)
  const totalProtein = meals.reduce((sum, m) => sum + (m.protein || 0), 0)

  const mealTypeOrder: MealType[] = ["breakfast", "lunch", "dinner", "snack"]
  const groupedMeals = mealTypeOrder.map((type) => ({
    type,
    items: meals.filter((m) => m.mealType === type),
  })).filter((g) => g.items.length > 0)

  return (
    <div className="space-y-4 pb-20">
      {/* 日付ナビ */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSelectedDate(format(subDays(new Date(selectedDate), 1), "yyyy-MM-dd"))}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="text-center">
          <h1 className="text-lg font-bold">
            {format(new Date(selectedDate), "M月d日（E）", { locale: ja })}
          </h1>
          {selectedDate !== format(new Date(), "yyyy-MM-dd") && (
            <button
              className="text-xs text-primary"
              onClick={() => setSelectedDate(format(new Date(), "yyyy-MM-dd"))}
            >
              今日に戻る
            </button>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSelectedDate(format(addDays(new Date(selectedDate), 1), "yyyy-MM-dd"))}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* サマリー */}
      {meals.length > 0 && (totalCalories > 0 || totalProtein > 0) && (
        <div className="flex gap-3">
          {totalCalories > 0 && (
            <Card className="flex-1">
              <CardContent className="p-3 text-center">
                <p className="text-xs text-muted-foreground">カロリー</p>
                <p className="text-lg font-bold">{totalCalories}<span className="text-xs font-normal ml-0.5">kcal</span></p>
              </CardContent>
            </Card>
          )}
          {totalProtein > 0 && (
            <Card className="flex-1">
              <CardContent className="p-3 text-center">
                <p className="text-xs text-muted-foreground">タンパク質</p>
                <p className="text-lg font-bold">{totalProtein}<span className="text-xs font-normal ml-0.5">g</span></p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* 食事一覧 */}
      {loading ? (
        <div className="text-center py-8 text-muted-foreground text-sm">読み込み中...</div>
      ) : groupedMeals.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">この日の食事記録はありません</p>
          <Button className="mt-4" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-1" />
            食事を記録する
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {groupedMeals.map(({ type, items }) => (
            <Card key={type}>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm flex items-center gap-2">
                  <span>{MEAL_TYPE_EMOJI[type]}</span>
                  {MEAL_TYPE_LABELS[type]}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-3 pt-0 space-y-2">
                {items.map((meal) => (
                  <div key={meal.id} className="flex items-start justify-between gap-2 py-1.5 border-b last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{meal.description}</p>
                      <div className="flex gap-3 mt-0.5">
                        {meal.calories && (
                          <span className="text-xs text-muted-foreground">{meal.calories}kcal</span>
                        )}
                        {meal.protein && (
                          <span className="text-xs text-muted-foreground">P:{meal.protein}g</span>
                        )}
                      </div>
                      {meal.memo && (
                        <p className="text-xs text-muted-foreground mt-0.5">{meal.memo}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => handleDelete(meal.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 追加ボタン（FAB） */}
      {meals.length > 0 && (
        <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40">
          <Button size="lg" className="rounded-full h-14 w-14 shadow-lg" onClick={handleAdd}>
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* 追加ダイアログ */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>食事を記録</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>食事タイプ</Label>
              <Select value={mealType} onValueChange={(v) => setMealType(v as MealType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mealTypeOrder.map((type) => (
                    <SelectItem key={type} value={type}>
                      {MEAL_TYPE_EMOJI[type]} {MEAL_TYPE_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>食事内容</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="例: 鶏むね肉200g、玄米、サラダ"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>カロリー (kcal)</Label>
                <Input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  placeholder="任意"
                />
              </div>
              <div className="space-y-2">
                <Label>タンパク質 (g)</Label>
                <Input
                  type="number"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  placeholder="任意"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>メモ</Label>
              <Input
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="任意"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleSave} disabled={!description.trim()}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
