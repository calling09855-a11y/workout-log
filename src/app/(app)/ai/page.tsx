"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AiChat } from "@/components/ai/AiChat"
import { PhotoAnalyzer } from "@/components/ai/PhotoAnalyzer"

export default function AiPage() {
  const [tab, setTab] = useState("chat")

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <h1 className="text-xl font-bold mb-4">AI アシスタント</h1>

      <Tabs value={tab} onValueChange={setTab} className="flex flex-col flex-1 min-h-0">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat">テキスト相談</TabsTrigger>
          <TabsTrigger value="photo">写真分析</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 min-h-0 mt-4">
          <AiChat />
        </TabsContent>

        <TabsContent value="photo" className="flex-1 min-h-0 mt-4">
          <PhotoAnalyzer />
        </TabsContent>
      </Tabs>
    </div>
  )
}
