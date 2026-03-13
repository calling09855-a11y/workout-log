import { BodyPart } from "@/lib/types";

export type ExerciseLevel = "basic" | "advanced";
export type ArmSubCategory = "bicep" | "tricep" | "forearm";

export interface PresetExercise {
  name: string;
  nameEn: string;
  bodyPart: BodyPart;
  level: ExerciseLevel;
  armSub?: ArmSubCategory;
  steps: string[];
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
      {
        name: "バーベルベンチプレス", nameEn: "Barbell Bench Press", bodyPart: "chest", level: "basic",
        steps: [
          "ベンチに仰向けになり、足を床にしっかりつける",
          "バーを肩幅より少し広めに握る",
          "バーをラックから外し、胸の上に構える",
          "息を吸いながらバーを胸に下ろす",
          "息を吐きながら腕を伸ばして押し上げる",
        ],
      },
      {
        name: "ダンベルベンチプレス", nameEn: "Dumbbell Bench Press", bodyPart: "chest", level: "basic",
        steps: [
          "ダンベルを持ちベンチに仰向けになる",
          "ダンベルを胸の横に構える（肘90度）",
          "息を吐きながら真上に押し上げる",
          "息を吸いながらゆっくり下ろす",
        ],
      },
      {
        name: "プッシュアップ", nameEn: "Push-Up", bodyPart: "chest", level: "basic",
        steps: [
          "両手を肩幅より少し広めに床につく",
          "頭からかかとまで一直線にする",
          "肘を曲げて胸を床に近づける",
          "地面を押して元の位置に戻る",
        ],
      },
      {
        name: "インクラインベンチプレス", nameEn: "Incline Bench Press", bodyPart: "chest", level: "basic",
        steps: [
          "ベンチを30〜45度に設定する",
          "バー/ダンベルを肩幅で握る",
          "鎖骨のあたりに向かって下ろす",
          "胸上部を意識して押し上げる",
        ],
      },
      {
        name: "デクラインベンチプレス", nameEn: "Decline Bench Press", bodyPart: "chest", level: "advanced",
        steps: [
          "ベンチを15〜30度下向きに設定する",
          "足をパッドに固定する",
          "バーを胸下部に向かって下ろす",
          "胸下部を意識して押し上げる",
        ],
      },
      {
        name: "ダンベルフライ", nameEn: "Dumbbell Fly", bodyPart: "chest", level: "advanced",
        steps: [
          "ダンベルを持ちベンチに仰向けになる",
          "腕を真上に伸ばし、軽く肘を曲げる",
          "弧を描くように腕を横に開く",
          "胸のストレッチを感じたら戻す",
        ],
      },
      {
        name: "ケーブルクロスオーバー", nameEn: "Cable Crossover", bodyPart: "chest", level: "advanced",
        steps: [
          "ケーブルマシンの中央に立つ",
          "ハンドルを両手で握り、少し前傾する",
          "弧を描くように手を体の前で合わせる",
          "胸の収縮を感じたらゆっくり戻す",
        ],
      },
      {
        name: "ディップス（胸）", nameEn: "Chest Dips", bodyPart: "chest", level: "advanced",
        steps: [
          "ディップスバーを握り、体を持ち上げる",
          "上体をやや前傾させる",
          "肘を曲げて体を下ろす",
          "胸に効かせながら押し上げる",
        ],
      },
    ],
  },
  {
    id: "back", icon: "🏋️", title: "背中 / BACK",
    exercises: [
      {
        name: "デッドリフト", nameEn: "Deadlift", bodyPart: "back", level: "basic",
        steps: [
          "足を腰幅に開き、バーの前に立つ",
          "腰を曲げてバーを肩幅で握る",
          "背中をまっすぐに保ちながら立ち上がる",
          "膝を伸ばし、腰を前に押し出す",
          "ゆっくりと逆の動作で下ろす",
        ],
      },
      {
        name: "ベントオーバーロウ", nameEn: "Bent-Over Row", bodyPart: "back", level: "basic",
        steps: [
          "バーベルを肩幅で握り、膝を軽く曲げる",
          "上体を45度前傾させる",
          "バーをおへそに向かって引き上げる",
          "肩甲骨を寄せてからゆっくり下ろす",
        ],
      },
      {
        name: "チンニング（懸垂）", nameEn: "Pull-Up / Chin-Up", bodyPart: "back", level: "basic",
        steps: [
          "バーを肩幅より広めに握る",
          "体をぶら下げた状態からスタート",
          "肘を引きながらアゴをバーの上まで上げる",
          "ゆっくりと体を下ろす",
        ],
      },
      {
        name: "ラットプルダウン", nameEn: "Lat Pulldown", bodyPart: "back", level: "basic",
        steps: [
          "バーを肩幅より広めに握る",
          "胸を張り、やや後ろに体を倒す",
          "バーを鎖骨に向かって引き下げる",
          "背中を絞ったらゆっくり戻す",
        ],
      },
      {
        name: "シーテッドケーブルロウ", nameEn: "Seated Cable Row", bodyPart: "back", level: "advanced",
        steps: [
          "シートに座り、足をプレートに置く",
          "ハンドルを両手で握る",
          "胸を張りながら、おへそに向かって引く",
          "肩甲骨を寄せてからゆっくり戻す",
        ],
      },
      {
        name: "Tバーロウ", nameEn: "T-Bar Row", bodyPart: "back", level: "advanced",
        steps: [
          "Tバーマシンにまたがって立つ",
          "ハンドルを握り、上体を前傾させる",
          "腹部に向かってバーを引き上げる",
          "肩甲骨を寄せてからゆっくり下ろす",
        ],
      },
      {
        name: "ダンベルワンアームロウ", nameEn: "One-Arm DB Row", bodyPart: "back", level: "advanced",
        steps: [
          "片手と片膝をベンチに置く",
          "反対の手でダンベルを持つ",
          "脇腹に向かってダンベルを引き上げる",
          "肩甲骨を寄せてからゆっくり下ろす",
        ],
      },
      {
        name: "フェイスプル", nameEn: "Face Pull", bodyPart: "back", level: "advanced",
        steps: [
          "ケーブルを顔の高さにセットする",
          "ロープアタッチメントを握る",
          "顔に向かってロープを引く",
          "両手を外に開きながら絞る",
        ],
      },
    ],
  },
  {
    id: "shoulder", icon: "🔺", title: "肩 / SHOULDER",
    exercises: [
      {
        name: "バーベルショルダープレス", nameEn: "Barbell Shoulder Press", bodyPart: "shoulder", level: "basic",
        steps: [
          "バーベルを鎖骨の前に構える",
          "足を肩幅に開き、体幹を固める",
          "バーを頭上に押し上げる",
          "ゆっくりと鎖骨の位置に戻す",
        ],
      },
      {
        name: "ダンベルショルダープレス", nameEn: "DB Shoulder Press", bodyPart: "shoulder", level: "basic",
        steps: [
          "ダンベルを肩の高さに持ち上げる",
          "手のひらを前に向ける",
          "真上にダンベルを押し上げる",
          "ゆっくりと肩の高さに戻す",
        ],
      },
      {
        name: "サイドレイズ", nameEn: "Lateral Raise", bodyPart: "shoulder", level: "basic",
        steps: [
          "ダンベルを体の横に持つ",
          "軽く肘を曲げた状態を保つ",
          "腕を真横に肩の高さまで上げる",
          "ゆっくりと元の位置に戻す",
        ],
      },
      {
        name: "フロントレイズ", nameEn: "Front Raise", bodyPart: "shoulder", level: "advanced",
        steps: [
          "ダンベルを太ももの前に持つ",
          "肘を軽く曲げた状態で保つ",
          "腕を正面に肩の高さまで上げる",
          "ゆっくりと元の位置に戻す",
        ],
      },
      {
        name: "リアデルトフライ", nameEn: "Rear Delt Fly", bodyPart: "shoulder", level: "advanced",
        steps: [
          "上体を前に倒す（ベンチにうつ伏せ可）",
          "ダンベルを下に垂らす",
          "弧を描くように腕を横に開く",
          "肩甲骨を寄せてからゆっくり戻す",
        ],
      },
      {
        name: "アップライトロウ", nameEn: "Upright Row", bodyPart: "shoulder", level: "advanced",
        steps: [
          "バーベル/ダンベルを太ももの前に持つ",
          "肘を外側に張りながら引き上げる",
          "アゴの高さまで上げる",
          "ゆっくりと下ろす",
        ],
      },
    ],
  },
  {
    id: "bicep", icon: "💪", title: "二頭筋 / BICEPS",
    exercises: [
      {
        name: "バーベルカール", nameEn: "Barbell Curl", bodyPart: "arms", level: "basic", armSub: "bicep",
        steps: [
          "バーベルを肩幅で逆手に握る",
          "肘を体の横に固定する",
          "肘を曲げてバーを肩に向かって上げる",
          "ゆっくりと腕を伸ばして下ろす",
        ],
      },
      {
        name: "ダンベルカール", nameEn: "Dumbbell Curl", bodyPart: "arms", level: "basic", armSub: "bicep",
        steps: [
          "ダンベルを体の横に持つ（手のひら前向き）",
          "肘を固定したまま曲げる",
          "ダンベルを肩まで上げる",
          "ゆっくりと下ろす",
        ],
      },
      {
        name: "ハンマーカール", nameEn: "Hammer Curl", bodyPart: "arms", level: "advanced", armSub: "bicep",
        steps: [
          "ダンベルを縦向き（ハンマー握り）で持つ",
          "肘を体に固定したまま曲げる",
          "ダンベルを肩に向かって上げる",
          "ゆっくりと下ろす",
        ],
      },
      {
        name: "インクラインカール", nameEn: "Incline DB Curl", bodyPart: "arms", level: "advanced", armSub: "bicep",
        steps: [
          "インクラインベンチに座る（45度）",
          "ダンベルを垂らした状態からスタート",
          "肘を固定したままカールする",
          "ストレッチを感じながら下ろす",
        ],
      },
      {
        name: "コンセントレーションカール", nameEn: "Concentration Curl", bodyPart: "arms", level: "advanced", armSub: "bicep",
        steps: [
          "ベンチに座り、膝を開く",
          "肘を太ももの内側に当てて固定",
          "ダンベルをカールする",
          "収縮を意識してゆっくり下ろす",
        ],
      },
      {
        name: "ケーブルカール", nameEn: "Cable Curl", bodyPart: "arms", level: "advanced", armSub: "bicep",
        steps: [
          "ケーブルを一番下にセットする",
          "バーまたはハンドルを逆手で握る",
          "肘を固定してカールする",
          "ゆっくり戻す（常に負荷がかかる）",
        ],
      },
    ],
  },
  {
    id: "tricep", icon: "🔥", title: "三頭筋 / TRICEPS",
    exercises: [
      {
        name: "トライセプスプッシュダウン", nameEn: "Tricep Pushdown", bodyPart: "arms", level: "basic", armSub: "tricep",
        steps: [
          "ケーブルマシンのバーを順手で握る",
          "肘を体の横に固定する",
          "肘を伸ばしてバーを押し下げる",
          "ゆっくり肘を曲げて戻す",
        ],
      },
      {
        name: "ナローグリップベンチプレス", nameEn: "Close-Grip Bench Press", bodyPart: "arms", level: "basic", armSub: "tricep",
        steps: [
          "ベンチに仰向けになる",
          "バーを肩幅より狭く握る",
          "バーを胸に下ろす（肘を体に寄せる）",
          "三頭筋を意識して押し上げる",
        ],
      },
      {
        name: "スカルクラッシャー", nameEn: "Skull Crusher", bodyPart: "arms", level: "basic", armSub: "tricep",
        steps: [
          "ベンチに仰向けでバー/ダンベルを持つ",
          "腕を真上に伸ばした状態からスタート",
          "肘を固定し、おでこに向かって下ろす",
          "三頭筋で持ち上げて腕を伸ばす",
        ],
      },
      {
        name: "ディップス（三頭筋）", nameEn: "Tricep Dips", bodyPart: "arms", level: "advanced", armSub: "tricep",
        steps: [
          "ディップスバーを握り体を持ち上げる",
          "上体をまっすぐに保つ（前傾しない）",
          "肘を曲げて体を下ろす",
          "三頭筋で押し上げる",
        ],
      },
      {
        name: "オーバーヘッドエクステンション", nameEn: "Overhead Extension", bodyPart: "arms", level: "advanced", armSub: "tricep",
        steps: [
          "ダンベル/バーを頭上に持ち上げる",
          "肘を耳の横に固定する",
          "肘を曲げて頭の後ろに下ろす",
          "三頭筋で持ち上げて伸ばす",
        ],
      },
      {
        name: "キックバック", nameEn: "Tricep Kickback", bodyPart: "arms", level: "advanced", armSub: "tricep",
        steps: [
          "上体を前傾し、肘を90度に曲げる",
          "肘の位置を体の横に固定する",
          "腕を後ろに伸ばす",
          "収縮を感じたらゆっくり戻す",
        ],
      },
    ],
  },
  {
    id: "forearm", icon: "✊", title: "前腕 / FOREARMS",
    exercises: [
      {
        name: "リストカール", nameEn: "Wrist Curl", bodyPart: "arms", level: "basic", armSub: "forearm",
        steps: [
          "前腕をベンチに乗せ、手首を端から出す",
          "バー/ダンベルを逆手で握る",
          "手首を曲げてウエイトを持ち上げる",
          "ゆっくりと手首を伸ばして下ろす",
        ],
      },
      {
        name: "リバースカール", nameEn: "Reverse Curl", bodyPart: "arms", level: "basic", armSub: "forearm",
        steps: [
          "バーベルを順手（手の甲が上）で握る",
          "肘を体の横に固定する",
          "通常のカールと同じ動作で上げる",
          "ゆっくり下ろす",
        ],
      },
      {
        name: "リバースリストカール", nameEn: "Reverse Wrist Curl", bodyPart: "arms", level: "advanced", armSub: "forearm",
        steps: [
          "前腕をベンチに乗せ、手首を端から出す",
          "バー/ダンベルを順手で握る",
          "手首を反らせてウエイトを持ち上げる",
          "ゆっくり戻す",
        ],
      },
      {
        name: "ファーマーズウォーク", nameEn: "Farmer's Walk", bodyPart: "arms", level: "advanced", armSub: "forearm",
        steps: [
          "重いダンベル/ケトルベルを両手に持つ",
          "背筋を伸ばし、肩を下げる",
          "安定した歩幅で前に歩く",
          "握力が限界になるまで続ける",
        ],
      },
    ],
  },
  {
    id: "leg", icon: "🦵", title: "脚 / LEGS",
    exercises: [
      {
        name: "バーベルスクワット", nameEn: "Barbell Squat", bodyPart: "legs", level: "basic",
        steps: [
          "バーを肩（僧帽筋上部）に担ぐ",
          "足を肩幅に開き、つま先を少し外に向ける",
          "お尻を後ろに引きながら膝を曲げる",
          "太ももが床と平行になるまで下げる",
          "地面を踏みしめて立ち上がる",
        ],
      },
      {
        name: "レッグプレス", nameEn: "Leg Press", bodyPart: "legs", level: "basic",
        steps: [
          "シートに座り、足を肩幅でプレートに置く",
          "安全バーを外す",
          "膝を曲げてプレートを体に近づける",
          "足で押して脚を伸ばす（膝を完全にロックしない）",
        ],
      },
      {
        name: "ルーマニアンデッドリフト", nameEn: "Romanian Deadlift", bodyPart: "legs", level: "basic",
        steps: [
          "バーベルを肩幅で握り、立った状態からスタート",
          "膝を軽く曲げ、お尻を後ろに引く",
          "バーをすねに沿って下ろす",
          "ハムストリングのストレッチを感じたら戻す",
        ],
      },
      {
        name: "レッグカール", nameEn: "Leg Curl", bodyPart: "legs", level: "basic",
        steps: [
          "マシンにうつ伏せで寝る",
          "パッドをアキレス腱の上にセット",
          "膝を曲げてパッドをお尻に近づける",
          "ゆっくり脚を伸ばして戻す",
        ],
      },
      {
        name: "レッグエクステンション", nameEn: "Leg Extension", bodyPart: "legs", level: "basic",
        steps: [
          "マシンに座り、パッドを足首にセット",
          "背もたれにしっかり背中をつける",
          "膝を伸ばしてパッドを持ち上げる",
          "ゆっくり膝を曲げて戻す",
        ],
      },
      {
        name: "カーフレイズ", nameEn: "Calf Raise", bodyPart: "legs", level: "basic",
        steps: [
          "つま先を段差の端に置く",
          "かかとを下げてふくらはぎを伸ばす",
          "つま先立ちになるまでかかとを上げる",
          "ゆっくりかかとを下ろす",
        ],
      },
      {
        name: "ブルガリアンスクワット", nameEn: "Bulgarian Split Squat", bodyPart: "legs", level: "advanced",
        steps: [
          "後ろ足をベンチに乗せる",
          "前足に体重をかける",
          "前足の膝を曲げて体を下ろす",
          "前足で踏み込んで立ち上がる",
        ],
      },
      {
        name: "ランジ", nameEn: "Lunge", bodyPart: "legs", level: "advanced",
        steps: [
          "まっすぐ立った状態からスタート",
          "片足を大きく前に踏み出す",
          "両膝を90度に曲げて体を下ろす",
          "前足で地面を蹴って元に戻る",
        ],
      },
      {
        name: "ハックスクワット", nameEn: "Hack Squat", bodyPart: "legs", level: "advanced",
        steps: [
          "マシンに背中をつけて肩パッドの下に入る",
          "足を肩幅に開いてプレートに置く",
          "膝を曲げて体を下ろす",
          "脚で押して立ち上がる",
        ],
      },
      {
        name: "グルートブリッジ", nameEn: "Glute Bridge", bodyPart: "legs", level: "advanced",
        steps: [
          "仰向けに寝て膝を曲げ、足を床につける",
          "バーベル/ダンベルを腰に置く",
          "お尻を天井に向かって持ち上げる",
          "お尻を絞ったらゆっくり下ろす",
        ],
      },
    ],
  },
];

// Firestore初期化用のフラット配列
export const PRESET_EXERCISES: PresetExercise[] = EXERCISE_GROUPS.flatMap(
  (group) => group.exercises
);
