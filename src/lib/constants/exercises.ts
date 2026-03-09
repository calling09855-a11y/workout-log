import { BodyPart } from "@/lib/types";

export type ExerciseLevel = "basic" | "advanced";
export type ArmSubCategory = "bicep" | "tricep" | "forearm";

export interface PresetExercise {
  name: string;
  nameEn: string;
  bodyPart: BodyPart;
  level: ExerciseLevel;
  armSub?: ArmSubCategory;
}

export interface ExerciseGroup {
  id: string;
  icon: string;
  title: string;
  exercises: PresetExercise[];
}

export const EXERCISE_GROUPS: ExerciseGroup[] = [
  {
    id: "chest", icon: "💪", title: "胸 / CHEST",
    exercises: [
      { name: "バーベルベンチプレス", nameEn: "Barbell Bench Press", bodyPart: "chest", level: "basic" },
      { name: "ダンベルベンチプレス", nameEn: "Dumbbell Bench Press", bodyPart: "chest", level: "basic" },
      { name: "プッシュアップ", nameEn: "Push-Up", bodyPart: "chest", level: "basic" },
      { name: "インクラインベンチプレス", nameEn: "Incline Bench Press", bodyPart: "chest", level: "basic" },
      { name: "デクラインベンチプレス", nameEn: "Decline Bench Press", bodyPart: "chest", level: "advanced" },
      { name: "ダンベルフライ", nameEn: "Dumbbell Fly", bodyPart: "chest", level: "advanced" },
      { name: "ケーブルクロスオーバー", nameEn: "Cable Crossover", bodyPart: "chest", level: "advanced" },
      { name: "ディップス（胸）", nameEn: "Chest Dips", bodyPart: "chest", level: "advanced" },
    ],
  },
  {
    id: "back", icon: "🏋️", title: "背中 / BACK",
    exercises: [
      { name: "デッドリフト", nameEn: "Deadlift", bodyPart: "back", level: "basic" },
      { name: "ベントオーバーロウ", nameEn: "Bent-Over Row", bodyPart: "back", level: "basic" },
      { name: "チンニング（懸垂）", nameEn: "Pull-Up / Chin-Up", bodyPart: "back", level: "basic" },
      { name: "ラットプルダウン", nameEn: "Lat Pulldown", bodyPart: "back", level: "basic" },
      { name: "シーテッドケーブルロウ", nameEn: "Seated Cable Row", bodyPart: "back", level: "advanced" },
      { name: "Tバーロウ", nameEn: "T-Bar Row", bodyPart: "back", level: "advanced" },
      { name: "ダンベルワンアームロウ", nameEn: "One-Arm DB Row", bodyPart: "back", level: "advanced" },
      { name: "フェイスプル", nameEn: "Face Pull", bodyPart: "back", level: "advanced" },
    ],
  },
  {
    id: "shoulder", icon: "🔺", title: "肩 / SHOULDER",
    exercises: [
      { name: "バーベルショルダープレス", nameEn: "Barbell Shoulder Press", bodyPart: "shoulder", level: "basic" },
      { name: "ダンベルショルダープレス", nameEn: "DB Shoulder Press", bodyPart: "shoulder", level: "basic" },
      { name: "サイドレイズ", nameEn: "Lateral Raise", bodyPart: "shoulder", level: "basic" },
      { name: "フロントレイズ", nameEn: "Front Raise", bodyPart: "shoulder", level: "advanced" },
      { name: "リアデルトフライ", nameEn: "Rear Delt Fly", bodyPart: "shoulder", level: "advanced" },
      { name: "アップライトロウ", nameEn: "Upright Row", bodyPart: "shoulder", level: "advanced" },
    ],
  },
  {
    id: "bicep", icon: "💪", title: "二頭筋 / BICEPS",
    exercises: [
      { name: "バーベルカール", nameEn: "Barbell Curl", bodyPart: "arms", level: "basic", armSub: "bicep" },
      { name: "ダンベルカール", nameEn: "Dumbbell Curl", bodyPart: "arms", level: "basic", armSub: "bicep" },
      { name: "ハンマーカール", nameEn: "Hammer Curl", bodyPart: "arms", level: "advanced", armSub: "bicep" },
      { name: "インクラインカール", nameEn: "Incline DB Curl", bodyPart: "arms", level: "advanced", armSub: "bicep" },
      { name: "コンセントレーションカール", nameEn: "Concentration Curl", bodyPart: "arms", level: "advanced", armSub: "bicep" },
      { name: "ケーブルカール", nameEn: "Cable Curl", bodyPart: "arms", level: "advanced", armSub: "bicep" },
    ],
  },
  {
    id: "tricep", icon: "🔥", title: "三頭筋 / TRICEPS",
    exercises: [
      { name: "トライセプスプッシュダウン", nameEn: "Tricep Pushdown", bodyPart: "arms", level: "basic", armSub: "tricep" },
      { name: "ナローグリップベンチプレス", nameEn: "Close-Grip Bench Press", bodyPart: "arms", level: "basic", armSub: "tricep" },
      { name: "スカルクラッシャー", nameEn: "Skull Crusher", bodyPart: "arms", level: "basic", armSub: "tricep" },
      { name: "ディップス（三頭筋）", nameEn: "Tricep Dips", bodyPart: "arms", level: "advanced", armSub: "tricep" },
      { name: "オーバーヘッドエクステンション", nameEn: "Overhead Extension", bodyPart: "arms", level: "advanced", armSub: "tricep" },
      { name: "キックバック", nameEn: "Tricep Kickback", bodyPart: "arms", level: "advanced", armSub: "tricep" },
    ],
  },
  {
    id: "forearm", icon: "✊", title: "前腕 / FOREARMS",
    exercises: [
      { name: "リストカール", nameEn: "Wrist Curl", bodyPart: "arms", level: "basic", armSub: "forearm" },
      { name: "リバースカール", nameEn: "Reverse Curl", bodyPart: "arms", level: "basic", armSub: "forearm" },
      { name: "リバースリストカール", nameEn: "Reverse Wrist Curl", bodyPart: "arms", level: "advanced", armSub: "forearm" },
      { name: "ファーマーズウォーク", nameEn: "Farmer's Walk", bodyPart: "arms", level: "advanced", armSub: "forearm" },
    ],
  },
  {
    id: "leg", icon: "🦵", title: "脚 / LEGS",
    exercises: [
      { name: "バーベルスクワット", nameEn: "Barbell Squat", bodyPart: "legs", level: "basic" },
      { name: "レッグプレス", nameEn: "Leg Press", bodyPart: "legs", level: "basic" },
      { name: "ルーマニアンデッドリフト", nameEn: "Romanian Deadlift", bodyPart: "legs", level: "basic" },
      { name: "レッグカール", nameEn: "Leg Curl", bodyPart: "legs", level: "basic" },
      { name: "レッグエクステンション", nameEn: "Leg Extension", bodyPart: "legs", level: "basic" },
      { name: "カーフレイズ", nameEn: "Calf Raise", bodyPart: "legs", level: "basic" },
      { name: "ブルガリアンスクワット", nameEn: "Bulgarian Split Squat", bodyPart: "legs", level: "advanced" },
      { name: "ランジ", nameEn: "Lunge", bodyPart: "legs", level: "advanced" },
      { name: "ハックスクワット", nameEn: "Hack Squat", bodyPart: "legs", level: "advanced" },
      { name: "グルートブリッジ", nameEn: "Glute Bridge", bodyPart: "legs", level: "advanced" },
    ],
  },
];

// Firestore初期化用のフラット配列
export const PRESET_EXERCISES: PresetExercise[] = EXERCISE_GROUPS.flatMap(
  (group) => group.exercises
);
