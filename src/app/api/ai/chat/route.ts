import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
})

const SYSTEM_PROMPT = `あなたはトレーニングの専門家AIアシスタント「WorkoutLog AI」です。
ユーザーの筋トレ・フィットネスに関する質問に日本語で回答してください。

以下の分野について専門的なアドバイスができます：
- 筋トレのフォーム・テクニック
- トレーニングメニューの組み方
- 栄養・食事管理
- 休息・リカバリー
- 怪我の予防
- モチベーション管理

回答は簡潔で実用的にしてください。医療的な判断が必要な場合は、専門医への相談を勧めてください。`

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "メッセージが必要です" }, { status: 400 })
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY が設定されていません" },
        { status: 500 }
      )
    }

    const messages = [
      ...(history || []).map((h: { role: string; content: string }) => ({
        role: h.role as "user" | "assistant",
        content: h.content,
      })),
      { role: "user" as const, content: message },
    ]

    const response = await anthropic.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    })

    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => {
        if (block.type === "text") return block.text
        return ""
      })
      .join("")

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Claude API error:", error)
    return NextResponse.json(
      { error: "AIの応答でエラーが発生しました" },
      { status: 500 }
    )
  }
}
