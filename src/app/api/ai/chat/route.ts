import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

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

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY が設定されていません" },
        { status: 500 }
      )
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_PROMPT,
    })

    const chatHistory = (history || []).map((h: { role: string; content: string }) => ({
      role: h.role === "assistant" ? "model" : "user",
      parts: [{ text: h.content }],
    }))

    const chat = model.startChat({ history: chatHistory })
    const result = await chat.sendMessage(message)
    const text = result.response.text()

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Gemini API error:", error)
    return NextResponse.json(
      { error: "AIの応答でエラーが発生しました" },
      { status: 500 }
    )
  }
}
