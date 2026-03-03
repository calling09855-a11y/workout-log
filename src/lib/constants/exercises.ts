import { BodyPart } from "@/lib/types";

export interface PresetExercise {
  name: string;
  bodyPart: BodyPart;
}

export const PRESET_EXERCISES: PresetExercise[] = [
  // 胸
  { name: "ベンチプレス", bodyPart: "chest" },
  { name: "ダンベルフライ", bodyPart: "chest" },
  { name: "インクラインベンチ", bodyPart: "chest" },
  { name: "チェストプレスマシン", bodyPart: "chest" },

  // 背中
  { name: "デッドリフト", bodyPart: "back" },
  { name: "ラットプルダウン", bodyPart: "back" },
  { name: "ベントオーバーロー", bodyPart: "back" },
  { name: "懸垂", bodyPart: "back" },

  // 肩
  { name: "ショルダープレス", bodyPart: "shoulder" },
  { name: "サイドレイズ", bodyPart: "shoulder" },
  { name: "フロントレイズ", bodyPart: "shoulder" },
  { name: "フェイスプル", bodyPart: "shoulder" },

  // 腕
  { name: "アームカール", bodyPart: "arms" },
  { name: "ハンマーカール", bodyPart: "arms" },
  { name: "トライセプスプッシュダウン", bodyPart: "arms" },
  { name: "キックバック", bodyPart: "arms" },

  // 脚
  { name: "スクワット", bodyPart: "legs" },
  { name: "レッグプレス", bodyPart: "legs" },
  { name: "レッグカール", bodyPart: "legs" },
  { name: "カーフレイズ", bodyPart: "legs" },
  { name: "ルーマニアンデッドリフト", bodyPart: "legs" },

  // 体幹
  { name: "プランク", bodyPart: "core" },
  { name: "アブローラー", bodyPart: "core" },
  { name: "レッグレイズ", bodyPart: "core" },
  { name: "ケーブルクランチ", bodyPart: "core" },
];
