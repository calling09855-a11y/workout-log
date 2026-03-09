import { BodyPart } from "@/lib/types";

export interface PresetExercise {
  name: string;
  bodyPart: BodyPart;
}

export const PRESET_EXERCISES: PresetExercise[] = [
  // 胸
  { name: "ベンチプレス", bodyPart: "chest" },
  { name: "インクラインベンチプレス", bodyPart: "chest" },
  { name: "デクラインベンチプレス", bodyPart: "chest" },
  { name: "ダンベルプレス", bodyPart: "chest" },
  { name: "ダンベルフライ", bodyPart: "chest" },
  { name: "インクラインダンベルフライ", bodyPart: "chest" },
  { name: "チェストプレスマシン", bodyPart: "chest" },
  { name: "ペックフライマシン", bodyPart: "chest" },
  { name: "ケーブルクロスオーバー", bodyPart: "chest" },
  { name: "ディップス（胸）", bodyPart: "chest" },

  // 背中
  { name: "デッドリフト", bodyPart: "back" },
  { name: "懸垂（チンニング）", bodyPart: "back" },
  { name: "ラットプルダウン", bodyPart: "back" },
  { name: "ベントオーバーロー", bodyPart: "back" },
  { name: "ワンハンドダンベルロー", bodyPart: "back" },
  { name: "シーテッドケーブルロー", bodyPart: "back" },
  { name: "Tバーロー", bodyPart: "back" },
  { name: "シュラッグ", bodyPart: "back" },

  // 肩
  { name: "ショルダープレス", bodyPart: "shoulder" },
  { name: "ダンベルショルダープレス", bodyPart: "shoulder" },
  { name: "サイドレイズ", bodyPart: "shoulder" },
  { name: "フロントレイズ", bodyPart: "shoulder" },
  { name: "リアレイズ", bodyPart: "shoulder" },
  { name: "フェイスプル", bodyPart: "shoulder" },
  { name: "アップライトロー", bodyPart: "shoulder" },
  { name: "アーノルドプレス", bodyPart: "shoulder" },

  // 腕 - 二頭筋
  { name: "バーベルカール", bodyPart: "arms" },
  { name: "ダンベルカール", bodyPart: "arms" },
  { name: "ハンマーカール", bodyPart: "arms" },
  { name: "インクラインダンベルカール", bodyPart: "arms" },
  { name: "コンセントレーションカール", bodyPart: "arms" },
  { name: "プリーチャーカール", bodyPart: "arms" },
  { name: "ケーブルカール", bodyPart: "arms" },
  // 腕 - 三頭筋
  { name: "トライセプスプッシュダウン", bodyPart: "arms" },
  { name: "フレンチプレス", bodyPart: "arms" },
  { name: "スカルクラッシャー", bodyPart: "arms" },
  { name: "キックバック", bodyPart: "arms" },
  { name: "ディップス（三頭筋）", bodyPart: "arms" },
  { name: "ナロウベンチプレス", bodyPart: "arms" },
  { name: "オーバーヘッドエクステンション", bodyPart: "arms" },
  // 腕 - 前腕
  { name: "リストカール", bodyPart: "arms" },
  { name: "リバースリストカール", bodyPart: "arms" },
  { name: "リバースカール", bodyPart: "arms" },

  // 脚
  { name: "スクワット", bodyPart: "legs" },
  { name: "フロントスクワット", bodyPart: "legs" },
  { name: "レッグプレス", bodyPart: "legs" },
  { name: "レッグエクステンション", bodyPart: "legs" },
  { name: "レッグカール", bodyPart: "legs" },
  { name: "ブルガリアンスクワット", bodyPart: "legs" },
  { name: "ランジ", bodyPart: "legs" },
  { name: "ルーマニアンデッドリフト", bodyPart: "legs" },
  { name: "ヒップスラスト", bodyPart: "legs" },
  { name: "カーフレイズ", bodyPart: "legs" },
];
