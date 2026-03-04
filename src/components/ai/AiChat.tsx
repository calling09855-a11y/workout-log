"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

type Message = {
  role: "user" | "assistant"
  content: string
}

export function AiChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: messages,
        }),
      })

      const data = await res.json()

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `エラー: ${data.error}` },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.response },
        ])
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "通信エラーが発生しました" },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 pr-2" ref={scrollRef}>
        <div className="space-y-4 pb-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              <p className="text-lg font-medium mb-2">AI トレーナーに質問しよう</p>
              <p className="text-sm">筋トレのフォーム、メニュー、栄養など</p>
              <div className="mt-6 space-y-2">
                {[
                  "初心者におすすめの筋トレメニューは？",
                  "ベンチプレスのフォームのコツを教えて",
                  "筋トレ後の食事は何がいい？",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setInput(suggestion)
                    }}
                    className="block w-full text-left px-4 py-2 rounded-lg border hover:bg-accent text-sm transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <Card
                className={`max-w-[85%] px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </Card>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <Card className="bg-muted px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.1s]" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="flex gap-2 pt-4 border-t">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              sendMessage()
            }
          }}
          placeholder="質問を入力..."
          disabled={isLoading}
        />
        <Button onClick={sendMessage} disabled={isLoading || !input.trim()}>
          送信
        </Button>
      </div>
    </div>
  )
}
