"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { MoreHorizontal, Pencil, Trash2, Trophy } from "lucide-react"
import { CONDITION_EMOJI, type Condition, type WorkoutLog } from "@/lib/types"
import { format, parseISO } from "date-fns"
import { ja } from "date-fns/locale"

interface RecordCardProps {
  record: WorkoutLog
  isPersonalBest?: boolean
  onEdit?: (record: WorkoutLog) => void
  onDelete?: (recordId: string) => void
}

export function RecordCard({ record, isPersonalBest, onEdit, onDelete }: RecordCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const dateLabel = format(parseISO(record.date), "M/d (E)", { locale: ja })

  return (
    <>
      <Card className="relative">
        <CardContent className="flex items-center justify-between py-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium truncate">{record.exerciseName}</p>
              {isPersonalBest && (
                <Badge variant="secondary" className="gap-1 shrink-0">
                  <Trophy className="h-3 w-3" />
                  PB
                </Badge>
              )}
              {record.condition && (
                <span className="text-sm">{CONDITION_EMOJI[record.condition as Condition]}</span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground">{dateLabel}</span>
              <span className="text-sm font-medium">
                {record.weightKg}kg × {record.reps}回 × {record.sets}セット
              </span>
            </div>
            {record.volume > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5">
                Vol: {record.volume.toLocaleString()} kg
              </p>
            )}
            {record.memo && (
              <p className="text-xs text-muted-foreground mt-1 truncate">{record.memo}</p>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(record)}>
                <Pencil className="h-4 w-4 mr-2" />
                編集
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                削除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>記録を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              {record.exerciseName}の記録（{dateLabel}）を削除します。この操作は取り消せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete?.(record.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
