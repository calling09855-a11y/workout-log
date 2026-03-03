import { Timestamp } from "firebase/firestore";

// ── 部位 ──
export type BodyPart = "chest" | "back" | "shoulder" | "arms" | "legs" | "core" | "fullbody";

export const BODY_PART_LABELS: Record<BodyPart, string> = {
  chest: "胸",
  back: "背中",
  shoulder: "肩",
  arms: "腕",
  legs: "脚",
  core: "体幹",
  fullbody: "全身",
};

// ── コンディション ──
export type Condition = 1 | 2 | 3 | 4 | 5;

export const CONDITION_LABELS: Record<Condition, string> = {
  5: "絶好調",
  4: "好調",
  3: "普通",
  2: "不調",
  1: "かなり不調",
};

export const CONDITION_EMOJI: Record<Condition, string> = {
  5: "🔥",
  4: "😊",
  3: "😐",
  2: "😞",
  1: "😵",
};

// ── ユーザー ──
export interface UserProfile {
  displayName: string;
  email: string;
  createdAt: Timestamp;
}

// ── 種目 ──
export interface Exercise {
  id: string;
  name: string;
  bodyPart: BodyPart;
  isDefault: boolean;
  order: number;
}

// ── トレーニング記録 ──
export interface WorkoutLog {
  id: string;
  exerciseId: string;
  exerciseName?: string; // 表示用（JOINの代わり）
  date: string; // YYYY-MM-DD
  weightKg: number;
  reps: number;
  sets: number;
  volume: number; // weightKg × reps × sets（自動計算）
  condition?: Condition;
  memo?: string;
  createdAt: Timestamp;
}

// ── 記録入力フォーム ──
export interface WorkoutFormData {
  exerciseId: string;
  date: string;
  weightKg: number;
  reps: number;
  sets: number;
  condition?: Condition;
  memo?: string;
}

// ── ボディ写真 ──
export interface BodyPhoto {
  id: string;
  date: string; // YYYY-MM-DD
  imageUrl: string;
  tag?: string;
  createdAt: Timestamp;
}

// ── 統計データ ──
export interface WorkoutStats {
  exerciseId: string;
  exerciseName: string;
  maxWeight: number;
  maxVolume: number;
  totalSessions: number;
  data: Array<{
    date: string;
    weightKg: number;
    volume: number;
  }>;
}

export interface BodyPartStats {
  bodyPart: BodyPart;
  label: string;
  count: number;
  percentage: number;
}

// ── フィルター ──
export interface WorkoutFilter {
  exerciseId?: string;
  dateFrom?: string;
  dateTo?: string;
  keyword?: string;
}

// ── 期間選択 ──
export type DateRange = "1w" | "1m" | "3m" | "6m" | "1y" | "all";

export const DATE_RANGE_LABELS: Record<DateRange, string> = {
  "1w": "1週間",
  "1m": "1ヶ月",
  "3m": "3ヶ月",
  "6m": "6ヶ月",
  "1y": "1年",
  all: "全期間",
};
