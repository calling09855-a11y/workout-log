import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

const ANALYSIS_PROMPT = `この画像はトレーニング・フィットネスに関連する写真です。
以下の観点から分析して、日本語で回答してください：

1. 写真の内容の説明（体の写真の場合は、見た目の印象）
2. 良い点・改善点
3. トレーニングや食事に関するアドバイス

注意：
- ポジティブで建設的なフィードバックを心がけてください
- 具体的で実行可能なアドバイスを提供してください
- 医療的な診断はせず、必要に応じて専門家への相談を勧めてください
- 簡潔にまとめてください`

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File | null
    const prompt = (formData.get("prompt") as string) || ANALYSIS_PROMPT

    if (!image) {
      return NextResponse.json({ error: "画像が必要です" }, { status: 400 })
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY が設定されていません" },
        { status: 500 }
      )
    }

    const bytes = await image.arrayBuffer()
    const base64 = Buffer.from(bytes).toString("base64")
    const mimeType = image.type || "image/jpeg"

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64,
          mimeType,
        },
      },
    ])

    const response = result.response
    const text = response.text()

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Gemini API error:", error)
    return NextResponse.json(
      { error: "画像分析でエラーが発生しました" },
      { status: 500 }
    )
  }
}
